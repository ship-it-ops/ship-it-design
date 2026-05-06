import { Avatar, AvatarGroup } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <Avatar name="Mohamed Tariq" size="xs" />
      <Avatar name="Priya Khanna" size="sm" />
      <Avatar name="John Adams" size="md" />
      <Avatar name="Esme Sandberg" size="lg" />
      <Avatar name="Anya Brown" size="xl" />
    </div>
  );
}
