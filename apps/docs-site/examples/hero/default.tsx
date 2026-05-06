import { Badge, Button } from '@ship-it-ui/ui';
import { Hero } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <Hero
      eyebrow={
        <Badge variant="accent" dot>
          v2.0 · shipped today
        </Badge>
      }
      title={
        <>
          Your org&apos;s knowledge, <span className="text-accent">as a graph.</span>
        </>
      }
      description="ShipIt turns repos, docs, tickets, and chat into a queryable graph — so on-call engineers stop asking the same question for the twelfth time."
      actions={
        <>
          <Button size="lg" variant="primary">
            Start free
          </Button>
          <Button size="lg" variant="secondary" trailing="→">
            Book a demo
          </Button>
        </>
      }
    />
  );
}
