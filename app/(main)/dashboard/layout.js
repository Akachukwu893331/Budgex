// import DashboardPage from "./page";
// import { BarLoader } from "react-spinners";
// import { Suspense } from "react";

// export default function Layout() {
//   return (
//     <div className="px-5">
//       <div className="flex items-center justify-between mb-5">
//         <h1 className="text-6xl font-bold tracking-tight gradient-title">
//           Dashboard
//         </h1>
//       </div>
//       <Suspense
//         fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
//       >
//         <DashboardPage />
//       </Suspense>
//     </div>
//   );
// }




// import { Suspense } from "react";
// import DashboardPage from "./page";
// import { BarLoader } from "react-spinners";
// import { getCurrentUser } from "@/actions/user";

// export default async function Layout() {
//   const user = await getCurrentUser();

//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-950">
//       {/* Minimal Header */}
//       <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
//         <div className="px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo/Brand */}
//             <div className="flex items-center space-x-1">
//               <div className="w-12 h-12 bg-black dark:bg-white rounded flex items-center justify-center">
//                 <span className="text-white dark:text-black font-bold text-[30px]">D</span>
//               </div>
//               <span className="text-xl font-semibold text-slate-900 dark:text-white">
//                 ashboard
//               </span>
//             </div>

//             {/* User - Only name in pill */}
//             <div className="flex items-center space-x-3">
//               <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                   {user?.name || "User"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="p-4 sm:p-6 lg:p-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Welcome Section - Single line */}
//           <div className="mb-8">
//             <div className="text-center sm:text-left">
//               <h1 className="text-3xl sm:text-4xl font-light text-slate-900 dark:text-white mb-3">
//                 Welcome back
//               </h1>
//               <p className="text-slate-500 dark:text-slate-400 text-lg">
//                 Ready to pick up where you left off?
//               </p>
//             </div>
//           </div>

//           {/* Dashboard Content */}
//           <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 sm:p-8">
//             <Suspense
//               fallback={
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between">
//                     <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse"></div>
//                     <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-24 animate-pulse"></div>
//                   </div>
//                   <BarLoader width={"100%"} height={2} color="#64748b" />
//                   <div className="flex items-center justify-center py-12">
//                     <p className="text-slate-400 dark:text-slate-600 text-sm">
//                       Loading your content...
//                     </p>
//                   </div>
//                 </div>
//               }
//             >
//               <DashboardPage />
//             </Suspense>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





















import { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { getCurrentUser } from "@/actions/user";

export default async function Layout() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-1">
              <div className="w-12 h-12 bg-black dark:bg-white rounded flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-[30px]">D</span>
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-white">
                ashboard
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user?.name || "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Suspense
            fallback={
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-24 animate-pulse"></div>
                </div>
                <BarLoader width={"100%"} height={2} color="#64748b" />
                <div className="flex items-center justify-center py-12">
                  <p className="text-slate-400 dark:text-slate-600 text-sm">
                    Loading your content...
                  </p>
                </div>
              </div>
            }
          >
            <DashboardPage />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
