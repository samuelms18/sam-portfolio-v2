import type { CSSProperties } from 'react';
import type { MockType } from '@/content/types';
import { mockHtml } from '@/lib/mocks';

type Props = { type: MockType; hue: number; wire?: boolean; className?: string };

/** Schematic UI illustration standing in for confidential screens. */
export function Mock({ type, hue, wire = false, className = '' }: Props) {
  return (
    <div
      className={`mock mock--${type}${wire ? ' mock--wire' : ''} ${className}`}
      style={{ '--h': hue } as CSSProperties}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: mockHtml(type) }}
    />
  );
}
