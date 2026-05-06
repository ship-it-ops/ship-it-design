import { Tree, type TreeItem } from "@ship-it-ui/ui";

const items: TreeItem[] = [
    {
        id: 'src',
        label: 'src',
        icon: '▢',
        children: [
            { id: 'src/index.ts', label: 'index.ts', icon: '▢' },
            {
                id: 'src/components',
                label: 'components',
                icon: '▢',
                children: [
                    { id: 'src/components/Button.tsx', label: 'Button.tsx', icon: '▢' },
                    { id: 'src/components/Input.tsx', label: 'Input.tsx', icon: '▢' },
                ],
            },
            { id: 'src/utils.ts', label: 'utils.ts', icon: '▢' },
        ],
    },
    { id: 'package.json', label: 'package.json', icon: '▢' },
    { id: 'README.md', label: 'README.md', icon: '▢' },
];

export default function Example() {
    return <Tree items={items} defaultExpanded={['src']} />;
}

