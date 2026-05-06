import { Banner } from '@ship-it-ui/ui';

export default function Example() {
  const args = {
    tone: 'warn',
  } as const;
  return (
    <Banner
      {...args}
      action={
        <a href="https://example.com/billing" className="underline">
          Upgrade →
        </a>
      }
    >
      You&apos;re on the trial plan — <strong>4 days remaining</strong>.
    </Banner>
  );
}
