import { Chip } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip color="#7c3aed">Brand</Chip>
      <Chip color="oklch(0.7 0.2 320)">Premium</Chip>
      <Chip color="#0ea5e9">Live</Chip>
    </div>
  );
}
