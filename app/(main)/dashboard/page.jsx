"use client";

import React, { useEffect, useState } from "react";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet, TrendingUp } from "lucide-react";
import { getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/AccountCard";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budgetprogress";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAccounts = await getUserAccounts();
        setAccounts(userAccounts || []);
        
        const defaultAccount = userAccounts?.find((account) => account.isDefault);
        if (defaultAccount) {
          const budget = await getCurrentBudget(defaultAccount.id);
          setBudgetData(budget);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const defaultAccount = accounts?.find((account) => account.isDefault);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 md:p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center mb-4"
          >
            <Wallet className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold text-zinc-50">
              Financial Dashboard
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-300"
          >
            Track your accounts, budgets, and financial goals
          </motion.p>
        </div>

        {/* Budget Section */}
        {defaultAccount && budgetData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto"
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
              />
            </div>
          </motion.div>
        )}

        {/* Accounts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-6xl mx-auto w-full"
        >
          <div className="flex items-center mb-6">
            <Wallet className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-zinc-100">
              Your Accounts
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Create Account Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="w-full"
            >
              <CreateAccountDrawer>
                <Card className="w-full h-full bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 hover:border-zinc-600/80 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group rounded-2xl overflow-hidden">
                  <CardContent className="h-full flex flex-col items-start justify-center p-6 space-y-4">
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

            {/* Existing Accounts */}
            {accounts?.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.6 + (index * 0.1) 
                }}
                whileHover={{ scale: 1.02 }}
                className="w-full"
              >
                <AccountCard account={account} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {!accounts || accounts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
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
        ) : null}
      </motion.div>
    </div>
  );
};

export default DashboardPage;