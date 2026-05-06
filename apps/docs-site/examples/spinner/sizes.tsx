import { Spinner } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-center gap-5">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}
