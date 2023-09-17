import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BillingAddress from '../BillingAddress';

describe('BillingAddress component', () => {
  const mockAddressProps = {
    city: 'San Francisco',
    country: 'USA',
    postalCode: '94103',
    name: 'John Doe',
    streetName: '123 Main St',
  };

  it('renders the BillingAddress component correctly', () => {
    render(
      <BillingAddress
        city={mockAddressProps.city}
        country={mockAddressProps.country}
        postalCode={mockAddressProps.postalCode}
        name={mockAddressProps.name}
        streetName={mockAddressProps.streetName}
      />,
      { wrapper: BrowserRouter },
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('San Francisco')).toBeInTheDocument();
    expect(screen.getByText('94103')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('applies the correct CSS classes', () => {
    render(
      <BillingAddress
        city={mockAddressProps.city}
        country={mockAddressProps.country}
        postalCode={mockAddressProps.postalCode}
        name={mockAddressProps.name}
        streetName={mockAddressProps.streetName}
      />,
      { wrapper: BrowserRouter },
    );

    expect(screen.getByText('John Doe')).toHaveClass('name');
    expect(screen.getByText('123 Main St')).toHaveClass('adress');
    expect(screen.getByText('San Francisco')).toHaveClass('city');
    expect(screen.getByText('94103')).toHaveClass('postIndex');
    expect(screen.getByText('USA')).toHaveClass('country');
  });
});
