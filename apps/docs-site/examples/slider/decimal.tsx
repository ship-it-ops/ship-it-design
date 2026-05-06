import { useState } from 'react';
import { Slider } from "@ship-it-ui/ui";

export default function Example() {
    return <Slider defaultValue={[3.5]} showValue min={0} max={10} step={0.5} />;
}

