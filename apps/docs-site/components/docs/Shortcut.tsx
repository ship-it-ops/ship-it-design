import { Kbd } from '@ship-it-ui/ui';

interface Props {
  /** A `+`-joined chord, e.g. `cmd+k` or `shift+/`. */
  keys: string;
}

export function Shortcut({ keys }: Props) {
  const parts = keys.split('+').map((k) => k.trim());
  return (
    <span className="inline-flex items-center gap-1">
      {parts.map((p, i) => (
        <Kbd key={`${p}-${i}`}>{symbolFor(p)}</Kbd>
      ))}
    </span>
  );
}

function symbolFor(token: string): string {
  const t = token.toLowerCase();
  switch (t) {
    case 'cmd':
    case 'meta':
      return '⌘';
    case 'ctrl':
      return '⌃';
    case 'alt':
    case 'option':
      return '⌥';
    case 'shift':
      return '⇧';
    case 'enter':
    case 'return':
      return '↵';
    case 'esc':
      return 'Esc';
    case 'tab':
      return '⇥';
    case 'space':
      return '␣';
    default:
      return token.length === 1 ? token.toUpperCase() : token;
  }
}
