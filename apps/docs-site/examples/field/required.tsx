import { Field, Input } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Field label="Email" required>
      {(p) => <Input type="email" placeholder="you@example.com" {...p} />}
    </Field>
  );
}
