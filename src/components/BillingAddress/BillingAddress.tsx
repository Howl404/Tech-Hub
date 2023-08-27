import React from 'react';
import styles from './BillingAddresss.module.scss';

function BillingAddress({
  city,
  country,
  postalCode,
  name,
  streetName,
}: {
  city: string;
  country: string;
  postalCode: string;
  name: string;
  streetName: string;
}): JSX.Element {
  return (
    <div className="container__address">
      <div className={styles.name}>{name}</div>
      <div className={styles.adress}>{`${streetName}`}</div>
      <div className={styles.city}>{`${city}`}</div>
      <div className={styles.postIndex}>{`${postalCode}`}</div>
      <div className={styles.country}>{`${country}`}</div>
    </div>
  );
}

export default BillingAddress;
