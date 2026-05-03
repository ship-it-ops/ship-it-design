'use client';

import { useCallback, useState } from 'react';

/**
 * Standardized open/close state for overlays.
 * Returns the same shape Radix and shadcn-style libraries use, so passing it as
 * `{...disclosure}` props works with any overlay primitive.
 */
export function useDisclosure(initial = false): {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: (open: boolean) => void;
} {
  const [open, setOpen] = useState(initial);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((o) => !o), []);
  return { open, onOpen, onClose, onToggle, setOpen };
}
