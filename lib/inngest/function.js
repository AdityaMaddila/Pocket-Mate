import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 3. Budget Alerts with Event Batching
export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // Every 6 hours
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue; // Skip if no default account

      await step.run(`check-budget-${budget.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1); // Start of current month

        // Calculate total expenses for the default account only
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id, // Only consider default account
            type: "EXPENSE",
            date: {
              gte: startDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        // Check if we should send an alert
        if (
          percentageUsed >= 80 && // Default threshold of 80%
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount: parseInt(budgetAmount).toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });

          // Update last alert sent
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

export const triggerRecurringTransactions = inngest.createFunction({
  id: "trigger-recurring-transactions",
  name: "Trigger Recurring Transactions",
}, { cron: "0 0 * * *" },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              { nextRecurringDate: { lte: new Date() } },
            ],
          },
        });
      }
    );
    //create events for transactions
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: { transactionID: transaction.id, userId: transaction.userId },
      }));
      //sending to inngest
      await inngest.send(events);
    }
    return { triggered: recurringTransactions.length };
  }
);

export const processRecurringTransaction = inngest.createFunction({
  id: "process-recurring-transaction",
  throttle: {
    limit: 10,
    period: "1m",
    key: "event.data.userId",
  },
},
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }
    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });
      if (!transaction || !isTransactionDue(transaction)) return;
      await db.transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        // Update last processed date and next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

function isTransactionDue(transaction) {
  if (!transaction.lastProcessed) return true;
  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

export const generateMonthlyReports = inngest.createFunction({
  id: "generate-monthly-reports",
  name: "Generate Monthly Reports"
},
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });
    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });
        const insights = await generateFinancialInsights(stats, monthName);
        
        // Get comparison data and trends
        const comparisonData = await getComparisonData(user.id, lastMonth);
        const trendData = await getTrendData(user.id, lastMonth);

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: EmailTemplate({
            userName: user.name,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
              comparisonData,
              trendData,
              chartData: generateChartData(stats, trendData),
            },
          }),
        });
      });
    }
    return { processed: users.length };
  }
);

async function generateFinancialInsights(stats, month) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this financial data and provide 4 concise, actionable insights.
    Focus on spending patterns, savings opportunities, and practical advice.
    Keep it friendly and conversational, using emojis where appropriate.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Savings Rate: ${((stats.totalIncome - stats.totalExpenses) / stats.totalIncome * 100).toFixed(1)}%
    - Transaction Count: ${stats.transactionCount}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}
    - Top Expense Category: ${Object.entries(stats.byCategory).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3", "insight 4"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "💡 Your highest expense category this month might need attention.",
      "🎯 Consider setting up automatic savings to reach your financial goals.",
      "🔍 Track your recurring expenses to identify potential savings opportunities.",
      "📊 Monitor your spending patterns to make informed financial decisions.",
    ];
  }
}

async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  const stats = transactions.reduce(
    (acc, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        acc.totalExpenses += amount;
        acc.byCategory[t.category] = (acc.byCategory[t.category] || 0) + amount;
      } else {
        acc.totalIncome += amount;
      }
      return acc;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );

  // Calculate additional metrics
  stats.savingsRate = stats.totalIncome > 0 ? ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome * 100) : 0;
  stats.netIncome = stats.totalIncome - stats.totalExpenses;
  stats.topCategory = Object.entries(stats.byCategory).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
  stats.categoryCount = Object.keys(stats.byCategory).length;

  return stats;
}

async function getComparisonData(userId, currentMonth) {
  const previousMonth = new Date(currentMonth);
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  
  const previousStats = await getMonthlyStats(userId, previousMonth);
  const currentStats = await getMonthlyStats(userId, currentMonth);

  return {
    incomeChange: currentStats.totalIncome - previousStats.totalIncome,
    expenseChange: currentStats.totalExpenses - previousStats.totalExpenses,
    savingsChange: currentStats.netIncome - previousStats.netIncome,
    incomeChangePercent: previousStats.totalIncome > 0 ? 
      ((currentStats.totalIncome - previousStats.totalIncome) / previousStats.totalIncome * 100) : 0,
    expenseChangePercent: previousStats.totalExpenses > 0 ? 
      ((currentStats.totalExpenses - previousStats.totalExpenses) / previousStats.totalExpenses * 100) : 0,
  };
}

async function getTrendData(userId, currentMonth) {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentMonth);
    month.setMonth(month.getMonth() - i);
    months.push(month);
  }

  const trendData = await Promise.all(
    months.map(async (month) => {
      const stats = await getMonthlyStats(userId, month);
      return {
        month: month.toLocaleString("default", { month: "short" }),
        fullMonth: month.toLocaleString("default", { month: "long" }),
        income: stats.totalIncome,
        expenses: stats.totalExpenses,
        savings: stats.netIncome,
        transactionCount: stats.transactionCount,
      };
    })
  );

  return trendData;
}

function generateChartData(stats, trendData) {
  // Generate category pie chart data
  const categoryData = Object.entries(stats.byCategory).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount,
    percentage: ((amount / stats.totalExpenses) * 100).toFixed(1),
  })).sort((a, b) => b.amount - a.amount);

  // Generate trend line data
  const trendChartData = trendData.map(item => ({
    month: item.month,
    income: item.income,
    expenses: item.expenses,
    savings: item.savings,
  }));

  return {
    categoryData,
    trendChartData,
    summaryData: {
      totalIncome: stats.totalIncome,
      totalExpenses: stats.totalExpenses,
      netIncome: stats.netIncome,
      savingsRate: stats.savingsRate,
    },
  };
}