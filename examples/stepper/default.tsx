import { Stepper } from '@ship-it-ui/ui';

export default function Example() {
  return <Stepper steps={['Workspace', 'Connect', 'Review', 'Invite']} current={2} />;
}
