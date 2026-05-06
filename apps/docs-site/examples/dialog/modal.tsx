import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, Button, Dialog, Drawer, Sheet } from "@ship-it-ui/ui";

export default function Example() {

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

}

