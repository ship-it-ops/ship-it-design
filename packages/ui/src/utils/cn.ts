import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with conflict-aware Tailwind merging.
 *
 *   cn('px-2 py-1', condition && 'px-4')   →   'py-1 px-4'
 *
 * Use anywhere you'd otherwise concatenate strings of Tailwind classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
