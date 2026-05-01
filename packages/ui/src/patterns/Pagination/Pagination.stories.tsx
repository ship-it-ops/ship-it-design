import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Patterns/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Pagination>;

function PaginationDemo({
  initial,
  total,
  siblings,
}: {
  initial: number;
  total: number;
  siblings?: number;
}) {
  const [page, setPage] = useState(initial);
  return <Pagination page={page} total={total} onPageChange={setPage} siblings={siblings} />;
}

export const Default: Story = {
  render: () => <PaginationDemo initial={3} total={42} />,
};

export const FewPages: Story = {
  render: () => <PaginationDemo initial={2} total={5} />,
};

export const ManyPages: Story = {
  render: () => <PaginationDemo initial={50} total={100} siblings={2} />,
};
