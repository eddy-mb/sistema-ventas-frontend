import { Suspense } from "react";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6">
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
