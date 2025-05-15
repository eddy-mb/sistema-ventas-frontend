import { Suspense } from "react";

import { Footer } from "@/components/common/footer";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarContextProvider } from "@/context/siderbar-context";

import { AppSidebar } from "@/components/common/sidebar";
import Header from "@/components/common/header";
import { LoadingSpinner } from "@/components/common/loading-spinner";

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
