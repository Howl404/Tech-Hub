// pages/RegistrationPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { AddressData, RegistrationFormData } from '../interfaces/register_interfaces';
import { getAnonymousAccessToken, registerUser } from '../services/AuthService';
import FormAddress from '../components/FormAddress';
import './RegistrationPage.scss';
import { CustomerDraft } from '../interfaces/Customer';

function RegistrationPage(): JSX.Element {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    defaultShippingAddress: false,
    defaultBillingAddress: false,
    sameBillingShipping: false,
    billingAddress: {
      city: '',
      postalCode: '',
      streetName: '',
      country: '',
    },
    shippingAddress: { city: '', postalCode: '', streetName: '', country: '' },
  });

  const navigate = useNavigate();

  const [isFormComplete, setIsFormComplete] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, checked } = event.target as HTMLInputElement;
    if ((id !== 'sameBillingShipping' && formData.sameBillingShipping) || (id === 'sameBillingShipping' && checked)) {
      setFormData({ ...formData, [id]: checked, billingAddress: formData.shippingAddress });

      return;
    }
    setFormData({ ...formData, [id]: checked });
  };

  const handleBillingAddressChange = (address: Partial<AddressData>): void => {
    const newAddress = { ...formData.billingAddress, ...address };
    setFormData({ ...formData, billingAddress: newAddress });
  };

  const handleShippingAddressChange = (address: Partial<AddressData>): void => {
    const newAddress = { ...formData.shippingAddress, ...address };
    setFormData({ ...formData, shippingAddress: newAddress });
  };

  useEffect(() => {
    if (
      Object.values(formData).every((value) => {
        if (typeof value !== 'object') {
          return value !== '';
        }
        return Object.values(value).every((objValue) => objValue !== '');
      })
    ) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const response = await getAnonymousAccessToken();

    if (response?.accessToken) {
      localStorage.setItem('alchemists-token', response.accessToken);
    }

    const {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      shippingAddress,
      billingAddress,
      defaultShippingAddress,
      defaultBillingAddress,
    } = formData;

    const registerData: CustomerDraft = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses: [shippingAddress, billingAddress],
      shippingAddresses: [0],
      billingAddresses: [1],
    };

    if (defaultShippingAddress) {
      registerData.defaultShippingAddress = 0;
    }
    if (defaultBillingAddress) {
      registerData.defaultBillingAddress = 1;
    }

    const token = localStorage.getItem('alchemists-token');
    if (token) {
      const result = await registerUser(registerData, token);
      if (result !== false) {
        // TODO: set cookie token

        navigate('/');
      }
    }
  };

  return (
    <div>
      <h1>Registration Page</h1>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          errorMessage="Invalid email"
          onChange={handleInputChange}
          id="email"
          type="text"
          pattern="[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
          title="Must contain a valid email"
          value={formData.email}
        />
        <FormInput
          label="Password"
          errorMessage="Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number"
          onChange={handleInputChange}
          id="password"
          type="password"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
          title="Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number"
          value={formData.password}
        />
        <FormInput
          label="First name"
          errorMessage="Must contain at least one character and no special characters or numbers"
          onChange={handleInputChange}
          id="firstName"
          type="text"
          pattern="[A-Za-z]+"
          title="Must contain at least one character and no special characters or numbers"
          value={formData.firstName}
        />
        <FormInput
          label="Last name"
          errorMessage="Must contain at least one character and no special characters or numbers"
          onChange={handleInputChange}
          id="lastName"
          type="text"
          pattern="[A-Za-z]+"
          title="Must contain at least one character and no special characters or numbers"
          value={formData.lastName}
        />
        <FormInput
          label="Date of birth"
          errorMessage="You need to be older than 13 years old"
          onChange={handleInputChange}
          id="dateOfBirth"
          type="date"
          pattern=".*"
          title="You need to be older than 13 years old"
          max="2010-01-01"
          value={formData.dateOfBirth}
        />
        <div className="form-address">
          <div className="form-shipping-address">
            <label htmlFor="defaultShippingAddress">
              <input id="defaultShippingAddress" onChange={handleCheckboxChange} type="checkbox" />
              Default shipping address
            </label>

            <FormAddress
              prefix="shipping"
              city={formData.shippingAddress.city}
              country={formData.shippingAddress.country}
              postalCode={formData.shippingAddress.postalCode}
              streetName={formData.shippingAddress.streetName}
              onInputChange={handleShippingAddressChange}
            />
            <label htmlFor="sameBillingShipping">
              <input id="sameBillingShipping" onChange={handleCheckboxChange} type="checkbox" />
              Billing address same shipping address
            </label>
          </div>

          <div className="form-billing-address">
            <label htmlFor="defaultBillingAddress">
              <input id="defaultBillingAddress" onChange={handleCheckboxChange} type="checkbox" />
              Default billing address
            </label>

            {formData.sameBillingShipping ? (
              <FormAddress
                prefix="billing"
                city={formData.shippingAddress.city}
                country={formData.shippingAddress.country}
                postalCode={formData.shippingAddress.postalCode}
                streetName={formData.shippingAddress.streetName}
                disabled
                onInputChange={handleBillingAddressChange}
              />
            ) : (
              <FormAddress
                prefix="billing"
                city={formData.billingAddress.city}
                country={formData.billingAddress.country}
                postalCode={formData.billingAddress.postalCode}
                streetName={formData.billingAddress.streetName}
                onInputChange={handleBillingAddressChange}
              />
            )}
          </div>
        </div>

        <div className="buttons-container">
          <button type="submit" id="submit" disabled={!isFormComplete}>
            Register
          </button>
          <Link to="/login">
            <button type="button">Log in</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegistrationPage;
