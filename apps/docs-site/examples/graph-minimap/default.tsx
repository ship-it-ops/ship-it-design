import { GraphMinimap } from '@ship-it-ui/shipit';
const points = Array.from({ length: 14 }).map((_, i) => ({
  x: ((i % 5) + 0.5) / 5,
  y: (Math.floor(i / 5) + 0.5) / 3,
}));

export default function Example() {
  return <GraphMinimap points={points} viewport={{ x: 0.3, y: 0.2, width: 0.4, height: 0.55 }} />;
}
