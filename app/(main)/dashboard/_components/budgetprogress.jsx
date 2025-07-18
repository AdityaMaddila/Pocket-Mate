"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { updateBudget } from "@/actions/budget";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { getCurrencySymbol } from "@/app/context/CurrencyContext";  // Utility function for currency symbols

const BudgetProgress = ({ initialBudget, currentExpenses, currency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid budget amount.");
      return;
    }
    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget) {
      toast.success("Budget updated successfully!");
      setIsEditing(false);
    }
    if (error) {
      toast.error("Failed to update budget. Please try again.");
    }
  }, [updatedBudget, error]);

  const percentageUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const symbol = getCurrencySymbol(currency);

  return (
    <Card className="bg-zinc-950 text-white border border-zinc-800 shadow-md">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold tracking-wide">
            Monthly Budget{" "}
            <span className="text-zinc-400 text-sm">(Default Account)</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-7 w-7 hover:bg-zinc-800"
          >
            <Pencil className="h-4 w-4 text-zinc-300" />
          </Button>
        </div>

        {isEditing && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 rounded-md w-36 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter new budget"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUpdateBudget}
              className="hover:bg-zinc-800"
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="hover:bg-zinc-800"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}

        <CardDescription className="text-sm text-zinc-400 pt-1">
          {initialBudget
            ? `${symbol}${currentExpenses.toFixed(2)} of ${symbol}${initialBudget.amount.toFixed(2)} spent`
            : "No budget set for this account."}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full transition-all duration-300 ${
              percentageUsed > 90
                ? "bg-red-500"
                : percentageUsed > 60
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-end mt-2">
          <p className="text-xs text-zinc-400 mt-2">
            {Math.min(percentageUsed, 100).toFixed(2)}% of budget used
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
