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
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete entity
        </Button>
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete payment-webhook-v2?"
          description="This permanently removes the entity from the graph and breaks any inbound relations."
          footer={
            <>
              <AlertDialogCancel asChild>
                <Button variant="ghost">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogAction>
            </>
          }
        />
      </>
    );
  };
  return <Inner />;
}
