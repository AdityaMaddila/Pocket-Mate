"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CreditCard, Wallet, Star, AlertCircle, Sparkles, DollarSign } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const watchedType = watch("type");
  const watchedBalance = watch("balance");

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case "CURRENT":
        return <CreditCard className="h-5 w-5" />;
      case "SAVINGS":
        return <Wallet className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case "CURRENT":
        return "text-blue-400";
      case "SAVINGS":
        return "text-green-400";
      default:
        return "text-blue-400";
    }
  };

  const getAccountTypeDescription = (type) => {
    switch (type) {
      case "CURRENT":
        return "Perfect for daily transactions and bill payments";
      case "SAVINGS":
        return "Ideal for building wealth and earning interest";
      default:
        return "";
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-h-[95vh] bg-zinc-950/95 backdrop-blur-2xl border-zinc-800/50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl -top-32 -right-32 animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute w-48 h-48 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-24 -left-24 animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <DrawerHeader className="relative text-center border-b border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 backdrop-blur-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50" />
              <div className="relative p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 backdrop-blur-xl">
                <CreditCard className="h-7 w-7 text-blue-400" />
              </div>
            </div>
          </div>
          <DrawerTitle className="text-2xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent mb-2">
            Create New Account
          </DrawerTitle>
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>AI-powered financial management</span>
          </div>
        </DrawerHeader>
        
        <div className="relative px-6 pb-6 pt-6 max-h-[calc(95vh-140px)] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Name */}
            <div className="group space-y-3">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-zinc-300 flex items-center gap-2"
              >
                <div className="p-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                </div>
                Account Name
              </label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="e.g., Main Checking Account"
                  className="h-14 text-base bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-2xl"
                  {...register("name")}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              {errors.name && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name.message}
                </div>
              )}
            </div>

            {/* Account Type */}
            <div className="group space-y-3">
              <label
                htmlFor="type"
                className="text-sm font-semibold text-zinc-300 flex items-center gap-2"
              >
                <div className={`p-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30`}>
                  {getAccountTypeIcon(watchedType)}
                </div>
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type" className="h-14 text-base bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 text-zinc-100 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-2xl">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-800/50 rounded-2xl">
                  <SelectItem value="CURRENT" className="py-4 rounded-xl focus:bg-zinc-800/50 text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                        <CreditCard className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-zinc-100">Current Account</div>
                        <div className="text-sm text-zinc-400">For everyday transactions</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="SAVINGS" className="py-4 rounded-xl focus:bg-zinc-800/50 text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                        <Wallet className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium text-zinc-100">Savings Account</div>
                        <div className="text-sm text-zinc-400">For saving and growth</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {watchedType && (
                <div className="flex items-center gap-3 text-sm text-zinc-400 bg-zinc-900/50 backdrop-blur-xl p-4 rounded-2xl border border-zinc-800/50">
                  <div className={`p-1 bg-gradient-to-br ${watchedType === 'CURRENT' ? 'from-blue-500/20 to-purple-500/20 border-blue-500/30' : 'from-green-500/20 to-emerald-500/20 border-green-500/30'} rounded-lg border`}>
                    {getAccountTypeIcon(watchedType)}
                  </div>
                  <span className="text-zinc-300">{getAccountTypeDescription(watchedType)}</span>
                </div>
              )}
              {errors.type && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  {errors.type.message}
                </div>
              )}
            </div>

            {/* Initial Balance */}
            <div className="group space-y-3">
              <label
                htmlFor="balance"
                className="text-sm font-semibold text-zinc-300 flex items-center gap-2"
              >
                <div className="p-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                  <DollarSign className="h-4 w-4 text-green-400" />
                </div>
                Initial Balance
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 text-base font-medium z-10">
                  $
                </div>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="h-14 text-base pl-10 bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 rounded-2xl"
                  {...register("balance")}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              {watchedBalance && (
                <div className="text-sm text-zinc-300 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-2xl border border-green-500/20 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-green-500/20 rounded-full">
                      <DollarSign className="h-3 w-3 text-green-400" />
                    </div>
                    <span className="font-medium text-green-400">
                      Starting balance: ${parseFloat(watchedBalance || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              {errors.balance && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  {errors.balance.message}
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-zinc-800/50 my-8"></div>

            {/* Default Account Setting */}
            <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl blur-xl" />
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30">
                      <Star className="h-4 w-4 text-amber-400" />
                    </div>
                    <label
                      htmlFor="isDefault"
                      className="text-base font-semibold text-zinc-100 cursor-pointer"
                    >
                      Set as Default Account
                    </label>
                    {watch("isDefault") && (
                      <Badge className="ml-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 backdrop-blur-xl">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 ml-11">
                    This account will be automatically selected for new transactions
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  checked={watch("isDefault")}
                  onCheckedChange={(checked) => setValue("isDefault", checked)}
                  className="ml-4 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <DrawerClose asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-14 text-base font-medium bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 transition-all duration-300 rounded-2xl"
                  disabled={createAccountLoading}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-1 h-14 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 rounded-2xl backdrop-blur-xl"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <div className="mr-2 p-1 bg-white/20 rounded-full">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    Create Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}