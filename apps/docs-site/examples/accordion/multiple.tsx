import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Accordion type="multiple" defaultValue={['a', 'b']}>
      <AccordionItem value="a">
        <AccordionTrigger>Vehicle features</AccordionTrigger>
        <AccordionContent>Bluetooth, USB-C, backup camera, all-wheel drive.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>House rules</AccordionTrigger>
        <AccordionContent>No smoking, no pets, return with the same fuel level.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
