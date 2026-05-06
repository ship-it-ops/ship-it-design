import { Badge } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      {(
        ['neutral', 'accent', 'ok', 'warn', 'err', 'purple', 'pink', 'outline', 'solid'] as const
      ).map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  );
}
