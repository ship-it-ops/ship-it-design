import { Field, Input } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Field label="Subdomain" error="Subdomain already taken">
      {(p) => <Input defaultValue="acme" {...p} />}
    </Field>
  );
}
