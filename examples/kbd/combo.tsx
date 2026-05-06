import { Kbd } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-center gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>K</Kbd>
      <span className="text-text-muted ml-3 text-[12px]">Command palette</span>
    </div>
  );
}
