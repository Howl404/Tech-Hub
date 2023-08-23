import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ButtonsAccount from '../ButtonsAccount';

test('renders login and register buttons with correct links', () => {
  render(
    <Router>
      <ButtonsAccount />
    </Router>,
  );

  const loginButton = screen.getByRole('link', { name: /LOG IN/i });
  expect(loginButton).toHaveAttribute('href', '/login');

  const registerButton = screen.getByRole('link', { name: /REGISTER/i });
  expect(registerButton).toHaveAttribute('href', '/register');
});
