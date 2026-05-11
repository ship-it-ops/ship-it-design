import { FilterPanel } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <FilterPanel
      facets={[
        {
          id: 'environment',
          label: 'Environment',
          options: [
            { value: 'prod', label: 'Production' },
            { value: 'staging', label: 'Staging' },
            { value: 'dev', label: 'Development' },
          ],
        },
        {
          id: 'tier',
          label: 'Tier',
          options: [
            { value: 'critical', label: 'Critical' },
            { value: 'standard', label: 'Standard' },
            { value: 'experimental', label: 'Experimental' },
          ],
        },
        {
          id: 'owner',
          label: 'Owner',
          options: [
            { value: 'payments', label: 'Payments' },
            { value: 'platform', label: 'Platform' },
            { value: 'growth', label: 'Growth' },
          ],
        },
      ]}
      counts={{
        environment: { prod: 42, staging: 18, dev: 9 },
        tier: { critical: 7, standard: 51, experimental: 11 },
      }}
      defaultValue={{ environment: ['prod'], tier: ['critical'] }}
    />
  );
}
