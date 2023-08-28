import React from 'react';
import { CustomersId } from '@src/interfaces/Customer';
import BillingAddress from '@src/components/BillingAddress/BillingAddress';
import ShippingAddress from '@src/components/ShippingAddress/ShippingAddress';
import styles from './Profile.module.scss';

function Profile({ user }: { user: CustomersId }): JSX.Element {
  const defaultBillingAddressId = user.billingAddressIds[0];
  const defaultBillingAddress = user.addresses.find((item) => item.id === defaultBillingAddressId);
  const defaultShippingAddressId = user.shippingAddressIds[0];
  const defaultShippingAddress = user.addresses.find((item) => item.id === defaultShippingAddressId);
  const dateBirth = new Date(user.dateOfBirth);
  const date = String(dateBirth.getDay()).length === 1 ? `0${dateBirth.getDay()}` : `${dateBirth.getDay()}`;
  const month = String(dateBirth.getMonth()).length === 1 ? `0${dateBirth.getMonth()}` : `${dateBirth.getMonth()}`;
  const resultDateBirth = `${date}.${month}.${dateBirth.getFullYear()}`;

  return (
    <div className={styles.dashboard__description}>
      <h3 className={styles.account__information_title}>Account Information</h3>
      <div className={styles.account__information_block}>
        <div className={styles.account__information_blockTitle}>Contact Information</div>
        <div className={styles.account__information_name}>{`${user.firstName} ${user.lastName}`}</div>
        <div className={styles.account__information_email}>{resultDateBirth}</div>
        <div className={styles.account__information_email}>{user.email}</div>
      </div>
      <h3 className={styles.account__information_title}>Address Book</h3>
      <div className={styles.account__information_blockAdress}>
        <div className={styles.account__information_billing}>Default Billing Address</div>
        <div className={styles.account__information_adress}>
          {defaultBillingAddress ? (
            <BillingAddress
              city={defaultBillingAddress.city}
              postalCode={defaultBillingAddress.postalCode}
              country={defaultBillingAddress.country}
              name={`${user.firstName} ${user.lastName}`}
              streetName={defaultBillingAddress.streetName}
            />
          ) : (
            <span>You have not set a default billing address.</span>
          )}
        </div>
      </div>
      <div className={styles.account__information_blockAdress}>
        <div className={styles.account__information_billing}>Default Shipping Address</div>
        <div className={styles.account__information_adress}>
          {defaultShippingAddress ? (
            <ShippingAddress
              city={defaultShippingAddress.city}
              postalCode={defaultShippingAddress.postalCode}
              country={defaultShippingAddress.country}
              name={`${user.firstName} ${user.lastName}`}
              streetName={defaultShippingAddress.streetName}
            />
          ) : (
            <span>You have not set a default shipping address.</span>
          )}
        </div>
      </div>
    </div>
  );
}
export default Profile;
