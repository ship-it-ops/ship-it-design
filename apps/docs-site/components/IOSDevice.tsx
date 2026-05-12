/**
 * Minimal iPhone-style bezel for docs showcase pages. Wraps children in a
 * 402×874 device frame with a notch and rounded corners. No interaction —
 * purely visual scaffolding so mobile screens read as "iOS" in screenshots.
 *
 * Adapted from `mobile/ios-frame.jsx` in the design canvas; the Liquid Glass
 * status bar treatment is intentionally omitted (overkill for docs).
 */

import type { ReactNode } from 'react';

export interface IOSDeviceProps {
  children?: ReactNode;
  width?: number;
  height?: number;
  label?: ReactNode;
}

export function IOSDevice({ children, width = 402, height = 874, label }: IOSDeviceProps) {
  return (
    <figure
      style={{
        margin: 0,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius: 56,
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border-strong)',
          padding: 8,
          boxShadow:
            '0 0 0 8px #1a1a1c, 0 50px 80px -20px rgba(0,0,0,0.5), 0 24px 40px -16px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Notch / Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 32,
            borderRadius: 999,
            background: '#000',
            zIndex: 10,
          }}
        />
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 48,
            overflow: 'hidden',
            background: 'var(--color-bg)',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>
      {label && (
        <figcaption
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
          }}
        >
          {label}
        </figcaption>
      )}
    </figure>
  );
}
