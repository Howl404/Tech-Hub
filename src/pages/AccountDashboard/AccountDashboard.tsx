import React, { useEffect, useState } from 'react';
import { getCustomerId } from '@src/services/AuthService/AuthService';
import { CustomersId } from '@src/interfaces/Customer';
import ShippingAddress from '@src/components/ShippingAddress/ShippingAddress';
import BillingAddress from '@src/components/BillingAddress/BillingAddress';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';
import { Link } from 'react-router-dom';
import styles from './AccountDashboard.module.scss';

function AccountDashboard(): JSX.Element {
  const [user, setUser] = useState<CustomersId>({
    email: '',
    firstName: '',
    lastName: '',
    billingAddressIds: [],
    shippingAddressIds: [],
    addresses: [
      {
        apartment: '',
        building: '',
        city: '',
        country: '',
        id: '',
        postalCode: '',
        region: '',
        state: '',
        streetName: '',
        streetNumber: '',
        firstName: '',
        lastName: '',
      },
    ],
  });

  const buttonsData = [
    { name: 'Account Dashboard', label: 'Account Dashboard', path: '' },
    { name: 'Account Information', label: 'Account Information', path: '' },
    { name: 'Address Book', label: 'Address Book', path: '' },
    { name: 'My Orders', label: 'My Orders', path: '' },
  ];

  useEffect(() => {
    getCustomerId().then((item) => setUser(item));
  }, []);

  const defaultBillingAddressId = user.billingAddressIds[0];
  const defaultBillingAddress = user.addresses.find((item) => item.id === defaultBillingAddressId);
  const defaultShippingAddressId = user.shippingAddressIds[0];
  const defaultShippingAddress = user.addresses.find((item) => item.id === defaultShippingAddressId);

  const buttons = buttonsData.map(({ name, label, path }) => (
    <Link key={name} className={styles.link} to={path}>
      <button
        className={`${styles.btn__dashboard} ${name === 'Account Dashboard' ? styles.active_btn : ''}`}
        type="button"
        key={name}
      >
        {label}
      </button>
    </Link>
  ));

  return (
    <section>
      <div className={styles.container}>
        <Breadcrumbs />
        <h2 className={styles.page__title}>My Dashboard</h2>
        <div className={styles.dashboard__information}>
          <div className={styles.dashboard__menu}>{buttons}</div>
          <div className={styles.dashboard__description}>
            <h3 className={styles.account__information_title}>Account Information</h3>
            <div className={styles.account__information_block}>
              <div className={styles.account__information_blockTitle}>Contact Information</div>
              <div className={styles.account__information_name}>{`${user.firstName} ${user.lastName}`}</div>
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
                    name={`${defaultBillingAddress.firstName} ${defaultBillingAddress.lastName}`}
                    streetName={defaultBillingAddress.streetName}
                    streetNumber={defaultBillingAddress.streetNumber}
                    building={defaultBillingAddress.building}
                    apartment={defaultBillingAddress.apartment}
                    region={defaultBillingAddress.region}
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
                    name={`${defaultShippingAddress.firstName} ${defaultShippingAddress.lastName}`}
                    streetName={defaultShippingAddress.streetName}
                    streetNumber={defaultShippingAddress.streetNumber}
                    building={defaultShippingAddress.building}
                    apartment={defaultShippingAddress.apartment}
                    region={defaultShippingAddress.region}
                  />
                ) : (
                  <span>You have not set a default shipping address.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountDashboard;
