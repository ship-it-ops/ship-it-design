import { Footer } from "@ship-it-ui/shipit";

export default function Example() {
    return <Footer brand={(
        <span className="inline-flex items-center gap-[10px]">
            <span
                aria-hidden
                className="text-on-accent grid h-6 w-6 place-items-center rounded-md text-[13px]"
                style={{
                    background: 'linear-gradient(135deg, oklch(0.82 0.12 200), oklch(0.78 0.14 300))',
                }}
            >
                ◆
            </span>
            <span className="text-[13px] font-medium">ShipIt</span>
        </span>
    )} columns={[
        {
            heading: 'Product',
            links: [
                { label: 'Graph', href: '#' },
                { label: 'Ask', href: '#' },
                { label: 'Connectors', href: '#' },
            ],
        },
        {
            heading: 'Company',
            links: [
                { label: 'About', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Blog', href: '#' },
            ],
        },
        {
            heading: 'Legal',
            links: [
                { label: 'Privacy', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'Security', href: '#' },
            ],
        },
    ]} copyright='© 2026 ShipIt, Inc.' closing='made with care · san francisco' />;
}

