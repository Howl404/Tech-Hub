import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AccountMenu.module.scss';
import './style.scss';

function AccountMenu(): JSX.Element {
  const buttonsData = [
    { name: 'Account Dashboard', label: 'Account Dashboard', path: '/MyAccount/Profile' },
    { name: 'Account Information', label: 'Account Information', path: '/MyAccount/Information' },
    { name: 'Address Book', label: 'Address Book', path: '/MyAccount/Address' },
    { name: 'My Orders', label: 'My Orders', path: '/MyAccount/Order' },
  ];
  //   ${name === 'Account Dashboard' ? styles.active_btn : ''}
  const buttons = buttonsData.map(({ name, label, path }) => (
    <NavLink key={name} className={styles.link} to={path}>
      <button className={`${styles.btn__dashboard}`} type="button" key={name}>
        {label}
      </button>
    </NavLink>
  ));
  return <div className={styles.dashboard__menu}>{buttons}</div>;
}

export default AccountMenu;
