import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SortingSelect from '../SortingSelect';
import '@testing-library/jest-dom';

describe('SortingSelect Component', () => {
  const options = [
    { value: 'name.asc', label: 'Name (Ascending)' },
    { value: 'name.desc', label: 'Name (Descending)' },
    { value: 'price.asc', label: 'Price (Ascending)' },
    { value: 'price.desc', label: 'Price (Descending)' },
  ];

  it('renders correctly with selected option', () => {
    const selectedOption = 'price.asc';
    const onSelect = jest.fn();

    const { getByLabelText, getByDisplayValue } = render(
      <SortingSelect selectedOption={selectedOption} options={options} onSelect={onSelect} />,
    );

    const sortingSelect = getByLabelText('Sort by:');
    const selectedValue = getByDisplayValue('Price (Ascending)');

    expect(sortingSelect).toBeInTheDocument();
    expect(selectedValue).toBeInTheDocument();
  });

  it('calls onSelect when an option is selected', () => {
    const selectedOption = 'name.asc';
    const onSelect = jest.fn();

    const { getByLabelText, getByDisplayValue } = render(
      <SortingSelect selectedOption={selectedOption} options={options} onSelect={onSelect} />,
    );

    const sortingSelect = getByLabelText('Sort by:');
    const selectedValue = getByDisplayValue('Name (Ascending)');

    expect(sortingSelect).toBeInTheDocument();
    expect(selectedValue).toBeInTheDocument();

    fireEvent.change(sortingSelect, { target: { value: 'price.desc' } });

    expect(onSelect).toHaveBeenCalledWith('price.desc');
  });
});
