import { Radio, RadioGroup } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <RadioGroup defaultValue="team">
            <Radio value="team" label="Everyone on team" />
            <Radio value="admins" label="Admins only" />
            <Radio value="custom" label="Custom" />
            <Radio value="disabled" label="Disabled" disabled />
        </RadioGroup>
    );
}

