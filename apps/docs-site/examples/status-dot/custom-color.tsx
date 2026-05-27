import { StatusDot } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <StatusDot color="#7c3aed" label="Premium" />
      <StatusDot color="oklch(0.7 0.2 320)" label="Brand" />
      <StatusDot color="#0ea5e9" label="Live" />
    </div>
  );
}
