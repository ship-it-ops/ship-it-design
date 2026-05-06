import { IconButton } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <IconButton aria-label="Search" icon="⌕" variant="primary" />
      <IconButton aria-label="Search" icon="⌕" variant="secondary" />
      <IconButton aria-label="Search" icon="⌕" variant="ghost" />
      <IconButton aria-label="Search" icon="⌕" variant="outline" />
      <IconButton aria-label="Delete" icon="×" variant="destructive" />
      <IconButton aria-label="Confirm" icon="✓" variant="success" />
    </div>
  );
}
