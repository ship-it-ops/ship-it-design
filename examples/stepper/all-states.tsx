import { Stepper } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      <Stepper steps={['Workspace', 'Connect', 'Review', 'Invite']} current={0} />
      <Stepper steps={['Workspace', 'Connect', 'Review', 'Invite']} current={2} />
      <Stepper steps={['Workspace', 'Connect', 'Review', 'Invite']} current={4} />
    </div>
  );
}
