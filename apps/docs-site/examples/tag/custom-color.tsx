import { Tag } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag color="#7c3aed">Brand</Tag>
      <Tag color="oklch(0.7 0.2 320)">Marketing</Tag>
      <Tag color="#0ea5e9">Engineering</Tag>
    </div>
  );
}
