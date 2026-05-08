import { Button } from '@ship-it-ui/ui';
import { PricingCard } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div className="w-full max-w-[340px]">
      <PricingCard
        tier="Pro"
        price="$29"
        priceUnit="/ user / mo"
        description="For growing teams that need to graph their stack."
        features={['Unlimited repos', 'SSO + SCIM', 'Audit log', '7-day query history']}
        action={
          <Button variant="primary" fullWidth>
            Start free
          </Button>
        }
        featured
      />
    </div>
  );
}
