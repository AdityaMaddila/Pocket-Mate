"use client";

import React, { useEffect, useState } from "react";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet, TrendingUp, ArrowRight, ExternalLink } from "lucide-react";
import { getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/AccountCard";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budgetprogress";
import MonthlyStatsCards from "./_components/MonthlyStatsCards";
import { useGoals } from "@/hooks/useGoals";
import { getMonthlySpending, getMonthlySavings } from "@/actions/monthlyStats";
import { motion } from "framer-motion";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/lib/formatCurrency";
import { CurrencySelector } from "@/components/CurrencySelector";

const DashboardPage = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [accounts, setAccounts] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [loading, setLoading] = useState(true);

  // ========================================
  // HOOKS
  // ========================================
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const { currency } = useCurrency();

  // ========================================
  // DATA FETCHING
  // ========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAccounts = await getUserAccounts();
        setAccounts(userAccounts || []);

        const defaultAccount = userAccounts?.find((account) => account.isDefault);
        if (defaultAccount) {
          const budget = await getCurrentBudget(defaultAccount.id);
          setBudgetData(budget);

          const [spending, savings] = await Promise.all([
            getMonthlySpending(defaultAccount.id),
            getMonthlySavings(defaultAccount.id)
          ]);

          setMonthlySpending(spending);
          setMonthlySavings(savings);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ========================================
  // LOADING STATE
  // ========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // DERIVED VALUES
  // ========================================
  const defaultAccount = accounts?.find((account) => account.isDefault);

  // ========================================
  // MAIN DASHBOARD LAYOUT
  // ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto w-full space-y-6"
      >
        {/* ========================================
            HEADER SECTION
        ======================================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3">
            <div className="flex items-center justify-center">
              <Wallet className="h-8 w-8 text-blue-400 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-50">
                Financial Dashboard
              </h1>
            </div>
            <CurrencySelector />
          </div>
          <p className="text-zinc-300 text-sm md:text-base">
            Track your accounts, budgets, and financial goals
          </p>
        </motion.div>

        {/* ========================================
            MONTHLY STATS SECTION
        ======================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MonthlyStatsCards
            monthlySpending={monthlySpending}
            savings={monthlySavings}
            goals={goals}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
            currency={currency}
          />
        </motion.div>

        {/* ========================================
            BUDGET OVERVIEW SECTION
        ======================================== */}
        {defaultAccount && budgetData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full"
          >
            <div className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-5 w-5 text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-zinc-100">
                  Budget Overview
                </h2>
              </div>
              <BudgetProgress
                initialBudget={budgetData?.budget}
                currentExpenses={budgetData?.currentExpenses || 0}
                currency={currency}
              />
            </div>
          </motion.div>
        )}

        {/* ========================================
            ACCOUNTS SECTION
        ======================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          {/* Section Header */}
          <div className="flex items-center mb-6">
            <Wallet className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-zinc-100">
              Your Accounts
            </h2>
            {accounts && accounts.length > 0 && (
              <span className="ml-auto text-sm text-zinc-400">
                Click on any account to view details
              </span>
            )}
          </div>

          {/* Empty State */}
          {!accounts || accounts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center py-12"
            >
              <div className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                <div className="p-4 bg-zinc-700/50 rounded-xl inline-block mb-4">
                  <Wallet className="h-12 w-12 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  No Accounts Yet
                </h3>
                <p className="text-zinc-400 mb-6">
                  Create your first account to start managing your finances
                </p>
                <CreateAccountDrawer>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </motion.button>
                </CreateAccountDrawer>
              </div>
            </motion.div>
          ) : (
            /* Accounts Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Create New Account Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="w-full"
              >
                <CreateAccountDrawer>
                  <Card className="w-full h-full bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 hover:border-zinc-600/80 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group rounded-2xl overflow-hidden">
                    <CardContent className="h-full flex flex-col items-start justify-center p-6 space-y-4 min-h-[180px]">
                      <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors duration-200">
                        <Plus className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors duration-200">
                          Create New Account
                        </h3>
                        <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-200">
                          Start tracking your finances with a new account
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CreateAccountDrawer>
              </motion.div>

              {/* Existing Account Cards */}
              {accounts?.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + index * 0.1,
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full relative group"
                >
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                  
                  {/* External Link Icon */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-1.5">
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-20">
                    <div className="bg-zinc-700/80 backdrop-blur-sm border border-zinc-600/60 rounded-full p-2">
                      <ArrowRight className="w-4 h-4 text-zinc-300" />
                    </div>
                  </div>
                  
                  {/* Bottom Gradient with Text */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-800/90 to-transparent rounded-b-2xl p-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <p className="text-xs text-zinc-400 text-center">
                      Click to view account details
                    </p>
                  </div>
                  
                  {/* Account Card Component */}
                  <AccountCard account={account} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;