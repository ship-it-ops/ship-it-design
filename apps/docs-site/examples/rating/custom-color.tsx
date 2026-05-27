import { Rating } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Rating value={4.5} readOnly precision="half" color="#7c3aed" />
      <Rating value={3} readOnly color="oklch(0.7 0.2 320)" />
      <Rating value={5} readOnly color="#0ea5e9" />
    </div>
  );
}
