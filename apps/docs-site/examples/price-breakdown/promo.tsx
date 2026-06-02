import { PriceBreakdown } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div style={{ width: 320 }}>
      <PriceBreakdown
        items={[
          {
            label: 'Nightly rate × 3',
            subLabel: 'SAVE25 promo applied',
            amount: '$425',
            originalAmount: '$567',
          },
          { label: 'Service fee', amount: '$48' },
        ]}
        total="$473"
        currency="USD"
      />
    </div>
  );
}
