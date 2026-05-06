import { RadialProgress } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-center gap-5">
      {[28, 58, 84, 100].map((v) => (
        <RadialProgress key={v} value={v} />
      ))}
    </div>
  );
}
