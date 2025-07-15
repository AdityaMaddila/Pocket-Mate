import React from "react";
import { CreateAccountDrawer } from "@/components/createAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {getUserAccounts} from "@/actions/dashboard";
import AccountCard from "./_components/AccountCard";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budgetprogress";

const DashboardPage = async () => {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((account) => account.isDefault);
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8 bg-zinc-950 min-h-screen">
      {/* Budget Section */}
      {defaultAccount && (
        <div className="max-w-4xl mx-auto">
          <BudgetProgress
            initialBudget={budgetData?.budget}
            currentExpenses={budgetData?.currentExpenses || 0}
          />
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {/* Create Account Card */}
        <CreateAccountDrawer>
          <Card className="w-full h-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer">
            <CardContent className="h-full flex flex-col items-start justify-center p-5 space-y-3">
              <Plus className="w-6 h-6 text-zinc-400" />
              <h2 className="text-base font-semibold text-white">
                Create New Account
              </h2>
              <p className="text-sm text-zinc-400">
                Start tracking your finances
              </p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* Existing Accounts */}
        {accounts?.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
