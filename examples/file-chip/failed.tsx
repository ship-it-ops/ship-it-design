import { FileChip } from '@ship-it-ui/ui';

export default function Example() {
  const args = {
    name: 'diagram.xlsx',
    size: 'failed',
    progress: undefined,
    failed: true,
  } as const;
  return <FileChip {...args} onRemove={() => {}} />;
}
