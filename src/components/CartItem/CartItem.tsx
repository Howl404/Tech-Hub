import React, { useState } from 'react';
import './CartItem.scss';
import { CiSquareRemove } from 'react-icons/ci';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

function CartItem({
  id,
  price,
  image,
  name,
}: {
  id: string;
  price: { currencyCode: string; centAmount: number; fractionDigits: number };
  image: { url: string }[];
  name: string;
}): JSX.Element {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="cart-item-container" id={id}>
      <div className="cart-image">
        <img srcSet={image[0].url} key={id} alt="" />
      </div>
      <div className="cart-title">{name}</div>
      <div className="cart-price">{`${price.centAmount.toString().slice(0, price.fractionDigits)} ${
        price.currencyCode
      }`}</div>
      <div className="cart-quantity">
        <button type="button" className="button__quantity" onClick={(): void => setQuantity(quantity - 1)}>
          <AiOutlineMinus color="#C4C4C4" />
        </button>
        <div className="quantity-number">{quantity}</div>
        <button type="button" className="button__quantity" onClick={(): void => setQuantity(quantity + 1)}>
          <AiOutlinePlus color="#C4C4C4" />
        </button>
      </div>
      <div className="cart-total">120.00 EUR</div>
      <div className="cart-remove-item">
        <button type="button">
          <CiSquareRemove />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
