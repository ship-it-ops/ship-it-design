import { Field, Input } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Field label="Workspace name">{(p) => <Input placeholder="acme-payments" {...p} />}</Field>
  );
}
