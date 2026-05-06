import { GraphEdge, PathOverlay } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <svg width={520} height={180} viewBox="0 0 520 180">
      <GraphEdge x1={40} y1={150} x2={160} y2={90} edgeStyle="dim" />
      <GraphEdge x1={160} y1={90} x2={300} y2={140} edgeStyle="dim" />
      <GraphEdge x1={300} y1={140} x2={460} y2={60} edgeStyle="dim" />
      <PathOverlay
        points={[
          { x: 40, y: 150 },
          { x: 160, y: 90 },
          { x: 300, y: 140 },
          { x: 460, y: 60 },
        ]}
      />
      <g fill="var(--color-text-muted)" fontFamily="var(--font-mono)" fontSize={10}>
        <text x={20} y={170}>
          api-gw
        </text>
        <text x={140} y={80}>
          payment-wh
        </text>
        <text x={280} y={160}>
          ledger
        </text>
        <text x={440} y={50}>
          notify
        </text>
      </g>
    </svg>
  );
}
