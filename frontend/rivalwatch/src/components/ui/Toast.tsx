import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastInput = {
  variant?: ToastVariant;
  title: string;
  description?: string;
  durationMs?: number;
};

type ToastItem = Required<Pick<ToastInput, 'title'>> &
  Pick<ToastInput, 'description'> & {
    id: string;
    variant: ToastVariant;
    durationMs: number;
  };

type ToastContextValue = {
  push: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function toastStyles(variant: ToastVariant) {
  if (variant === 'success') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100';
  if (variant === 'info') return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-100';
  return 'border-rose-500/30 bg-rose-500/10 text-rose-100';
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const remove = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) window.clearTimeout(timer);
    timersRef.current.delete(id);
    setItems((s) => s.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = crypto.randomUUID();
      const item: ToastItem = {
        id,
        title: toast.title,
        description: toast.description,
        variant: toast.variant ?? 'info',
        durationMs: toast.durationMs ?? 3500,
      };

      setItems((s) => [item, ...s].slice(0, 4));

      const timer = window.setTimeout(() => remove(id), item.durationMs);
      timersRef.current.set(id, timer);
    },
    [remove]
  );

  const value = useMemo<ToastContextValue>(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[60] w-full max-w-sm space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={[
              'pointer-events-auto rounded-lg border px-4 py-3 shadow-lg backdrop-blur',
              toastStyles(t.variant),
            ].join(' ')}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{t.title}</div>
                {t.description ? <div className="mt-1 text-xs text-zinc-200/90">{t.description}</div> : null}
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-xs text-zinc-200 hover:bg-white/10"
                onClick={() => remove(t.id)}
              >
                Fechar
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider />');
  return ctx;
}

