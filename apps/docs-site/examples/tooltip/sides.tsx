import { IconButton, Tooltip } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex gap-3">
      <Tooltip content="Top" side="top">
        <IconButton aria-label="Top" icon="↑" />
      </Tooltip>
      <Tooltip content="Bottom" side="bottom">
        <IconButton aria-label="Bottom" icon="↓" />
      </Tooltip>
      <Tooltip content="Left" side="left">
        <IconButton aria-label="Left" icon="←" />
      </Tooltip>
      <Tooltip content="Right" side="right">
        <IconButton aria-label="Right" icon="→" />
      </Tooltip>
    </div>
  );
}
