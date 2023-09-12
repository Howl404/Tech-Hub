import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './Basket.scss';
import Breadcrumbs from '@src/components/Breadcrumbs/Breadcrumbs';
import CartItem from '@src/components/CartItem/CartItem';
import Cookies from 'js-cookie';
import { Cart } from '@src/interfaces/Cart';
import {
  addDiscountCode,
  getCartByAnonId,
  getCartByCustomerId,
  getCartById,
  removeDiscountCode,
} from '@src/services/CartService/CartService';
import { Link } from 'react-router-dom';

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
    if (Cookies.get('auth-type') === 'anon') {
      const accToken = Cookies.get('anon-token') as string;
      const cartId = Cookies.get('cart-id') as string;
      getCartById(accToken, cartId).then((item) => {
        setTotalSumInCart(item.totalPrice.centAmount);
      });
    } else if (Cookies.get('auth-type') === 'password') {
      const accToken = Cookies.get('access-token') as string;
      const cartId = Cookies.get('cart-id') as string;
      getCartById(accToken, cartId).then((item) => {
        setTotalSumInCart(item.totalPrice.centAmount);
      });
    }
  };

  const applyPromoCode = (event: React.MouseEvent<HTMLElement>): void => {
    async function fetchData(): Promise<void> {
      const accToken = Cookies.get('anon-token') as string;
      const cartId = Cookies.get('cart-id') as string;
      const btnNode = event.currentTarget as HTMLElement;
      const inputNode = btnNode.previousElementSibling as HTMLInputElement;
      const code = inputNode.value;
      const cartDiscount = await addDiscountCode(accToken, cartId, cart.version, code);
      if (cartDiscount) {
        setCart(cartDiscount);
      }
    }
    fetchData();
  };

  const deletePromoCode = (): void => {
    async function fetchData(): Promise<void> {
      const accToken = Cookies.get('anon-token') as string;
      const cartId = Cookies.get('cart-id') as string;
      const cartDiscount = await removeDiscountCode(
        accToken,
        cartId,
        cart.version,
        cart.discountCodes[0].discountCode.id,
      );
      if (cartDiscount) {
        setCart(cartDiscount);
      }
    }
    fetchData();
  };

  const [cartItems, setCartItems] = useState<JSX.Element[]>([]);
  const [totalCart, setTotalCart] = useState<{ centAmount: number; currencyCode: string; fractionDigits: number }>({
    centAmount: 0,
    currencyCode: '',
    fractionDigits: 2,
  });
  useEffect(() => {
    if (Cookies.get('auth-type') === 'anon') {
      const accToken = Cookies.get('anon-token') as string;
      const cartId = Cookies.get('cart-id') as string;
      getCartById(accToken, cartId).then((item) => {
        getCartByAnonId(accToken, item.anonymousId).then((carta: Cart) => {
          setCart(carta);
        });
      });
    } else if (Cookies.get('auth-type') === 'password') {
      const accToken = Cookies.get('access-token') as string;
      const cartId = Cookies.get('cart-id') as string;
      getCartById(accToken, cartId).then((item) => {
        getCartByCustomerId(accToken, item.customerId).then((carta: Cart) => {
          setCart(carta);
        });
      });
    }
  }, []);

  useEffect(() => {
    const test = cart.lineItems.map<JSX.Element>(
      ({ variant, name, totalPrice, id, quantity, price, discountedPrice }) => (
        <CartItem
          id={id}
          key={id}
          totalPrice={totalPrice}
          image={variant.images}
          name={name.en}
          setCart={setCart}
          quantity={quantity}
          price={price.value}
          discountedPrice={discountedPrice?.value}
        />
      ),
    );
    setTotalCart(cart.totalPrice);
    setCartItems(test);
    checkCartUpdateHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="cart-information">
            {cart.lineItems.length === 0 ? (
              <div>
                <div>Sorry, you cart empty... try to find and add new purchases :)</div>
                <Link to="/catalog">
                  <button type="button" className="button__to-catalog">
                    Catalog
                  </button>
                </Link>
              </div>
            ) : (
              cartItems
            )}
          </div>
        </div>
        <div className="sub-information-list-cart">
          <div className="discount-code">
            {cart.discountCodes.length ? (
              <>
                <h3>Delete Discount Code</h3>
                <input disabled value="discount code" />
                <button type="button" className="discount-btn" onClick={(): void => deletePromoCode()}>
                  delete discount
                </button>
              </>
            ) : (
              <>
                <h3>Apply Discount Code</h3>
                <input placeholder="Enter discount code..." />
                <button type="button" className="discount-btn" onClick={applyPromoCode}>
                  Apply
                </button>
              </>
            )}
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
