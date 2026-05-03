'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * React warns when `useLayoutEffect` runs on the server because there's no
 * DOM to measure. This shim swaps in `useEffect` during SSR and restores
 * `useLayoutEffect` once the bundle is evaluated client-side.
 *
 * Use when you need to measure or synchronously mutate the DOM before
 * paint. Plain `useEffect` is preferred otherwise.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
