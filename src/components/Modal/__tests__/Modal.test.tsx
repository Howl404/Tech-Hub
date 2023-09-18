import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Modal, { ModalType } from '../Modal';
import '@testing-library/jest-dom';

const mockSetSelectedData = jest.fn();
const mockSetUserAccount = jest.fn();
const mockSendData = jest.fn();

jest.mock('@src/services/AuthService/AuthService', () => ({
  sendData: (): void => mockSendData(),
}));

const initialProps: ModalType = {
  active: true,
  userId: '1',
  city: '',
  postalCode: '',
  country: '',
  streetName: '',
  setActive: jest.fn(),
  setSelectedData: mockSetSelectedData,
  setUserAccount: mockSetUserAccount,
  userAccount: {
    email: '',
    firstName: '',
    id: '',
    lastName: '',
    billingAddressIds: [''],
    shippingAddressIds: [''],
    defaultBillingAddressId: '',
    defaultShippingAddressId: '',
    addresses: [],
    dateOfBirth: '',
  },
  selectedData: {
    city: '',
    postalCode: '',
    country: '',
    streetName: '',
    addressId: '1',
  },
};

describe('Modal component', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Modal
        active={initialProps.active}
        userId={initialProps.userId}
        city={initialProps.city}
        postalCode={initialProps.postalCode}
        country={initialProps.country}
        streetName={initialProps.streetName}
        setActive={initialProps.setActive}
        setSelectedData={initialProps.setSelectedData}
        setUserAccount={initialProps.setUserAccount}
        userAccount={initialProps.userAccount}
        selectedData={initialProps.selectedData}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle input change', async () => {
    render(
      <Modal
        active={initialProps.active}
        userId={initialProps.userId}
        city={initialProps.city}
        postalCode={initialProps.postalCode}
        country={initialProps.country}
        streetName={initialProps.streetName}
        setActive={initialProps.setActive}
        setSelectedData={initialProps.setSelectedData}
        setUserAccount={initialProps.setUserAccount}
        userAccount={initialProps.userAccount}
        selectedData={initialProps.selectedData}
      />,
    );
    const cityInput = screen.getByLabelText(/City/i);
    fireEvent.change(cityInput, { target: { value: 'New York' } });
    await waitFor(() => {
      expect(mockSetSelectedData).toHaveBeenCalledWith(
        expect.objectContaining({
          city: 'New York',
        }),
      );
    });
  });

  it('should handle country select change', async () => {
    render(
      <Modal
        active={initialProps.active}
        userId={initialProps.userId}
        city={initialProps.city}
        postalCode={initialProps.postalCode}
        country={initialProps.country}
        streetName={initialProps.streetName}
        setActive={initialProps.setActive}
        setSelectedData={initialProps.setSelectedData}
        setUserAccount={initialProps.setUserAccount}
        userAccount={initialProps.userAccount}
        selectedData={initialProps.selectedData}
      />,
    );
    const countrySelect = screen.getByTestId('country');
    fireEvent.change(countrySelect, { target: { value: 'US' } });
    await waitFor(() => {
      expect(mockSetSelectedData).toHaveBeenCalledWith(
        expect.objectContaining({
          country: 'US',
        }),
      );
    });
  });
});
