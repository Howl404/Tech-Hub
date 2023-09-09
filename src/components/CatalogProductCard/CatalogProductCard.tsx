import './CatalogProductCard.scss';
import React, { useState } from 'react';
import { ProductCatalog } from '@src/interfaces/Product';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';

import cartAdd from '@assets/cart-plus-solid.svg';
import cartRemove from '@assets/cart-shopping-solid.svg';

function CatalogProductCard({
  product,
  cartList,
  addToCart,
  removeFromCart,
}: {
  product: ProductCatalog;
  cartList: { productId: string; id: string }[];
  addToCart: (product: string) => Promise<void>;
  removeFromCart: (product: string) => Promise<void>;
}): JSX.Element {
  const { name, masterVariant } = product;
  const { images, prices, sku } = masterVariant;

  const [addItemLoading, setAddItemLoading] = useState(false);
  const [removeItemLoading, setRemoveItemLoading] = useState(false);

  let CartProduct: {
    productId: string;
    id: string;
  } = {
    productId: '0',
    id: '0',
  };
  if (cartList.length > 0) {
    const foundProduct = cartList.find((item) => item.productId === product.id);
    if (foundProduct) {
      CartProduct = foundProduct;
    }
  }

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
        <button
          type="button"
          className="add-to-cart btn-enabled"
          onClick={(): void => {
            setAddItemLoading(true);
            addToCart(sku).then(() => {
              console.log('resolve product cart');
              setAddItemLoading(false);
            });
          }}
          disabled={CartProduct.id !== '0'}
        >
          {addItemLoading ? <ClipLoader /> : <img src={cartAdd} className="cart-add-img" alt="Add to cart" />}
        </button>
        <button
          type="button"
          className="remove-from-cart btn-enabled"
          onClick={(): void => {
            setRemoveItemLoading(true);
            removeFromCart(CartProduct.id).then(() => {
              setRemoveItemLoading(false);
            });
          }}
          disabled={CartProduct.id === '0'}
        >
          {removeItemLoading ? (
            <ClipLoader />
          ) : (
            <img src={cartRemove} className="cart-remove-img" alt="Remove from cart" />
          )}
        </button>
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
