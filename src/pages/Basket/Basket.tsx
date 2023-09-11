import React, { useEffect, useState } from 'react';
import './Basket.scss';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';
import CartItem from '@src/components/CartItem/CartItem';
import Cookies from 'js-cookie';
import { Cart } from '@src/interfaces/Cart';
import { getCartByAnonId, getCartById } from '@src/services/CartService/CartService';

function Basket(): JSX.Element {
  const [cart, setCart] = useState<Cart>({
    type: '',
    id: '',
    version: 0,
    versionModifiedAt: '',
    lastMessageSequenceNumber: 0,
    createdAt: '',
    lastModifiedAt: '',
    anonymousId: '',
    lineItems: [],
    lastModifiedBy: { clientId: '', isPlatformClient: false, anonymousId: '' },
    createdBy: { clientId: '', isPlatformClient: false, anonymousId: '' },
    cartState: '',
    totalPrice: '',
    shippingMode: '',
    shipping: [],
    customLineItems: [],
    discountCodes: [],
    directDiscounts: [],
    inventoryMode: '',
    taxMode: '',
    taxRoundingMode: '',
    taxCalculationMode: '',
    deleteDaysAfterLastModification: 0,
    refusedGifts: [],
    origin: '',
    itemShippingAddresses: [],
  });
  const [cartItems, setCartItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (Cookies.get('auth-type') === 'anon') {
      const accToken = Cookies.get('anon-token') as string;
      const cartId = Cookies.get('cart-id') as string;
      getCartById(accToken, cartId).then((item) => {
        getCartByAnonId(accToken, item.anonymousId).then((carta: Cart) => {
          setCart(carta);
        });
      });
    } else if (Cookies.get('auth-type') === 'auth') {
      console.log('auth');
    }
  }, []);

  useEffect(() => {
    const test = cart.lineItems.map<JSX.Element>(({ variant, name, totalPrice, id }) => (
      <CartItem id={id} key={id} price={totalPrice} image={variant.images} name={name.en} />
    ));
    setCartItems(test);
  }, [cart]);

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
          <div className="cart-information">{cart.lineItems.length === 0 ? 'Sorry, you cart empty' : cartItems}</div>
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
