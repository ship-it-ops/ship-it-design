import { Button, OnboardingChecklist } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <OnboardingChecklist
      items={[
        {
          id: 'workspace',
          label: 'Create a workspace',
          description: 'Name it, choose a region, invite your team later.',
          status: 'done',
        },
        {
          id: 'connector',
          label: 'Connect your first source',
          description: 'GitHub, Notion, Slack, Linear — pick whatever you live in.',
          status: 'in-progress',
          action: (
            <Button size="sm" variant="primary">
              Continue
            </Button>
          ),
        },
        {
          id: 'graph',
          label: 'Watch the graph build',
          description: 'We crawl, dedupe, and link entities in the background.',
          status: 'pending',
        },
        {
          id: 'ask',
          label: 'Ask your first question',
          description: 'Try "who owns the payment webhook?"',
          status: 'pending',
        },
      ]}
    />
  );
}
