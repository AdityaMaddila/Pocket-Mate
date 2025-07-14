import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/accounts";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transactiontable";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

// Removed MonthlySummary component

const ActivityFeed = ({ transactions }) => {
  const recent = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="w-full md:w-[30%] bg-zinc-900/40 p-4 rounded-xl border border-zinc-700 shadow-md">
      <h2 className="text-lg font-semibold mb-3 text-white">Recent Activity</h2>
      <ul className="space-y-3">
        {recent.map((tx) => {
          const isExpense = tx.type?.toUpperCase() === "EXPENSE";

          return (
            <li key={tx.id} className="flex justify-between text-sm text-white">
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-zinc-400 text-xs">
                  {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
              <p className={`font-semibold ${isExpense ? "text-red-500" : "text-green-500"}`}>
                {isExpense ? "-" : "+"}${tx.amount.toFixed(2)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default async function AccountPage({ params }) {
  const Params= await params;
  const accountData = await getAccountWithTransactions(Params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      {/* Header */}
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold gradient-title">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart and Activity Feed */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Chart section - 70% */}
        <div className="w-full md:w-[70%] bg-zinc-900/40 p-4 rounded-xl border border-zinc-700 shadow-md">
          <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
            <AccountChart transactions={transactions} />
          </Suspense>
        </div>

        {/* Activity feed - 30% */}
        <ActivityFeed transactions={transactions} />
      </div>

      {/* Transaction Table */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
