import './CatalogProductCard.scss';
import React from 'react';
import { ProductCatalog } from '@src/interfaces/Product';
import { Link } from 'react-router-dom';
import { addToCart, createCart, getCartByAnonId, getCartById } from '@src/services/CartService/CartService';
import { getAnonymousToken } from '@src/services/AuthService/AuthService';
import Cookies from 'js-cookie';

function CatalogProductCard({ product }: { product: ProductCatalog }): JSX.Element {
  const { name, description, masterVariant } = product;
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
      <p>{description.en}</p>
      <Link to={`/products/${sku}`}>
        <button type="button" className="product-page-button  btn-enabled">
          Details
        </button>
      </Link>
      <button
        type="button"
        onClick={() => {
          getAnonymousToken().then((tokens) => {
            createCart(tokens.accessToken).then((cart) => {
              addToCart(tokens.accessToken, cart.id, sku, cart.version, 1);
              setTimeout(() => {
                const token = Cookies.get('access-token');
                if (token) {
                  getCartByAnonId(token, cart.anonymousId);
                }
                getCartByAnonId(tokens.accessToken, cart.anonymousId);
              }, 250);
            });
          });
        }}
      >
        Click
      </button>
    </div>
  );
}

export default CatalogProductCard;
