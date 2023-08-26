import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../LoginPage';
import '@testing-library/jest-dom';

describe('LoginPage', () => {
  test('renders LoginForm component', () => {
    const mockCheckLogIn = jest.fn();

    render(
      <Router>
        <LoginPage checkLogIn={mockCheckLogIn} />
      </Router>,
    );

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
  });
});
