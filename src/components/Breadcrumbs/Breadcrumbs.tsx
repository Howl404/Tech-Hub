import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';

function Breadcrumbs(): JSX.Element {
  const location = useLocation();

  let result = '';

  if (location.pathname.includes('Profile')) {
    result = 'Profile';
  } else if (location.pathname.includes('Information')) {
    result = 'Information';
  } else if (location.pathname.includes('Address')) {
    result = 'Address';
  } else if (location.pathname.includes('Order')) {
    result = 'Order';
  } else if (location.pathname.includes('basket')) {
    result = 'Basket';
  }

  return (
    <div className={styles.crumbs}>
      <Link className={styles.link} to="/">
        Home
      </Link>
      {/* <span>&nbsp;/&nbsp;</span> */}
      {/* <p>My Dashboard</p> */}
      <span>&nbsp;/&nbsp;</span>
      <p>{result}</p>
    </div>
  );
}

export default Breadcrumbs;
