import { ReasoningBlock, ReasoningStep } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <ReasoningBlock duration="1.8s">
      <ReasoningStep step={1}>
        Found service payment-webhook-v2 — 1 match, high confidence.
      </ReasoningStep>
      <ReasoningStep step={2}>
        Traversed OWNED_BY edge → Priya K. (person, staff-eng).
      </ReasoningStep>
      <ReasoningStep step={3}>
        Traversed DOCUMENTED_IN → runbook-oncall.md § Rollback.
      </ReasoningStep>
    </ReasoningBlock>
  );
}
