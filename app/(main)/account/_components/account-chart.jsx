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
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
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
import { TrendingUp, TrendingDown, DollarSign, Download, Filter } from "lucide-react";

const DATE_RANGES = {
  "7D": { label: "7 Days", days: 7 },
  "1M": { label: "1 Month", days: 30 },
  "3M": { label: "3 Month", days: 90 },
  "6M": { label: "6 Month", days: 180 },
  "1Y": { label: "1 Year", days: 365 },
  ALL: { label: "All", days: null },
};

const CHART_TYPES = {
  BAR: "bar",
  LINE: "line",
  AREA: "area",
  PIE: "pie",
};

const COLORS = {
  income: "#10b981",
  expense: "#ef4444",
  net: "#3b82f6",
  background: "hsl(var(--card))",
  grid: "hsl(var(--border))",
};

const CHART_ICONS = {
  [CHART_TYPES.BAR]: "📊",
  [CHART_TYPES.LINE]: "📈",
  [CHART_TYPES.AREA]: "🌊",
  [CHART_TYPES.PIE]: "🥧",
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");
  const [chartType, setChartType] = useState(CHART_TYPES.AREA);

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
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 space-y-2">
          <p className="font-semibold text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground capitalize">
                {entry.dataKey}:
              </span>
              <span className="font-medium text-foreground">
                ${entry.value.toFixed(2)}
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
      margin: { top: 10, right: 10, left: 10, bottom: 10 },
    };

    switch (chartType) {
      case CHART_TYPES.LINE:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={COLORS.grid}
              opacity={0.4}
            />
            <XAxis
              dataKey="date"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickMargin={10}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke={COLORS.income}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke={COLORS.expense}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        );

      case CHART_TYPES.AREA:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.income} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={COLORS.income} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.expense} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={COLORS.expense} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={COLORS.grid}
              opacity={0.4}
            />
            <XAxis
              dataKey="date"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickMargin={10}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke={COLORS.income}
              fill="url(#incomeGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke={COLORS.expense}
              fill="url(#expenseGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        );

      case CHART_TYPES.PIE:
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value}`, ""]} />
          </PieChart>
        );

      default: // BAR chart
        return (
          <BarChart {...commonProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={COLORS.grid}
              opacity={0.4}
            />
            <XAxis
              dataKey="date"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickMargin={10}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="income"
              name="Income"
              fill={COLORS.income}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill={COLORS.expense}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Financial Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track your income and expenses over time
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                INCOME
              </span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              ${totals.income.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10 rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                EXPENSES
              </span>
            </div>
            <p className="text-2xl font-bold text-red-900 dark:text-red-100">
              ${totals.expense.toLocaleString()}
            </p>
          </div>

          <div className={`bg-gradient-to-br rounded-xl p-4 border ${
            isPositive 
              ? "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10" 
              : "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${
                isPositive 
                  ? "bg-blue-100 dark:bg-blue-900/30" 
                  : "bg-orange-100 dark:bg-orange-900/30"
              }`}>
                <DollarSign className={`h-3.5 w-3.5 ${
                  isPositive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-orange-600 dark:text-orange-400"
                }`} />
              </div>
              <span className={`text-xs font-medium ${
                isPositive 
                  ? "text-blue-700 dark:text-blue-300" 
                  : "text-orange-700 dark:text-orange-300"
              }`}>
                NET
              </span>
            </div>
            <p className={`text-2xl font-bold ${
              isPositive 
                ? "text-blue-900 dark:text-blue-100" 
                : "text-orange-900 dark:text-orange-100"
            }`}>
              ${netAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">View:</span>
            <Select defaultValue={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[100px] border-0 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex bg-muted/50 rounded-lg p-1">
            {Object.entries(CHART_TYPES).map(([key, value]) => (
              <Button
                key={key}
                variant={chartType === value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChartType(value)}
                className="px-3 py-1 h-8 text-xs font-medium"
              >
                <span className="mr-1.5">{CHART_ICONS[value]}</span>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] rounded-lg border bg-background/50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS.income }}
            />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS.expense }}
            />
            <span className="text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}