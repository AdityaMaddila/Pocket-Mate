import React from "react";
import { CreateAccountDrawer } from "@/components/createAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import getUserAccounts from "@/actions/dashboard";
import AccountCard from "./_components/AccountCard";

const DashboardPage = async () => {
  const accounts = await getUserAccounts();

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold gradient-title mb-6">Your Accounts</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Create Account Card */}
        <CreateAccountDrawer>
          <Card className="h-full border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200">
            <CardContent className="h-full flex flex-col items-start justify-center p-6">
              <Plus className="w-7 h-7 text-gray-600 mb-3" />
              <h2 className="text-lg font-medium text-gray-700">
                Create New Account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
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
