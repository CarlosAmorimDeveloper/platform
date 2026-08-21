import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab navigation inside a container while `active`, closes on Escape,
 * locks background scroll without a layout shift (compensates for the
 * scrollbar width with body padding), and restores focus to whatever had it
 * before opening. Shared by `SideNav`'s drawer and `Dialog` — both need the
 * same overlay-with-a-focus-trap behavior, and neither is built on a native
 * modal primitive the way the mobile versions are (RN's `Modal` handles all
 * of this natively, so there's no mobile equivalent of this hook).
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean, onEscape?: () => void) {
  const containerRef = useRef<T>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;
    triggerRef.current = document.activeElement;
    const container = containerRef.current;
    const focusables = container?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables?.[0]?.focus();

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [active]);

  function onKeyDown(e: KeyboardEvent<T>) {
    if (!active) return;
    if (e.key === 'Escape') {
      onEscape?.();
      return;
    }
    if (e.key !== 'Tab') return;
    const container = containerRef.current;
    if (!container) return;
    const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusables.length === 0) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return { containerRef, onKeyDown };
}
