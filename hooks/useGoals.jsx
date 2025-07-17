"use client";

import { useState, useEffect } from "react";

// Custom hook for managing goals
export const useGoals = () => {
  const [goals, setGoals] = useState([]);

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('financial-goals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('financial-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goalData) => {
    const newGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (updatedGoal) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
};