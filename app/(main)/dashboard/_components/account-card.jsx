// "use client";

// import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { useEffect } from "react";
// import useFetch from "@/hooks/use-fetch";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Link from "next/link";
// import { updateDefaultAccount } from "@/actions/account";
// import { toast } from "sonner";

// export function AccountCard({ account }) {
//   const { name, type, balance, id, isDefault } = account;

//   const {
//     loading: updateDefaultLoading,
//     fn: updateDefaultFn,
//     data: updatedAccount,
//     error,
//   } = useFetch(updateDefaultAccount);

//   const handleDefaultChange = async (event) => {
//     event.preventDefault(); // Prevent navigation

//     if (isDefault) {
//       toast.warning("You need atleast 1 default account");
//       return; // Don't allow toggling off the default account
//     }

//     await updateDefaultFn(id);
//   };

//   useEffect(() => {
//     if (updatedAccount?.success) {
//       toast.success("Default account updated successfully");
//     }
//   }, [updatedAccount]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || "Failed to update default account");
//     }
//   }, [error]);

//   return (
//     <Card className="hover:shadow-md transition-shadow group relative">
//       <Link href={`/account/${id}`}>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium capitalize">
//             {name}
//           </CardTitle>
//           <Switch
//             checked={isDefault}
//             onClick={handleDefaultChange}
//             disabled={updateDefaultLoading}
//           />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">
//             ${parseFloat(balance).toFixed(2)}
//           </div>
//           <p className="text-xs text-muted-foreground">
//             {type.charAt(0) + type.slice(1).toLowerCase()} Account
//           </p>
//         </CardContent>
//         <CardFooter className="flex justify-between text-sm text-muted-foreground">
//           <div className="flex items-center">
//             <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
//             Income
//           </div>
//           <div className="flex items-center">
//             <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
//             Expense
//           </div>
//         </CardFooter>
//       </Link>
//     </Card>
//   );
// }



"use client";

import { Trash2, MoreVertical, CreditCard, Building, Wallet, TrendingUp, PiggyBank } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { updateDefaultAccount, deleteAccount } from "@/actions/dashboard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AccountCard({ account, refreshAccounts }) {
  const { name, type, balance, id, isDefault } = account;
  const [deleting, setDeleting] = useState(false);

  const { loading: updateDefaultLoading, fn: updateDefaultFn, data: updatedAccount, error } = useFetch(updateDefaultAccount);
  const { loading: deleteLoading, fn: deleteFn, data: deletedAccount, error: deleteError } = useFetch(deleteAccount);

  const handleDefaultChange = async () => {
    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }
    await updateDefaultFn(id);
    refreshAccounts?.();
  };

  const handleDelete = async () => {
    if (deleting) return;

    if (!confirm(`Are you sure you want to delete "${name}" account?`)) return;

    setDeleting(true);
    try {
      const res = await deleteFn(id);
      if (res?.success) {
        toast.success("Account deleted successfully");
        refreshAccounts?.();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (updatedAccount?.success) toast.success("Default account updated successfully");
  }, [updatedAccount]);

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to update default account");
    if (deleteError) toast.error(deleteError.message || "Failed to delete account");
  }, [error, deleteError]);

  // Format number with commas
  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      CASH: "bg-green-50 text-green-700 border-green-200",
      BANK: "bg-blue-50 text-blue-700 border-blue-200",
      CREDIT: "bg-purple-50 text-purple-700 border-purple-200",
      INVESTMENT: "bg-orange-50 text-orange-700 border-orange-200",
      SAVINGS: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return colors[type] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getAccountIcon = (type) => {
    const icons = {
      CASH: Wallet,
      BANK: Building,
      CREDIT: CreditCard,
      INVESTMENT: TrendingUp,
      SAVINGS: PiggyBank,
    };
    return icons[type] || CreditCard;
  };

  const AccountIcon = getAccountIcon(type);

  return (
    <Card className={cn(
      "group relative border border-gray-200/80 bg-white/90 backdrop-blur-sm",
      "hover:border-gray-300 hover:shadow-lg transition-all duration-300",
      "w-full min-w-0 max-w-full",
      "sm:min-w-[280px] sm:max-w-[320px]",
      "lg:min-w-[300px] lg:max-w-[350px]",
      "xl:min-w-[320px] xl:max-w-[380px]",
      isDefault && "ring-2 ring-blue-500/20 border-blue-300"
    )}>
      {/* Default Account Badge */}
      {isDefault && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-blue-500 text-white text-xs px-2 py-1 shadow-lg">
            Default
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              "p-2 rounded-xl flex-shrink-0",
              isDefault ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
            )}>
              <AccountIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-gray-900 truncate">
                {name}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-normal mt-1.5",
                  getAccountTypeColor(type)
                )}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleDefaultChange}
                disabled={updateDefaultLoading || deleting || isDefault}
              >
                Set as Default
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={deleteLoading || deleting}
                className="text-red-600 focus:text-red-600"
              >
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <Link href={`/account/${id}`}>
        <CardContent className="pb-4 px-5 cursor-pointer">
          <div className="space-y-3">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              ${formatBalance(balance)}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="font-medium">Account #{id.slice(-6)}</span>
              <div className={cn(
                "w-2 h-2 rounded-full",
                isDefault ? "bg-green-500" : "bg-gray-400"
              )} />
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100/80 px-5 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hidden sm:inline">Default</span>
            <span className="sm:hidden">Def</span>
            <Switch 
              checked={isDefault} 
              onCheckedChange={handleDefaultChange}
              disabled={updateDefaultLoading || deleting}
              className="scale-90 data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={deleteLoading || deleting}
          className={cn(
            "p-2 rounded-xl transition-all duration-200",
            "text-gray-400 hover:text-red-500 hover:bg-red-50",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            deleting && "animate-pulse"
          )}
          title="Delete account"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </CardFooter>

      {/* Loading Overlay */}
      {(updateDefaultLoading || deleteLoading) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            {deleteLoading ? "Deleting..." : "Updating..."}
          </div>
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}