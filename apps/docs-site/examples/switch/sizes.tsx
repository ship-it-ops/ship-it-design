import { Switch } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <Switch label="Small" size="sm" defaultChecked />
      <Switch label="Medium" size="md" defaultChecked />
    </div>
  );
}
