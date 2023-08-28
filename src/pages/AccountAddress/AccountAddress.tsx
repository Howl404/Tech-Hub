import React, { useState } from 'react';
import ShippingAddress from '@src/components/ShippingAddress/ShippingAddress';
import BillingAddress from '@src/components/BillingAddress/BillingAddress';
import { CustomersId } from '@src/interfaces/Customer';
import { FaCheck, FaEdit } from 'react-icons/fa';
import Modal from '@src/components/Modal/Modal';
import styles from './AccountAddress.module.scss';

function AccountAddress({ user }: { user: CustomersId }): JSX.Element {
  const [modalActive, setModalActive] = useState(false);
  const [selectedData, setSelectedData] = useState({
    city: '',
    postalCode: '',
    country: '',
    streetName: '',
  });
  const [addressId, setAddressId] = useState('');
  const { defaultBillingAddressId, defaultShippingAddressId, billingAddressIds, shippingAddressIds, addresses } = user;
  console.log(user);
  const billingAddress = addresses.filter((item) => billingAddressIds.includes(item.id));
  const shippingAddress = addresses.filter((item) => shippingAddressIds.includes(item.id));

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
            setSelectedData({ city, postalCode, country, streetName });
            setAddressId(id);
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
            setSelectedData({ city, postalCode, country, streetName });
            setAddressId(id);
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
        <div className={styles.account__information_blockTitle}>Billing Adresses</div>
        {billingAddress ? billingAddressArr : <span>You have not set a default billing address.</span>}
        <div className={styles.account__information_blockTitle}>Shipping Adresses</div>
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
        addressId={addressId}
      />
    </div>
  );
}

export default AccountAddress;
