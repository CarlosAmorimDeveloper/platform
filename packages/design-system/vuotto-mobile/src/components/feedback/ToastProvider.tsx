import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import type { ReactNode } from 'react';
import { space, zIndex } from '@vuotto/tokens';
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
 * Mount once near the app root, wrapping the whole tree — same practical
 * requirement as `SafeAreaProvider`. RN has no portal, so the toast stack
 * renders as an absolutely-positioned `View` layered on top of `children`
 * rather than escaping to a separate root the way the web version's
 * `createPortal` does. Stacked at the top of the screen (not the bottom,
 * unlike web) since that's clear of the thumb and any bottom `TabBar`.
 * Pausing on hover has no touch equivalent — press-and-hold
 * (`onPressIn`/`onPressOut`) substitutes, same pattern as `Tooltip`'s
 * long-press.
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

  useEffect(() => {
    const room = MAX_VISIBLE - visible.length;
    if (room <= 0 || queue.length === 0) return;
    const promoted = queue.slice(0, room);
    setQueue((prev) => prev.slice(promoted.length));
    setVisible((prev) => [...prev, ...promoted]);
  }, [queue, visible.length]);

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
      <View style={{ flex: 1 }}>{children}</View>
      <View
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          alignItems: 'center',
          gap: space[2],
          paddingTop: space[6],
          zIndex: zIndex.toast,
        }}
      >
        {visible.map((t) => (
          <Toast
            key={t.id}
            tone={t.tone}
            title={t.title}
            description={t.description}
            action={t.action}
            onDismiss={() => dismiss(t.id)}
            onPressIn={() => pause(t.id)}
            onPressOut={() => resume(t.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}
