import React from 'react';
import styles from './ShippingAdress.module.scss';

function ShippingAddress({
  city,
  country,
  postalCode,
  name,
  streetNumber,
  streetName,
  building,
  apartment,
  region,
}: {
  city: string;
  country: string;
  postalCode: string;
  name: string;
  streetNumber: string;
  streetName: string;
  building: string;
  apartment: string;
  region: string;
}): JSX.Element {
  return (
    <div className="container__address">
      <div className={styles.name}>{name}</div>
      <div className={styles.adress}>{`${streetNumber} ${streetName} ${building} Apt.${apartment}`}</div>
      <div className={styles.city}>{`${city}`}</div>
      <div className={styles.postIndex}>{`${postalCode}`}</div>
      <div className={styles.country}>{`${country}, ${region}`}</div>
    </div>
  );
}

export default ShippingAddress;
