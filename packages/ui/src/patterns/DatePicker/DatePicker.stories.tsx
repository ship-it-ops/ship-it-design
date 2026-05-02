import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Calendar } from './Calendar';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Patterns/Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

function DatePickerDemo() {
  const [value, setValue] = useState<Date | undefined>(new Date(2026, 3, 23));
  return <DatePicker value={value} onValueChange={setValue} />;
}

export const Default: Story = {
  render: () => <DatePickerDemo />,
};

export const StandaloneCalendar: Story = {
  render: () => (
    <Calendar defaultMonth={3} defaultYear={2026} defaultSelected={new Date(2026, 3, 23)} />
  ),
};
