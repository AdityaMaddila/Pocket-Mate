import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React from "react";

const AccountCard = ({ account }) => {
  return (
    <Link href={`/account/${account.id}`} className="block h-full">
      <Card className="h-full flex flex-col justify-between border border-gray-200 hover:shadow-sm transition-shadow duration-200 rounded-xl px-5 py-6">
        <CardHeader className="p-0 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {account.name}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()} Account
            </p>
          </div>
          <Switch />
        </CardHeader>

        <CardContent className="p-0 mt-6 flex-1 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-800">
            ₹{parseFloat(account.balance).toFixed(2)}
          </div>
        </CardContent>

        <CardFooter className="p-0 mt-6 flex justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowDownRight className="h-4 w-4 text-red-500" />
            <span>Expense</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AccountCard;
