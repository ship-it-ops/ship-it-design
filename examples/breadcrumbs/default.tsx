import { Breadcrumbs, Crumb } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Breadcrumbs>
      <Crumb href="/">Workspace</Crumb>
      <Crumb href="/graph">Graph</Crumb>
      <Crumb href="/graph/services">Services</Crumb>
      <Crumb>payment-webhook</Crumb>
    </Breadcrumbs>
  );
}
