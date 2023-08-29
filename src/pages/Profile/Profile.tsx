import React, { useEffect, useState } from 'react';
import { CustomersId } from '@src/interfaces/Customer';
import BillingAddress from '@src/components/BillingAddress/BillingAddress';
import ShippingAddress from '@src/components/ShippingAddress/ShippingAddress';
import { getCustomerId } from '@src/services/AuthService/AuthService';
import styles from './Profile.module.scss';

function Profile(): JSX.Element {
  // { user }: { user: CustomersId }
  const [user, setUser] = useState<CustomersId>({
    email: '',
    firstName: '',
    lastName: '',
    billingAddressIds: [],
    shippingAddressIds: [],
    dateOfBirth: '',
    id: '',
    defaultShippingAddressId: '',
    defaultBillingAddressId: '',
    addresses: [
      {
        city: '',
        country: '',
        id: '',
        postalCode: '',
        streetName: '',
      },
    ],
  });
  useEffect(() => {
    getCustomerId().then((item) => setUser(item));
  }, []);
  const defaultBillingAddressId = user.billingAddressIds[0];
  const defaultBillingAddress = user.addresses.find((item) => item.id === defaultBillingAddressId);
  const defaultShippingAddressId = user.shippingAddressIds[0];
  const defaultShippingAddress = user.addresses.find((item) => item.id === defaultShippingAddressId);
  const dateBirth = user.dateOfBirth.split('-');
  const resultDateBirth = `${dateBirth[2]}.${dateBirth[1]}.${dateBirth[0]}`;

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
