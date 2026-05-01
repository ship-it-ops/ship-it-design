import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { FileChip } from '../FileChip';

import { Dropzone } from './Dropzone';

const meta: Meta<typeof Dropzone> = {
  title: 'Patterns/Forms/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
    title: 'Drop files to ingest',
    description: 'or browse · .md, .pdf, .txt up to 50MB',
  },
};

function DropzoneWithFilesDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="flex flex-col gap-3">
      <Dropzone
        title="Drop files to ingest"
        description="or browse · .md, .pdf, .txt up to 50MB"
        onFiles={(f) => setFiles((prev) => [...prev, ...f])}
      />
      <div className="flex flex-col gap-2">
        {files.map((f, i) => (
          <FileChip
            key={i}
            name={f.name}
            size={`${(f.size / 1024).toFixed(1)} KB`}
            progress={100}
            onRemove={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
          />
        ))}
      </div>
    </div>
  );
}

export const WithFiles: Story = {
  render: () => <DropzoneWithFilesDemo />,
};
