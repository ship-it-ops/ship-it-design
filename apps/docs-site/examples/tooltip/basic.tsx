import { IconButton, Tooltip } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <Tooltip content="Add new source">
            <IconButton aria-label="Add source" icon="+" />
        </Tooltip>
    );
}

