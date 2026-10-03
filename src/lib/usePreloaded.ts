'use client';

import { useHtmlState } from './useHtmlState';

/** True once the first-visit preloader has finished (immediately on later visits). */
export function usePreloaded() {
  return useHtmlState((root) => !root.classList.contains('is-loading'), false);
}
