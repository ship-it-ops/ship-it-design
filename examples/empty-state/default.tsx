import { Button, EmptyState } from '@ship-it-ui/ui';

export default function Example() {
  const args = {
    icon: '◇',
    title: 'No services yet',
    description: 'Connect a code source to start. Most teams begin with GitHub.',
  } as const;
  return (
    <div className="w-[280px]">
      <EmptyState
        {...args}
        action={
          <Button size="sm" variant="primary">
            Connect GitHub
          </Button>
        }
      />
    </div>
  );
}
