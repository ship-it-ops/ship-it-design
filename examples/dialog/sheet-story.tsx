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
          Open sheet
        </Button>
        <Sheet open={open} onOpenChange={setOpen} title="Quick actions">
          <div className="text-text-muted text-[12px]">Press a key to run.</div>
        </Sheet>
      </>
    );
  };
  return <Inner />;
}
