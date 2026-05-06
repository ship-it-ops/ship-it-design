import { Combobox } from "@ship-it-ui/ui";

export default function Example() {
    return <Combobox aria-label='Repository' placeholder='Search repos…' options={[
        'repo:shipit-api',
        'repo:shipit-web',
        'repo:shipit-ingest',
        'repo:shipit-graph',
        'repo:shipit-cli',
        'repo:shipit-docs',
    ]} />;
}

