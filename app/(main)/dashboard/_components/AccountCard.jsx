"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { UpdateDefaultAccount } from "@/actions/accounts";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(UpdateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);
  return (
    <Card className="h-full flex flex-col justify-between border border-gray-200 hover:shadow-sm transition-shadow duration-200 rounded-xl px-5 py-6">
        <Link href={`/account/${account.id}`} className="block h-full">
        <CardHeader className="p-0 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {account.name}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()} Account
            </p>
          </div>
          <Switch checked={account.isDefault} onClick={handleDefaultChange}/>
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
    </Link>
      </Card>
  );
};

export default AccountCard;
