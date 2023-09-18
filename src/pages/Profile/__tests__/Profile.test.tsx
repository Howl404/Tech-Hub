import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { getCustomerId } from '@src/services/AuthService/AuthService';
import Profile from '../Profile';

jest.mock('@src/services/AuthService/AuthService', () => ({
  getCustomerId: jest.fn(),
}));

describe('Profile Component', () => {
  const mockUser = {
    email: 'john_doe@mail.com',
    firstName: 'John',
    lastName: 'Doe',
    billingAddressIds: [],
    shippingAddressIds: [],
    dateOfBirth: '1990-01-01',
    id: '123',
    defaultShippingAddressId: '',
    defaultBillingAddressId: '',
    addresses: [
      {
        city: 'Los Angeles',
        country: 'USA',
        id: '234',
        postalCode: '90001',
        streetName: '123 Main St',
      },
    ],
  };

  beforeEach(() => {
    (getCustomerId as jest.Mock).mockResolvedValue(mockUser);
  });

  it('renders the correct user data', async () => {
    render(<Profile />);

    await screen.findByText('John Doe');

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('01.01.1990')).toBeInTheDocument();
    expect(screen.getByText('john_doe@mail.com')).toBeInTheDocument();
  });

  //   it('renders "You have not set a default billing address." when no default billing address is set', async () => {
  //     render(<Profile />);

  //     // Wait for the useEffect to resolve
  //     await screen.findByText('You have not set a default billing address.');

  //     expect(screen.getByText('You have not set a default billing address.')).toBeInTheDocument();
  //   });

  //   it('renders "You have not set a default shipping address." when no default shipping address is set', async () => {
  //     render(<Profile />);

  //     // Wait for the useEffect to resolve
  //     await screen.findByText('You have not set a default shipping address.');

  //     expect(screen.getByText('You have not set a default shipping address.')).toBeInTheDocument();
  //   });

  // Add other tests, checking rendering of default shipping/billing addresses if set, and other possible scenarios.
});
