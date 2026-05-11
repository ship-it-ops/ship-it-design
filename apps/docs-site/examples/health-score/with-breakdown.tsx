import { HealthScore } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <HealthScore
      value={84}
      label="Graph health"
      delta={2}
      breakdown={[
        { label: 'Coverage', value: 92, tone: 'ok' },
        { label: 'Latency', value: 76, tone: 'warn' },
        { label: 'Errors', value: 4, tone: 'err' },
        { label: 'Drift', value: 12 },
      ]}
    />
  );
}
