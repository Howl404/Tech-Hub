import './ProductCard.scss';
import React from 'react';
import { Product } from '@src/interfaces/Product';

function ProductCard({ product }: { product: Product }): JSX.Element {
  const { name, description, masterVariant } = product.masterData.current;
  const { images, prices } = masterVariant;

  return (
    <div className="product-card">
      <img src={images[0].url} alt={name.en} />
      <h3>{name.en}</h3>
      <h4>
        {prices[0].value.centAmount / 100} {prices[0].value.currencyCode}
      </h4>
      <p>{description.en.slice(0, 250).concat('...')}</p>
    </div>
  );
}

export default ProductCard;
