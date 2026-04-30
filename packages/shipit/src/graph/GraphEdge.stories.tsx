import type { Meta, StoryObj } from '@storybook/react';

import { GraphEdge } from './GraphEdge';

const meta: Meta<typeof GraphEdge> = {
  title: 'ShipIt/Graph/GraphEdge',
  component: GraphEdge,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof GraphEdge>;

export const Catalog: Story = {
  render: () => (
    <svg width={520} height={180} viewBox="0 0 520 180">
      <defs>
        <marker
          id="arr"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)" />
        </marker>
      </defs>
      <g fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-text-dim)">
        <GraphEdge x1={20} y1={30} x2={200} y2={30} edgeStyle="solid" />
        <text x={210} y={34}>
          solid · 1.5px
        </text>

        <GraphEdge x1={20} y1={60} x2={200} y2={60} edgeStyle="dashed" />
        <text x={210} y={64}>
          dashed · async
        </text>

        <GraphEdge x1={20} y1={90} x2={200} y2={90} edgeStyle="highlighted" />
        <text x={210} y={94}>
          highlighted · in path
        </text>

        <GraphEdge x1={20} y1={120} x2={200} y2={120} edgeStyle="dim" />
        <text x={210} y={124}>
          dim · out of scope
        </text>

        <GraphEdge
          x1={20}
          y1={150}
          x2={200}
          y2={150}
          curve={{ cx: 110, cy: 130 }}
          arrowheadId="arr"
        />
        <text x={210} y={154}>
          directed · arrowhead
        </text>
      </g>
    </svg>
  ),
};
