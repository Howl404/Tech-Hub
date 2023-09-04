import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PriceRange from '../PriceRange';
import '@testing-library/jest-dom';
import 'resize-observer-polyfill';

class ResizeObserver {
  public observe(): void {}
  public unobserve(): void {}
  public disconnect(): void {}
}

global.ResizeObserver = ResizeObserver;

test('PriceRangeSlider renders correctly', () => {
  const min = 0;
  const max = 100;
  const onChange = jest.fn();

  const { getByText, getByDisplayValue } = render(<PriceRange min={min} max={max} onChange={onChange} />);

  const title = getByText('Price range');
  expect(title).toBeInTheDocument();

  const currency = getByText('EUR');
  expect(currency).toBeInTheDocument();

  const minInput = getByDisplayValue('0');
  expect(minInput).toBeInTheDocument();

  const maxInput = getByDisplayValue('100');
  expect(maxInput).toBeInTheDocument();

  const slider = getByDisplayValue('0');
  expect(slider).toBeInTheDocument();

  fireEvent.change(minInput, { target: { value: '25' } });
  fireEvent.change(maxInput, { target: { value: '75' } });

  expect(onChange).toHaveBeenCalledWith([25, 75]);
});
