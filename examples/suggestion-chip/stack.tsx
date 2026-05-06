import { SuggestionChip } from "@ship-it-ui/shipit";

export default function Example() {
    return (
        <div className="flex flex-wrap gap-[6px]">
            {[
                'What depends on ledger-core?',
                'Who is on-call tonight?',
                'Recent rollbacks',
                'Services without runbooks',
            ].map((label) => (
                <SuggestionChip key={label}>{label}</SuggestionChip>
            ))}
        </div>
    );
}

