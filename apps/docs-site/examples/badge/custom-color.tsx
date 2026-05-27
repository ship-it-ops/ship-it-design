import { Badge } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge color="#7c3aed">Premium</Badge>
      <Badge color="oklch(0.7 0.2 320)">Pro</Badge>
      <Badge color="#0ea5e9" dot>
        Live
      </Badge>
    </div>
  );
}
