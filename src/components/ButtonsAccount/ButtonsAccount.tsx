import React from 'react';
import { Link } from 'react-router-dom';

function ButtonsAccount(): JSX.Element {
  return (
    <>
      <Link to="/login">
        <button type="button" className="header__account-in">
          LOG IN
        </button>
      </Link>
      <Link to="/register">
        <button type="button" className="header__account-create">
          REGISTER
        </button>
      </Link>
    </>
  );
}

export default ButtonsAccount;
