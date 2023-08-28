import React from 'react';
import ShippingAddress from '@src/components/ShippingAddress/ShippingAddress';
import BillingAddress from '@src/components/BillingAddress/BillingAddress';
import { CustomersId } from '@src/interfaces/Customer';
import { FaCheck, FaEdit } from 'react-icons/fa';
import styles from './AccountAddress.module.scss';

function AccountAddress({ user }: { user: CustomersId }): JSX.Element {
  const { defaultBillingAddressId, defaultShippingAddressId, billingAddressIds, shippingAddressIds, addresses } = user;

  const billingAddress = addresses.filter((item) => billingAddressIds.includes(item.id));
  const shippingAddress = addresses.filter((item) => shippingAddressIds.includes(item.id));

  const billingAddressArr = billingAddress.map(({ id, city, postalCode, country, streetName }) => {
    const isDefault = id === defaultBillingAddressId;
    return (
      <div className={styles.block__address} key={id}>
        {isDefault && <FaCheck className={styles.btn__edit} title="Default billing address" />}
        <FaEdit title="Edit" className={styles.btn__edit} onClick={(): void => {}} />
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
        <FaEdit title="Edit" className={styles.btn__edit} onClick={(): void => {}} />
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
    </div>
  );
}

export default AccountAddress;
