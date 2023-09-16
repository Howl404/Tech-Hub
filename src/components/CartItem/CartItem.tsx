import React, { MouseEvent, useState } from 'react';
import './CartItem.scss';
import { CiSquareRemove } from 'react-icons/ci';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { addToCart, getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import { Cart, LinePrice } from '@src/interfaces/Cart';
import getCookieToken from '@src/utilities/getCookieToken';

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
    const cartId = Cookies.get('cart-id');
    const idTarget = event.currentTarget.id;
    if (cartId) {
      getCookieToken().then((token) => {
        if (token) {
          getCartById(token, cartId).then((item) => {
            removeFromCart(token, cartId, idTarget, item.version).then((requestNewCart) => setCart(requestNewCart));
          });
        }
      });
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
    const cartId = Cookies.get('cart-id');

    if (cartId) {
      getCookieToken().then((token) => {
        if (token) {
          getCartById(token, cartId).then((cart) => {
            removeFromCart(token, cartId, id, cart.version, 1).then((items) => {
              setCart(items);
              setDisabledButton(false);
            });
          });
        }
      });
    }
  };

  const handlerButtonInc = (): void => {
    setDisabledButton(true);
    const cartId = Cookies.get('cart-id');

    if (cartId) {
      getCookieToken().then((token) => {
        if (token) {
          getCartById(token, cartId).then((item) => {
            addToCart(token, cartId, name.split(' ').join('-'), item.version, 1).then((items) => {
              setCart(items);
              setDisabledButton(false);
            });
          });
        }
      });
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
