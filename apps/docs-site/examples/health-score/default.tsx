import { HealthScore } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-start gap-8">
      <HealthScore value={92} label="checkout-api" delta={3} />
      <HealthScore value={71} label="search-svc" delta={-4} />
      <HealthScore value={48} label="legacy-billing" delta={-1} />
    </div>
  );
}
