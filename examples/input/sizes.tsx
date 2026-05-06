import { Input } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex w-72 flex-col gap-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  );
}
