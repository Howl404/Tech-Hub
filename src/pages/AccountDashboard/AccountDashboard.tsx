import React, { useEffect, useState } from 'react';
import { getCustomerId } from '@src/services/AuthService/AuthService';
import { CustomersId } from '@src/interfaces/Customer';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';
import AccountMenu from '@src/components/AccountMenu/AccountMenu';
import { Route, Routes } from 'react-router-dom';
import Profile from '../Profile/Profile';
import styles from './AccountDashboard.module.scss';
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
    // console.log(user );
  }, []);

  return (
    <section>
      <div className={styles.container}>
        <Breadcrumbs />
        <h2 className={styles.page__title}>My Dashboard</h2>
        <div className={styles.dashboard__information}>
          <AccountMenu />
          <Routes>
            <Route path="/Profile" element={<Profile />} />
            {/* user={user} */}
            <Route
              path="/Information"
              element={<AccountInformation user={user} setUser={setUser} onLogOut={onLogOut} />}
            />
            <Route path="/Address" element={<AccountAddress user={user} setUser={setUser} />} />
            <Route path="/Order" element={<AccountOrder />} />
          </Routes>
        </div>
      </div>
    </section>
  );
}

export default AccountDashboard;
