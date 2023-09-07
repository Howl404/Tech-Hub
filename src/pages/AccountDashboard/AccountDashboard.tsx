import React from 'react';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';
import AccountMenu from '@src/components/AccountMenu/AccountMenu';
import { Route, Routes } from 'react-router-dom';
import Profile from '../Profile/Profile';
import './AccountDashboard.scss';
import AccountInformation from '../AccountInformation/AccountInformation';
import AccountAddress from '../AccountAddress/AccountAddress';
import AccountOrder from '../AccountOrder/AccountOrder';

function AccountDashboard({ onLogOut }: { onLogOut: () => void }): JSX.Element {
  return (
    <section>
      <div className="dashboard__container">
        <Breadcrumbs />
        <h2 className="dashboard__page__title">My Dashboard</h2>
        <div className="dashboard__information">
          <AccountMenu />
          <Routes>
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Information" element={<AccountInformation onLogOut={onLogOut} />} />
            <Route path="/Address" element={<AccountAddress />} />
            <Route path="/Order" element={<AccountOrder />} />
          </Routes>
        </div>
      </div>
    </section>
  );
}

export default AccountDashboard;
