import { Button } from '@ship-it-ui/ui';

export default function Example() {
  const variants = [
    'primary',
    'secondary',
    'ghost',
    'outline',
    'destructive',
    'success',
    'link',
  ] as const;
  return (
    <div className="grid grid-cols-[auto_repeat(3,1fr)] items-center gap-3">
      <div />
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} className="text-text-dim font-mono text-[10px] tracking-wider uppercase">
          {s}
        </div>
      ))}
      {variants.map((v) => (
        <>
          <div key={`${v}-label`} className="text-text-muted font-mono text-[11px]">
            {v}
          </div>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Button key={`${v}-${s}`} variant={v} size={s} icon={v === 'link' ? undefined : '✦'}>
              Action
            </Button>
          ))}
        </>
      ))}
    </div>
  );
}
