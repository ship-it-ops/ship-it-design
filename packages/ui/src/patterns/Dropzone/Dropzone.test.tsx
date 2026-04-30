import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Dropzone } from './Dropzone';

function makeFile(name: string, type = 'text/plain') {
  return new File(['x'], name, { type });
}

describe('Dropzone', () => {
  it('renders the title', () => {
    render(<Dropzone title="Drop files to ingest" />);
    expect(screen.getByText('Drop files to ingest')).toBeInTheDocument();
  });

  it('emits onFiles when files are dropped', () => {
    const onFiles = vi.fn();
    const { container } = render(<Dropzone onFiles={onFiles} />);
    const zone = container.querySelector('label')!;
    const file = makeFile('runbook.pdf');
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('emits onFiles on file input change', () => {
    const onFiles = vi.fn();
    render(<Dropzone onFiles={onFiles} title="Drop files to ingest" />);
    const input = screen.getByLabelText('Drop files to ingest');
    const file = makeFile('a.pdf');
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('shows drag-over state on dragover', () => {
    const { container } = render(<Dropzone />);
    const zone = container.querySelector('label')!;
    fireEvent.dragOver(zone);
    expect(zone.className).toContain('border-accent');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Dropzone title="Drop files to ingest" description=".pdf, .md up to 50MB" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
