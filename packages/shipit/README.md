# @ship-it-ui/shipit

ShipIt-AI domain composites — built on `@ship-it-ui/ui`.

This package houses the components that are _specific_ to ShipIt's product
surface: the AI conversation primitives (AskBar, CopilotMessage,
ReasoningBlock, …), knowledge-graph chrome (GraphNode, GraphEdge, …), entity
displays (EntityBadge, EntityCard, …), and the marketing sections. The
generic primitives and patterns live in `@ship-it-ui/ui`.

## Install

```bash
pnpm add @ship-it-ui/shipit
```

`@ship-it-ui/shipit` peer-depends on `@ship-it-ui/ui` (which carries `react`,
`react-dom`, and Radix transitively). Apps consume the same `globals.css`
they already pull from `@ship-it-ui/ui`.

## Usage

```tsx
import { AskBar, CopilotMessage } from '@ship-it-ui/shipit';

export function Chat() {
  return (
    <div className="flex flex-col gap-3">
      <AskBar onSubmit={(q) => console.log(q)} placeholder="Ask anything…" />
      <CopilotMessage role="assistant">…</CopilotMessage>
    </div>
  );
}
```

See Storybook (`apps/docs`) for the full surface area.
