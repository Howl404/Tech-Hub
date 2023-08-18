import React from 'react';
import { Link } from 'react-router-dom';

import './NotFound.scss';

export default function NotFound(): JSX.Element {
  return (
    <main>
      <h2>Page not found</h2>
      <h1>404</h1>
      <Link to="/">
        <button className="button" type="button">
          Home
        </button>
      </Link>
    </main>
  );
}
