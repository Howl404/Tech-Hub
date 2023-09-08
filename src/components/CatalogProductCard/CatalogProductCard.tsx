import './CatalogProductCard.scss';
import React from 'react';
import { ProductCatalog } from '@src/interfaces/Product';
import { Link } from 'react-router-dom';

function CatalogProductCard({ product, CartArray }: { product: ProductCatalog; CartArray: string[] }): JSX.Element {
  const { name, masterVariant } = product;
  const { images, prices, sku } = masterVariant;

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
      <div className="buttons-container">
        {CartArray.includes(sku) ? (
          <button type="button" className="remove-from-cart btn-enabled">
            Remove from cart
          </button>
        ) : (
          <button type="button" className="add-to-cart btn-enabled">
            Add to cart
          </button>
        )}
        <Link to={`/products/${sku}`}>
          <button type="button" className="details-button  btn-enabled">
            Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CatalogProductCard;
