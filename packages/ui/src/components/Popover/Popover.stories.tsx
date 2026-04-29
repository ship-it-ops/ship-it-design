import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const meta: Meta = { title: 'Components/Overlays/Popover' };
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" trailing="▾">
          Show popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2 max-w-[260px]">
          <div className="text-[13px] font-medium mb-1">Service · payment-webhook</div>
          <div className="text-[12px] text-text-muted leading-[1.5]">
            Owned by Payments. Last deployed 2h ago. 142 dependents.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
