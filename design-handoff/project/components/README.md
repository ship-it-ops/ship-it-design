# ShipIt-AI · Components

Reusable React primitives. All files are plain JSX (loaded via Babel standalone in the browser — no bundler). Each file exports its components to `window` so other scripts can pick them up.

## Load order

All primitives depend on tokens from `/colors_and_type.css`. In the host HTML, load them in this order after React + Babel:

```html
<link rel="stylesheet" href="colors_and_type.css">
<script src="…react…"></script>
<script src="…react-dom…"></script>
<script src="…babel-standalone…"></script>
<script type="text/babel" src="components/tokens.jsx"></script>
<script type="text/babel" src="components/Button.jsx"></script>
<script type="text/babel" src="components/Input.jsx"></script>
<script type="text/babel" src="components/Dialog.jsx"></script>
<script type="text/babel" src="components/Toast.jsx"></script>
<!-- … -->
```

## Usage

```jsx
<Button variant="primary" icon="✦" onClick={…}>Build graph</Button>
<Input placeholder="name@org.com" icon="@"/>
<Dialog open={open} onClose={close} title="Disconnect source">…</Dialog>
```

## Primitives

| Primitive      | File              | Props                                                         |
|----------------|-------------------|---------------------------------------------------------------|
| `Button`       | Button.jsx        | `variant` `size` `icon` `trailing` `loading` `disabled`       |
| `IconButton`   | Button.jsx        | `icon` `size` `variant`                                       |
| `ButtonGroup`  | Button.jsx        | (children are Buttons)                                        |
| `Input`        | Input.jsx         | `value` `onChange` `placeholder` `icon` `trailing` `size`     |
| `Textarea`     | Input.jsx         | `value` `onChange` `rows`                                     |
| `Select`       | Input.jsx         | `value` `options` `onChange`                                  |
| `Checkbox`     | Input.jsx         | `checked` `onChange` `label` `indeterminate`                  |
| `Radio`        | Input.jsx         | `checked` `onChange` `label`                                  |
| `Switch`       | Input.jsx         | `on` `onChange` `label` `size`                                |
| `Slider`       | Input.jsx         | `value` `min` `max` `onChange` `showValue`                    |
| `Dialog`       | Dialog.jsx        | `open` `onClose` `title` `description` `footer`               |
| `Drawer`       | Dialog.jsx        | `open` `onClose` `side` `title`                               |
| `Popover`      | Popover.jsx       | `open` `anchor` `children`                                    |
| `Tooltip`      | Popover.jsx       | `content` (wraps a trigger child)                             |
| `Toast`        | Toast.jsx         | `variant` `title` `description` `action`                      |
| `Badge`        | Badge.jsx         | `variant` `dot` `size`                                        |
| `Avatar`       | Avatar.jsx        | `name` `src` `size` `status`                                  |
| `Card`         | Card.jsx          | `title` `description` `footer`                                |

All components are keyboard-accessible and use CSS custom properties from `colors_and_type.css`, so they adapt to light/dark mode automatically.
