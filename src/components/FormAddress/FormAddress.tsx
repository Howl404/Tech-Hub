import React from 'react';
import FormInput from '@components/FormInput/FormInput';
import { PostalCodePattern } from '@interfaces/Register';
import { BaseAddress } from '@interfaces/Customer';

const postalCodePattern: PostalCodePattern = {
  US: '\\d{5}-\\d{4}|\\d{5}',
  RU: '\\d{6}',
  GB: '[A-Za-z]{1,2}\\d{1,2}[A-Za-z]?\\s?\\d[A-Za-z]{2}',
  DE: '\\d{5}',
  FR: '\\d{5}',
};

function FormAddress(props: {
  prefix: string;
  city: string;
  postalCode: string;
  streetName: string;
  country: string;
  disabled?: boolean;
  onInputChange: (address: Partial<BaseAddress>) => void;
}): JSX.Element {
  const { prefix, city, postalCode, streetName, country, disabled, onInputChange } = props;

  const handleCB = (id: string, value: string): void => {
    const idWithoutPrefix = id.replace(prefix, '');
    onInputChange({ [idWithoutPrefix]: value });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target;
    handleCB(id, value);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target;
    handleCB(id, value);
  };

  return (
    <>
      <div className="form-input">
        <label htmlFor="country">
          Country
          <select
            id={`${prefix}country`}
            name="country"
            value={country}
            disabled={disabled}
            onChange={handleCountryChange}
          >
            <option value="" label="Select a country ... ">
              Select a country ...
            </option>
            <option value="US" label="United States">
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
        id={`${prefix}city`}
        type="text"
        pattern="[A-Za-z]+"
        title="Must contain only letters"
        value={city}
        disabled={disabled}
      />
      <FormInput
        label="Postal Code"
        errorMessage="Invalid Postal Code"
        onChange={handleInputChange}
        id={`${prefix}postalCode`}
        type="text"
        pattern={postalCodePattern[country] || '.*'}
        title="Must be a valid postal code of a selected country"
        value={postalCode}
        disabled={disabled}
      />
      <FormInput
        label="Street name"
        errorMessage="Less than 1 character"
        onChange={handleInputChange}
        id={`${prefix}streetName`}
        type="text"
        pattern=".*"
        title="Must contain more than 1 character"
        value={streetName}
        disabled={disabled}
      />
    </>
  );
}

FormAddress.defaultProps = {
  disabled: false,
};

export default FormAddress;
