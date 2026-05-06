import { FAB } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="flex gap-4">
            <FAB aria-label="Ask" icon="✦" />
            <FAB aria-label="Add" icon="+" />
            <FAB aria-label="Up" icon="↑" />
        </div>
    );
}

