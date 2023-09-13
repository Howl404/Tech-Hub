import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './Basket.scss';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';
import CartItem from '@src/components/CartItem/CartItem';
import Cookies from 'js-cookie';
import { Cart } from '@src/interfaces/Cart';
import {
  getCartByAnonId,
  getCartByCustomerId,
  getCartById,
  removeFromCart,
} from '@src/services/CartService/CartService';
import { Link } from 'react-router-dom';
import { getNewToken } from '@src/services/AuthService/AuthService';

function Basket({ setTotalSumInCart }: { setTotalSumInCart: Dispatch<SetStateAction<number>> }): JSX.Element {
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
    customerId: '',
    totalPrice: { centAmount: 0, currencyCode: '', fractionDigits: 2 },
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

  const checkCartUpdateHeader = (): void => {
    const authType = Cookies.get('auth-type');
    const accessToken = Cookies.get('access-token');
    const anonToken = Cookies.get('anon-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    const cartId = Cookies.get('cart-id');
    if (cartId) {
      if (authType === 'password' && accessToken) {
        getCartById(accessToken, cartId).then((item) => {
          setTotalSumInCart(item.totalPrice.centAmount);
        });
      } else if (anonToken) {
        getCartById(anonToken, cartId).then((item) => {
          setTotalSumInCart(item.totalPrice.centAmount);
        });
      } else if (anonRefreshToken) {
        getNewToken(anonRefreshToken).then((item) => {
          Cookies.set('anon-token', item.accessToken, { expires: 2 });
          getCartById(item.accessToken, cartId).then((items) => setTotalSumInCart(items.totalPrice.centAmount));
        });
      }
    }
  };

  const handleClearCart = (): void => {
    let i = cart.lineItems.length;
    const anonFunc = (version: number): void => {
      const authType = Cookies.get('auth-type');
      const accessToken = Cookies.get('access-token');
      const anonToken = Cookies.get('anon-token');
      i -= 1;
      if (i === -1) return;
      if (authType === 'password' && accessToken) {
        if (i !== -1) {
          removeFromCart(accessToken, cart.id, cart.lineItems[i].id, version).then((item) => {
            if (i === 0) setCart(item);
            anonFunc(item.version);
          });
        }
      } else if (anonToken) {
        if (i !== -1) {
          removeFromCart(anonToken, cart.id, cart.lineItems[i].id, version).then((item) => {
            if (i === 0) setCart(item);
            anonFunc(item.version);
          });
        }
      }
    };
    anonFunc(cart.version);
  };

  const [cartItems, setCartItems] = useState<JSX.Element[]>([]);
  const [totalCart, setTotalCart] = useState<{ centAmount: number; currencyCode: string; fractionDigits: number }>({
    centAmount: 0,
    currencyCode: '',
    fractionDigits: 2,
  });
  useEffect(() => {
    const authType = Cookies.get('auth-type');
    const accessToken = Cookies.get('access-token');
    const anonToken = Cookies.get('anon-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    const cartId = Cookies.get('cart-id');
    if (cartId) {
      if (authType === 'password' && accessToken) {
        getCartById(accessToken, cartId).then((item) => {
          getCartByCustomerId(accessToken, item.customerId).then((carta: Cart) => {
            setCart(carta);
          });
        });
      } else if (anonToken) {
        getCartById(anonToken, cartId).then((item) => {
          getCartByAnonId(anonToken, item.anonymousId).then((carta: Cart) => {
            setCart(carta);
          });
        });
      } else if (anonRefreshToken) {
        getNewToken(anonRefreshToken).then((item) => {
          Cookies.set('anon-token', item.accessToken, { expires: 2 });
          getCartById(item.accessToken, cartId).then((items) => setCart(items));
        });
      }
    }
  }, []);

  useEffect(() => {
    if (cart.lineItems.length !== 0) {
      const carts = cart.lineItems.map<JSX.Element>(({ variant, name, totalPrice, id, quantity, price }) => (
        <CartItem
          id={id}
          key={id}
          totalPrice={totalPrice}
          image={variant.images}
          name={name.en}
          setCart={setCart}
          quantity={quantity}
          price={price.value}
        />
      ));
      setCartItems(carts);
    }
    setTotalCart(cart.totalPrice);
    checkCartUpdateHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);
  return (
    <>
      <Breadcrumbs />
      <h2>Shopping Cart</h2>
      <div className="cart">
        <div className="main-list-cart">
          <div className="cart">
            <table>
              <thead>
                <tr className="title-table">
                  <th className="table-text">Product</th>
                  <th className="table-text"> </th>
                  <th className="table-text">Price</th>
                  <th className="table-text">Quantity</th>
                  <th className="table-text">Total</th>
                  <th className="table-text"> </th>
                </tr>
              </thead>
              <tbody>
                {cart.lineItems.length === 0 ? (
                  <>
                    <tr>
                      <td className="title-for-empty" colSpan={6}>
                        Sorry, you cart empty... try to find and add new purchases :)
                      </td>
                    </tr>
                    <tr>
                      <td className="title-for-empty" colSpan={6}>
                        <Link to="/catalog">
                          <button type="button" className="button__to-catalog">
                            Catalog
                          </button>
                        </Link>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {cartItems}
                    <tr>
                      <td className="container-button-clear" colSpan={6}>
                        <button type="button" className="clear-cart" onClick={handleClearCart}>
                          clear cart
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
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
              <div>
                {totalCart.centAmount !== 0
                  ? `${String(totalCart.centAmount).slice(0, -2)}.${String(totalCart.centAmount).slice(-2)}`
                  : `0 ${totalCart.currencyCode}`}
              </div>
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
