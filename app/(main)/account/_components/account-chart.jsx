"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrencySymbol, useCurrency } from "@/app/context/CurrencyContext";// ✅ useCurrency hook

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const { currency } = useCurrency(); // 🔥 fetch currency from context
  const currencySymbol = getCurrencySymbol(currency);

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <Card className="bg-[#1f1f23] border border-muted text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-base font-medium text-white">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] bg-[#2a2a2e] text-white border border-[#3f3f46]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a2e] text-white border border-[#3f3f46]">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem
                key={key}
                value={key}
                className="hover:bg-[#3a3a40] focus:bg-[#3a3a40]"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <div className="flex justify-around mb-6 text-sm text-muted-foreground">
          <div className="text-center">
            <p>Total Income</p>
            <p className="text-lg font-bold text-green-400">
              {currencySymbol}
              {totals.income.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p>Total Expenses</p>
            <p className="text-lg font-bold text-red-400">
              {currencySymbol}
              {totals.expense.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p>Net</p>
            <p
              className={`text-lg font-bold ${
                totals.income - totals.expense >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {currencySymbol}
              {(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="h-[300px] bg-[#1f1f23] rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                stroke="#aaa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#aaa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${currencySymbol}${value}`}
              />
              <Tooltip
                wrapperStyle={{ outline: "none" }}
                contentStyle={{
                  backgroundColor: "#2a2a2e",
                  border: "1px solid #3f3f46",
                  borderRadius: 6,
                  color: "#fff",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value) => [`${currencySymbol}${value}`, undefined]}
              />
              <Legend
                wrapperStyle={{
                  color: "#a1a1aa",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#4ade80"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#f87171"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
