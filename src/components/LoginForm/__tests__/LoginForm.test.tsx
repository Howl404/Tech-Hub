import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import SignInForm from '../LoginForm';

describe('SignInForm component', () => {
  test('toggles password visibility', () => {
    const mockCheckLogIn = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Router>
        <SignInForm checkLogIn={mockCheckLogIn} />
      </Router>,
    );
    const passwordInput = getByLabelText('Password *') as HTMLInputElement;
    const visibilityToggleButton = getByRole('checkbox', { name: 'show password' });

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    expect(passwordInput.value).toBe('Password123');
    expect(passwordInput.type).toBe('password');

    fireEvent.click(visibilityToggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(visibilityToggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('blocks spacebar key on email and password input fields', () => {
    const mockCheckLogIn = jest.fn();
    const { getByLabelText } = render(
      <Router>
        <SignInForm checkLogIn={mockCheckLogIn} />
      </Router>,
    );
    const emailInput = getByLabelText('Email *') as HTMLInputElement;
    const passwordInput = getByLabelText('Password *') as HTMLInputElement;

    fireEvent.keyDown(emailInput, { key: ' ', code: 'Space' });
    expect(emailInput.value).toBe('');

    fireEvent.keyDown(passwordInput, { key: ' ', code: 'Space' });
    expect(passwordInput.value).toBe('');
  });
});
