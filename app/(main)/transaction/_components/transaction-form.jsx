"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Receipt, Wallet, Tag, Calendar, FileText, Repeat } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";
import { getUserAccounts } from "@/actions/account";

export function AddTransactionForm({ categories, editMode = false, initialData = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [accounts, setAccounts] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await getUserAccounts();
        setAccounts(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load accounts");
      } finally {
        setLoadingAccounts(false);
      }
    }
    fetchAccounts();
  }, []);

  const defaultAccountId =
    initialData?.accountId || accounts?.find((ac) => ac.isDefault)?.id || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: editMode && initialData
      ? {
          type: initialData.type,
          amount: initialData.amount.toString(),
          description: initialData.description,
          accountId: initialData.accountId,
          category: initialData.category,
          date: new Date(initialData.date),
          isRecurring: initialData.isRecurring,
          ...(initialData.recurringInterval && { recurringInterval: initialData.recurringInterval }),
        }
      : {
          type: "EXPENSE",
          amount: "",
          description: "",
          accountId: defaultAccountId,
          date: new Date(),
          isRecurring: false,
        },
  });

  const { loading: transactionLoading, fn: transactionFn, data: transactionResult } = useFetch(
    editMode ? updateTransaction : createTransaction
  );

  const onSubmit = (data) => {
    const formData = { ...data, amount: parseFloat(data.amount) };
    if (editMode) transactionFn(editId, formData);
    else transactionFn(formData);
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) setValue("description", scannedData.description);
      if (scannedData.category) setValue("category", scannedData.category);
      toast.success("Receipt scanned successfully");
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction updated successfully" : "Transaction created successfully");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter((category) => category.type === type);

  if (loadingAccounts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {editMode ? "Edit Transaction" : "Add Transaction"}
        </h1> */}
        <p className="text-muted-foreground mt-2">
          {editMode ? "Update your transaction details" : "Record a new income or expense"}
        </p>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Receipt Scanner */}
          {!editMode && (
            <div className="bg-muted/30 rounded-xl p-4 border">
              <div className="flex items-center gap-3 mb-3">
                <Receipt className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Scan Receipt</h3>
              </div>
              <ReceiptScanner onScanComplete={handleScanComplete} />
            </div>
          )}

          {/* Transaction Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${type === "EXPENSE" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                <Wallet className="h-4 w-4" />
              </div>
              Transaction Type
            </label>
            <Select onValueChange={(value) => setValue("type", value)} defaultValue={type}>
              <SelectTrigger className="w-full h-12 bg-background border-input">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Expense
                </SelectItem>
                <SelectItem value="INCOME" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Income
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500 flex items-center gap-1">{errors.type.message}</p>}
          </div>

          {/* Amount & Account Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Amount */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-muted-foreground">$</span>
                </div>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  className="pl-8 h-12 bg-background border-input"
                  {...register("amount")} 
                />
              </div>
              {errors.amount && <p className="text-sm text-red-500 flex items-center gap-1">{errors.amount.message}</p>}
            </div>

            {/* Account */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                Account
              </label>
              <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
                <SelectTrigger className="w-full h-14 bg-background border-input">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {account.name}
                      </div>
                      <span className="text-muted-foreground text-sm">
                        ${parseFloat(account.balance).toFixed(2)}
                      </span>
                    </SelectItem>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <CreateAccountDrawer>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
                      >
                        + Create New Account
                      </Button>
                    </CreateAccountDrawer>
                  </div>
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-sm text-red-500 flex items-center gap-1">{errors.accountId.message}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Category
            </label>
            <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
              <SelectTrigger className="w-full h-12 bg-background border-input">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color || '#6B7280' }}
                    />
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500 flex items-center gap-1">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal bg-background border-input",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(date) => setValue("date", date)}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-red-500 flex items-center gap-1">{errors.date.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Description
            </label>
            <Input 
              placeholder="Enter description (optional)" 
              className="h-12 bg-background border-input"
              {...register("description")} 
            />
            {errors.description && <p className="text-sm text-red-500 flex items-center gap-1">{errors.description.message}</p>}
          </div>

          {/* Recurring Section */}
          <div className="bg-muted/30 rounded-xl p-4 border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Repeat className="h-4 w-4" />
                </div>
                <div>
                  <label className="text-base font-medium">Recurring Transaction</label>
                  <div className="text-sm text-muted-foreground">Set up automatic repeating</div>
                </div>
              </div>
              <Switch 
                checked={isRecurring} 
                onCheckedChange={(checked) => setValue("isRecurring", checked)} 
              />
            </div>

            {/* Recurring Interval */}
            {isRecurring && (
              <div className="space-y-3 pl-11">
                <label className="text-sm font-medium">Repeat Every</label>
                <Select
                  onValueChange={(value) => setValue("recurringInterval", value)}
                  defaultValue={getValues("recurringInterval")}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recurringInterval && <p className="text-sm text-red-500 flex items-center gap-1">{errors.recurringInterval.message}</p>}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-12 order-2 sm:order-1" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12 order-1 sm:order-2" 
              disabled={transactionLoading}
            >
              {transactionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : editMode ? (
                "Update Transaction"
              ) : (
                "Create Transaction"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}