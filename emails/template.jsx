import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";

// Chart generation functions
function generateCategoryPieChart(categoryData, totalExpenses) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
  const size = 200;
  const center = size / 2;
  const radius = 80;
  
  let currentAngle = 0;
  const paths = categoryData.slice(0, 6).map((item, index) => {
    const percentage = (item.amount / totalExpenses) * 100;
    const angle = (percentage / 100) * 360;
    const x1 = center + radius * Math.cos((currentAngle * Math.PI) / 180);
    const y1 = center + radius * Math.sin((currentAngle * Math.PI) / 180);
    const x2 = center + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
    const y2 = center + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    currentAngle += angle;
    
    return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="#fff" stroke-width="2"/>`;
  }).join('');
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${paths}
  </svg>`;
}

function generateTrendChart(trendData) {
  const width = 400;
  const height = 200;
  const padding = 40;
  
  const maxValue = Math.max(...trendData.map(d => Math.max(d.income, d.expenses)));
  const minValue = Math.min(...trendData.map(d => Math.min(d.income, d.expenses, 0)));
  
  const xStep = (width - 2 * padding) / (trendData.length - 1);
  const yScale = (height - 2 * padding) / (maxValue - minValue);
  
  const incomePoints = trendData.map((d, i) => 
    `${padding + i * xStep},${height - padding - (d.income - minValue) * yScale}`
  ).join(' ');
  
  const expensePoints = trendData.map((d, i) => 
    `${padding + i * xStep},${height - padding - (d.expenses - minValue) * yScale}`
  ).join(' ');
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#10B981;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#10B981;stop-opacity:0" />
      </linearGradient>
      <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#EF4444;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#EF4444;stop-opacity:0" />
      </linearGradient>
    </defs>
    
    <!-- Grid lines -->
    ${Array.from({length: 4}, (_, i) => {
      const y = padding + (i * (height - 2 * padding) / 3);
      return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>`;
    }).join('')}
    
    <!-- Income area -->
    <polygon points="${incomePoints} ${width - padding},${height - padding} ${padding},${height - padding}" 
             fill="url(#incomeGradient)" />
    
    <!-- Expense area -->
    <polygon points="${expensePoints} ${width - padding},${height - padding} ${padding},${height - padding}" 
             fill="url(#expenseGradient)" />
    
    <!-- Income line -->
    <polyline points="${incomePoints}" stroke="#10B981" stroke-width="3" fill="none"/>
    
    <!-- Expense line -->
    <polyline points="${expensePoints}" stroke="#EF4444" stroke-width="3" fill="none"/>
    
    <!-- Data points -->
    ${trendData.map((d, i) => `
      <circle cx="${padding + i * xStep}" cy="${height - padding - (d.income - minValue) * yScale}" 
              r="4" fill="#10B981" stroke="#fff" stroke-width="2"/>
      <circle cx="${padding + i * xStep}" cy="${height - padding - (d.expenses - minValue) * yScale}" 
              r="4" fill="#EF4444" stroke="#fff" stroke-width="2"/>
    `).join('')}
    
    <!-- Month labels -->
    ${trendData.map((d, i) => `
      <text x="${padding + i * xStep}" y="${height - 10}" text-anchor="middle" 
            font-size="12" fill="#6b7280">${d.month}</text>
    `).join('')}
  </svg>`;
}

function generateProgressBar(percentage, color = '#3B82F6') {
  const width = 200;
  const height = 20;
  const progressWidth = (percentage / 100) * width;
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#e5e7eb" rx="10"/>
    <rect width="${progressWidth}" height="${height}" fill="${color}" rx="10"/>
    <text x="${width/2}" y="${height/2 + 4}" text-anchor="middle" font-size="12" fill="#fff" font-weight="600">
      ${percentage.toFixed(1)}%
    </text>
  </svg>`;
}

// Dummy data for preview
const PREVIEW_DATA = {
  monthlyReport: {
    userName: "John Doe",
    type: "monthly-report",
    data: {
      month: "December",
      stats: {
        totalIncome: 5000,
        totalExpenses: 3500,
        netIncome: 1500,
        savingsRate: 30,
        byCategory: {
          housing: 1500,
          groceries: 600,
          transportation: 400,
          entertainment: 300,
          utilities: 700,
        },
        transactionCount: 45,
      },
      insights: [
        "💡 Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
        "🎯 Great job keeping entertainment expenses under control this month!",
        "📊 Setting up automatic savings could help you save 20% more of your income.",
        "🔍 Your savings rate improved by 5% compared to last month - keep it up!",
      ],
      comparisonData: {
        incomeChange: 200,
        expenseChange: -100,
        savingsChange: 300,
        incomeChangePercent: 4.2,
        expenseChangePercent: -2.8,
      },
      trendData: [
        { month: "Jul", income: 4500, expenses: 3200, savings: 1300 },
        { month: "Aug", income: 4700, expenses: 3300, savings: 1400 },
        { month: "Sep", income: 4800, expenses: 3600, savings: 1200 },
        { month: "Oct", income: 4900, expenses: 3400, savings: 1500 },
        { month: "Nov", income: 4800, expenses: 3600, savings: 1200 },
        { month: "Dec", income: 5000, expenses: 3500, savings: 1500 },
      ],
      chartData: {
        categoryData: [
          { category: "Housing", amount: 1500, percentage: "42.9" },
          { category: "Utilities", amount: 700, percentage: "20.0" },
          { category: "Groceries", amount: 600, percentage: "17.1" },
          { category: "Transportation", amount: 400, percentage: "11.4" },
          { category: "Entertainment", amount: 300, percentage: "8.6" },
        ],
        summaryData: {
          totalIncome: 5000,
          totalExpenses: 3500,
          netIncome: 1500,
          savingsRate: 30,
        },
      },
    },
  },
  budgetAlert: {
    userName: "John Doe",
    type: "budget-alert",
    data: {
      percentageUsed: 85,
      budgetAmount: 4000,
      totalExpenses: 3400,
      accountName: "Main Account",
    },
  },
};

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  // Defensive parsing for budget alerts
  const parsedPercentageUsed = typeof data?.percentageUsed === "number"
    ? data.percentageUsed.toFixed(1)
    : "N/A";

  const parsedBudgetAmount = Number(data?.budgetAmount) || 0;
  const parsedTotalExpenses = Number(data?.totalExpenses) || 0;
  const remainingAmount = (parsedBudgetAmount - parsedTotalExpenses).toFixed(1);

  if (type === "monthly-report") {
    const stats = data?.stats || {};
    const chartData = data?.chartData || {};
    const comparisonData = data?.comparisonData || {};
    const trendData = data?.trendData || [];

    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report - {data?.month}</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            {/* Header */}
            <Section style={styles.header}>
              <Heading style={styles.title}>💰 Monthly Financial Report</Heading>
              <Text style={styles.subtitle}>{data?.month} Summary</Text>
            </Section>

            <Text style={styles.greeting}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here's your comprehensive financial overview for {data?.month}:
            </Text>

            {/* Key Metrics Cards */}
            <Section style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>📈</div>
                <div>
                  <Text style={styles.metricLabel}>Total Income</Text>
                  <Text style={styles.metricValue}>${stats.totalIncome?.toLocaleString()}</Text>
                  {comparisonData.incomeChange !== undefined && (
                    <Text style={{
                      ...styles.metricChange,
                      color: comparisonData.incomeChange >= 0 ? '#10B981' : '#EF4444'
                    }}>
                      {comparisonData.incomeChange >= 0 ? '+' : ''}${comparisonData.incomeChange?.toFixed(0)} 
                      ({comparisonData.incomeChangePercent?.toFixed(1)}%)
                    </Text>
                  )}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>💸</div>
                <div>
                  <Text style={styles.metricLabel}>Total Expenses</Text>
                  <Text style={styles.metricValue}>${stats.totalExpenses?.toLocaleString()}</Text>
                  {comparisonData.expenseChange !== undefined && (
                    <Text style={{
                      ...styles.metricChange,
                      color: comparisonData.expenseChange <= 0 ? '#10B981' : '#EF4444'
                    }}>
                      {comparisonData.expenseChange >= 0 ? '+' : ''}${comparisonData.expenseChange?.toFixed(0)} 
                      ({comparisonData.expenseChangePercent?.toFixed(1)}%)
                    </Text>
                  )}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>💰</div>
                <div>
                  <Text style={styles.metricLabel}>Net Savings</Text>
                  <Text style={{
                    ...styles.metricValue,
                    color: stats.netIncome >= 0 ? '#10B981' : '#EF4444'
                  }}>
                    ${stats.netIncome?.toLocaleString()}
                  </Text>
                  {comparisonData.savingsChange !== undefined && (
                    <Text style={{
                      ...styles.metricChange,
                      color: comparisonData.savingsChange >= 0 ? '#10B981' : '#EF4444'
                    }}>
                      {comparisonData.savingsChange >= 0 ? '+' : ''}${comparisonData.savingsChange?.toFixed(0)}
                    </Text>
                  )}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>🎯</div>
                <div>
                  <Text style={styles.metricLabel}>Savings Rate</Text>
                  <Text style={{
                    ...styles.metricValue,
                    color: stats.savingsRate >= 20 ? '#10B981' : stats.savingsRate >= 10 ? '#F59E0B' : '#EF4444'
                  }}>
                    {stats.savingsRate?.toFixed(1)}%
                  </Text>
                </div>
              </div>
            </Section>

            {/* Savings Rate Progress */}
            <Section style={styles.progressSection}>
              <Heading style={styles.sectionTitle}>📊 Savings Rate Progress</Heading>
              <div style={styles.progressContainer}>
                <div dangerouslySetInnerHTML={{
                  __html: generateProgressBar(
                    stats.savingsRate || 0,
                    stats.savingsRate >= 20 ? '#10B981' : stats.savingsRate >= 10 ? '#F59E0B' : '#EF4444'
                  )
                }} />
                <Text style={styles.progressText}>
                  {stats.savingsRate >= 20 ? '🎉 Excellent!' : stats.savingsRate >= 10 ? '👍 Good progress' : '📈 Room for improvement'}
                </Text>
              </div>
            </Section>

            {/* 6-Month Trend Chart */}
            {trendData.length > 0 && (
              <Section style={styles.chartSection}>
                <Heading style={styles.sectionTitle}>📈 6-Month Trend</Heading>
                <div style={styles.chartContainer}>
                  <div dangerouslySetInnerHTML={{ __html: generateTrendChart(trendData) }} />
                  <div style={styles.chartLegend}>
                    <div style={styles.legendItem}>
                      <div style={{...styles.legendColor, backgroundColor: '#10B981'}}></div>
                      <Text style={styles.legendText}>Income</Text>
                    </div>
                    <div style={styles.legendItem}>
                      <div style={{...styles.legendColor, backgroundColor: '#EF4444'}}></div>
                      <Text style={styles.legendText}>Expenses</Text>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* Expense Categories */}
            {chartData.categoryData && chartData.categoryData.length > 0 && (
              <Section style={styles.chartSection}>
                <Heading style={styles.sectionTitle}>🏷️ Expense Breakdown</Heading>
                <div style={styles.categoryContainer}>
                  <div style={styles.categoryChart}>
                    <div dangerouslySetInnerHTML={{
                      __html: generateCategoryPieChart(chartData.categoryData, stats.totalExpenses)
                    }} />
                  </div>
                  <div style={styles.categoryList}>
                    {chartData.categoryData.slice(0, 6).map((category, index) => (
                      <div key={category.category} style={styles.categoryItem}>
                        <div style={{
                          ...styles.categoryColor,
                          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index]
                        }}></div>
                        <div style={styles.categoryInfo}>
                          <Text style={styles.categoryName}>{category.category}</Text>
                          <Text style={styles.categoryAmount}>${category.amount.toLocaleString()}</Text>
                          <Text style={styles.categoryPercent}>{category.percentage}%</Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* Transaction Summary */}
            <Section style={styles.summarySection}>
              <Heading style={styles.sectionTitle}>📋 Transaction Summary</Heading>
              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Transactions</Text>
                  <Text style={styles.summaryValue}>{stats.transactionCount}</Text>
                </div>
                <div style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Categories Used</Text>
                  <Text style={styles.summaryValue}>{stats.categoryCount}</Text>
                </div>
                <div style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Top Category</Text>
                  <Text style={styles.summaryValue}>{stats.topCategory}</Text>
                </div>
                <div style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Avg per Transaction</Text>
                  <Text style={styles.summaryValue}>
                    ${stats.transactionCount > 0 ? (stats.totalExpenses / stats.transactionCount).toFixed(0) : '0'}
                  </Text>
                </div>
              </div>
            </Section>

            {/* AI Insights */}
            {data?.insights && (
              <Section style={styles.insightsSection}>
                <Heading style={styles.sectionTitle}>🤖 AI-Powered Insights</Heading>
                <div style={styles.insightsContainer}>
                  {data.insights.map((insight, index) => (
                    <div key={index} style={styles.insightCard}>
                      <Text style={styles.insightText}>{insight}</Text>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Financial Health Score */}
            <Section style={styles.healthSection}>
              <Heading style={styles.sectionTitle}>🏥 Financial Health Score</Heading>
              <div style={styles.healthContainer}>
                {(() => {
                  const savingsScore = Math.min(stats.savingsRate || 0, 30) / 30 * 40;
                  const expenseScore = stats.totalExpenses <= stats.totalIncome * 0.7 ? 30 : 
                                     stats.totalExpenses <= stats.totalIncome * 0.8 ? 20 : 10;
                  const diversityScore = Math.min(stats.categoryCount || 0, 8) / 8 * 30;
                  const totalScore = Math.round(savingsScore + expenseScore + diversityScore);
                  
                  return (
                    <>
                      <div style={styles.scoreCircle}>
                        <Text style={styles.scoreNumber}>{totalScore}</Text>
                        <Text style={styles.scoreLabel}>/ 100</Text>
                      </div>
                      <div style={styles.scoreBreakdown}>
                        <div style={styles.scoreItem}>
                          <Text style={styles.scoreItemLabel}>Savings Rate</Text>
                          <div dangerouslySetInnerHTML={{
                            __html: generateProgressBar(savingsScore / 40 * 100, '#10B981')
                          }} />
                        </div>
                        <div style={styles.scoreItem}>
                          <Text style={styles.scoreItemLabel}>Expense Control</Text>
                          <div dangerouslySetInnerHTML={{
                            __html: generateProgressBar(expenseScore / 30 * 100, '#3B82F6')
                          }} />
                        </div>
                        <div style={styles.scoreItem}>
                          <Text style={styles.scoreItemLabel}>Spending Diversity</Text>
                          <div dangerouslySetInnerHTML={{
                            __html: generateProgressBar(diversityScore / 30 * 100, '#F59E0B')
                          }} />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Section>

            {/* Footer */}
            <Section style={styles.footerSection}>
              <Text style={styles.footer}>
                🎯 Keep tracking your finances with Pocket Mate for better financial health! 
                <br />
                📊 This report was generated automatically based on your transaction data.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  // BUDGET ALERT EMAIL
  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>⚠️ Budget Alert - {parsedPercentageUsed}% Used</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Section style={styles.alertHeader}>
              <Heading style={styles.alertTitle}>⚠️ Budget Alert</Heading>
              <Text style={styles.alertSubtitle}>
                {data?.accountName || 'Your Account'}
              </Text>
            </Section>

            <Text style={styles.greeting}>Hello {userName},</Text>
            <Text style={styles.text}>
              You've used <strong>{parsedPercentageUsed}%</strong> of your monthly budget.
            </Text>

            {/* Budget Progress */}
            <Section style={styles.budgetProgressSection}>
              <div style={styles.budgetProgressContainer}>
                <div dangerouslySetInnerHTML={{
                  __html: generateProgressBar(
                    parseFloat(parsedPercentageUsed),
                    parseFloat(parsedPercentageUsed) >= 90 ? '#EF4444' : 
                    parseFloat(parsedPercentageUsed) >= 80 ? '#F59E0B' : '#10B981'
                  )
                }} />
              </div>
            </Section>

            {/* Budget Stats */}
            <Section style={styles.budgetStatsGrid}>
              <div style={styles.budgetStatCard}>
                <div style={styles.budgetStatIcon}>💰</div>
                <div>
                  <Text style={styles.budgetStatLabel}>Budget Amount</Text>
                  <Text style={styles.budgetStatValue}>${parsedBudgetAmount.toFixed(1)}</Text>
                </div>
              </div>

              <div style={styles.budgetStatCard}>
                <div style={styles.budgetStatIcon}>💸</div>
                <div>
                  <Text style={styles.budgetStatLabel}>Spent So Far</Text>
                  <Text style={styles.budgetStatValue}>${parsedTotalExpenses.toFixed(1)}</Text>
                </div>
              </div>

              <div style={styles.budgetStatCard}>
                <div style={styles.budgetStatIcon}>🎯</div>
                <div>
                  <Text style={styles.budgetStatLabel}>Remaining</Text>
                  <Text style={{
                    ...styles.budgetStatValue,
                    color: parseFloat(remainingAmount) > 0 ? '#10B981' : '#EF4444'
                  }}>
                    ${remainingAmount}
                  </Text>
                </div>
              </div>
            </Section>

            {/* Alert Message */}
            <Section style={styles.alertMessageSection}>
              <div style={{
                ...styles.alertMessage,
                backgroundColor: parseFloat(parsedPercentageUsed) >= 90 ? '#FEF2F2' : '#FEF3C7',
                borderColor: parseFloat(parsedPercentageUsed) >= 90 ? '#F87171' : '#FBBF24'
              }}>
                <Text style={styles.alertMessageText}>
                  {parseFloat(parsedPercentageUsed) >= 90 ? 
                    '🚨 Critical: You\'re approaching your budget limit!' :
                    '⚠️ Warning: Monitor your spending to stay within budget.'
                  }
                </Text>
              </div>
            </Section>

            <Text style={styles.footer}>
              📊 Stay on top of your spending to maintain your financial goals. 
              We're here to help you succeed!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    lineHeight: "1.6",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "0",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#1f2937",
    padding: "30px 20px",
    textAlign: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: "16px",
    margin: "0",
  },
  greeting: {
    color: "#1f2937",
    fontSize: "18px",
    margin: "20px 20px 0",
    fontWeight: "600",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "10px 20px 20px",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    padding: "20px",
    margin: "0",
  },
  metricCard: {
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  metricIcon: {
    fontSize: "24px",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
  },
  metricLabel: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 4px",
  },
  metricValue: {
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 4px",
  },
  metricChange: {
    fontSize: "12px",
    fontWeight: "600",
    margin: "0",
  },
  progressSection: {
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
  },
  sectionTitle: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  progressText: {
    color: "#4b5563",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0",
  },
  chartSection: {
    padding: "20px",
    borderTop: "1px solid #e5e7eb",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
  },
  chartLegend: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "16px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  legendText: {
    color: "#4b5563",
    fontSize: "14px",
    margin: "0",
  },
  categoryContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },
  categoryChart: {
    flex: "0 0 200px",
    textAlign: "center",
  },
  categoryList: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  categoryItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  categoryColor: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
  },
  categoryInfo: {
    flex: "1",
  },
  categoryName: {
    color: "#1f2937",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 4px",
  },
  categoryAmount: {
    color: "#4b5563",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 2px",
  },
  categoryPercent: {
    color: "#6b7280",
    fontSize: "12px",
    margin: "0",
  },
  summarySection: {
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
  },
  summaryItem: {
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "6px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
  },
  summaryLabel: {
    color: "#6b7280",
    fontSize: "12px",
    margin: "0 0 8px",
  },
  summaryValue: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0",
  },
  insightsSection: {
    padding: "20px",
    borderTop: "1px solid #e5e7eb",
  },
  insightsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  insightCard: {
    backgroundColor: "#eff6ff",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #bfdbfe",
  },
  insightText: {
    color: "#1e40af",
    fontSize: "14px",
    margin: "0",
  },
  healthSection: {
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
  },
  healthContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  scoreCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#10B981",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
  },
  scoreNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
    color: "#ffffff",
  },
  scoreLabel: {
    fontSize: "12px",
    margin: "0",
    color: "#ffffff",
  },
  scoreBreakdown: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  scoreItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  scoreItemLabel: {
    color: "#4b5563",
    fontSize: "14px",
    margin: "0",
    minWidth: "120px",
  },
  footerSection: {
    padding: "20px",
    backgroundColor: "#1f2937",
    textAlign: "center",
  },
  footer: {
    color: "#9CA3AF",
    fontSize: "14px",
    margin: "0",
  },
  // Budget Alert Styles
  alertHeader: {
    backgroundColor: "#FEF3C7",
    padding: "30px 20px",
    textAlign: "center",
    borderBottom: "3px solid #F59E0B",
  },
  alertTitle: {
    color: "#92400E",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 8px",
  },
  alertSubtitle: {
    color: "#B45309",
    fontSize: "16px",
    margin: "0",
  },
  budgetProgressSection: {
    padding: "20px",
    textAlign: "center",
  },
  budgetProgressContainer: {
    display: "flex",
    justifyContent: "center",
  },
  budgetStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    padding: "20px",
  },
  budgetStatCard: {
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  budgetStatIcon: {
    fontSize: "24px",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
  },
  budgetStatLabel: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 4px",
  },
  budgetStatValue: {
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
  },
  alertMessageSection: {
    padding: "20px",
  },
  alertMessage: {
    padding: "16px",
    borderRadius: "8px",
    border: "2px solid",
    textAlign: "center",
  },
  alertMessageText: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "0",
    color: "#92400E",
  },
};