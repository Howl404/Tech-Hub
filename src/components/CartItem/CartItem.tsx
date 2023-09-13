import React, { MouseEvent, useState } from 'react';
import './CartItem.scss';
import { CiSquareRemove } from 'react-icons/ci';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { addToCart, getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import { Cart, LinePrice } from '@src/interfaces/Cart';

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
    const accToken = Cookies.get('access-token') as string;
    const cartId = Cookies.get('cart-id') as string; // условие какая карзина анон или авториз
    const idTarget = event.currentTarget.id;
    getCartById(accToken, cartId).then((item) => {
      removeFromCart(accToken, cartId, idTarget, item.version).then((requestNewCart) => setCart(requestNewCart));
    });
  };

  const [disabledButton, setDisabledButton] = useState(false);

  const currency = price.value.currencyCode || 'EUR';
  const cartPrice = price.value.centAmount / 100;
  const cartDiscountedPrice = (price.discounted?.value.centAmount || 0) / 100;
  const cartDiscountedPricePromo = ((discountedPrice?.centAmount || 0) * quantity) / 100;
  const cartLastPrice = cartDiscountedPricePromo || cartDiscountedPrice || cartPrice;
  const cartTotalPrice = cartLastPrice * quantity;

  const getFormattedSum = (sum: number): string =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(sum);

  let elemCartPriceFormated = <div className="cart-price">{getFormattedSum(cartPrice)}</div>;
  if (cartPrice !== cartLastPrice) {
    elemCartPriceFormated = (
      <>
        <div className="cart-price-discount">{getFormattedSum(cartLastPrice)}</div>
        <div className="cart-price-orig">{getFormattedSum(cartPrice)}</div>
      </>
    );
  }

  return (
    <div className="cart-item-container">
      <div className="cart-image">
        <img srcSet={image[0].url} key={id} alt="" />
      </div>
      <div className="cart-title">{name}</div>
      <div>{elemCartPriceFormated}</div>
      <div className="cart-quantity">
        <button
          type="button"
          className="button__quantity"
          disabled={disabledButton}
          onClick={(): void => {
            setDisabledButton(true);
            const accToken = Cookies.get('access-token') as string;
            const cartId = Cookies.get('cart-id') as string; // условие какая карзина анон или авториз
            getCartById(accToken, cartId).then((item) => {
              removeFromCart(accToken, cartId, id, item.version, 1).then((items) => {
                setCart(items);
                setDisabledButton(false);
              });
            });
          }}
        >
          <AiOutlineMinus color="#C4C4C4" />
        </button>
        <div className="quantity-number">{quantity}</div>
        <button
          type="button"
          className="button__quantity"
          disabled={disabledButton}
          onClick={(): void => {
            setDisabledButton(true);
            const accToken = Cookies.get('access-token') as string;
            const cartId = Cookies.get('cart-id') as string; // условие какая карзина анон или авториз
            getCartById(accToken, cartId).then((item) => {
              addToCart(accToken, cartId, name.split(' ').join('-'), item.version, 1).then((items) => {
                setCart(items);
                setDisabledButton(false);
              });
            });
          }}
        >
          <AiOutlinePlus color="#C4C4C4" />
        </button>
      </div>
      <div className="cart-total">{getFormattedSum(cartTotalPrice)}</div>
      <div className="cart-remove-item">
        <button type="button" id={id} onClick={handlerRemove}>
          <CiSquareRemove pointerEvents="none" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
