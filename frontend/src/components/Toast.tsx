import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export interface ToastState {
  type: "success" | "error";
  message: string;
}

export function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timeout);
  }, [onDismiss, toast]);

  const isSuccess = toast.type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium shadow-lg ${
        isSuccess ? "bg-signal-green text-white" : "bg-signal-red text-white"
      }`}
    >
      {isSuccess ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      {toast.message}
    </div>
  );
}
