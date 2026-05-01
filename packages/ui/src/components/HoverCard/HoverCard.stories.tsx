import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../Avatar';

import { HoverCard } from './HoverCard';

const meta: Meta = { title: 'Components/Overlays/HoverCard' };
export default meta;

type Story = StoryObj;

export const Mention: Story = {
  render: () => (
    <p className="text-text-muted text-[13px] leading-[1.7]">
      Owner is{' '}
      <HoverCard
        trigger={<span className="text-accent cursor-pointer">@priya</span>}
        content={
          <div className="flex items-center gap-3">
            <Avatar name="Priya Khanna" size="md" status="ok" />
            <div>
              <div className="text-[13px] font-medium">Priya Khanna</div>
              <div className="text-text-dim font-mono text-[11px]">staff eng · payments</div>
              <p className="text-text-muted mt-1 max-w-[240px] text-[11px] leading-[1.55]">
                Owns 4 services. On-call rotation Wed–Fri. Last commit 2h ago.
              </p>
            </div>
          </div>
        }
      />
      , on-call through Friday.
    </p>
  ),
};
