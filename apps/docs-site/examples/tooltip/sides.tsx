import { IconButton, SimpleTooltip } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex gap-3">
      <SimpleTooltip content="Top" side="top">
        <IconButton aria-label="Top" icon="↑" />
      </SimpleTooltip>
      <SimpleTooltip content="Bottom" side="bottom">
        <IconButton aria-label="Bottom" icon="↓" />
      </SimpleTooltip>
      <SimpleTooltip content="Left" side="left">
        <IconButton aria-label="Left" icon="←" />
      </SimpleTooltip>
      <SimpleTooltip content="Right" side="right">
        <IconButton aria-label="Right" icon="→" />
      </SimpleTooltip>
    </div>
  );
}
