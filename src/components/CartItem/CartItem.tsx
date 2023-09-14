import React, { MouseEvent, useState } from 'react';
import './CartItem.scss';
import { CiSquareRemove } from 'react-icons/ci';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { addToCart, getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import { Cart, LinePrice } from '@src/interfaces/Cart';
import { getNewToken } from '@src/services/AuthService/AuthService';

function CartItem({
  id,
  image,
  name,
  setCart,
  quantity,
  price,
  discountedPrice,
}: {
  id: string;
  image: { url: string }[];
  name: string;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  quantity: number;
  price: {
    value: LinePrice;
    discounted?: {
      value: LinePrice;
    };
  };
  discountedPrice: LinePrice | undefined;
}): JSX.Element {
  const handlerRemove = (event: MouseEvent<HTMLButtonElement>): void => {
    const authType = Cookies.get('auth-type');
    const accessToken = Cookies.get('access-token');
    const anonToken = Cookies.get('anon-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    const cartId = Cookies.get('cart-id');
    const idTarget = event.currentTarget.id;
    if (cartId) {
      if (authType === 'password' && accessToken) {
        getCartById(accessToken, cartId).then((item) => {
          removeFromCart(accessToken, cartId, idTarget, item.version).then((requestNewCart) => setCart(requestNewCart));
        });
      } else if (anonToken) {
        getCartById(anonToken, cartId).then((item) => {
          removeFromCart(anonToken, cartId, idTarget, item.version).then((requestNewCart) => setCart(requestNewCart));
        });
      } else if (anonRefreshToken) {
        getNewToken(anonRefreshToken).then((item) => {
          Cookies.set('anon-token', item.accessToken, { expires: 2 });
          getCartById(item.accessToken, cartId).then((items) => setCart(items));
        });
      }
    }
  };

  const [disabledButton, setDisabledButton] = useState(false);

  const currency = price.value.currencyCode || 'EUR';
  const cartPrice = price.value.centAmount / 100;
  const cartDiscountedPrice = (price.discounted?.value.centAmount || 0) / 100;
  const cartDiscountedPricePromo = (discountedPrice?.centAmount || 0) / 100;
  const cartLastPrice = cartDiscountedPricePromo || cartDiscountedPrice || cartPrice;
  const cartTotalPrice = cartLastPrice * quantity;

  const getFormattedSum = (sum: number): string =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(sum);

  let elemCartPriceFormated = <div className="cart-price-product">{getFormattedSum(cartPrice)}</div>;
  if (cartPrice !== cartLastPrice) {
    elemCartPriceFormated = (
      <>
        <div className="cart-price-discount">{getFormattedSum(cartLastPrice)}</div>
        <div className="cart-price-orig">{getFormattedSum(cartPrice)}</div>
      </>
    );
  }

  const handlerButtonDec = (): void => {
    setDisabledButton(true);
    const authType = Cookies.get('auth-type');
    const accessToken = Cookies.get('access-token');
    const anonToken = Cookies.get('anon-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    const cartId = Cookies.get('cart-id');
    if (cartId) {
      if (authType === 'password' && accessToken) {
        getCartById(accessToken, cartId).then((item) => {
          removeFromCart(accessToken, cartId, id, item.version, 1).then((items) => {
            setCart(items);
            setDisabledButton(false);
          });
        });
      } else if (anonToken) {
        getCartById(anonToken, cartId).then((item) => {
          removeFromCart(anonToken, cartId, id, item.version, 1).then((items) => {
            setCart(items);
            setDisabledButton(false);
          });
        });
      } else if (anonRefreshToken) {
        getNewToken(anonRefreshToken).then((item) => {
          Cookies.set('anon-token', item.accessToken, { expires: 2 });
          getCartById(item.accessToken, cartId).then((items) => setCart(items));
        });
      }
    }
  };

  const handlerButtonInc = (): void => {
    setDisabledButton(true);
    const authType = Cookies.get('auth-type');
    const accessToken = Cookies.get('access-token');
    const anonToken = Cookies.get('anon-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    const cartId = Cookies.get('cart-id');
    if (cartId) {
      if (authType === 'password' && accessToken) {
        getCartById(accessToken, cartId).then((item) => {
          addToCart(accessToken, cartId, name.split(' ').join('-'), item.version, 1).then((items) => {
            setCart(items);
            setDisabledButton(false);
          });
        });
      } else if (anonToken) {
        getCartById(anonToken, cartId).then((item) => {
          addToCart(anonToken, cartId, name.split(' ').join('-'), item.version, 1).then((items) => {
            setCart(items);
            setDisabledButton(false);
          });
        });
      } else if (anonRefreshToken) {
        getNewToken(anonRefreshToken).then((item) => {
          Cookies.set('anon-token', item.accessToken, { expires: 2 });
          getCartById(item.accessToken, cartId).then((items) => setCart(items));
        });
      }
    }
  };

  return (
    <tr className="cart-item-container">
      <td className="cart-image">
        <img srcSet={image[0].url} key={id} alt="" />
      </td>
      <td className="cart-title-product">{name}</td>
      <td>{elemCartPriceFormated}</td>
      <td>
        <div className="cart-quantity">
          <button type="button" className="button__quantity" disabled={disabledButton} onClick={handlerButtonDec}>
            <AiOutlineMinus color="#C4C4C4" />
          </button>
          <div className="quantity-number">{quantity}</div>
          <button type="button" className="button__quantity" disabled={disabledButton} onClick={handlerButtonInc}>
            <AiOutlinePlus color="#C4C4C4" />
          </button>
        </div>
      </td>
      <td className="cart-total-price">{getFormattedSum(cartTotalPrice)}</td>
      <td>
        <button className="cart-remove-item" type="button" id={id} onClick={handlerRemove}>
          <CiSquareRemove pointerEvents="none" />
        </button>
      </td>
    </tr>
  );
}

export default CartItem;
