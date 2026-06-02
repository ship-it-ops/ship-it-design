import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="regions">
        <AccordionTrigger leadingIcon="rocket">Deployment regions</AccordionTrigger>
        <AccordionContent>Edge in 30+ regions, sub-100ms cold start.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger leadingIcon="shield">Security & access</AccordionTrigger>
        <AccordionContent>
          SSO, audit logs, and signed deploy tokens — included on every plan.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="notifications">
        <AccordionTrigger leadingIcon="bell">Notifications</AccordionTrigger>
        <AccordionContent>Slack, email, or webhook on every deploy and incident.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
