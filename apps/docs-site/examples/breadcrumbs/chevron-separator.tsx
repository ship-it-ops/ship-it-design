import { Breadcrumbs, Crumb } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Breadcrumbs separator={<span className="font-mono">›</span>}>
      <Crumb href="/">~</Crumb>
      <Crumb href="/workspace">workspace</Crumb>
      <Crumb href="/workspace/graph">graph</Crumb>
      <Crumb>payment-webhook</Crumb>
    </Breadcrumbs>
  );
}
