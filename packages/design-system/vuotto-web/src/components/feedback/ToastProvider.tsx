import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { zIndex } from '@vuotto/tokens';
import { Toast, type ToastTone } from './Toast';

export interface ToastOptions {
  tone?: ToastTone;
  title: string;
  description?: string;
  action?: ReactNode;
  duration?: number;
}

interface QueuedToast extends ToastOptions {
  id: string;
}

interface TimerEntry {
  timeoutId: ReturnType<typeof setTimeout>;
  remainingMs: number;
  startedAt: number;
}

const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 4000;

interface ToastContextValue {
  show: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de um ToastProvider');
  return ctx;
}

/**
 * Mount once near the app root. Renders the toast stack into a single,
 * persistent `aria-live="polite"` region via a portal to `document.body` —
 * the region itself never unmounts, only the toasts inside it change, which
 * is what makes announcements reliable across screen readers.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState<QueuedToast[]>([]);
  const [queue, setQueue] = useState<QueuedToast[]>([]);
  const idCounter = useRef(0);
  const timers = useRef<Map<string, TimerEntry>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer.timeoutId);
      timers.current.delete(id);
    }
    setVisible((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startTimer = useCallback(
    (id: string, remainingMs: number) => {
      const timeoutId = setTimeout(() => dismiss(id), remainingMs);
      timers.current.set(id, { timeoutId, remainingMs, startedAt: Date.now() });
    },
    [dismiss],
  );

  // Promote queued toasts into the visible slots whenever there's room.
  useEffect(() => {
    const room = MAX_VISIBLE - visible.length;
    if (room <= 0 || queue.length === 0) return;
    const promoted = queue.slice(0, room);
    setQueue((prev) => prev.slice(promoted.length));
    setVisible((prev) => [...prev, ...promoted]);
  }, [queue, visible.length]);

  // Start an auto-dismiss timer for any visible toast that doesn't have one yet.
  useEffect(() => {
    visible.forEach((t) => {
      if (!timers.current.has(t.id)) startTimer(t.id, t.duration ?? DEFAULT_DURATION);
    });
  }, [visible, startTimer]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t.timeoutId));
    },
    [],
  );

  const show = useCallback((options: ToastOptions) => {
    const id = `toast-${idCounter.current++}`;
    setQueue((prev) => [...prev, { ...options, id }]);
  }, []);

  function pause(id: string) {
    const timer = timers.current.get(id);
    if (!timer) return;
    clearTimeout(timer.timeoutId);
    timer.remainingMs = Math.max(0, timer.remainingMs - (Date.now() - timer.startedAt));
  }

  function resume(id: string) {
    const timer = timers.current.get(id);
    if (!timer) return;
    startTimer(id, timer.remainingMs);
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="false"
            style={{
              position: 'fixed',
              bottom: 'var(--space-6)',
              right: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              zIndex: zIndex.toast,
            }}
          >
            {visible.map((t) => (
              <div
                key={t.id}
                onMouseEnter={() => pause(t.id)}
                onMouseLeave={() => resume(t.id)}
                onFocus={() => pause(t.id)}
                onBlur={() => resume(t.id)}
              >
                <Toast
                  tone={t.tone}
                  title={t.title}
                  description={t.description}
                  action={t.action}
                  onDismiss={() => dismiss(t.id)}
                />
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
