import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/Inputs/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ButtonGroup>;

function Segmented({ items }: { items: string[] }) {
  const [active, setActive] = useState(items[0]);
  return (
    <ButtonGroup>
      {items.map((item) => (
        <Button
          key={item}
          variant="secondary"
          onClick={() => setActive(item)}
          className={active === item ? 'bg-accent-dim text-accent' : ''}
        >
          {item}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export const Days: Story = { render: () => <Segmented items={['Day', 'Week', 'Month', 'Year']} /> };
export const Layout: Story = { render: () => <Segmented items={['⊞', '☰', '⋮']} /> };
