import { Sparkline } from "@ship-it-ui/ui";

const series = [12, 18, 14, 22, 19, 28, 24, 32, 30, 38, 36, 44];

export default function Example() {
    return <Sparkline values={series} width={160} height={32} stroke='var(--color-accent)' fill />;
}

