import React from 'react';
import { RenderResult, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Breadcrumbs from '../Breadcrumbs';

function renderBreadcrumbs(initialPathname: string): RenderResult {
  return render(
    <MemoryRouter initialEntries={[initialPathname]}>
      <Breadcrumbs />
    </MemoryRouter>,
  );
}

describe('Breadcrumbs Component', () => {
  test('renders "Home" link', () => {
    renderBreadcrumbs('/');
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
  });

  test('renders the correct breadcrumb for "Profile"', () => {
    renderBreadcrumbs('/Profile');
    const profileText = screen.getByText('Profile');
    expect(profileText).toBeInTheDocument();
  });

  test('renders the correct breadcrumb for "Information"', () => {
    renderBreadcrumbs('/Information');
    const informationText = screen.getByText('Information');
    expect(informationText).toBeInTheDocument();
  });

  test('renders the correct breadcrumb for "Address"', () => {
    renderBreadcrumbs('/Address');
    const addressText = screen.getByText('Address');
    expect(addressText).toBeInTheDocument();
  });

  test('renders the correct breadcrumb for "Order"', () => {
    renderBreadcrumbs('/Order');
    const orderText = screen.getByText('Order');
    expect(orderText).toBeInTheDocument();
  });

  test('renders the correct breadcrumb for "Basket"', () => {
    renderBreadcrumbs('/basket');
    const basketText = screen.getByText('Basket');
    expect(basketText).toBeInTheDocument();
  });
});
