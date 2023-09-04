import React, { useEffect, useState } from 'react';
import ShippingAddress from '@src/components/ShippingAddress/ShippingAddress';
import BillingAddress from '@src/components/BillingAddress/BillingAddress';
import { CustomersId, Address } from '@src/interfaces/Customer';
import { FaCheck, FaEdit, FaAddressBook, FaRegSave } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import Modal from '@src/components/Modal/Modal';
import {
  // getCustomerId,
  requestAddBillingAddress,
  requestAddShippingAddress,
  requestDefaultBillingAddress,
  requestDefaultShippingAddress,
  requestIdBillingAddress,
  requestIdShippingAddress,
  requestRemoveAddress,
} from '@src/services/AuthService/AuthService';
import FormInput from '@src/components/FormInput/FormInput';
import { PostalCodePattern } from '@src/interfaces/Register';
import styles from './AccountAddress.module.scss';

const postalCodePattern: PostalCodePattern = {
  US: '\\d{5}-\\d{4}|\\d{5}',
  RU: '\\d{6}',
  GB: '[A-Za-z]{1,2}\\d{1,2}[A-Za-z]?\\s?\\d[A-Za-z]{2}',
  DE: '\\d{5}',
  FR: '\\d{5}',
};

function AccountAddress({ user, setUser }: { user: CustomersId; setUser: (value: CustomersId) => void }): JSX.Element {
  const [isFormComplete, setIsFormComplete] = useState(false);

  const [modalActive, setModalActive] = useState(false);
  const [modalActiveNewAddress, setModalActiveNewAddress] = useState(false);
  const [modalActiveNewAddressBilling, setModalActiveNewAddressBilling] = useState(false);

  const [newAddress, setNewAddress] = useState<Address>({
    city: '',
    postalCode: '',
    country: 'en',
    streetName: '',
    id: '',
  });
  const [selectedData, setSelectedData] = useState({
    city: '',
    postalCode: '',
    country: '',
    streetName: '',
    addressId: '',
  });
  const [addressesAll, setAddressesAll] = useState<Address[]>([]);
  const [checkBoxBilling, setCheckBoxBilling] = useState(false);

  const { defaultBillingAddressId, defaultShippingAddressId, billingAddressIds, shippingAddressIds, addresses } = user;

  const [billingAddress, setBillingAddress] = useState<Address[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address[]>([]);

  useEffect(() => {
    if (
      [newAddress.streetName, newAddress.postalCode, newAddress.city, newAddress.country].every(
        (value) => value !== '',
      ) === true
    ) {
      setIsFormComplete(true);
    } else setIsFormComplete(false);
  }, [newAddress.streetName, newAddress.postalCode, newAddress.city, newAddress.country]);

  function modalWindow(
    modalActiveM: boolean,
    setModalActiveM: React.Dispatch<React.SetStateAction<boolean>>,
    requestAddress: (streetName: string, postalCode: string, city: string, country: string) => Promise<CustomersId>,
    requestIdAddress: (addressId: string) => Promise<CustomersId>,
    requestDefaultAddress: (addressId: string) => Promise<CustomersId>,
  ): JSX.Element {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={modalActiveM ? 'modal active__modal information' : 'modal'}
        onClick={(): void => setModalActiveM(false)}
      >
        <form
          className={modalActiveM ? 'modal__content active__modal' : 'modal__content'}
          onClick={(e): void => e.stopPropagation()}
          onSubmit={(e): void => {
            e.preventDefault();
            requestAddress(newAddress.streetName, newAddress.postalCode, newAddress.city, newAddress.country).then(
              (item) => {
                const addId = item.addresses[item.addresses.length - 1].id;
                requestIdAddress(addId).then(() => {
                  if (checkBoxBilling) {
                    requestDefaultAddress(addId);
                    setCheckBoxBilling(false);
                    setUser({ ...user, billingAddressIds: [addId], addresses: item.addresses });
                    setAddressesAll(item.addresses);
                  } else {
                    setUser({ ...user, addresses: item.addresses });
                    setAddressesAll(item.addresses);
                  }
                  setModalActiveM(false);
                });
              },
            );
          }}
        >
          <div className={styles.form_default_address}>
            <p>Set default address</p>
            <input
              type="checkbox"
              onChange={(e): void => {
                setCheckBoxBilling(e.target.checked);
              }}
            />
          </div>
          <div className="form-input">
            <label htmlFor="countryBill">
              Country
              <select
                id="countryBill"
                name="countryBill"
                value={newAddress.country}
                onChange={(e): void => setNewAddress({ ...newAddress, country: e.target.value })}
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
            onChange={(e): void => setNewAddress({ ...newAddress, city: e.target.value })}
            id=""
            type="text"
            pattern="[A-Za-z]+"
            title="Must contain only letters"
            value={newAddress.city}
          />
          <FormInput
            label="Postal Code"
            errorMessage="Invalid Postal Code"
            onChange={(e): void => setNewAddress({ ...newAddress, postalCode: e.target.value })}
            id=""
            type="text"
            pattern={postalCodePattern[newAddress.country] || '.*'}
            title="Must be a valid postal code of a selected country"
            value={newAddress.postalCode}
          />
          <FormInput
            label="Street name"
            errorMessage="Less than 1 character"
            onChange={(e): void => setNewAddress({ ...newAddress, streetName: e.target.value })}
            id=""
            type="text"
            pattern=".*"
            title="Must contain more than 1 character"
            value={newAddress.streetName}
          />
          <button type="submit" className="btn__save" disabled={!isFormComplete}>
            add new address <FaRegSave />
          </button>{' '}
        </form>
      </div>
    );
  }

  // useEffect(() => {
  //   getCustomerId().then((item) => setUser(item));
  // }, []);

  useEffect(() => {
    // getCustomerId().then((item) => setUser(item));
    const bill =
      addressesAll.length === 0
        ? addresses.filter((item) => billingAddressIds.includes(item.id))
        : addressesAll.filter((item) => billingAddressIds.includes(item.id));
    setBillingAddress(bill);
    const ship =
      addressesAll.length === 0
        ? addresses.filter((item) => shippingAddressIds.includes(item.id))
        : addressesAll.filter((item) => shippingAddressIds.includes(item.id));
    setShippingAddress(ship);
  }, [
    addresses,
    billingAddressIds,
    shippingAddressIds,
    addressesAll,
    selectedData,
    modalActiveNewAddress,
    modalActiveNewAddressBilling,
  ]);

  const billingAddressArr = billingAddress.map(({ id, city, postalCode, country, streetName }) => {
    const isDefault = id === defaultBillingAddressId;
    return (
      <div className={styles.block__address} key={id}>
        {isDefault && <FaCheck className={styles.btn__edit} title="Default billing address" />}
        <FaEdit
          title="Edit"
          className={styles.btn__edit}
          onClick={(): void => {
            setModalActive(true);
            setSelectedData({ city, postalCode, country, streetName, addressId: id });
          }}
        />
        <AiOutlineDelete
          title="remove address"
          className={styles.btn__edit}
          onClick={(): void => {
            requestRemoveAddress(id).then((item) => {
              setAddressesAll(item.addresses);
              setUser({ ...user, addresses: item.addresses });
            });
          }}
        />
        <BillingAddress
          city={city}
          postalCode={postalCode}
          country={country}
          name={`${user.firstName} ${user.lastName}`}
          streetName={streetName}
        />
      </div>
    );
  });

  const shippingAddressArr = shippingAddress.map(({ id, city, postalCode, country, streetName }) => {
    const isDefault = id === defaultShippingAddressId;
    return (
      <div className={styles.block__address} key={id}>
        {isDefault && <FaCheck className={styles.btn__edit} title="Default shipping address" />}

        <FaEdit
          title="Edit"
          className={styles.btn__edit}
          onClick={(): void => {
            setModalActive(true);
            setSelectedData({ city, postalCode, country, streetName, addressId: id });
          }}
        />
        <AiOutlineDelete
          title="remove address"
          className={styles.btn__edit}
          onClick={(): void => {
            requestRemoveAddress(id).then((item) => {
              setAddressesAll(item.addresses);
              setUser({ ...user, addresses: item.addresses });
            });
          }}
        />
        <ShippingAddress
          city={city}
          postalCode={postalCode}
          country={country}
          name={`${user.firstName} ${user.lastName}`}
          streetName={streetName}
        />
      </div>
    );
  });

  return (
    <div className={styles.dashboard__description}>
      <h3 className={styles.account__information_title}>Edit Address Information</h3>

      <div className={styles.account__information_block}>
        <div className={styles.account__information_blockTitle}>
          Billing Adresses{' '}
          <button
            title="add new billing address"
            type="button"
            onClick={(): void => {
              setModalActiveNewAddressBilling(true);
            }}
          >
            +
            <FaAddressBook />
          </button>
          {modalWindow(
            modalActiveNewAddressBilling,
            setModalActiveNewAddressBilling,
            requestAddBillingAddress,
            requestIdBillingAddress,
            requestDefaultBillingAddress,
          )}
        </div>
        {billingAddress ? billingAddressArr : <span>You have not set a default billing address.</span>}

        <div className={styles.account__information_blockTitle}>
          Shipping Adresses{' '}
          <button title="add new shipping address" type="button" onClick={(): void => setModalActiveNewAddress(true)}>
            +<FaAddressBook />
          </button>
          {modalWindow(
            modalActiveNewAddress,
            setModalActiveNewAddress,
            requestAddShippingAddress,
            requestIdShippingAddress,
            requestDefaultShippingAddress,
          )}
        </div>
        {shippingAddress ? shippingAddressArr : <span>You have not set a default shipping address.</span>}
      </div>
      <Modal
        active={modalActive}
        setActive={setModalActive}
        setSelectedData={setSelectedData}
        selectedData={selectedData}
        city={selectedData.city}
        postalCode={selectedData.postalCode}
        country={selectedData.country}
        streetName={selectedData.streetName}
        userId={user.id}
        setAddressesAll={setAddressesAll}
      />
    </div>
  );
}

export default AccountAddress;
