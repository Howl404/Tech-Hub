// pages/RegistrationPage.tsx
import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import { RegistrationFormData } from '../interfaces/register_interfaces';

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    console.log('submit');
  };

  return (
    <div>
      <h1>Registration Page</h1>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="email"
          errorMessage="Email is incorrect"
          onChange={handleInputChange}
          id="email"
          type="text"
          pattern="[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
        />
        <button type="submit" id="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default RegistrationPage;
