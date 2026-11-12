import React, { useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { ToastContext } from "./toastContextDef";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container floating cleanly within mobile and desktop viewports */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-5 sm:right-5 z-50 flex flex-col gap-2 sm:max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border-2 backdrop-blur-md transition-all duration-300 animate-slide-up bg-[#141414] text-white ${
                isSuccess
                  ? "border-[#FF3E18]"
                  : isError
                  ? "border-rose-500 text-rose-300"
                  : "border-white/20"
              }`}
            >
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#FF3E18] shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />}

              <div className="flex-1 text-sm font-bold">
                {toast.message}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#5A5450] hover:text-[#2038E2] transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
