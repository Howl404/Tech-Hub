import React, { MouseEvent } from 'react';
import './CartItem.scss';
import { CiSquareRemove } from 'react-icons/ci';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { addToCart, getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import { Cart } from '@src/interfaces/Cart';

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
    const accToken = Cookies.get('access-token') as string;
    const cartId = Cookies.get('cart-id') as string; // условие какая карзина анон или авториз
    const idTarget = event.currentTarget.id;
    getCartById(accToken, cartId).then((item) => {
      removeFromCart(accToken, cartId, idTarget, item.version).then((requestNewCart) => setCart(requestNewCart));
    });
  };

  return (
    <div className="cart-item-container">
      <div className="cart-image">
        <img srcSet={image[0].url} key={id} alt="" />
      </div>
      <div className="cart-title">{name}</div>
      <div className="cart-price">{`${price.centAmount.toString().slice(0, -price.fractionDigits)}.${price.centAmount
        .toString()
        .slice(-price.fractionDigits)} ${price.currencyCode}`}</div>
      <div className="cart-quantity">
        <button
          type="button"
          className="button__quantity"
          onClick={(): void => {
            const accToken = Cookies.get('access-token') as string;
            const cartId = Cookies.get('cart-id') as string; // условие какая карзина анон или авториз
            getCartById(accToken, cartId).then((item) => {
              removeFromCart(accToken, cartId, id, item.version, 1).then((items) => setCart(items));
            });
          }}
        >
          <AiOutlineMinus color="#C4C4C4" />
        </button>
        <div className="quantity-number">{quantity}</div>
        <button
          type="button"
          className="button__quantity"
          onClick={(): void => {
            const accToken = Cookies.get('access-token') as string;
            const cartId = Cookies.get('cart-id') as string; // условие какая карзина анон или авториз
            getCartById(accToken, cartId).then((item) => {
              addToCart(accToken, cartId, name.split(' ').join('-'), item.version, 1).then((items) => setCart(items));
            });
          }}
        >
          <AiOutlinePlus color="#C4C4C4" />
        </button>
      </div>
      <div className="cart-total">{`${Number(totalPrice.centAmount)
        .toString()
        .slice(0, -totalPrice.fractionDigits)}.${Number(totalPrice.centAmount)
        .toString()
        .slice(-totalPrice.fractionDigits)} ${totalPrice.currencyCode}`}</div>
      <div className="cart-remove-item">
        <button type="button" id={id} onClick={handlerRemove}>
          <CiSquareRemove pointerEvents="none" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;