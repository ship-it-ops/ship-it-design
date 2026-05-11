import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { FilterPanel, type FilterFacet } from './FilterPanel';

const FACETS: FilterFacet[] = [
  {
    id: 'environment',
    label: 'Environment',
    options: [
      { value: 'prod', label: 'Production' },
      { value: 'staging', label: 'Staging' },
    ],
  },
  {
    id: 'tier',
    label: 'Tier',
    options: [
      { value: 'critical', label: 'Critical' },
      { value: 'standard', label: 'Standard' },
    ],
  },
];

describe('FilterPanel', () => {
  it('renders each facet heading', () => {
    render(<FilterPanel facets={FACETS} />);
    expect(screen.getByText('Environment')).toBeInTheDocument();
    expect(screen.getByText('Tier')).toBeInTheDocument();
  });

  it('emits onValueChange when an option is toggled (uncontrolled)', async () => {
    const onChange = vi.fn();
    render(<FilterPanel facets={FACETS} onValueChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Production'));
    expect(onChange).toHaveBeenLastCalledWith({ environment: ['prod'] });
  });

  it('reflects the controlled value', () => {
    render(<FilterPanel facets={FACETS} value={{ tier: ['critical'] }} />);
    const critical = screen.getByLabelText('Critical') as HTMLButtonElement;
    expect(critical.getAttribute('aria-checked')).toBe('true');
  });

  it('resets to an empty selection and fires onReset', async () => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    render(
      <FilterPanel
        facets={FACETS}
        defaultValue={{ environment: ['prod'] }}
        onValueChange={onChange}
        onReset={onReset}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onReset).toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it('renders counts when supplied', () => {
    render(<FilterPanel facets={FACETS} counts={{ environment: { prod: 42, staging: 7 } }} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<FilterPanel facets={FACETS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
