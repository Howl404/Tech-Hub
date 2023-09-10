import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomersId } from '@src/interfaces/Customer';
import { getCustomerId } from '@src/services/AuthService/AuthService';
import './NameAccount.scss';
import { getCartByCustomerId } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';

function NameAccount({ logOut }: { logOut: () => void }): JSX.Element {
  const [data, setData] = useState<CustomersId>({
    email: '',
    firstName: '',
    lastName: '',
    billingAddressIds: [],
    shippingAddressIds: [],
    defaultShippingAddressId: '',
    defaultBillingAddressId: '',
    dateOfBirth: '',
    id: '',
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
    getCustomerId().then(async (item) => {
      setData(item);
      const token = Cookies.get('access-token');
      if (token) {
        try {
          const result = await getCartByCustomerId(token, item.id);
          Cookies.set('cart-id', result.id, { expires: 999 });
        } catch (error) {
          // no cart found
        }
      }
    });
  }, []);

  return (
    <>
      {/* <Link to="/MyAccount"> */}
      <Link to="/MyAccount/Profile">
        <button type="button" className="header__account-name">
          {data.email}
        </button>
      </Link>
      <button type="button" className="header__account-name" onClick={logOut}>
        Log Out
      </button>
    </>
  );
}

export default NameAccount;
