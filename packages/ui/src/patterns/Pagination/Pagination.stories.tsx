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

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(3);
    return <Pagination page={page} total={42} onPageChange={setPage} />;
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return <Pagination page={page} total={5} onPageChange={setPage} />;
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(50);
    return <Pagination page={page} total={100} onPageChange={setPage} siblings={2} />;
  },
};
