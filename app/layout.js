import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Budgex",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={inter.className}>
          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="min-h-screen">{children}</main>

          {/* Toaster Notifications */}
          <Toaster richColors />

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-6">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Budgex. All rights reserved.</p>
              <p className="mt-2 sm:mt-0">
                Built with ❤️ by <span className="font-medium text-gray-700">Daniel</span>
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
