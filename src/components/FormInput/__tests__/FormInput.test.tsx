import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormInput from '../FormInput';

describe('FormInput component', () => {
  test('renders the input element with a label', () => {
    render(
      <FormInput
        label="Username"
        errorMessage=""
        onChange={(): void => {}}
        id="username"
        type="text"
        pattern=""
        title=""
      />,
    );

    const labelElement = screen.getByText('Username');
    const inputElement = screen.getByRole('textbox', { name: 'Username' });

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  test('displays an error message', () => {
    render(
      <FormInput
        label="Username"
        errorMessage="Invalid username"
        onChange={(): void => {}}
        id="username"
        type="text"
        pattern=""
        title=""
      />,
    );

    const errorElement = screen.getByText('Invalid username');
    expect(errorElement).toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const onChangeMock = jest.fn();

    render(
      <FormInput
        label="Username"
        errorMessage=""
        onChange={onChangeMock}
        id="username"
        type="text"
        pattern=""
        title=""
      />,
    );

    const inputElement = screen.getByRole('textbox', { name: 'Username' });

    fireEvent.change(inputElement, { target: { value: 'newUsername' } });

    expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object));
  });
});
