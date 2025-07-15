import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/accounts";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transactiontable";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Building,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign
} from "lucide-react";

const ActivityFeed = ({ transactions }) => {
  const recent = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="w-full lg:w-[30%]">
      <div className="relative bg-zinc-900/60 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-zinc-800/50 hover:border-zinc-700/80 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl border border-purple-500/30">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Recent Activity</h2>
        </div>
        <div className="relative z-10 space-y-3 sm:space-y-4">
          {recent.map((tx) => {
            const isExpense = tx.type?.toUpperCase() === "EXPENSE";
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-800/50 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${
                      isExpense
                        ? "bg-red-500/20 border border-red-500/30"
                        : "bg-green-500/20 border border-green-500/30"
                    }`}
                  >
                    {isExpense ? (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white hover:text-blue-300 truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className={`font-bold text-sm sm:text-base ${
                      isExpense ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {isExpense ? "-" : "+"}${tx.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AccountTypeIcon = ({ type }) => {
  const icons = {
    checking: <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />,
    savings: <Building className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />,
    credit: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
    default: <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />,
  };
  return icons[type.toLowerCase()] || icons.default;
};

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);
  if (!accountData) notFound();

  const { transactions, ...account } = accountData;
  const balanceChange =
    transactions.length > 0
      ? parseFloat(account.balance) > 0
        ? "positive"
        : "negative"
      : "neutral";

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden px-4 sm:px-5 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 items-start xl:items-end justify-between">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm mb-3 sm:mb-4">
            <AccountTypeIcon type={account.type} />
            <span className="text-xs sm:text-sm font-medium text-blue-300">
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent capitalize break-words">
            {account.name}
          </h1>
        </div>
        <div className="text-left xl:text-right w-full xl:w-auto">
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <div className="flex items-center gap-2 justify-start xl:justify-end">
            <div className="flex items-center gap-1 px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50">
              {balanceChange === "positive" ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xs sm:text-sm text-zinc-400">
                {account._count.transactions} Transactions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart & Activity */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="w-full lg:w-[70%]">
          <div className="relative bg-zinc-900/60 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-zinc-800/50 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Account Overview</h2>
            </div>
            <div className="relative z-10">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-48 sm:h-64">
                    <BarLoader width={200} color="#9333ea" />
                  </div>
                }
              >
                <AccountChart transactions={transactions} />
              </Suspense>
            </div>
          </div>
        </div>

        <ActivityFeed transactions={transactions} />
      </div>

      {/* Table - Keeping Original TransactionTable Component */}
      <div className="relative">
        <div className="relative bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-zinc-800/50 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-cyan-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10 p-4 sm:p-6 border-b border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">All Transactions</h2>
            </div>
          </div>
          <div className="relative z-10 p-4 sm:p-6">
            {/* Enhanced container for better mobile experience */}
            <div className="w-full overflow-hidden">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-32">
                    <BarLoader width={200} color="#9333ea" />
                  </div>
                }
              >
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[600px] sm:min-w-0">
                    <TransactionTable transactions={transactions} />
                  </div>
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}