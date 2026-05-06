import { EntityBadge, type EntityType } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      {(['service', 'person', 'document', 'deployment', 'incident', 'ticket'] as EntityType[]).map(
        (t) => (
          <EntityBadge key={t} type={t} />
        ),
      )}
    </div>
  );
}
