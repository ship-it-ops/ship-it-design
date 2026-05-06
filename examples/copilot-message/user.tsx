import { Citation, CopilotMessage } from '@ship-it-ui/shipit';

// `role` is a React prop on CopilotMessage (the chat speaker), not an ARIA role.
/* eslint-disable jsx-a11y/aria-role */

export default function Example() {
  return (
    <CopilotMessage role="user" avatar="MT">
      Who owns payment-webhook and what's the rollback plan?
    </CopilotMessage>
  );
}
