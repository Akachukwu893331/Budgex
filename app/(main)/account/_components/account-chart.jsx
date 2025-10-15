// "use client";

// import { useState, useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { format, subDays, startOfDay, endOfDay } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const DATE_RANGES = {
//   "7D": { label: "Last 7 Days", days: 7 },
//   "1M": { label: "Last Month", days: 30 },
//   "3M": { label: "Last 3 Months", days: 90 },
//   "6M": { label: "Last 6 Months", days: 180 },
//   ALL: { label: "All Time", days: null },
// };

// export function AccountChart({ transactions }) {
//   const [dateRange, setDateRange] = useState("1M");

//   const filteredData = useMemo(() => {
//     const range = DATE_RANGES[dateRange];
//     const now = new Date();
//     const startDate = range.days
//       ? startOfDay(subDays(now, range.days))
//       : startOfDay(new Date(0));

//     // Filter transactions within date range
//     const filtered = transactions.filter(
//       (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
//     );

//     // Group transactions by date
//     const grouped = filtered.reduce((acc, transaction) => {
//       const date = format(new Date(transaction.date), "MMM dd");
//       if (!acc[date]) {
//         acc[date] = { date, income: 0, expense: 0 };
//       }
//       if (transaction.type === "INCOME") {
//         acc[date].income += transaction.amount;
//       } else {
//         acc[date].expense += transaction.amount;
//       }
//       return acc;
//     }, {});

//     // Convert to array and sort by date
//     return Object.values(grouped).sort(
//       (a, b) => new Date(a.date) - new Date(b.date)
//     );
//   }, [transactions, dateRange]);

//   // Calculate totals for the selected period
//   const totals = useMemo(() => {
//     return filteredData.reduce(
//       (acc, day) => ({
//         income: acc.income + day.income,
//         expense: acc.expense + day.expense,
//       }),
//       { income: 0, expense: 0 }
//     );
//   }, [filteredData]);

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
//         <CardTitle className="text-base font-normal">
//           Transaction Overview
//         </CardTitle>
//         <Select defaultValue={dateRange} onValueChange={setDateRange}>
//           <SelectTrigger className="w-[140px]">
//             <SelectValue placeholder="Select range" />
//           </SelectTrigger>
//           <SelectContent>
//             {Object.entries(DATE_RANGES).map(([key, { label }]) => (
//               <SelectItem key={key} value={key}>
//                 {label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent>
//         <div className="flex justify-around mb-6 text-sm">
//           <div className="text-center">
//             <p className="text-muted-foreground">Total Income</p>
//             <p className="text-lg font-bold text-green-500">
//               ${totals.income.toFixed(2)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-muted-foreground">Total Expenses</p>
//             <p className="text-lg font-bold text-red-500">
//               ${totals.expense.toFixed(2)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-muted-foreground">Net</p>
//             <p
//               className={`text-lg font-bold ${
//                 totals.income - totals.expense >= 0
//                   ? "text-green-500"
//                   : "text-red-500"
//               }`}
//             >
//               ${(totals.income - totals.expense).toFixed(2)}
//             </p>
//           </div>
//         </div>
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={filteredData}
//               margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis
//                 dataKey="date"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `$${value}`}
//               />
//               <Tooltip
//                 formatter={(value) => [`$${value}`, undefined]}
//                 contentStyle={{
//                   backgroundColor: "hsl(var(--popover))",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "var(--radius)",
//                 }}
//               />
//               <Legend />
//               <Bar
//                 dataKey="income"
//                 name="Income"
//                 fill="#22c55e"
//                 radius={[4, 4, 0, 0]}
//               />
//               <Bar
//                 dataKey="expense"
//                 name="Expense"
//                 fill="#ef4444"
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }










































"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const DATE_RANGES = {
  "7D": { label: "7D", days: 7 },
  "1M": { label: "1M", days: 30 },
  "3M": { label: "3M", days: 90 },
  "1Y": { label: "1Y", days: 365 },
};

const CHART_TYPES = {
  LINE: "line",
  BAR: "bar",
  PIE: "pie",
};

const COLORS = {
  income: "#10b981",
  expense: "#ef4444",
  net: "#3b82f6",
};

