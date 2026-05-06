import { useState } from 'react';
import { Pagination } from '@ship-it-ui/ui';

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

export default function Example() {
  return <PaginationDemo initial={3} total={42} />;
}
