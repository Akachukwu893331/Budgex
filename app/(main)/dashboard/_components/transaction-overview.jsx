"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, TrendingUp } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#06B6D4", "#84CC16", "#F97316", "#6366F1", "#EC4899",
  "#14B8A6", "#F43F5E", "#8B5CF6", "#06B6D4", "#84CC16"
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // Filter transactions for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
    })
  );

  const totalExpenses = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-3 min-w-[140px]">
          <p className="font-semibold text-gray-900 text-sm mb-1">{data.name}</p>
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-gray-900">${data.value.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-xs mt-1">
            <span className="text-gray-600">Percentage:</span>
            <span className="font-semibold text-blue-600">{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Hide labels for very small slices
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Recent Transactions Card - Redesigned */}
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm  ">
        <CardHeader className="flex flex-row items-center  justify-between pb-4 space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Latest account activity
            </p>
          </div>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-[160px] border-gray-300 bg-white">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No recent transactions</p>
              <p className="text-gray-400 text-xs mt-1">Transactions will appear here</p>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    transaction.type === "EXPENSE" 
                      ? "bg-red-50 text-red-600" 
                      : "bg-green-50 text-green-600"
                  )}>
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-2 py-0 h-5",
                          transaction.type === "EXPENSE" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-green-100 text-green-700"
                        )}
                      >
                        {transaction.type.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
                      <span>•</span>
                      <span className="capitalize">{transaction.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "text-right",
                    transaction.type === "EXPENSE" 
                      ? "text-red-600" 
                      : "text-green-600"
                  )}>
                    <div className="text-sm font-semibold">
                      {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Expense Breakdown Card - Redesigned */}
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Monthly Expenses
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Spending by category
              </p>
            </div>
            {totalExpenses > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ${totalExpenses.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Total spent</div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 pb-6">
          {pieChartData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No expenses this month</p>
              <p className="text-gray-400 text-xs mt-1">Expenses will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 px-6">
              {/* Chart Container */}
              <div className="h-[280px] w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={1}
                      dataKey="value"
                      label={renderCustomizedLabel}
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Container */}
              <div className="w-full lg:w-1/2 space-y-3 max-h-[280px] overflow-y-auto">
                {pieChartData.map((entry, index) => {
                  const percentage = ((entry.value / totalExpenses) * 100).toFixed(1);
                  return (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-900 truncate capitalize">
                          {entry.name.toLowerCase()}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-semibold text-gray-900">
                          ${entry.value.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}