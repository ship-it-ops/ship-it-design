import { Combobox } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Combobox
      aria-label="Repository"
      placeholder="Search repos…"
      options={[
        {
          value: 'pay-svc',
          label: 'payment-webhook-v2',
          description: 'service · owned by Payments',
        },
        { value: 'ledger', label: 'ledger-core', description: 'service · go 1.22' },
        { value: 'notify', label: 'notify-dispatch', description: 'service · node 20' },
        { value: 'auth', label: 'auth-edge', description: 'service · rust' },
      ]}
    />
  );
}
