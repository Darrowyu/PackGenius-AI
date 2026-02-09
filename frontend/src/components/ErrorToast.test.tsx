import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorToast } from './ErrorToast';

describe('ErrorToast', () => {
  test('renders nothing when error is null', () => {
    const { container } = render(<ErrorToast error={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders error message when error is provided', () => {
    render(<ErrorToast error="Something went wrong" onClose={() => {}} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ErrorToast error="Error message" onClose={onClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
