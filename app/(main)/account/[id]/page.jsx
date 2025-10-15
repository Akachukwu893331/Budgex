import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 truncate">
                {account.name}
              </h1>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 sm:p-6 border border-gray-200/60 shadow-sm">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ${parseFloat(account.balance).toFixed(2)}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {account._count.transactions} transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Chart Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Balance Trend</h2>
              <p className="text-sm text-gray-500">transaction overview</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-4 sm:p-6">
              <Suspense 
                fallback={
                  <div className="h-80 flex items-center justify-center">
                    <BarLoader width={"80%"} color="#6366f1" />
                  </div>
                }
              >
                <AccountChart transactions={transactions} />
              </Suspense>
            </div>
          </section>

          {/* Transactions Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-500"> account activities</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
              <Suspense 
                fallback={
                  <div className="h-40 flex items-center justify-center">
                    <BarLoader width={"80%"} color="#6366f1" />
                  </div>
                }
              >
                <TransactionTable transactions={transactions} />
              </Suspense>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}