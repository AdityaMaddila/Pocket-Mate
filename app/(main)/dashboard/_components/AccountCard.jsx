"use client";

import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdateDefaultAccount } from "@/actions/accounts";
import { toast } from "sonner";
import { useCurrency, getCurrencySymbol } from "@/app/context/CurrencyContext";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const { currency } = useCurrency(); // 👈 currency from context
  const currencySymbol = getCurrencySymbol(currency); // 👈 get symbol like ₹ or $

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(UpdateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
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

  const handleNavigate = () => {
    setIsNavigating(true);
    router.push(`/account/${id}`);
  };

  return (
    <Card
      onClick={handleNavigate}
      className="h-full flex flex-col justify-between border border-zinc-800 hover:shadow-lg bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-xl px-5 py-6 cursor-pointer transition duration-200"
    >
      {isNavigating ? (
        <div className="flex flex-col items-center justify-center h-full space-y-3 text-purple-200 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          <p className="text-sm tracking-wide text-purple-300">
            Loading{" "}
            <span className="font-semibold text-white">{account.name}</span>'s
            account...
          </p>
        </div>
      ) : (
        <>
          <CardHeader className="p-0 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                {name}
              </CardTitle>
              <p className="text-sm text-zinc-400 mt-1">
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
              </p>
            </div>
            <Switch checked={isDefault} onClick={handleDefaultChange} />
          </CardHeader>

          <CardContent className="p-0 mt-6 flex-1 flex flex-col justify-center">
            <div className="text-3xl font-bold text-zinc-100">
              {currencySymbol}
              {parseFloat(balance).toFixed(2)}
            </div>
          </CardContent>

          <CardFooter className="p-0 mt-6 flex justify-between text-sm text-zinc-400">
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="h-4 w-4 text-green-400" />
              <span>Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowDownRight className="h-4 w-4 text-red-400" />
              <span>Expense</span>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default AccountCard;
