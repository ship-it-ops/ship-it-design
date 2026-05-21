import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Accordion type="single" collapsible defaultValue="one">
      <AccordionItem value="one">
        <AccordionTrigger>What's included in the daily rate?</AccordionTrigger>
        <AccordionContent>
          Unlimited mileage, basic protection, and 24/7 roadside assistance.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Cancellation policy</AccordionTrigger>
        <AccordionContent>
          Free cancellation up to 24 hours before pickup. Within 24 hours, a 50% fee applies.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="three">
        <AccordionTrigger>Driver requirements</AccordionTrigger>
        <AccordionContent>
          Minimum age 21. Valid driver's license and matching ID required at pickup.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
