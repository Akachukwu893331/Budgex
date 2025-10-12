"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Memoized filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selections on page change
  };

  return (
    <div className="space-y-4">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length === paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCw className="h-3 w-3" />
                              {
                                RECURRING_INTERVALS[
                                  transaction.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PPP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}






























// "use client";

// import { useState, useEffect, useMemo } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   MoreHorizontal,
//   Trash,
//   Search,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   RefreshCw,
//   Clock,
//   Download,
//   Filter,
//   ArrowUpDown,
//   Eye,
//   Edit,
// } from "lucide-react";
// import { format } from "date-fns";
// import { toast } from "sonner";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
// import { categoryColors } from "@/data/categories";
// import { bulkDeleteTransactions } from "@/actions/account";
// import useFetch from "@/hooks/use-fetch";
// import { BarLoader } from "react-spinners";
// import { useRouter } from "next/navigation";

// const ITEMS_PER_PAGE = 10;

// const RECURRING_INTERVALS = {
//   DAILY: "Daily",
//   WEEKLY: "Weekly",
//   MONTHLY: "Monthly",
//   YEARLY: "Yearly",
// };

// export function TransactionTable({ transactions }) {
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     field: "date",
//     direction: "desc",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [recurringFilter, setRecurringFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const router = useRouter();

//   // Memoized filtered and sorted transactions
//   const filteredAndSortedTransactions = useMemo(() => {
//     let result = [...transactions];

//     // Apply search filter
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       result = result.filter((transaction) =>
//         transaction.description?.toLowerCase().includes(searchLower)
//       );
//     }

//     // Apply type filter
//     if (typeFilter) {
//       result = result.filter((transaction) => transaction.type === typeFilter);
//     }

//     // Apply recurring filter
//     if (recurringFilter) {
//       result = result.filter((transaction) => {
//         if (recurringFilter === "recurring") return transaction.isRecurring;
//         return !transaction.isRecurring;
//       });
//     }

//     // Apply sorting
//     result.sort((a, b) => {
//       let comparison = 0;

//       switch (sortConfig.field) {
//         case "date":
//           comparison = new Date(a.date) - new Date(b.date);
//           break;
//         case "amount":
//           comparison = a.amount - b.amount;
//           break;
//         case "category":
//           comparison = a.category.localeCompare(b.category);
//           break;
//         default:
//           comparison = 0;
//       }

//       return sortConfig.direction === "asc" ? comparison : -comparison;
//     });

//     return result;
//   }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

//   // Pagination calculations
//   const totalPages = Math.ceil(
//     filteredAndSortedTransactions.length / ITEMS_PER_PAGE
//   );
//   const paginatedTransactions = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredAndSortedTransactions.slice(
//       startIndex,
//       startIndex + ITEMS_PER_PAGE
//     );
//   }, [filteredAndSortedTransactions, currentPage]);

//   const handleSort = (field) => {
//     setSortConfig((current) => ({
//       field,
//       direction:
//         current.field === field && current.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   const handleSelect = (id) => {
//     setSelectedIds((current) =>
//       current.includes(id)
//         ? current.filter((item) => item !== id)
//         : [...current, id]
//     );
//   };

//   const handleSelectAll = () => {
//     setSelectedIds((current) =>
//       current.length === paginatedTransactions.length
//         ? []
//         : paginatedTransactions.map((t) => t.id)
//     );
//   };

//   const {
//     loading: deleteLoading,
//     fn: deleteFn,
//     data: deleted,
//   } = useFetch(bulkDeleteTransactions);

//   const handleBulkDelete = async () => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedIds.length} transactions?`
//       )
//     )
//       return;

//     deleteFn(selectedIds);
//   };

//   useEffect(() => {
//     if (deleted && !deleteLoading) {
//       toast.error("Transactions deleted successfully");
//     }
//   }, [deleted, deleteLoading]);

//   const handleClearFilters = () => {
//     setSearchTerm("");
//     setTypeFilter("");
//     setRecurringFilter("");
//     setCurrentPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//     setSelectedIds([]); // Clear selections on page change
//   };

//   const SortableHeader = ({ field, children }) => (
//     <TableHead
//       className="cursor-pointer hover:bg-muted/50 transition-colors"
//       onClick={() => handleSort(field)}
//     >
//       <div className="flex items-center gap-1.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">
//         {children}
//         <ArrowUpDown className="h-3.5 w-3.5" />
//         {sortConfig.field === field && (
//           sortConfig.direction === "asc" ? 
//             <ChevronUp className="h-3.5 w-3.5 text-primary" /> : 
//             <ChevronDown className="h-3.5 w-3.5 text-primary" />
//         )}
//       </div>
//     </TableHead>
//   );

//   return (
//     <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
//       <CardHeader className="pb-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <CardTitle className="text-xl font-bold text-foreground">
//               Transaction History
//             </CardTitle>
//             <p className="text-sm text-muted-foreground mt-1">
//               {filteredAndSortedTransactions.length} transactions found
//             </p>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" className="gap-2">
//               <Download className="h-4 w-4" />
//               Export
//             </Button>
            
//             {(searchTerm || typeFilter || recurringFilter) && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleClearFilters}
//                 className="gap-2"
//               >
//                 <X className="h-4 w-4" />
//                 Clear
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Enhanced Filters */}
//         <div className="flex flex-col lg:flex-row gap-4 pt-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search transactions..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="pl-10 h-11 bg-background/50 border-muted"
//             />
//           </div>
          
//           <div className="flex flex-1 gap-3">
//             <Select
//               value={typeFilter}
//               onValueChange={(value) => {
//                 setTypeFilter(value);
//                 setCurrentPage(1);
//               }}
//             >
//               <SelectTrigger className="h-11 bg-background/50 border-muted">
//                 <Filter className="h-4 w-4 mr-2" />
//                 <SelectValue placeholder="All Types" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="INCOME">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-green-500" />
//                     Income
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="EXPENSE">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-red-500" />
//                     Expense
//                   </div>
//                 </SelectItem>
//               </SelectContent>
//             </Select>

//             <Select
//               value={recurringFilter}
//               onValueChange={(value) => {
//                 setRecurringFilter(value);
//                 setCurrentPage(1);
//               }}
//             >
//               <SelectTrigger className="h-11 bg-background/50 border-muted">
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 <SelectValue placeholder="All Transactions" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="recurring">Recurring Only</SelectItem>
//                 <SelectItem value="non-recurring">One-time Only</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Bulk Actions Bar */}
//         {selectedIds.length > 0 && (
//           <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-8 bg-primary rounded-full" />
//               <span className="font-medium text-sm">
//                 {selectedIds.length} transaction{selectedIds.length > 1 ? 's' : ''} selected
//               </span>
//             </div>
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={handleBulkDelete}
//               className="gap-2"
//             >
//               <Trash className="h-4 w-4" />
//               Delete Selected
//             </Button>
//           </div>
//         )}
//       </CardHeader>

//       <CardContent className="p-0">
//         {deleteLoading && (
//           <div className="px-6">
//             <BarLoader width={"100%"} color="#3b82f6" />
//           </div>
//         )}

//         {/* Enhanced Table */}
//         <div className="rounded-lg border border-muted bg-background/30">
//           <Table>
//             <TableHeader>
//               <TableRow className="hover:bg-transparent border-b border-muted">
//                 <TableHead className="w-[50px] px-6">
//                   <Checkbox
//                     checked={
//                       selectedIds.length === paginatedTransactions.length &&
//                       paginatedTransactions.length > 0
//                     }
//                     onCheckedChange={handleSelectAll}
//                   />
//                 </TableHead>
//                 <SortableHeader field="date">Date</SortableHeader>
//                 <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
//                   Description
//                 </TableHead>
//                 <SortableHeader field="category">Category</SortableHeader>
//                 <SortableHeader field="amount">Amount</SortableHeader>
//                 <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
//                   Type
//                 </TableHead>
//                 <TableHead className="w-[80px]"></TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {paginatedTransactions.length === 0 ? (
//                 <TableRow className="hover:bg-transparent">
//                   <TableCell
//                     colSpan={7}
//                     className="text-center text-muted-foreground py-12"
//                   >
//                     <div className="flex flex-col items-center gap-3">
//                       <Search className="h-12 w-12 text-muted-foreground/40" />
//                       <div>
//                         <p className="font-medium">No transactions found</p>
//                         <p className="text-sm">Try adjusting your search or filters</p>
//                       </div>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedTransactions.map((transaction) => (
//                   <TableRow 
//                     key={transaction.id} 
//                     className={cn(
//                       "border-b border-muted/50 transition-colors hover:bg-muted/20",
//                       selectedIds.includes(transaction.id) && "bg-primary/5 border-primary/20"
//                     )}
//                   >
//                     <TableCell className="px-6">
//                       <Checkbox
//                         checked={selectedIds.includes(transaction.id)}
//                         onCheckedChange={() => handleSelect(transaction.id)}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex flex-col">
//                         <span className="font-medium text-sm">
//                           {format(new Date(transaction.date), "MMM dd")}
//                         </span>
//                         <span className="text-xs text-muted-foreground">
//                           {format(new Date(transaction.date), "yyyy")}
//                         </span>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="max-w-[200px]">
//                         <p className="font-medium text-sm truncate">
//                           {transaction.description}
//                         </p>
//                         {transaction.note && (
//                           <p className="text-xs text-muted-foreground truncate">
//                             {transaction.note}
//                           </p>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge 
//                         variant="secondary" 
//                         className="px-2.5 py-1 text-xs font-medium border-0 capitalize"
//                         style={{
//                           backgroundColor: `${categoryColors[transaction.category]}20`,
//                           color: categoryColors[transaction.category],
//                           border: `1px solid ${categoryColors[transaction.category]}40`
//                         }}
//                       >
//                         {transaction.category}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className={cn(
//                         "flex items-center gap-1.5 font-semibold text-sm",
//                         transaction.type === "EXPENSE" 
//                           ? "text-red-600" 
//                           : "text-green-600"
//                       )}>
//                         <span className={cn(
//                           "text-xs",
//                           transaction.type === "EXPENSE" 
//                             ? "text-red-500" 
//                             : "text-green-500"
//                         )}>
//                           {transaction.type === "EXPENSE" ? "−" : "+"}
//                         </span>
//                         ${transaction.amount.toFixed(2)}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       {transaction.isRecurring ? (
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger>
//                               <Badge
//                                 variant="secondary"
//                                 className="gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 px-2.5 py-1"
//                               >
//                                 <RefreshCw className="h-3 w-3" />
//                                 <span className="text-xs">
//                                   {RECURRING_INTERVALS[transaction.recurringInterval]}
//                                 </span>
//                               </Badge>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <div className="text-sm space-y-1">
//                                 <div className="font-medium">Recurring Transaction</div>
//                                 <div className="text-muted-foreground">
//                                   Next: {format(new Date(transaction.nextRecurringDate), "MMM dd, yyyy")}
//                                 </div>
//                               </div>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       ) : (
//                         <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs">
//                           <Clock className="h-3 w-3" />
//                           One-time
//                         </Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button 
//                             variant="ghost" 
//                             className="h-8 w-8 p-0 hover:bg-muted"
//                           >
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-48">
//                           <DropdownMenuItem className="gap-2">
//                             <Eye className="h-4 w-4" />
//                             View Details
//                           </DropdownMenuItem>
//                           <DropdownMenuItem 
//                             className="gap-2"
//                             onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
//                           >
//                             <Edit className="h-4 w-4" />
//                             Edit Transaction
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem 
//                             className="gap-2 text-destructive focus:text-destructive"
//                             onClick={() => deleteFn([transaction.id])}
//                           >
//                             <Trash className="h-4 w-4" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Enhanced Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-6 py-4 border-t border-muted">
//             <div className="text-sm text-muted-foreground">
//               Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
//               <span className="font-medium">
//                 {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length)}
//               </span>{" "}
//               of <span className="font-medium">{filteredAndSortedTransactions.length}</span> results
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="gap-1"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Previous
//               </Button>
              
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   const pageNum = i + 1;
//                   return (
//                     <Button
//                       key={pageNum}
//                       variant={currentPage === pageNum ? "default" : "outline"}
//                       size="sm"
//                       className="w-8 h-8 p-0"
//                       onClick={() => handlePageChange(pageNum)}
//                     >
//                       {pageNum}
//                     </Button>
//                   );
//                 })}
//                 {totalPages > 5 && (
//                   <span className="px-2 text-sm text-muted-foreground">...</span>
//                 )}
//               </div>
              
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="gap-1"
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }