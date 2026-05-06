import { Button, Popover, PopoverContent, PopoverTrigger } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" trailing="▾">
          Show popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="max-w-[260px] p-2">
          <div className="mb-1 text-[13px] font-medium">Service · payment-webhook</div>
          <div className="text-text-muted text-[12px] leading-[1.5]">
            Owned by Payments. Last deployed 2h ago. 142 dependents.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
