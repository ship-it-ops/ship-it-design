import { Select } from "@ship-it-ui/ui";

export default function Example() {
    return <Select options={['Production', 'Staging', 'Development', 'Local']} placeholder='Choose environment' defaultValue='Staging' />;
}

