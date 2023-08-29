import React, { useEffect, useState } from 'react';
import ShippingAddress from '@src/components/ShippingAddress/ShippingAddress';
import BillingAddress from '@src/components/BillingAddress/BillingAddress';
import { CustomersId, Address } from '@src/interfaces/Customer';
import { FaCheck, FaEdit, FaAddressBook } from 'react-icons/fa';
import Modal from '@src/components/Modal/Modal';
import styles from './AccountAddress.module.scss';

function AccountAddress({ user }: { user: CustomersId }): JSX.Element {
  const [modalActive, setModalActive] = useState(false);
  const [selectedData, setSelectedData] = useState({
    city: '',
    postalCode: '',
    country: '',
    streetName: '',
    addressId: '',
  });
  const [addressesAll, setAddressesAll] = useState<Address[]>([]);

  const handleAddBillingAddress = (): void => {};
  const handleAddShippingAddress = (): void => {};

  const { defaultBillingAddressId, defaultShippingAddressId, billingAddressIds, shippingAddressIds, addresses } = user;

  const [billingAddress, setBillingAddress] = useState<Address[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address[]>([]);
  useEffect(() => {
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
  }, [addresses, billingAddressIds, shippingAddressIds, addressesAll]);

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
          <button title="add new billing address" type="button" onClick={handleAddBillingAddress}>
            +<FaAddressBook />
          </button>
        </div>
        {billingAddress ? billingAddressArr : <span>You have not set a default billing address.</span>}
        <div className={styles.account__information_blockTitle}>
          Shipping Adresses{' '}
          <button title="add new shipping address" type="button" onClick={handleAddShippingAddress}>
            +<FaAddressBook />
          </button>
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
