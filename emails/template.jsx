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
  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
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
    
    return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="#fff" stroke-width="3"/>`;
  }).join('');
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));">
    <defs>
      <linearGradient id="centerGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
      </linearGradient>
    </defs>
    ${paths}
    <circle cx="${center}" cy="${center}" r="30" fill="url(#centerGradient)" stroke="#e2e8f0" stroke-width="2"/>
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
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));">
    <defs>
      <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#10B981;stop-opacity:0.4" />
        <stop offset="100%" style="stop-color:#10B981;stop-opacity:0" />
      </linearGradient>
      <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#EF4444;stop-opacity:0.4" />
        <stop offset="100%" style="stop-color:#EF4444;stop-opacity:0" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="#fafafa" rx="8"/>
    
    <!-- Grid lines -->
    ${Array.from({length: 4}, (_, i) => {
      const y = padding + (i * (height - 2 * padding) / 3);
      return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="5,5"/>`;
    }).join('')}
    
    <!-- Income area -->
    <polygon points="${incomePoints} ${width - padding},${height - padding} ${padding},${height - padding}" 
             fill="url(#incomeGradient)" />
    
    <!-- Expense area -->
    <polygon points="${expensePoints} ${width - padding},${height - padding} ${padding},${height - padding}" 
             fill="url(#expenseGradient)" />
    
    <!-- Income line -->
    <polyline points="${incomePoints}" stroke="#10B981" stroke-width="4" fill="none" filter="url(#glow)"/>
    
    <!-- Expense line -->
    <polyline points="${expensePoints}" stroke="#EF4444" stroke-width="4" fill="none" filter="url(#glow)"/>
    
    <!-- Data points -->
    ${trendData.map((d, i) => `
      <circle cx="${padding + i * xStep}" cy="${height - padding - (d.income - minValue) * yScale}" 
              r="6" fill="#10B981" stroke="#fff" stroke-width="3" filter="url(#glow)"/>
      <circle cx="${padding + i * xStep}" cy="${height - padding - (d.expenses - minValue) * yScale}" 
              r="6" fill="#EF4444" stroke="#fff" stroke-width="3" filter="url(#glow)"/>
    `).join('')}
    
    <!-- Month labels -->
    ${trendData.map((d, i) => `
      <text x="${padding + i * xStep}" y="${height - 10}" text-anchor="middle" 
            font-size="12" fill="#64748b" font-weight="600">${d.month}</text>
    `).join('')}
  </svg>`;
}

function generateProgressBar(percentage, color = '#6366F1') {
  const width = 200;
  const height = 24;
  const progressWidth = (percentage / 100) * width;
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bgGradient)" rx="12" stroke="#cbd5e1" stroke-width="1"/>
    <rect width="${progressWidth}" height="${height}" fill="url(#progressGradient)" rx="12"/>
    <text x="${width/2}" y="${height/2 + 5}" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">
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
            {/* Decorative Header */}
            <Section style={styles.decorativeTop}>
              <div style={styles.decorativePattern}></div>
            </Section>

            {/* Header */}
            <Section style={styles.header}>
              <div style={styles.headerContent}>
                <div style={styles.headerIcon}>💰</div>
                <Heading style={styles.title}>Monthly Financial Report</Heading>
                <Text style={styles.subtitle}>{data?.month} Summary</Text>
              </div>
            </Section>

            <Text style={styles.greeting}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here's your comprehensive financial overview for {data?.month}:
            </Text>

            {/* Key Metrics Cards */}
            <Section style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <div style={{...styles.metricIcon, backgroundColor: '#ecfdf5'}}>📈</div>
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
                <div style={{...styles.metricIcon, backgroundColor: '#fef2f2'}}>💸</div>
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
                <div style={{...styles.metricIcon, backgroundColor: '#f0f9ff'}}>💰</div>
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
                <div style={{...styles.metricIcon, backgroundColor: '#fef7cd'}}>🎯</div>
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
              <div style={styles.progressCard}>
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
              </div>
            </Section>

            {/* 6-Month Trend Chart */}
            {trendData.length > 0 && (
              <Section style={styles.chartSection}>
                <div style={styles.chartCard}>
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
                </div>
              </Section>
            )}

            {/* Expense Categories */}
            {chartData.categoryData && chartData.categoryData.length > 0 && (
              <Section style={styles.chartSection}>
                <div style={styles.chartCard}>
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
                            backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index]
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
                </div>
              </Section>
            )}

            {/* Transaction Summary */}
            <Section style={styles.summarySection}>
              <div style={styles.summaryCard}>
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
              </div>
            </Section>

            {/* AI Insights */}
            {data?.insights && (
              <Section style={styles.insightsSection}>
                <div style={styles.insightsCard}>
                  <Heading style={styles.sectionTitle}>🤖 AI-Powered Insights</Heading>
                  <div style={styles.insightsContainer}>
                    {data.insights.map((insight, index) => (
                      <div key={index} style={styles.insightCard}>
                        <div style={styles.insightIcon}>✨</div>
                        <Text style={styles.insightText}>{insight}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* Financial Health Score */}
            <Section style={styles.healthSection}>
              <div style={styles.healthCard}>
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
                              __html: generateProgressBar(expenseScore / 30 * 100, '#6366F1')
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
              </div>
            </Section>

            {/* Footer */}
            <Section style={styles.footerSection}>
              <div style={styles.footerCard}>
                <Text style={styles.footer}>
                  🎯 Keep tracking your finances with Pocket Mate for better financial health! 
                  <br />
                  📊 This report was generated automatically based on your transaction data.
                </Text>
              </div>
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
            <Section style={styles.decorativeTop}>
              <div style={styles.alertDecorativePattern}></div>
            </Section>

            <Section style={styles.alertHeader}>
              <div style={styles.alertHeaderContent}>
                <div style={styles.alertHeaderIcon}>⚠️</div>
                <Heading style={styles.alertTitle}>Budget Alert</Heading>
                <Text style={styles.alertSubtitle}>
                  {data?.accountName || 'Your Account'}
                </Text>
              </div>
            </Section>

            <Text style={styles.greeting}>Hello {userName},</Text>
            <Text style={styles.text}>
              You've used <strong>{parsedPercentageUsed}%</strong> of your monthly budget.
            </Text>

            {/* Budget Progress */}
            <Section style={styles.budgetProgressSection}>
              <div style={styles.budgetProgressCard}>
                <div style={styles.budgetProgressContainer}>
                  <div dangerouslySetInnerHTML={{
                    __html: generateProgressBar(
                      parseFloat(parsedPercentageUsed),
                      parseFloat(parsedPercentageUsed) >= 90 ? '#EF4444' : 
                      parseFloat(parsedPercentageUsed) >= 80 ? '#F59E0B' : '#10B981'
                    )
                  }} />
                </div>
              </div>
            </Section>

            {/* Budget Stats */}
            <Section style={styles.budgetStatsGrid}>
              <div style={styles.budgetStatCard}>
                <div style={{...styles.budgetStatIcon, backgroundColor: '#ecfdf5'}}>💰</div>
                <div>
                  <Text style={styles.budgetStatLabel}>Budget Amount</Text>
                  <Text style={styles.budgetStatValue}>${parsedBudgetAmount.toFixed(1)}</Text>
                </div>
              </div>

              <div style={styles.budgetStatCard}>
                <div style={{...styles.budgetStatIcon, backgroundColor: '#fef2f2'}}>💸</div>
                <div>
                  <Text style={styles.budgetStatLabel}>Spent So Far</Text>
                  <Text style={styles.budgetStatValue}>${parsedTotalExpenses.toFixed(1)}</Text>
                </div>
              </div>

              <div style={styles.budgetStatCard}>
                <div style={{...styles.budgetStatIcon, backgroundColor: '#f0f9ff'}}>🎯</div>
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
                <div style={styles.alertMessageIcon}>
                  {parseFloat(parsedPercentageUsed) >= 90 ? '🚨' : '⚠️'}
                </div>
                <Text style={styles.alertMessageText}>
                  {parseFloat(parsedPercentageUsed) >= 90 ? 
                    'Critical: You\'re approaching your budget limit!' :
                    'Warning: Monitor your spending to stay within budget.'
                  }
                </Text>
              </div>
            </Section>

            <Section style={styles.footerSection}>
              <div style={styles.footerCard}>
                <Text style={styles.footer}>
                  📊 Stay on top of your spending to maintain your financial goals. 
                  We're here to help you succeed!
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

const styles = {
  // Base styles
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f8fafc',
    margin: 0,
    padding: 0,
    lineHeight: 1.6,
    color: '#334155',
  },
  
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Decorative header patterns
  decorativeTop: {
    height: '8px',
    background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 25%, #06B6D4 50%, #10B981 75%, #F59E0B 100%)',
    position: 'relative',
  },
  
  decorativePattern: {
    height: '100%',
    background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
  },

  alertDecorativePattern: {
    height: '100%',
    background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
    backgroundColor: '#EF4444',
  },

  // Header styles
  header: {
    backgroundColor: '#1e293b',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '48px 32px',
    textAlign: 'center',
    position: 'relative',
  },
  
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  
  headerIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
  },
  
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 8px 0',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    letterSpacing: '-0.02em',
  },
  
  subtitle: {
    fontSize: '18px',
    color: '#cbd5e1',
    margin: '0',
    fontWeight: '500',
  },

  // Alert header styles
  alertHeader: {
    backgroundColor: '#dc2626',
    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    padding: '48px 32px',
    textAlign: 'center',
    position: 'relative',
  },
  
  alertHeaderContent: {
    position: 'relative',
    zIndex: 1,
  },
  
  alertHeaderIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
  },
  
  alertTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 8px 0',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    letterSpacing: '-0.02em',
  },
  
  alertSubtitle: {
    fontSize: '18px',
    color: '#fecaca',
    margin: '0',
    fontWeight: '500',
  },

  // Text styles
  greeting: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '32px 32px 16px 32px',
  },
  
  text: {
    fontSize: '16px',
    color: '#475569',
    margin: '0 32px 32px 32px',
    lineHeight: 1.7,
  },
  
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 20px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Metrics grid
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    margin: '0 32px 32px 32px',
  },
  
  metricCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
  },
  
  metricIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  
  metricLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
    margin: '0 0 4px 0',
  },
  
  metricValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  
  metricChange: {
    fontSize: '13px',
    fontWeight: '600',
    margin: '0',
  },

  // Progress section
  progressSection: {
    margin: '0 32px 32px 32px',
  },
  
  progressCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  
  progressText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#475569',
    margin: '0',
  },

  // Chart section
  chartSection: {
    margin: '0 32px 32px 32px',
  },
  
  chartCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  
  chartLegend: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  legendColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  
  legendText: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
    margin: '0',
  },

  // Category breakdown
  categoryContainer: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  
  categoryChart: {
    flexShrink: 0,
  },
  
  categoryList: {
    flex: 1,
    minWidth: '200px',
  },
  
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  
  categoryColor: {
    width: '12px',
    height: '12px',
    borderRadius: '3px',
    flexShrink: 0,
  },
  
  categoryInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  
  categoryName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    margin: '0',
    flex: 1,
  },
  
  categoryAmount: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  },
  
  categoryPercent: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
    margin: '0',
    minWidth: '40px',
    textAlign: 'right',
  },

  // Summary section
  summarySection: {
    margin: '0 32px 32px 32px',
  },
  
  summaryCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
  },
  
  summaryItem: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  
  summaryLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
    margin: '0 0 8px 0',
  },
  
  summaryValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  },

  // Insights section
  insightsSection: {
    margin: '0 32px 32px 32px',
  },
  
  insightsCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  
  insightsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  
  insightCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  
  insightIcon: {
    fontSize: '16px',
    flexShrink: 0,
    marginTop: '2px',
  },
  
  insightText: {
    fontSize: '14px',
    color: '#475569',
    margin: '0',
    lineHeight: 1.6,
  },

  // Health section
  healthSection: {
    margin: '0 32px 32px 32px',
  },
  
  healthCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  
  healthContainer: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    border: '4px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  
  scoreNumber: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0',
    lineHeight: 1,
  },
  
  scoreLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
    margin: '0',
  },
  
  scoreBreakdown: {
    flex: 1,
    minWidth: '200px',
  },
  
  scoreItem: {
    marginBottom: '16px',
  },
  
  scoreItemLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
    margin: '0 0 8px 0',
  },

  // Budget alert specific styles
  budgetProgressSection: {
    margin: '0 32px 32px 32px',
  },
  
  budgetProgressCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  
  budgetProgressContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  
  budgetStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    margin: '0 32px 32px 32px',
  },
  
  budgetStatCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  
  budgetStatIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  
  budgetStatLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
    margin: '0 0 4px 0',
  },
  
  budgetStatValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  },
  
  alertMessageSection: {
    margin: '0 32px 32px 32px',
  },
  
  alertMessage: {
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  alertMessageIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  
  alertMessageText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0',
  },

  // Footer
  footerSection: {
    margin: '0 32px 32px 32px',
  },
  
  footerCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  },
  
  footer: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0',
    lineHeight: 1.6,
  },

  // Responsive styles (for email clients that support media queries)
  '@media (max-width: 600px)': {
    container: {
      margin: '0 16px',
    },
    
    metricsGrid: {
      gridTemplateColumns: '1fr',
      margin: '0 16px 24px 16px',
    },
    
    metricCard: {
      padding: '20px',
    },
    
    categoryContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    
    healthContainer: {
      flexDirection: 'column',
      textAlign: 'center',
    },
    
    budgetStatsGrid: {
      gridTemplateColumns: '1fr',
      margin: '0 16px 24px 16px',
    },
    
    chartSection: {
      margin: '0 16px 24px 16px',
    },
    
    summarySection: {
      margin: '0 16px 24px 16px',
    },
    
    insightsSection: {
      margin: '0 16px 24px 16px',
    },
    
    healthSection: {
      margin: '0 16px 24px 16px',
    },
    
    footerSection: {
      margin: '0 16px 24px 16px',
    },
    
    greeting: {
      margin: '24px 16px 12px 16px',
    },
    
    text: {
      margin: '0 16px 24px 16px',
    },
  },
};
