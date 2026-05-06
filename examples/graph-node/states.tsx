import { GraphNode, type EntityType } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      {(['default', 'hover', 'selected', 'path', 'dim'] as const).map((s) => (
        <GraphNode key={s} type="service" state={s} label={s} />
      ))}
    </div>
  );
}
