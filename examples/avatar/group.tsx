import { Avatar, AvatarGroup } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-col gap-4">
      <AvatarGroup names={['Mohamed Tariq', 'Priya Khanna', 'John Adams', 'Esme S']} />
      <AvatarGroup
        names={['Mohamed', 'Priya', 'John', 'Esme', 'Rai', 'Dan', 'Alex', 'Yara']}
        size="md"
        max={5}
      />
      <AvatarGroup names={['Mohamed', 'Priya', 'John']} size="lg" max={3} />
    </div>
  );
}
