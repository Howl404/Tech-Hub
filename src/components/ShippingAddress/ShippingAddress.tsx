import React from 'react';
import './ShippingAdress.scss';

function ShippingAddress({
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
      <div className="name">{name}</div>
      <div className="adress">{`${streetName}`}</div>
      <div className="city">{`${city}`}</div>
      <div className="postIndex">{`${postalCode}`}</div>
      <div className="country">{`${country}`}</div>
    </div>
  );
}

export default ShippingAddress;
