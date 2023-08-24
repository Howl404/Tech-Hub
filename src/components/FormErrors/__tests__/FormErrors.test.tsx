import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormErrors from '../FormErrors';

describe('FormErrors component', () => {
  test('renders with correct errors', () => {
    const formErrors = {
      email: 'Invalid email format',
      password: 'Password is too short',
    };

    render(<FormErrors formErrors={formErrors} />);

    const emailErrorElement = screen.getByText('email Invalid email format');
    const passwordErrorElement = screen.getByText('password Password is too short');

    expect(emailErrorElement).toBeInTheDocument();
    expect(passwordErrorElement).toBeInTheDocument();
  });
});
