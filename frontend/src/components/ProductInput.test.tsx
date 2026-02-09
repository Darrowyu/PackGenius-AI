import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductInput } from './ProductInput';

const mockT = {
  productDimsTitle: 'Product Dimensions',
  productDimsDesc: 'Enter product dimensions',
  length: 'Length',
  width: 'Width',
  height: 'Height',
};

describe('ProductInput', () => {
  test('renders all input fields', () => {
    render(
      <ProductInput
        product={{ length: 0, width: 0, height: 0 }}
        onProductChange={() => {}}
        onKeyDown={() => {}}
        t={mockT}
      />
    );

    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('Width')).toBeInTheDocument();
    expect(screen.getByText('Height')).toBeInTheDocument();
  });

  test('displays product values', () => {
    render(
      <ProductInput
        product={{ length: 100, width: 50, height: 25 }}
        onProductChange={() => {}}
        onKeyDown={() => {}}
        t={mockT}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs[0]).toHaveValue(100);
    expect(inputs[1]).toHaveValue(50);
    expect(inputs[2]).toHaveValue(25);
  });

  test('calls onProductChange when input changes', () => {
    const onProductChange = vi.fn();
    render(
      <ProductInput
        product={{ length: 0, width: 0, height: 0 }}
        onProductChange={onProductChange}
        onKeyDown={() => {}}
        t={mockT}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '150' } });

    expect(onProductChange).toHaveBeenCalledWith({ length: 150 });
  });

  test('calls onKeyDown when key is pressed', () => {
    const onKeyDown = vi.fn();
    render(
      <ProductInput
        product={{ length: 0, width: 0, height: 0 }}
        onProductChange={() => {}}
        onKeyDown={onKeyDown}
        t={mockT}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.keyDown(inputs[0], { key: 'Enter' });

    expect(onKeyDown).toHaveBeenCalled();
  });

  test('handles zero input', () => {
    const onProductChange = vi.fn();
    render(
      <ProductInput
        product={{ length: 100, width: 0, height: 0 }}
        onProductChange={onProductChange}
        onKeyDown={() => {}}
        t={mockT}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '0' } });

    expect(onProductChange).toHaveBeenCalledWith({ length: 0 });
  });
});
