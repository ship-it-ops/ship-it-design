import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Accordion type="single" collapsible defaultValue="one">
      <AccordionItem value="one">
        <AccordionTrigger>What's included in the nightly rate?</AccordionTrigger>
        <AccordionContent>
          Wi-Fi, all utilities, cleaning, and self check-in via keypad.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Cancellation policy</AccordionTrigger>
        <AccordionContent>
          Free cancellation up to 48 hours before check-in. Within 48 hours, the first night is
          non-refundable.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="three">
        <AccordionTrigger>House rules</AccordionTrigger>
        <AccordionContent>
          No smoking, no parties, quiet hours after 10pm. Pets allowed on request.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
