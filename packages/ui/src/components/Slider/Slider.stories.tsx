import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { defaultValue: [65], showValue: true },
};
export default meta;

type Story = StoryObj<typeof Slider>;
export const Default: Story = {};
export const Live: Story = {
  render: () => {
    const Inner = () => {
      const [v, setV] = useState([42]);
      return <Slider value={v} onValueChange={setV} showValue />;
    };
    return <Inner />;
  },
};
export const Decimal: Story = {
  args: { defaultValue: [3.5], min: 0, max: 10, step: 0.5 },
};
