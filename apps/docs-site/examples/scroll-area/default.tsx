import { ScrollArea } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <ScrollArea className="border-border bg-panel h-[180px] w-[280px] rounded-md border p-3">
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[12px]">
        {Array.from({ length: 24 }, (_, i) => (
          <li key={i} className="border-border border-b pb-1 last:border-0">
            <span className="text-text-dim font-mono">entry_{String(i + 1).padStart(2, '0')}</span>
            <span className="text-text-muted ml-2">scrollable row</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
