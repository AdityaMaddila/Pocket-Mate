"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingDown,
  PiggyBank,
  Target,
  Plus,
  Edit3,
  Calendar,
  DollarSign,
  X,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/lib/formatCurrency"; // assumes formatCurrency uses selected currency from context

const MonthlyStatsCards = ({
  monthlySpending = 0,
  savings = 0,
  goals = [],
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { currency } = useCurrency();

  const handleGoalSubmit = () => {
    if (!goalForm.title || !goalForm.targetAmount) return;
    const goalData = {
      ...goalForm,
      targetAmount: parseFloat(goalForm.targetAmount) || 0,
      currentAmount: parseFloat(goalForm.currentAmount) || 0,
      id: editingGoal?.id || Date.now().toString(),
    };

    if (editingGoal) {
      onUpdateGoal(goalData);
    } else {
      onAddGoal(goalData);
    }

    setGoalForm({
      title: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      description: "",
    });
    setEditingGoal(null);
    setIsGoalDialogOpen(false);
  };

  const openEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      description: goal.description || "",
    });
    setShowDeleteConfirm(false);
    setIsGoalDialogOpen(true);
  };

  const handleDeleteGoal = () => {
    if (editingGoal && onDeleteGoal) {
      onDeleteGoal(editingGoal.id);
      setIsGoalDialogOpen(false);
      setEditingGoal(null);
      setShowDeleteConfirm(false);
    }
  };

  const getGoalProgress = (goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
      {/* Monthly Spending Card */}
      <div className="group">
        <Card className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 hover:border-red-500/30 transition-all duration-300 shadow-xl hover:shadow-2xl group-hover:shadow-red-500/20 rounded-2xl overflow-hidden transform hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-zinc-100 flex items-center">
                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 mr-3 group-hover:bg-red-500/20 transition-all duration-300">
                  <TrendingDown className="h-5 w-5 text-red-400" />
                </div>
                Monthly Spending
              </CardTitle>
              <Calendar className="h-4 w-4 text-zinc-400 group-hover:text-red-400 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-400">
                {formatCurrency(monthlySpending, currency)}
              </div>
              <p className="text-sm text-zinc-400">Total spent this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Card */}
      <div className="group">
        <Card className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 hover:border-green-500/30 transition-all duration-300 shadow-xl hover:shadow-2xl group-hover:shadow-green-500/20 rounded-2xl overflow-hidden transform hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-zinc-100 flex items-center">
                <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20 mr-3 group-hover:bg-green-500/20 transition-all duration-300">
                  <PiggyBank className="h-5 w-5 text-green-400" />
                </div>
                Savings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-zinc-400 group-hover:text-green-400 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">
                {formatCurrency(savings, currency)}
              </div>
              <p className="text-sm text-zinc-400">Total saved this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Card */}
      <div className="group">
        <Card className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 hover:border-blue-500/30 transition-all duration-300 shadow-xl hover:shadow-2xl group-hover:shadow-blue-500/20 rounded-2xl overflow-hidden transform hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-zinc-100 flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 mr-3 group-hover:bg-blue-500/20 transition-all duration-300">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                Goals
              </CardTitle>
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 hover:scale-110 transition-all duration-300 rounded-full p-2"
                    onClick={() => {
                      setEditingGoal(null);
                      setShowDeleteConfirm(false);
                      setGoalForm({
                        title: "",
                        targetAmount: "",
                        currentAmount: "",
                        deadline: "",
                        description: ""
                      });
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 text-zinc-100 max-w-md rounded-2xl shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl" />
                  <div className="relative z-10">
                    <DialogHeader className="space-y-4 pb-2">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-zinc-100 flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <Target className="h-5 w-5 text-blue-400" />
                          </div>
                          {editingGoal ? "Edit Goal" : "Create New Goal"}
                        </DialogTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsGoalDialogOpen(false)}
                          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-full p-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                    </DialogHeader>
                    
                    <div className="space-y-6 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-zinc-300 font-medium">Goal Title</Label>
                        <Input
                          id="title"
                          type="text"
                          value={goalForm.title}
                          onChange={(e) => setGoalForm({...goalForm, title: e.target.value})}
                          className="bg-zinc-800/50 border-zinc-700/60 text-zinc-100 rounded-xl h-11 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                          placeholder="Emergency Fund"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="targetAmount" className="text-zinc-300 font-medium">Target Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                              id="targetAmount"
                              type="number"
                              value={goalForm.targetAmount}
                              onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})}
                              className="bg-zinc-800/50 border-zinc-700/60 text-zinc-100 rounded-xl h-11 pl-10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                              placeholder="10000"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentAmount" className="text-zinc-300 font-medium">Current Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                              id="currentAmount"
                              type="number"
                              value={goalForm.currentAmount}
                              onChange={(e) => setGoalForm({...goalForm, currentAmount: e.target.value})}
                              className="bg-zinc-800/50 border-zinc-700/60 text-zinc-100 rounded-xl h-11 pl-10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                              placeholder="2500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deadline" className="text-zinc-300 font-medium">Target Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                          <Input
                            id="deadline"
                            type="date"
                            value={goalForm.deadline}
                            onChange={(e) => setGoalForm({...goalForm, deadline: e.target.value})}
                            className="bg-zinc-800/50 border-zinc-700/60 text-zinc-100 rounded-xl h-11 pl-10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-zinc-300 font-medium">Description <span className="text-zinc-500 font-normal">(Optional)</span></Label>
                        <Input
                          id="description"
                          type="text"
                          value={goalForm.description}
                          onChange={(e) => setGoalForm({...goalForm, description: e.target.value})}
                          className="bg-zinc-800/50 border-zinc-700/60 text-zinc-100 rounded-xl h-11 focus:border-zinc-500/50 focus:ring-2 focus:ring-zinc-500/20 transition-all duration-300"
                          placeholder="Save for 6 months of expenses"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center gap-3 pt-4">
                        {editingGoal && (
                          <div className="flex-1">
                            {!showDeleteConfirm ? (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl px-4 py-2 transition-all duration-300 flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Goal
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={handleDeleteGoal}
                                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 transition-all duration-300 text-sm"
                                >
                                  Confirm Delete
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => setShowDeleteConfirm(false)}
                                  className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-xl px-4 py-2 transition-all duration-300 text-sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsGoalDialogOpen(false)}
                            className="border-zinc-700/60 text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 rounded-xl px-6 transition-all duration-300"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleGoalSubmit}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                          >
                            {editingGoal ? "Update Goal" : "Create Goal"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
       <CardContent className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-6">
                <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20 w-fit mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-sm text-zinc-400">No goals set yet</p>
                <p className="text-xs text-zinc-500 mt-1">Click + to create your first goal</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {goals.slice(0, 2).map((goal) => (
                  <div key={goal.id} className="space-y-2 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30 hover:border-blue-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-300 truncate">
                        {goal.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditGoal(goal)}
                        className="text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 p-1 h-6 w-6 rounded transition-all duration-300"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>{formatCurrency(goal.currentAmount, currency)}</span>
                        <span>{formatCurrency(goal.targetAmount, currency)}</span>
                      </div>
                      <div className="w-full bg-zinc-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${getGoalProgress(goal)}%` }}
                        />
                      </div>
                      <div className="text-xs text-zinc-500 text-center">
                        {Math.round(getGoalProgress(goal))}% complete
                      </div>
                    </div>
                  </div>
                ))}
                {goals.length > 2 && (
                  <div className="text-xs text-zinc-500 text-center py-2">
                    +{goals.length - 2} more goals
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyStatsCards;
