import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormAddress from '../FormAddress';

describe('FormAddress component', () => {
  test('renders the input element with a label', () => {
    render(
      <FormAddress
        prefix=""
        city="TestCity"
        country="US"
        postalCode=""
        streetName=""
        disabled
        onInputChange={(): void => {}}
      />,
    );

    const labelElementCity = screen.getByText('City');
    const inputElementCity = document.querySelector('#city');

    expect(labelElementCity).toBeInTheDocument();
    expect((inputElementCity as HTMLInputElement).value).toBe('TestCity');
  });

  test('displays an error message', () => {
    render(
      <FormAddress
        prefix=""
        city="12"
        country=""
        postalCode=""
        streetName=""
        disabled
        onInputChange={(): void => {}}
      />,
    );

    const errorElement = screen.getByText('City is not valid');
    expect(errorElement).toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const onChangeMock = jest.fn();

    render(
      <FormAddress prefix="" city="" country="" postalCode="" streetName="" disabled onInputChange={onChangeMock} />,
    );

    const inputElementCity = document.querySelector('#city') as HTMLInputElement;
    const inputElementCountry = document.querySelector('#country') as HTMLInputElement;

    fireEvent.change(inputElementCity, { target: { value: 'new' } });
    fireEvent.change(inputElementCountry, { target: { value: 'US' } });

    expect(onChangeMock).toHaveBeenCalledTimes(2);
  });
});
