import { ConfidenceIndicator } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div className="flex flex-col gap-[10px]">
      <ConfidenceIndicator value={99.4} />
      <ConfidenceIndicator value={88.2} />
      <ConfidenceIndicator value={62.1} />
      <ConfidenceIndicator value={28.4} />
    </div>
  );
}
