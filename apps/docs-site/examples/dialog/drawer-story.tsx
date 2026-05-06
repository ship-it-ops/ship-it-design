import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
  Dialog,
  Drawer,
  Sheet,
} from '@ship-it-ui/ui';

export default function Example() {
  const Inner = () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open drawer
        </Button>
        <Drawer open={open} onOpenChange={setOpen} title="Filters">
          <div className="text-text-muted text-[13px]">Filter controls go here.</div>
        </Drawer>
      </>
    );
  };
  return <Inner />;
}
