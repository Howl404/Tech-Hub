import React, { MouseEvent, useState } from 'react';
import './CartItem.scss';
import { CiSquareRemove } from 'react-icons/ci';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { addToCart, getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import { Cart } from '@src/interfaces/Cart';
import { getNewToken } from '@src/services/AuthService/AuthService';

function CartItem({
  id,
  totalPrice,
  image,
  name,
  setCart,
  quantity,
  price,
}: {
  id: string;
  totalPrice: { currencyCode: string; centAmount: number; fractionDigits: number };
  image: { url: string }[];
  name: string;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  quantity: string;
  price: { currencyCode: string; centAmount: number; fractionDigits: number };
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
      <td className="cart-price-product">
        {`${price.centAmount.toString().slice(0, -price.fractionDigits)}.${price.centAmount
          .toString()
          .slice(-price.fractionDigits)} ${price.currencyCode}`}
      </td>
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
      <td className="cart-total-price">{`${Number(totalPrice.centAmount)
        .toString()
        .slice(0, -totalPrice.fractionDigits)}.${Number(totalPrice.centAmount)
        .toString()
        .slice(-totalPrice.fractionDigits)} ${totalPrice.currencyCode}`}</td>
      <td>
        <button className="cart-remove-item" type="button" id={id} onClick={handlerRemove}>
          <CiSquareRemove pointerEvents="none" />
        </button>
      </td>
    </tr>
  );
}

export default CartItem;
