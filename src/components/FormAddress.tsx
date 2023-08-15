import React from 'react';
import FormInput from './FormInput';
import { PostalCodePattern, AddressData } from '../interfaces/register_interfaces';

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
  onInputChange: (arddress: Partial<AddressData>) => void;
}): JSX.Element {
  const { prefix, city, postalCode, streetName, country, disabled, onInputChange } = props;

  const handleCB = (id: string, value: string): void => {
    const idWithoutPrefix = id.replace(prefix, '');
    onInputChange({ [idWithoutPrefix]: value });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target;
    handleCB(id, value);

    // const { value } = event.target;
    // let { id } = event.target;
    // id = id.replace(prefix, '');
    // onInputChange({ [id]: value });
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target;
    handleCB(id, value);

    // const { value } = event.target;
    // let { id } = event.target;
    // id = id.replace(prefix, '');
    // onInputChange({ [id]: value });
  };

  return (
    <>
      <div className="form-input">
        <label htmlFor="country">
          Country:
          <select name="country" value={country} disabled={disabled} id="country" onChange={handleCountryChange}>
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
        id="postalCode"
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
        id="streetName"
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
