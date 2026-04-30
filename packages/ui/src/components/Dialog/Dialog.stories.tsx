import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel } from './AlertDialog';
import { Dialog } from './Dialog';
import { Drawer } from './Drawer';
import { Sheet } from './Sheet';

const meta: Meta = { title: 'Components/Overlays/Dialog' };
export default meta;

type Story = StoryObj;

export const Modal: Story = {
  render: () => {
    const Inner = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open dialog
          </Button>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Disconnect github?"
            description="This stops live sync immediately. Your existing graph won't change, but new commits, PRs, and code references won't appear."
            footer={
              <>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setOpen(false)}>
                  Disconnect
                </Button>
              </>
            }
          />
        </>
      );
    };
    return <Inner />;
  },
};

export const DrawerStory: Story = {
  name: 'Drawer (right)',
  render: () => {
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
  },
};

export const SheetStory: Story = {
  name: 'Sheet (bottom)',
  render: () => {
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
  },
};

export const AlertConfirm: Story = {
  name: 'AlertDialog',
  render: () => {
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
  },
};
