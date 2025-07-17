// actions/monthlyStats.js
"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getMonthlySpending(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return expenses._sum.amount ? expenses._sum.amount.toNumber() : 0;
  } catch (error) {
    console.error("Error fetching monthly spending:", error);
    throw new Error("Failed to fetch monthly spending");
  }
}

export async function getMonthlySavings(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Get income transactions
    const income = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "INCOME",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    // Get expense transactions
    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    const totalIncome = income._sum.amount ? income._sum.amount.toNumber() : 0;
    const totalExpenses = expenses._sum.amount ? expenses._sum.amount.toNumber() : 0;

    // Savings = Income - Expenses
    const savings = totalIncome - totalExpenses;

    return Math.max(savings, 0); // Don't return negative savings
  } catch (error) {
    console.error("Error fetching monthly savings:", error);
    throw new Error("Failed to fetch monthly savings");
  }
}

// Alternative approach if you want to track savings as a separate category
export async function getMonthlySavingsFromCategory(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Get transactions with 'savings' category
    const savingsTransactions = await db.transaction.aggregate({
      where: {
        userId: user.id,
        category: "savings", // Adjust based on your category system
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return savingsTransactions._sum.amount ? savingsTransactions._sum.amount.toNumber() : 0;
  } catch (error) {
    console.error("Error fetching monthly savings from category:", error);
    throw new Error("Failed to fetch monthly savings from category");
  }
}