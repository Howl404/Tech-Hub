import React, { useEffect, useState } from 'react';
import { getCustomerId } from '@src/services/AuthService/AuthService';
import { CustomersId } from '@src/interfaces/Customer';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';
import AccountMenu from '@src/components/AccountMenu/AccountMenu';
import { Route, Routes } from 'react-router-dom';
import Profile from '../Profile/Profile';
import './AccountDashboard.scss';
import AccountInformation from '../AccountInformation/AccountInformation';
import AccountAddress from '../AccountAddress/AccountAddress';
import AccountOrder from '../AccountOrder/AccountOrder';

function AccountDashboard({ onLogOut }: { onLogOut: () => void }): JSX.Element {
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

  return (
    <section>
      <div className="dashboard__container">
        <Breadcrumbs />
        <h2 className="dashboard__page__title">My Dashboard</h2>
        <div className="dashboard__information">
          <AccountMenu />
          <Routes>
            <Route path="/Profile" element={<Profile />} />
            <Route
              path="/Information"
              element={<AccountInformation user={user} setUser={setUser} onLogOut={onLogOut} />}
            />
            <Route path="/Address" element={<AccountAddress />} />
            <Route path="/Order" element={<AccountOrder />} />
          </Routes>
        </div>
      </div>
    </section>
  );
}

export default AccountDashboard;
