import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tree, type TreeItem } from './Tree';

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

const meta: Meta<typeof Tree> = {
  title: 'Patterns/Data/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Tree>;

export const Default: Story = {
  args: { items, defaultExpanded: ['src'] },
};
