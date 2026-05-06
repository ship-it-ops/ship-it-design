import { Badge } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="ok" dot>
        synced
      </Badge>
      <Badge variant="warn" dot>
        stale
      </Badge>
      <Badge variant="err" dot>
        error
      </Badge>
      <Badge variant="accent" dot>
        live
      </Badge>
    </div>
  );
}
