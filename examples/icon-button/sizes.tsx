import { IconButton } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <IconButton aria-label="Ask" icon="✦" size="sm" />
      <IconButton aria-label="Ask" icon="✦" size="md" />
      <IconButton aria-label="Ask" icon="✦" size="lg" />
    </div>
  );
}
