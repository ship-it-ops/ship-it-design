import { Button } from '@ship-it-ui/ui';
import { PricingCard } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div className="grid w-full [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-4">
      <PricingCard
        tier="Free"
        price="$0"
        description="For small teams kicking the tires."
        features={['1 repo', '14-day history', 'Community support']}
        action={
          <Button variant="secondary" fullWidth>
            Get started
          </Button>
        }
      />
      <PricingCard
        tier="Pro"
        price="$29"
        priceUnit="/ user / mo"
        description="For growing teams."
        features={['Unlimited repos', 'SSO + SCIM', 'Audit log']}
        action={
          <Button variant="primary" fullWidth>
            Start free
          </Button>
        }
        featured
      />
      <PricingCard
        tier="Enterprise"
        price="Talk to us"
        description="VPC, custom retention, on-call SLO."
        features={['VPC deploy', 'Custom retention', 'On-call SLO']}
        action={
          <Button variant="secondary" fullWidth>
            Book a call
          </Button>
        }
      />
    </div>
  );
}
