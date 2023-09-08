import React, { useEffect } from 'react';
import './Basket.scss';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';
import CartItem from '@src/components/CartItem/CartItem';
// import Cookies from 'js-cookie';
// import { addToCart, getCartById } from '@src/services/CartService/CartService';

function Basket({ id }: { id: string }): JSX.Element {
  useEffect(() => {
    // const token = Cookies.get('access-token') as string;
    // getCartById(token, id).then((item) => console.log('cart', item));
    // addToCart(token, id, 'DEXP-Atlas-H343', 3, 1);
  }, []);
  const resultBasket = [1];
  return (
    <>
      <Breadcrumbs />
      <h2>Shopping Cart</h2>
      <div className="cart">
        <div className="main-list-cart">
          <ul className="title-table">
            <li className="table-text">PRODUCT</li>
            <li className="table-text">PRICE</li>
            <li className="table-text">QUANTITY</li>
            <li className="table-text">TOTAL</li>
          </ul>
          <div className="cart-information">
            {resultBasket.length === 0 ? 'Sorry, you cart empty' : <CartItem id="1" />}
          </div>
        </div>
        <div className="sub-information-list-cart">
          <div className="discount-code">
            <h3>Apply Discount Code</h3>
            <input placeholder="Enter discount code..." />
          </div>
          <div className="total-sum-block">
            <div className="subtotal-sum">
              <div>Subtotal</div>
              <div>0.0 EUR</div>
            </div>
            <div className="subtotal-discount">
              <div>Discount</div>
              <div>0EUR</div>
            </div>
            <div className="oreder-total">
              <div>ORDER TOTAL</div>
              <div>0.0 EUR</div>
            </div>
          </div>
          <button type="submit">proceed to checkout</button>
        </div>
      </div>
    </>
  );
}

export default Basket;
