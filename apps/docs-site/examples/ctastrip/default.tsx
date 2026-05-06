import { Button } from '@ship-it-ui/ui';
import { CTAStrip } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <CTAStrip
      title="Ready to graph your org?"
      description="Free for 14 days · no credit card · 5-minute setup."
      actions={
        <>
          <Button variant="primary" size="lg">
            Start free
          </Button>
          <Button variant="ghost" size="lg" trailing="→">
            Read the docs
          </Button>
        </>
      }
    />
  );
}
