import { PriceBreakdown } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div style={{ width: 320 }}>
      <PriceBreakdown
        items={[
          {
            label: 'Daily rate',
            subLabel: 'SAVE25 promo applied',
            amount: '$67',
            originalAmount: '$89',
          },
          { label: 'Service fee', amount: '$32' },
        ]}
        total="$99"
        currency="USD"
      />
    </div>
  );
}
