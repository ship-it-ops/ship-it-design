import { Avatar } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar name="Alex" color="#7c3aed" />
      <Avatar name="Jordan" color="oklch(0.7 0.2 320)" />
      <Avatar name="Sam" color="#0ea5e9" />
    </div>
  );
}
