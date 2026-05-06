import { Select } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex w-56 flex-col gap-2">
      <Select size="sm" options={['Small', 'Medium', 'Large']} />
      <Select size="md" options={['Small', 'Medium', 'Large']} />
      <Select size="lg" options={['Small', 'Medium', 'Large']} />
    </div>
  );
}
