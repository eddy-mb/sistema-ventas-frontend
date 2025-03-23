"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = React.createContext<{
  toast: (props: ToastProps) => void;
} | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastProvider);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-500 text-white",
        warning: "border-yellow-500 bg-yellow-500 text-white",
        info: "border-blue-500 bg-blue-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ComponentRef<"div">,
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof toastVariants> & {
      title?: string;
      description?: string;
      onClose?: () => void;
    }
>(
  (
    { className, variant, title, description, onClose, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="mr-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

function Toaster() {
  const [toasts, setToasts] = React.useState<
    Array<
      ToastProps & {
        id: string;
        timer: NodeJS.Timeout | null;
      }
    >
  >([]);

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, props.duration || 5000);

    setToasts((prev) => [...prev, { ...props, id, timer }]);

    return id;
  }, []);

  const closeToast = React.useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.timer) {
        clearTimeout(toast.timer);
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  // Clear all timeouts on unmount
  React.useEffect(() => {
    return () => {
      toasts.forEach((t) => {
        if (t.timer) {
          clearTimeout(t.timer);
        }
      });
    };
  }, [toasts]);

  return (
    <ToastProvider.Provider value={{ toast }}>
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:max-w-[420px]">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            variant={t.variant}
            title={t.title}
            description={t.description}
            onClose={() => closeToast(t.id)}
          />
        ))}
      </div>
    </ToastProvider.Provider>
  );
}

type ToastProps = VariantProps<typeof toastVariants> & {
  title?: string;
  description?: string;
  duration?: number;
};

export { Toast, Toaster, ToastProvider, type ToastProps };
