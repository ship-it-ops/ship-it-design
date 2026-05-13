import { Avatar, LargeTitle } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div
      style={{
        maxWidth: 390,
        margin: '0 auto',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <LargeTitle
        title="Morning, Mo."
        eyebrow="Tuesday · May 12"
        trailing={<Avatar name="MO" size="sm" />}
      />
      <div style={{ padding: '0 16px 24px', color: 'var(--color-text-muted)', fontSize: 13 }}>
        Pair this with a touch-density Topbar above for the scroll-revealing iOS large-title
        pattern.
      </div>
    </div>
  );
}
