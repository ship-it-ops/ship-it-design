import { Card, CardLink, StatCard } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="grid max-w-[860px] grid-cols-4 gap-3">
            <StatCard label="Entities" value="12,408" delta="+284 today" trend="up" />
            <StatCard label="Relations" value="28,104" delta="+812 today" trend="up" />
            <StatCard label="Sources live" value="4 / 6" delta="2 pending" trend="flat" />
            <StatCard label="Avg confidence" value="92.4%" delta="−0.3%" trend="down" />
        </div>
    );
}

