import { Badge } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="accent" size="sm">
        SM
      </Badge>
      <Badge variant="accent" size="md">
        MD
      </Badge>
      <Badge variant="accent" size="lg">
        LG
      </Badge>
    </div>
  );
}
