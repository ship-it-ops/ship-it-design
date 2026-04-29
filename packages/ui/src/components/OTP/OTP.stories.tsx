import type { Meta, StoryObj } from '@storybook/react';

import { OTP } from './OTP';

const meta: Meta<typeof OTP> = {
  title: 'Components/Inputs/OTP',
  component: OTP,
  tags: ['autodocs'],
  args: { length: 6 },
};
export default meta;

type Story = StoryObj<typeof OTP>;
export const Default: Story = {};
export const FourDigit: Story = { args: { length: 4 } };
