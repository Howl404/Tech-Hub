import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(): JSX.Element {
  return (
    <div>
      <h2 className="main-heading">Home</h2>
      <div className="wrapper-btn">
        <Link to="/login">
          <button type="button" className="btn btn-enabled">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button type="button" className="btn btn-enabled mg-0">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
