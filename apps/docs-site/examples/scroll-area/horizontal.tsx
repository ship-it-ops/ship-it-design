import { ScrollArea, Tag } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <ScrollArea
      orientation="horizontal"
      className="border-border bg-panel w-[320px] rounded-md border p-3"
    >
      <div className="flex gap-2 whitespace-nowrap">
        {[
          'service',
          'deployment',
          'incident',
          'ticket',
          'document',
          'person',
          'repository',
          'pipeline',
          'monitor',
        ].map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </ScrollArea>
  );
}