const MOBILE_COLORS = {
  income: "#059669",
  expense: "#dc2626", 
  net: "#2563eb",
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");
  const [chartType, setChartType] = useState(CHART_TYPES.LINE);

  const { filteredData, pieData } = useMemo(() => {
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
        acc[date] = { date, income: 0, expense: 0, net: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
        acc[date].net += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
        acc[date].net -= transaction.amount;
      }
      return acc;
    }, {});

    const chartData = Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const totalIncome = chartData.reduce((sum, day) => sum + day.income, 0);
    const totalExpense = chartData.reduce((sum, day) => sum + day.expense, 0);
    const pieData = [
      { name: "Income", value: totalIncome, color: COLORS.income },
      { name: "Expense", value: totalExpense, color: COLORS.expense },
    ];

    return { filteredData: chartData, pieData };
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

  const netAmount = totals.income - totals.expense;
  const isPositive = netAmount >= 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4 space-y-2 min-w-[140px]">
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 capitalize">
                  {entry.dataKey}:
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                ${entry.value?.toFixed(2) || 0}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { 
        top: 10, 
        right: window.innerWidth < 768 ? 5 : 10, 
        left: window.innerWidth < 768 ? 0 : 10, 
        bottom: window.innerWidth < 768 ? 20 : 10 
      },
    };

    switch (chartType) {
      case CHART_TYPES.LINE:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f1f5f9"
              opacity={0.6}
            />
            <XAxis
              dataKey="date"
              fontSize={window.innerWidth < 768 ? 10 : 11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b" }}
              tickMargin={8}
              interval={window.innerWidth < 768 ? "preserveStartEnd" : 0}
            />
            <YAxis
              fontSize={window.innerWidth < 768 ? 10 : 11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "#64748b" }}
              width={window.innerWidth < 768 ? 35 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke={window.innerWidth < 768 ? MOBILE_COLORS.income : COLORS.income}
              strokeWidth={window.innerWidth < 768 ? 2.5 : 3}
              dot={false}
              activeDot={{ 
                r: window.innerWidth < 768 ? 4 : 6, 
                strokeWidth: 0,
                fill: window.innerWidth < 768 ? MOBILE_COLORS.income : COLORS.income
              }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke={window.innerWidth < 768 ? MOBILE_COLORS.expense : COLORS.expense}
              strokeWidth={window.innerWidth < 768 ? 2.5 : 3}
              dot={false}
              activeDot={{ 
                r: window.innerWidth < 768 ? 4 : 6, 
                strokeWidth: 0,
                fill: window.innerWidth < 768 ? MOBILE_COLORS.expense : COLORS.expense
              }}
            />
          </LineChart>
        );

      case CHART_TYPES.PIE:
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => 
                window.innerWidth < 768 
                  ? `${(percent * 100).toFixed(0)}%`
                  : `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={window.innerWidth < 768 ? 70 : 80}
              innerRadius={window.innerWidth < 768 ? 30 : 40}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={window.innerWidth < 768 ? MOBILE_COLORS[entry.name.toLowerCase()] : entry.color} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
          </PieChart>
        );

      default: // BAR chart
        return (
          <BarChart {...commonProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f1f5f9"
              opacity={0.6}
            />
            <XAxis
              dataKey="date"
              fontSize={window.innerWidth < 768 ? 10 : 11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b" }}
              tickMargin={8}
              interval={window.innerWidth < 768 ? "preserveStartEnd" : 0}
            />
            <YAxis
              fontSize={window.innerWidth < 768 ? 10 : 11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "#64748b" }}
              width={window.innerWidth < 768 ? 35 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="income"
              name="Income"
              fill={window.innerWidth < 768 ? MOBILE_COLORS.income : COLORS.income}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill={window.innerWidth < 768 ? MOBILE_COLORS.expense : COLORS.expense}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Financial Overview
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track your income and expenses
            </p>
          </div>
          
          {/* Date Range Selector - Mobile Optimized */}
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[120px] border-gray-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key} className="text-sm">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards - Block on Mobile, Straight Line on Laptop */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Income Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-700">
                INCOME
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-green-900">
              ${totals.income.toLocaleString()}
            </p>
          </div>

          {/* Expense Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-600" />
              </div>
              <span className="text-xs font-medium text-red-700">
                EXPENSES
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-red-900">
              ${totals.expense.toLocaleString()}
            </p>
          </div>

          {/* Net Card */}
          <div className={`bg-gradient-to-br rounded-xl p-3 border flex-1 ${
            isPositive 
              ? "from-blue-50 to-blue-100 border-blue-200" 
              : "from-orange-50 to-orange-100 border-orange-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${
                isPositive ? "bg-blue-100" : "bg-orange-100"
              }`}>
                <DollarSign className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                  isPositive ? "text-blue-600" : "text-orange-600"
                }`} />
              </div>
              <span className={`text-xs font-medium ${
                isPositive ? "text-blue-700" : "text-orange-700"
              }`}>
                NET
              </span>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${
              isPositive ? "text-blue-900" : "text-orange-900"
            }`}>
              ${netAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart Type Selector - Mobile Optimized */}
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
            {Object.entries(CHART_TYPES).map(([key, value]) => (
              <Button
                key={key}
                variant={chartType === value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChartType(value)}
                className={`px-3 py-1 h-8 text-xs font-medium transition-all ${
                  chartType === value 
                    ? "bg-white shadow-sm border border-gray-200" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[300px] sm:h-[350px] lg:h-[400px] rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Legend - Simplified for Mobile */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
              style={{ backgroundColor: window.innerWidth < 768 ? MOBILE_COLORS.income : COLORS.income }}
            />
            <span className="text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
              style={{ backgroundColor: window.innerWidth < 768 ? MOBILE_COLORS.expense : COLORS.expense }}
            />
            <span className="text-gray-600">Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}