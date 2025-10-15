
















// "use client";

// import { useState, useTransition } from "react";
// import { updateBudget } from "@/actions/budget";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { Pencil, Check, X, DollarSign, TrendingUp } from "lucide-react";

// export default function BudgetSection({ initialBudget, initialExpenses }) {
//   const [amount, setAmount] = useState(initialBudget?.amount || 0);
//   const [expenses] = useState(initialExpenses);
//   const [isPending, startTransition] = useTransition();
//   const [isEditing, setIsEditing] = useState(false);

//   // 🔢 Calculate usage percentage
//   const percentage = amount > 0 ? Math.min((expenses / amount) * 100, 100) : 0;
//   const remaining = amount - expenses;

//   // 🎨 Dynamic color based on usage
//   const getProgressColor = () => {
//     if (percentage >= 90) return "bg-red-500";
//     if (percentage >= 70) return "bg-yellow-500";
//     return "bg-green-500";
//   };

//   const getStatusColor = () => {
//     if (percentage >= 90) return "text-red-600";
//     if (percentage >= 70) return "text-yellow-600";
//     return "text-green-600";
//   };

//   const handleUpdate = () => {
//     startTransition(async () => {
//       const res = await updateBudget(Number(amount));
//       if (res.success) {
//         toast.success("Budget updated successfully!");
//         setIsEditing(false);
//       } else {
//         toast.error("Failed to update budget");
//       }
//     });
//   };

//   const handleCancel = () => {
//     setAmount(initialBudget?.amount || 0);
//     setIsEditing(false);
//   };

//   return (
//     <div className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
//       {/* Header Section */}
//       <div className="flex justify-between items-start mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
//             <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Budget
//             </h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Track your spending progress
//             </p>
//           </div>
//         </div>

//         {/* Budget Amount & Edit Controls */}
//         <div className="text-right">
//           {isEditing ? (
//             <div className="flex gap-2 items-center">
//               <div className="relative">
//                 <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                 <Input
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="w-32 pl-8 pr-4 py-2 border-2 border-blue-200 focus:border-blue-500 rounded-xl"
//                   disabled={isPending}
//                   autoFocus
//                 />
//               </div>
//               <Button
//                 onClick={handleUpdate}
//                 disabled={isPending}
//                 size="icon"
//                 className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
//               >
//                 <Check className="w-4 h-4" />
//               </Button>
//               <Button
//                 onClick={handleCancel}
//                 disabled={isPending}
//                 size="icon"
//                 variant="outline"
//                 className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
//               >
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           ) : (
//             <div className="flex flex-col items-end gap-2">
//               <div className="flex items-center gap-3">
//                 <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                   ${amount.toLocaleString()}
//                 </p>
//                 <Button
//                   onClick={() => setIsEditing(true)}
//                   size="icon"
//                   variant="ghost"
//                   className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
//                 >
//                   <Pencil className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Progress Section */}
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
//             Spending Progress
//           </span>
//           <span className={`text-sm font-semibold ${getStatusColor()}`}>
//             {percentage.toFixed(1)}% Used
//           </span>
//         </div>

//         {/* Enhanced Progress Bar */}
//         <div className="relative">
//           <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
//             <div
//               className={`h-full ${getProgressColor()} transition-all duration-700 ease-out rounded-2xl relative`}
//               style={{ width: `${percentage}%` }}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
//             </div>
//           </div>
          
//           {/* Progress Indicators */}
//           <div className="flex justify-between mt-1 px-1">
//             <div className="w-1/3 text-center">
//               <div className="text-xs text-gray-500">70% Warning</div>
//             </div>
//             <div className="w-1/3 text-center">
//               <div className="text-xs text-gray-500">90% Critical</div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-3 gap-4 mt-6">
//           <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
//             <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
//             <p className="text-xl font-bold text-gray-900 dark:text-white">
//               ${expenses.toLocaleString()}
//             </p>
//           </div>
//           <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
//             <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
//             <p className="text-xl font-bold text-green-600 dark:text-green-400">
//               ${remaining.toLocaleString()}
//             </p>
//           </div>
//           <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
//             <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
//             <div className="flex items-center justify-center gap-1">
//               <TrendingUp className="w-4 h-4 text-gray-500" />
//               <p className={`text-sm font-semibold ${getStatusColor()}`}>
//                 {percentage >= 90 ? 'Critical' : percentage >= 70 ? 'Warning' : 'Healthy'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Usage Breakdown */}
//         <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//               Monthly Usage
//             </span>
//             <span className="text-sm text-blue-600 dark:text-blue-400">
//               {percentage.toFixed(1)}% of budget
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useTransition, useEffect } from "react";
import { updateBudget } from "@/actions/budget";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Check, X, DollarSign, TrendingUp } from "lucide-react";

export default function BudgetSection({ initialBudget, initialExpenses, accountId }) {
  const [amount, setAmount] = useState(initialBudget?.amount || 0);
  const [expenses, setExpenses] = useState(initialExpenses || 0);
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  // 🔄 Refresh state whenever the account changes
  useEffect(() => {
    setAmount(initialBudget?.amount || 0);
    setExpenses(initialExpenses || 0);
    setIsEditing(false);
  }, [initialBudget, initialExpenses, accountId]);

  // 🔢 Calculate usage percentage
  const percentage = amount > 0 ? Math.min((expenses / amount) * 100, 100) : 0;
  const remaining = amount - expenses;

  // 🎨 Dynamic color based on usage
  const getProgressColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusColor = () => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const handleUpdate = () => {
    startTransition(async () => {
      const res = await updateBudget(Number(amount));
      if (res.success) {
        toast.success("Budget updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update budget");
      }
    });
  };

  const handleCancel = () => {
    setAmount(initialBudget?.amount || 0);
    setIsEditing(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Budget
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track your spending progress
            </p>
          </div>
        </div>

        {/* Budget Amount & Edit Controls */}
        <div className="text-right">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-32 pl-8 pr-4 py-2 border-2 border-blue-200 focus:border-blue-500 rounded-xl"
                  disabled={isPending}
                  autoFocus
                />
              </div>
              <Button
                onClick={handleUpdate}
                disabled={isPending}
                size="icon"
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isPending}
                size="icon"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${amount.toLocaleString()}
                </p>
                <Button
                  onClick={() => setIsEditing(true)}
                  size="icon"
                  variant="ghost"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Spending Progress
          </span>
          <span className={`text-sm font-semibold ${getStatusColor()}`}>
            {percentage.toFixed(1)}% Used
          </span>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-700 ease-out rounded-2xl relative`}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-between mt-1 px-1">
            <div className="w-1/3 text-center">
              <div className="text-xs text-gray-500">70% Warning</div>
            </div>
            <div className="w-1/3 text-center">
              <div className="text-xs text-gray-500">90% Critical</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${expenses.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              ${remaining.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <p className={`text-sm font-semibold ${getStatusColor()}`}>
                {percentage >= 90 ? 'Critical' : percentage >= 70 ? 'Warning' : 'Healthy'}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Breakdown */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Monthly Usage
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {percentage.toFixed(1)}% of budget
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
