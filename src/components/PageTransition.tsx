import { ViewTransition, type ReactNode } from 'react';

/** Wrap each page: old page lifts away, new page settles in (View Transitions). */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
