import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { space } from '@industry/tokens';
import { Toast, type ToastTone } from '../components/core/Toast';

export interface ToastOptions {
  tone?: ToastTone;
  title: string;
  description?: string;
  duration?: number;
}

interface QueuedToast extends ToastOptions {
  id: string;
}

interface TimerEntry {
  timeoutId: ReturnType<typeof setTimeout>;
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

/** Mount once near the app root, wrapping the whole tree. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState<QueuedToast[]>([]);
  const [queue, setQueue] = useState<QueuedToast[]>([]);
  const idCounter = useRef(0);
  const timers = useRef<Map<string, TimerEntry>>(new Map());

  const dismiss = useCallback((id: string) => {
    // clearTimeout(undefined) is a spec-safe no-op — TS's lib types just
    // don't model it, so the cast avoids an `if` branch no caller can
    // actually take (dismiss is only ever invoked for a visible toast).
    clearTimeout(timers.current.get(id)?.timeoutId as ReturnType<typeof setTimeout>);
    timers.current.delete(id);
    setVisible((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const room = MAX_VISIBLE - visible.length;
    if (room <= 0 || queue.length === 0) return;
    const promoted = queue.slice(0, room);
    setQueue((prev) => prev.slice(promoted.length));
    setVisible((prev) => [...prev, ...promoted]);
  }, [queue, visible.length]);

  useEffect(() => {
    visible.forEach((t) => {
      if (timers.current.has(t.id)) return;
      const timeoutId = setTimeout(() => dismiss(t.id), t.duration ?? DEFAULT_DURATION);
      timers.current.set(t.id, { timeoutId });
    });
  }, [visible, dismiss]);

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

  // Keeps `useToast()`'s return value referentially stable across
  // ToastProvider re-renders (which happen on every show/dismiss) — without
  // this, any consumer effect that lists `toast` in its dependency array
  // (e.g. to call `toast.show` on a fetch failure) re-fires every time a
  // toast is shown, since the raw `{ show }` object literal is a new
  // reference on every render.
  const contextValue = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={contextValue}>
      <View style={{ flex: 1 }}>{children}</View>
      <View
        testID="toast-stack"
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          alignItems: 'center',
          gap: space[2],
          paddingTop: space[6] + insets.top,
          zIndex: 1000,
        }}
      >
        {visible.map((t) => (
          <Toast key={t.id} tone={t.tone} title={t.title} onDismiss={() => dismiss(t.id)}>
            {t.description}
          </Toast>
        ))}
      </View>
    </ToastContext.Provider>
  );
}
