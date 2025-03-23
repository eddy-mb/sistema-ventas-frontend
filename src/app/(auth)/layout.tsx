import { Footer } from "@/components/common/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {/* Placeholder for logo - replace with actual logo when available */}
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                AW
              </div>
            </div>
            <h1 className="text-2xl font-bold">Ama Wara Tour</h1>
            <p className="text-muted-foreground mt-2">Sistema de Ventas</p>
          </div>

          <div className="bg-card rounded-lg shadow-md border p-6">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
