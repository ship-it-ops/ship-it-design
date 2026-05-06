import { Field, Input } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Field label="Domain" hint="Use lowercase, no spaces.">
      {(p) => <Input placeholder="acme" {...p} />}
    </Field>
  );
}
