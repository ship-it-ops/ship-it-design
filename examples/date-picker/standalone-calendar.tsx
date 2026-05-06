import { useState } from 'react';
import { Calendar, DatePicker } from "@ship-it-ui/ui";

function DatePickerDemo() {
    const [value, setValue] = useState<Date | undefined>(new Date(2026, 3, 23));
    return <DatePicker value={value} onValueChange={setValue} />;
}

export default function Example() {
    return (
        <Calendar defaultMonth={3} defaultYear={2026} defaultValue={new Date(2026, 3, 23)} />
    );
}

