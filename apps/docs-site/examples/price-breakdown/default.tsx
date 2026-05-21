import { PriceBreakdown } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div style={{ width: 320 }}>
      <PriceBreakdown
        items={[
          { label: 'Trip price', subLabel: '$89 × 3 nights', amount: '$267' },
          { label: 'Trip discount', amount: '−$25', discount: true },
          { label: 'Insurance', amount: '$18' },
          { label: 'Service fee', amount: '$32' },
          { label: 'Taxes', amount: '$24.30' },
        ]}
        total="$316.30"
        currency="USD"
      />
    </div>
  );
}
