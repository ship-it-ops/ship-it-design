import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Patterns/Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: {
    steps: ['Workspace', 'Connect', 'Review', 'Invite'],
    current: 2,
  },
  argTypes: {
    current: { control: { type: 'range', min: 0, max: 3 } },
  },
};
export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Stepper steps={['Workspace', 'Connect', 'Review', 'Invite']} current={0} />
      <Stepper steps={['Workspace', 'Connect', 'Review', 'Invite']} current={2} />
      <Stepper steps={['Workspace', 'Connect', 'Review', 'Invite']} current={4} />
    </div>
  ),
};
