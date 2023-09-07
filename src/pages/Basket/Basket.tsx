import React from 'react';
import './Basket.scss';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';

function Basket(): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <h2>Shopping Cart</h2>
      <div className="cart">
        <div className="main-list-cart">
          <ul className="title-table">
            <li className="table-text">PRODUCT</li>
            <li className="table-text">PRICE</li>
            <li className="table-text">SIZE</li>
            <li className="table-text">QUANTITY</li>
            <li className="table-text">TOTAL</li>
          </ul>
          <div className="cart-information">cart-blocks</div>
        </div>
        <div className="sub-information-list-cart">
          <div className="discount-code">
            <h3>Apply Discount Code</h3>
            <input placeholder="Enter discount code..." />
          </div>
          <div className="total-sum-block">
            <div className="subtotal-sum">
              <div>Subtotal</div>
              <div>120EUR</div>
            </div>
            <div className="subtotal-discount">
              <div>Discount</div>
              <div>0EUR</div>
            </div>
            <div className="oreder-total">
              <div>ORDER TOTAL</div>
              <div>120EUR</div>
            </div>
          </div>
          <button type="submit">proceed to checkout</button>
        </div>
      </div>
    </>
  );
}

export default Basket;
