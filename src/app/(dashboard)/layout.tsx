import { Suspense } from "react";

import { Footer } from "@/components/layout/footer";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarContextProvider } from "@/context/siderbar-context";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import Header from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 md:p-6">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </SidebarContextProvider>
  );
}
