import { Button, ComparisonTable, type ComparisonOption, type ComparisonRow } from '@ship-it-ui/ui';

const options: ComparisonOption[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Starter',
    icon: 'sparkle',
    description: 'For small teams kicking the tires.',
    action: (
      <Button variant="secondary" fullWidth>
        Get started
      </Button>
    ),
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Most popular',
    icon: 'service',
    description: 'For growing teams that need SSO and audit.',
    featured: true,
    action: (
      <Button variant="primary" fullWidth>
        Start free trial
      </Button>
    ),
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Custom',
    icon: 'graph',
    description: 'VPC deploy, custom retention, on-call SLO.',
    action: (
      <Button variant="secondary" fullWidth>
        Book a call
      </Button>
    ),
  },
];

const rows: ComparisonRow[] = [
  {
    feature: 'Price',
    values: {
      free: '$0',
      pro: { value: '$29', note: 'per user / month' },
      enterprise: 'Talk to us',
    },
  },
  { feature: 'Repos', values: { free: '1', pro: 'Unlimited', enterprise: 'Unlimited' } },
  {
    feature: 'History retention',
    values: { free: '14 days', pro: '1 year', enterprise: 'Custom' },
  },
  { feature: 'SSO + SCIM', values: { free: false, pro: true, enterprise: true } },
  { feature: 'Audit log', values: { free: false, pro: true, enterprise: true } },
  { feature: 'VPC deploy', values: { free: false, pro: false, enterprise: true } },
  { feature: 'On-call SLO', values: { free: false, pro: false, enterprise: true } },
];

export default function Example() {
  return (
    <div className="rounded-base border-border bg-panel overflow-hidden border p-2 pt-3">
      <ComparisonTable
        caption="ShipIt plan comparison — features by tier."
        options={options}
        rows={rows}
        schema="Service"
        headerSize="lg"
        headerAlign="center"
        prominentFeatured
      />
    </div>
  );
}
