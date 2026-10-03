'use client';

import { useSyncExternalStore } from 'react';

/** Subscribe to class/attribute changes on <html> (set by the boot script, preloader and theme toggle). */
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  return () => mo.disconnect();
}

/** Reads a value derived from <html>; `server` is what's rendered before hydration. */
export function useHtmlState<T>(read: (root: HTMLElement) => T, server: T): T {
  return useSyncExternalStore(subscribe, () => read(document.documentElement), () => server);
}
