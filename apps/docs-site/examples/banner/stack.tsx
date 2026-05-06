import { Banner } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div>
      <Banner
        tone="warn"
        action={
          <a href="https://example.com/billing" className="underline">
            Upgrade →
          </a>
        }
      >
        Trial expires in <strong>4 days</strong>.
      </Banner>
      <Banner
        tone="accent"
        action={
          <a href="https://example.com/changelog" className="underline">
            What&apos;s new →
          </a>
        }
      >
        New: <strong>incident pinning</strong> in the graph.
      </Banner>
    </div>
  );
}
