import { Sparkline } from "@ship-it-ui/ui";

const series = [12, 18, 14, 22, 19, 28, 24, 32, 30, 38, 36, 44];

export default function Example() {
    return (
        <div className="grid grid-cols-2 gap-3" style={{ width: 480 }}>
            {[
                { label: 'Queries / hr', value: '182', color: 'var(--color-accent)' },
                { label: 'Avg latency', value: '94ms', color: 'var(--color-ok)' },
                { label: 'Error rate', value: '0.2%', color: 'var(--color-warn)' },
                { label: 'Entities / day', value: '284', color: 'var(--color-purple)' },
            ].map((s) => (
                <div key={s.label} className="rounded-base border-border bg-panel border p-3">
                    <div className="text-text-dim font-mono text-[10px] tracking-[1.2px] uppercase">
                        {s.label}
                    </div>
                    <div className="my-1 font-mono text-[20px] font-medium tabular-nums">{s.value}</div>
                    <Sparkline values={series} stroke={s.color} fill width={160} height={32} />
                </div>
            ))}
        </div>
    );
}

