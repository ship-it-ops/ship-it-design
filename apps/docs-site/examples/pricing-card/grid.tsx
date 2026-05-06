import { Button } from '@ship-it-ui/ui';
import { PricingCard } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3" style={{ width: 720 }}>
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
        price={
          <>
            $29 <span className="text-text-dim text-[14px] font-normal">/ user / mo</span>
          </>
        }
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
