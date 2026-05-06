import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, MenuItem, MenuSeparator } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" trailing="▾">
                    Actions
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <MenuItem trailing="↵">Open in graph</MenuItem>
                <MenuItem trailing="⌘C">Copy entity ID</MenuItem>
                <MenuItem trailing="⌘O">View source</MenuItem>
                <MenuSeparator />
                <MenuItem trailing="R">Re-extract</MenuItem>
                <MenuSeparator />
                <MenuItem destructive trailing="⌫">
                    Delete
                </MenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

