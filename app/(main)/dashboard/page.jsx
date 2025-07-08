import React from "react";
import { CreateAccountDrawer } from "@/components/createAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import getUserAccounts from "@/actions/dashboard";
import AccountCard from "./_components/AccountCard";

const DashboardPage = async () => {
  const accounts = await getUserAccounts();

  return (
    <div className="w-full overflow-x-hidden px-4 sm:px-6 py-6 sm:py-8 box-border">
      <h1 className="text-xl sm:text-2xl font-bold gradient-title mb-6 text-center sm:text-left">
        Your Accounts
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full">
        {/* Create Account Card */}
        <CreateAccountDrawer>
          <Card className="w-full h-full border border-gray-300 hover:border-gray-400 transition-colors duration-200 shadow-sm box-border">
            <CardContent className="h-full flex flex-col items-start justify-center p-4 sm:p-6 space-y-2">
              <Plus className="w-6 h-6 text-gray-600" />
              <h2 className="text-base font-semibold text-gray-700">
                Create New Account
              </h2>
              <p className="text-sm text-gray-500">
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
