import { IconButton, SimpleTooltip } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <SimpleTooltip content="Add new source">
      <IconButton aria-label="Add source" icon="+" />
    </SimpleTooltip>
  );
}
