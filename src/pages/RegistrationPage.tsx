// pages/RegistrationPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { PostalCodePattern, RegistrationFormData } from '../interfaces/register_interfaces';

const postalCodePattern: PostalCodePattern = {
  USA: '\\d{5}-\\d{4}|\\d{5}',
  RU: '\\d{6}',
  GB: '[A-Za-z]{1,2}\\d{1,2}[A-Za-z]?\\s?\\d[A-Za-z]{2}',
  DE: '\\d{5}',
  FR: '\\d{5}',
};

function RegistrationPage(): JSX.Element {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [isFormComplete, setIsFormComplete] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  useEffect(() => {
    if (Object.values(formData).every((value) => value !== '')) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [formData]);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    console.log('submit');
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
        />
        <FormInput
          label="Password"
          errorMessage="Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number"
          onChange={handleInputChange}
          id="password"
          type="password"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
          title="Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number"
        />
        <FormInput
          label="First name"
          errorMessage="Must contain at least one character and no special characters or numbers"
          onChange={handleInputChange}
          id="firstName"
          type="text"
          pattern="[A-Za-z]+"
          title="Must contain at least one character and no special characters or numbers"
        />
        <FormInput
          label="Last name"
          errorMessage="Must contain at least one character and no special characters or numbers"
          onChange={handleInputChange}
          id="lastName"
          type="text"
          pattern="[A-Za-z]+"
          title="Must contain at least one character and no special characters or numbers"
        />
        <FormInput
          label="Date of birth"
          errorMessage="You need to be older than 13 years old"
          onChange={handleInputChange}
          id="dob"
          type="date"
          pattern=".*"
          title="You need to be older than 13 years old"
          max="2010-01-01"
        />
        <div className="form-input">
          <label htmlFor="country">
            Country:
            <select name="country" id="country" defaultValue="" onChange={handleCountryChange}>
              <option value="" label="Select a country ... ">
                Select a country ...
              </option>
              <option value="USA" label="United States">
                United States
              </option>
              <option value="RU" label="Russia">
                Russia
              </option>
              <option value="GB" label="United Kingdom">
                United Kingdom
              </option>
              <option value="DE" label="Germany">
                Germany
              </option>
              <option value="FR" label="France">
                France
              </option>
            </select>
          </label>
        </div>
        <FormInput
          label="City"
          errorMessage="City is not valid"
          onChange={handleInputChange}
          id="city"
          type="text"
          pattern="[A-Za-z]+"
          title="Must contain only letters"
        />
        <FormInput
          label="Postal Code"
          errorMessage="Invalid Postal Code"
          onChange={handleInputChange}
          id="postalCode"
          type="text"
          pattern={postalCodePattern[formData.country] || '.*'}
          title="Must be a valid postal code of a selected country"
        />
        <FormInput
          label="Street"
          errorMessage="Less than 1 character"
          onChange={handleInputChange}
          id="street"
          type="text"
          pattern=".*"
          title="Must contain more than 1 character"
        />
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
