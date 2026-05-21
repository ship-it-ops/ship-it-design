import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="features">
        <AccordionTrigger leadingIcon="car">Vehicle features</AccordionTrigger>
        <AccordionContent>4-door SUV, automatic, AWD.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="insurance">
        <AccordionTrigger leadingIcon="umbrella">Insurance & protection</AccordionTrigger>
        <AccordionContent>
          Basic plan included; premium upgrade available at checkout.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="pickup">
        <AccordionTrigger leadingIcon="airport">Pickup options</AccordionTrigger>
        <AccordionContent>Airport curbside delivery available for a $25 fee.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
