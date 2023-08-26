import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

describe('Header component', () => {
  it('renders logo and navigation buttons', () => {
    render(
      <BrowserRouter>
        <Header authh={false} logOut={(): void => {}} />
      </BrowserRouter>,
    );

    const logo = screen.getByAltText('logo');
    const homeButton = screen.getByText('home');
    const catalogButton = screen.getByText('catalog');
    const aboutUsButton = screen.getByText('about us');

    expect(logo).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
    expect(catalogButton).toBeInTheDocument();
    expect(aboutUsButton).toBeInTheDocument();
  });

  it('toggles the menu when burger button is clicked', () => {
    render(
      <BrowserRouter>
        <Header authh={false} logOut={(): void => {}} />
      </BrowserRouter>,
    );

    const burgerButton = document.querySelector('.header-burger');
    if (burgerButton) {
      expect(burgerButton).not.toHaveClass('active');

      fireEvent.click(burgerButton);

      expect(burgerButton).toHaveClass('active');

      fireEvent.click(burgerButton);

      expect(burgerButton).not.toHaveClass('active');
    }
  });
});
