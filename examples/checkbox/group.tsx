import { Checkbox } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="Ingest PRs" defaultChecked />
      <Checkbox label="Ingest issues" />
      <Checkbox label="Ingest wiki" checked="indeterminate" />
      <Checkbox label="Disabled" disabled defaultChecked />
    </div>
  );
}
