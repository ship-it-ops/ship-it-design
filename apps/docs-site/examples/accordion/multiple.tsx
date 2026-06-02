import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Accordion type="multiple" defaultValue={['a', 'b']}>
      <AccordionItem value="a">
        <AccordionTrigger>What's included</AccordionTrigger>
        <AccordionContent>Wi-Fi, A/C, full kitchen, parking on-site.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>House rules</AccordionTrigger>
        <AccordionContent>No smoking, no parties, quiet hours after 10pm.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
