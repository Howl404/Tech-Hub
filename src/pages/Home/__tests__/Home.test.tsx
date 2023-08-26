import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import '@testing-library/jest-dom';

describe('Home Component', () => {
  it('renders properly', () => {
    const { getByText, container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    expect(getByText('Home')).toBeInTheDocument();
    expect(container.querySelector('.main-heading')).toBeInTheDocument();
    expect(container.querySelector('.wrapper-btn')).toBeInTheDocument();
  });

  it('navigates to /login and /register on button clicks', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    const loginButton = getByText('Login');
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(document.location.href).toContain('/login');

    const registerButton = getByText('Register');
    expect(registerButton).toBeInTheDocument();
    fireEvent.click(registerButton);
    expect(document.location.href).toContain('/register');
  });
});
