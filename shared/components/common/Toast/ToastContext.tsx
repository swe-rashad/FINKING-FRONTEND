import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ShowToastOptions {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: ShowToastOptions) => string;
  hideToast: (id: string) => void;
}

type ToastListener = (options: ShowToastOptions) => void;
const toastListeners = new Set<ToastListener>();

let lastToastKey = '';
let lastToastTime = 0;

export const toast = {
  show: (options: ShowToastOptions) => {
    // Debounce duplicate messages within 500ms
    const now = Date.now();
    const key = `${options.type || 'info'}:${options.message}`;
    if (key === lastToastKey && now - lastToastTime < 500) {
      return;
    }
    lastToastKey = key;
    lastToastTime = now;
    toastListeners.forEach((listener) => listener(options));
  },
  error: (message: string, title?: string) => {
    toast.show({ type: 'error', message, title });
  },
  success: (message: string, title?: string) => {
    toast.show({ type: 'success', message, title });
  },
  info: (message: string, title?: string) => {
    toast.show({ type: 'info', message, title });
  },
  warning: (message: string, title?: string) => {
    toast.show({ type: 'warning', message, title });
  },
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'success', title, message, duration = 4500 }: ShowToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }

      return id;
    },
    [hideToast]
  );

  useEffect(() => {
    const handler = (options: ShowToastOptions) => {
      showToast(options);
    };
    toastListeners.add(handler);
    return () => {
      toastListeners.delete(handler);
    };
  }, [showToast]);

  const contextValue = React.useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Notification Container — Bottom Right */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col-reverse gap-2.5 pointer-events-none max-w-sm w-full"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-fade-in-up ${
              item.type === 'success'
                ? 'bg-white border-emerald-200 text-gray-900 shadow-emerald-500/10'
                : item.type === 'error'
                ? 'bg-white border-rose-200 text-gray-900 shadow-rose-500/10'
                : item.type === 'warning'
                ? 'bg-white border-amber-200 text-gray-900 shadow-amber-500/10'
                : 'bg-white border-primary-200 text-gray-900 shadow-primary-500/10'
            }`}
          >
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && (
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              {item.type === 'error' && (
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              )}
              {item.type === 'warning' && (
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              )}
              {item.type === 'info' && (
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="8" />
                    <line x1="12" y1="16" x2="12.01" y2="8" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {item.title && (
                <p className="text-xs font-bold text-gray-900 mb-0.5 tracking-tight">
                  {item.title}
                </p>
              )}
              <p className="text-xs font-medium text-gray-600 leading-relaxed">
                {item.message}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => hideToast(item.id)}
              className="shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Dismiss toast"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
