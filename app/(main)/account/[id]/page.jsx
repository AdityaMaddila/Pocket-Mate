import { getAccountWithTransactions } from "@/actions/accounts";
import { parse } from "date-fns";
import { notFound } from "next/navigation";
import React from "react";
import { BarLoader } from "react-spinners";
import TransactionTable from "../_components/transactiontable";

const AccountsPage = async({params}) => {
    const accountData = await getAccountWithTransactions(params.id);
    if (!accountData) {
        notFound();
}
const {transactions, ...account} = accountData;
return (
  <div className="text-white w-full px-5 py-4 flex justify-between items-end">
    <div className="space-y-1">
      <h1 className="text-xl font-semibold gradient-title">{account.name}</h1>
      <p className="text-sm text-gray-300">
        {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
      </p>
    </div>

    <div className="text-right space-y-1">
      <div className="text-2xl font-bold gradient-title">
        ${parseFloat(account.balance).toFixed(2)}
      </div>
      <p className="text-sm text-gray-300">
        {account._count.transactions} Transactions
      </p>
    </div>
    <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea"/>}>
    <TransactionTable transactions={transactions}/>
    </Suspense>
  </div>
);
}

export default AccountsPage;