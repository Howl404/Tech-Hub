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
  removeFromCart,
} from '@src/services/CartService/CartService';
import { Link } from 'react-router-dom';
import { getDiscountCodeById } from '@src/services/DiscountService/DiscountService';
import { getNewToken } from '@src/services/AuthService/AuthService';
import { ClipLoader } from 'react-spinners';

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

  const [loading, setLoading] = useState(true);

  const onLoaded = (): void => {
    setLoading(false);
  };

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

  const [currentDiscountCode, setCurrentDiscountCode] = useState('');

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
  const [totalCart, setTotalCart] = useState<{
    centAmount: number;
    centAmountDiscount: number;
    centAmountDiscountPromo: number;
    centSubtotal: number;
    currencyCode: string;
    fractionDigits: number;
  }>({
    centAmount: 0,
    centAmountDiscount: 0,
    centAmountDiscountPromo: 0,
    centSubtotal: 0,
    currencyCode: 'EUR',
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
            onLoaded();
          });
        });
      } else if (anonToken) {
        getCartById(anonToken, cartId).then((item) => {
          getCartByAnonId(anonToken, item.anonymousId).then((carta: Cart) => {
            setCart(carta);
            onLoaded();
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
    const carts = cart.lineItems.map<JSX.Element>(({ variant, name, id, quantity, price, discountedPrice }) => (
      <CartItem
        id={id}
        key={id}
        image={variant.images}
        name={name.en}
        setCart={setCart}
        quantity={quantity}
        price={price}
        discountedPrice={discountedPrice?.value}
      />
    ));

    const objDiscount = cart.lineItems.reduce(
      (acc, val) => {
        const price = val.price.value.centAmount;
        const discountPrice = val.price.discounted?.value.centAmount || 0;
        const discountedPrice = price - (val.price.discounted?.value.centAmount || price);
        const lastPrice = discountPrice || price;
        const discountedPricePromo = lastPrice - (val.discountedPrice?.value.centAmount || lastPrice);
        return {
          centSubtotal: price * val.quantity + acc.centSubtotal,
          discountedPrice: discountedPrice * val.quantity + acc.discountedPrice,
          discountedPricePromo: discountedPricePromo * val.quantity + acc.discountedPricePromo,
        };
      },
      { centSubtotal: 0, discountedPrice: 0, discountedPricePromo: 0 },
    );

    setTotalCart({
      ...cart.totalPrice,
      centSubtotal: objDiscount.centSubtotal,
      centAmountDiscount: objDiscount.discountedPrice,
      centAmountDiscountPromo: objDiscount.centSubtotal - objDiscount.discountedPrice - cart.totalPrice.centAmount,
    });
    setCartItems(carts);

    checkCartUpdateHeader();

    async function fetchData(): Promise<void> {
      if (cart.discountCodes.length) {
        const discountInfo = await getDiscountCodeById(cart.discountCodes[0].discountCode.id);
        if (discountInfo) setCurrentDiscountCode(discountInfo.code);
      }
    }
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const getFormattedSum = (sum: number): string =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'EUR',
    }).format(sum / 100);

  let content = (
    <tr>
      <td>a</td>
    </tr>
  );
  if (loading) {
    content = (
      <tr>
        <td className="loader" colSpan={6}>
          <ClipLoader size={100} />
        </td>
      </tr>
    );
  } else {
    content =
      cart.lineItems.length !== 0 ? (
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
      ) : (
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
      );
  }

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
              <tbody>{content}</tbody>
            </table>
          </div>
        </div>
        <div className="sub-information-list-cart">
          <div className="discount-code">
            {cart.discountCodes.length ? (
              <>
                <h3>Delete Discount Code</h3>
                <input disabled value={currentDiscountCode} />
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
              <div>{getFormattedSum(totalCart.centSubtotal)}</div>
            </div>
            <div className="subtotal-discount">
              <div>Discount</div>
              <div>{getFormattedSum(totalCart.centAmountDiscount)}</div>
            </div>
            <div className="subtotal-discount">
              <div>Promocode</div>
              <div>{getFormattedSum(totalCart.centAmountDiscountPromo)}</div>
            </div>
            <div className="oreder-total">
              <div>ORDER TOTAL</div>
              <div>{getFormattedSum(totalCart.centAmount)}</div>
            </div>
          </div>
          <button type="submit">proceed to checkout</button>
        </div>
      </div>
    </>
  );
}

export default Basket;
