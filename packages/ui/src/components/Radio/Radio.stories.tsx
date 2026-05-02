import type { Meta, StoryObj } from '@storybook/react-vite';

import { Radio, RadioGroup } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Inputs/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Group: Story = {
  render: () => (
    <RadioGroup defaultValue="team">
      <Radio value="team" label="Everyone on team" />
      <Radio value="admins" label="Admins only" />
      <Radio value="custom" label="Custom" />
      <Radio value="disabled" label="Disabled" disabled />
    </RadioGroup>
  ),
};
