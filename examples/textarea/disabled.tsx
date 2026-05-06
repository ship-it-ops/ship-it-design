import { Textarea } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Textarea
      placeholder="Knowledge graph for our backend services."
      defaultValue="read only"
      rows={4}
      disabled
    />
  );
}
