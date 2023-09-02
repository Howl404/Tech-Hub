import './ProductCard.scss';
import React from 'react';
import { Product } from '@src/interfaces/Product';
import { Link } from 'react-router-dom';

function ProductCard({ product }: { product: Product }): JSX.Element {
  const { name, description, masterVariant } = product;
  const { images, prices, sku } = masterVariant;
  console.log(product);

  let price: JSX.Element;
  if (prices[0].discounted) {
    price = (
      <div className="price-container">
        <h4 className="discounted-price">
          {prices[0].discounted.value.centAmount / 100} {prices[0].value.currencyCode}
        </h4>
        <h4 className="old-price crossed-price">
          {prices[0].value.centAmount / 100} {prices[0].value.currencyCode}
        </h4>
      </div>
    );
  } else {
    price = (
      <div className="price-container">
        <h4 className="old-price">
          {prices[0].value.centAmount / 100} {prices[0].value.currencyCode}
        </h4>
      </div>
    );
  }

  return (
    <div className="product-card">
      <img src={images[0].url} alt={name.en} />
      <h3>{name.en}</h3>
      {price}
      <p>{description.en}</p>
      <Link to={`/products/${sku}`}>
        <button type="button" className="product-page-button  btn-enabled">
          Details
        </button>
      </Link>
    </div>
  );
}

export default ProductCard;
