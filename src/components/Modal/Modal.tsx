/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import './Modal.scss';
import { FaRegSave } from 'react-icons/fa';
import { PostalCodePattern } from '@src/interfaces/Register';
import { sendData } from '@src/services/AuthService/AuthService';
import FormInput from '../FormInput/FormInput';

interface ModalType {
  active: boolean;
  userId: string;
  setActive: (logic: boolean) => void;
  city: string;
  postalCode: string;
  country: string;
  streetName: string;
  addressId: string;
  selectedData: {
    city: string;
    postalCode: string;
    country: string;
    streetName: string;
  };
  setSelectedData: React.Dispatch<
    React.SetStateAction<{
      city: string;
      postalCode: string;
      country: string;
      streetName: string;
    }>
  >;
}

const postalCodePattern: PostalCodePattern = {
  US: '\\d{5}-\\d{4}|\\d{5}',
  RU: '\\d{6}',
  GB: '[A-Za-z]{1,2}\\d{1,2}[A-Za-z]?\\s?\\d[A-Za-z]{2}',
  DE: '\\d{5}',
  FR: '\\d{5}',
};

function Modal({
  active,
  setActive,
  city,
  userId,
  postalCode,
  country,
  streetName,
  selectedData,
  setSelectedData,
  addressId,
}: ModalType): JSX.Element {
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target;
    setSelectedData({ ...selectedData, [id]: value });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target;
    setSelectedData({ ...selectedData, [id]: value });
  };

  return (
    <div className={active ? 'modal active__modal' : 'modal'} onClick={(): void => setActive(false)}>
      <div
        className={active ? 'modal__content active__modal' : 'modal__content'}
        onClick={(e): void => e.stopPropagation()}
      >
        <div className="form-input">
          <label htmlFor="country">
            Country
            <select id="country" name="country" value={country} onChange={handleCountryChange}>
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
          id="city"
          type="text"
          pattern="[A-Za-z]+"
          title="Must contain only letters"
          value={city}
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
        />
        <button
          type="button"
          className="btn__save"
          onClick={(): Promise<void> =>
            sendData(selectedData, userId, addressId).then((item) => {
              const date = item.addresses.filter((adress) => adress.id === addressId)[0];
              setSelectedData({
                city: date.city,
                postalCode: date.postalCode,
                country: date.country,
                streetName: date.streetName,
              });
              setActive(false);
            })
          }
        >
          save <FaRegSave />
        </button>
      </div>
    </div>
  );
}

export default Modal;
