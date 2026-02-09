import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  test('renders title and description', () => {
    const t = {
      emptyStateTitle: 'No Results',
      emptyStateDesc: 'Enter dimensions to calculate',
    };

    render(<EmptyState t={t} />);

    expect(screen.getByText('No Results')).toBeInTheDocument();
    expect(screen.getByText('Enter dimensions to calculate')).toBeInTheDocument();
  });
});
