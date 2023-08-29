import './ProductCard.scss';
import React from 'react';
import { Product } from '@src/interfaces/Product';

function ProductCard({ product }: { product: Product }): JSX.Element {
  const { name, description, masterVariant } = product;
  const { images, prices } = masterVariant;

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
      <div>
        <div className="price-container">
          <h4 className="old-price">
            {prices[0].value.centAmount / 100} {prices[0].value.currencyCode}
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <img src={images[0].url} alt={name.en} />
      <h3>{name.en}</h3>
      {price}
      <p>{description.en.slice(0, 250).concat('...')}</p>
    </div>
  );
}

export default ProductCard;
