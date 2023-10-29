import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.scss';

function Breadcrumb({ breadcrumb }: { breadcrumb: { name: string; slug: string }[] }): JSX.Element {
  return (
    <div className="breadcrumb">
      {breadcrumb.map((product, index) => (
        <div key={product.slug} className={product.slug}>
          <span> / </span>
          <Link
            to={`/catalog/${breadcrumb
              .slice(0, index + 1)
              .map((item) => item.slug)
              .join('/')}`}
          >
            {product.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Breadcrumb;
