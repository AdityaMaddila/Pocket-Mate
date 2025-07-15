"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/app/lib/schema";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createTransaction } from "@/actions/transaction";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import { motion } from "framer-motion";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CalendarSearchIcon, 
  DollarSign, 
  FileText, 
  Repeat, 
  Target,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Calendar } from "@/components/ui/calendar";

export default function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: editMode && initialData
      ? {
          type: initialData.type,
          amount: initialData.amount.toString(),
          description: initialData.description,
          accountId: initialData.accountId,
          category: initialData.category,
          date: new Date(initialData.date),
          isRecurring: initialData.isRecurring,
          recurringInterval: initialData.recurringInterval ?? undefined,
        }
      : {
          type: "EXPENSE",
          amount: "",
          description: "",
          accountId: accounts.find((a) => a.isDefault)?.id ?? "",
          date: new Date(),
          isRecurring: false,
        },
  });

  const { loading: transactionLoading, fn: transactionFn, data: transactionResult } = useFetch(createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const onSubmit = (data) => {
    transactionFn({ ...data, amount: parseFloat(data.amount) });
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction updated successfully" : "Transaction created successfully");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 md:p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">
            {editMode ? "Edit Transaction" : "Add New Transaction"}
          </h1>
          <p className="text-zinc-300">
            {editMode ? "Update your transaction details" : "Track your income and expenses"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full overflow-hidden">
          {/* Main Content Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            
            {/* Transaction Type Card - Fixed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1 bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center mb-6">
                <Target className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-zinc-100 leading-tight">
                  Transaction Type
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue("type", "EXPENSE")}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      type === "EXPENSE"
                        ? "border-red-500 bg-red-500/10 text-red-300"
                        : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <TrendingDown className="h-5 w-5" />
                      <span className="text-sm font-medium">Expense</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setValue("type", "INCOME")}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      type === "INCOME"
                        ? "border-green-500 bg-green-500/10 text-green-300"
                        : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-sm font-medium">Income</span>
                    </div>
                  </button>
                </div>
                {errors.type && <p className="text-xs text-red-400 break-words">{errors.type.message}</p>}
              </div>
            </motion.div>

            {/* Amount & Account Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 rounded-2xl p-6 shadow-xl overflow-hidden"
            >
              <div className="flex items-center mb-4">
                <DollarSign className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-zinc-100 truncate">Amount & Account</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">Amount</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">$</div>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      className="pl-8 bg-zinc-800/80 border-zinc-700 text-zinc-100 h-12 text-lg font-medium rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-zinc-400" 
                      {...register("amount")} 
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-400 break-words">{errors.amount.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">Account</label>
                  <Select onValueChange={(val) => setValue("accountId", val)} defaultValue={getValues("accountId") ?? ""}>
                    <SelectTrigger className="bg-zinc-800/80 border-zinc-700 h-12 rounded-xl text-zinc-100">
                      <SelectValue placeholder="Select Account" className="text-zinc-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id} className="text-zinc-100 hover:bg-zinc-700">
                          {a.name} (${parseFloat(a.balance).toFixed(2)})
                        </SelectItem>
                      ))}
                      <CreateAccountDrawer>
                        <Button variant="ghost" className="w-full mt-2 text-zinc-300 hover:text-zinc-100">+ Create Account</Button>
                      </CreateAccountDrawer>
                    </SelectContent>
                  </Select>
                  {errors.accountId && <p className="text-xs text-red-400 break-words">{errors.accountId.message}</p>}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            
            {/* Category & Date Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 rounded-2xl p-6 shadow-xl overflow-hidden"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">Category</label>
                  <Select onValueChange={(val) => setValue("category", val)} defaultValue={getValues("category") ?? ""}>
                    <SelectTrigger className="bg-zinc-800/80 border-zinc-700 h-12 rounded-xl text-zinc-100">
                      <SelectValue placeholder="Select Category" className="text-zinc-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-zinc-100 hover:bg-zinc-700">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-red-400 break-words">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start pl-3 text-left font-normal bg-zinc-800/80 border-zinc-700 text-zinc-100 h-12 rounded-xl hover:bg-zinc-700/50"
                      >
                        {date ? format(date, "PPP") : <span className="text-zinc-400">Pick a date</span>}
                        <CalendarSearchIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-zinc-900 border-zinc-700 text-zinc-100 rounded-xl shadow-xl z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => setValue("date", date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && <p className="text-xs text-red-400 break-words">{errors.date.message}</p>}
                </div>
              </div>
            </motion.div>

            {/* Description & Recurring Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 rounded-2xl p-6 shadow-xl overflow-hidden"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200 flex items-center">
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    Description
                  </label>
                  <Input 
                    placeholder="Enter description" 
                    className="bg-zinc-800/80 border-zinc-700 text-zinc-100 h-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-zinc-400" 
                    {...register("description")} 
                  />
                  {errors.description && <p className="text-xs text-red-400 break-words">{errors.description.message}</p>}
                </div>

                <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Repeat className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                      <label className="text-sm font-medium text-zinc-100">Recurring Transaction</label>
                    </div>
                    <Switch
                      checked={isRecurring}
                      onCheckedChange={(val) => setValue("isRecurring", val)}
                    />
                  </div>
                  <p className="text-xs text-zinc-400">Set up automatic recurring transactions</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recurring Interval */}
          {isRecurring && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 rounded-2xl p-6 shadow-xl overflow-hidden w-full"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center">
                  <Repeat className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                  Recurring Schedule
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "DAILY", label: "Daily", icon: "📅" },
                    { value: "WEEKLY", label: "Weekly", icon: "📆" },
                    { value: "MONTHLY", label: "Monthly", icon: "🗓️" },
                    { value: "YEARLY", label: "Yearly", icon: "📊" }
                  ].map((interval) => (
                    <button
                      key={interval.value}
                      type="button"
                      onClick={() => setValue("recurringInterval", interval.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                        getValues("recurringInterval") === interval.value
                          ? "border-blue-500 bg-blue-500/10 text-blue-300"
                          : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{interval.icon}</div>
                        <div className="text-sm font-medium">{interval.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.recurringInterval && <p className="text-xs text-red-400 break-words">{errors.recurringInterval.message}</p>}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-6 w-full overflow-hidden"
          >
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-200 h-12 rounded-xl hover:bg-zinc-700/50 hover:text-zinc-100 transition-all duration-200" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={transactionLoading} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white h-12 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {transactionLoading ? "Processing..." : `${editMode ? "Update" : "Create"} Transaction`}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}