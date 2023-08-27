import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomersId } from '@src/interfaces/Customer';
import { getCustomerId } from '@src/services/AuthService/AuthService';
import './NameAccount.scss';

function NameAccount({ logOut }: { logOut: () => void }): JSX.Element {
  const [data, setData] = useState<CustomersId>({
    email: '',
    firstName: '',
    lastName: '',
    billingAddressIds: [],
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
      },
    ],
  });

  useEffect(() => {
    getCustomerId().then((item) => {
      setData(item);
    });
  }, []);

  return (
    <>
      <Link to="/MyAccount">
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
