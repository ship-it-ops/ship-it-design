import { Button } from '@ship-it-ui/ui';
import { PricingCard } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <PricingCard
      tier="Pro"
      price={
        <>
          $29 <span className="text-text-dim text-[14px] font-normal">/ user / mo</span>
        </>
      }
      description="For growing teams that need to graph their stack."
      features={['Unlimited repos', 'SSO + SCIM', 'Audit log', '7-day query history']}
      action={
        <Button variant="primary" fullWidth>
          Start free
        </Button>
      }
      featured
    />
  );
}
