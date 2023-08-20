import React from 'react';
import { Link } from 'react-router-dom';

import './NotFound.scss';
import '@components/Button/Button.scss';
import '@components/Heading/Heading.scss';

export default function NotFound(): JSX.Element {
  return (
    <div className="not-found">
      <h1 className="main-heading">Page not found</h1>
      <h2 className="main-heading">404</h2>
      <Link to="/">
        <button className="btn btn-enabled" type="button">
          Home
        </button>
      </Link>
    </div>
  );
}
