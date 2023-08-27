import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';

function Breadcrumbs(): JSX.Element {
  return (
    <div className={styles.crumbs}>
      <Link className={styles.link} to="/">
        Home
      </Link>
      <span>&nbsp;/&nbsp;</span>
      <p>My Dashboard</p>
    </div>
  );
}

export default Breadcrumbs;
