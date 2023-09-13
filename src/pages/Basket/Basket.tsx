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
import { getDiscountCodeById } from '@src/services/DiscountService/DiscountService';

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
    const test = cart.lineItems.map<JSX.Element>(({ variant, name, id, quantity, price, discountedPrice }) => (
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
          centSubtotal: price + acc.centSubtotal,
          discountedPrice: discountedPrice + acc.discountedPrice,
          discountedPricePromo: discountedPricePromo + acc.discountedPricePromo,
        };
      },
      { centSubtotal: 0, discountedPrice: 0, discountedPricePromo: 0 },
    );

    setTotalCart({
      ...cart.totalPrice,
      centSubtotal: objDiscount.centSubtotal,
      centAmountDiscount: objDiscount.discountedPrice,
      centAmountDiscountPromo: objDiscount.discountedPricePromo,
    });
    setCartItems(test);
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
