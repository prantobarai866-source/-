import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types/toast';
import { CheckCircle2, AlertTriangle, Bell, Info, X } from 'lucide-react';

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  notifyTrackList: (universityName: string, isAdded: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const duration = toast.duration ?? 4500;

      const newToast: ToastMessage = {
        ...toast,
        id,
        timestamp: Date.now(),
        duration,
      };

      setToasts((prev) => {
        // Keep at most 4 toasts visible at a time to prevent screen clutter
        const updated = [...prev, newToast];
        return updated.slice(-4);
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const notifyTrackList = useCallback(
    (universityName: string, isAdded: boolean) => {
      if (isAdded) {
        addToast({
          type: 'success',
          title: 'পছন্দের তালিকায় যুক্ত হয়েছে',
          message: `${universityName} আপনার ব্যক্তিগত শর্টলিস্টে যোগ করা হয়েছে।`,
          duration: 3500,
        });
      } else {
        addToast({
          type: 'info',
          title: 'পছন্দের তালিকা থেকে সরানো হয়েছে',
          message: `${universityName} আপনার শর্টলিস্ট থেকে মুছে ফেলা হয়েছে।`,
          duration: 3000,
        });
      }
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        notifyTrackList,
      }}
    >
      {children}
      {/* Toast Notification Container (Floating Bottom-Right / Top-Right on mobile) */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-[calc(100%-2rem)] pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 ${
                isSuccess
                  ? 'bg-emerald-900/95 text-white border-emerald-500/50 shadow-emerald-950/30'
                  : isWarning
                  ? 'bg-amber-900/95 text-white border-amber-500/50 shadow-amber-950/30'
                  : isError
                  ? 'bg-rose-900/95 text-white border-rose-500/50 shadow-rose-950/30'
                  : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/30'
              }`}
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                {isWarning && <Bell className="w-5 h-5 text-amber-300" />}
                {isError && <AlertTriangle className="w-5 h-5 text-rose-300" />}
                {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-indigo-300" />}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <h5 className="text-xs sm:text-sm font-bold leading-tight">
                  {toast.title}
                </h5>
                <p className="text-[11px] sm:text-xs text-slate-200 mt-1 leading-relaxed">
                  {toast.message}
                </p>

                {toast.actionLabel && toast.onAction && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                    className="mt-2 text-xs font-bold underline text-amber-300 hover:text-white transition"
                  >
                    {toast.actionLabel}
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                aria-label="বিজ্ঞপ্তিটি বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
