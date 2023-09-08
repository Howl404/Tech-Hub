import React, { useState } from 'react';
import './CartItem.scss';
import { CiSquareRemove } from 'react-icons/ci';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

function CartItem({ id }: { id: string }): JSX.Element {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="cart-item-container" id={id}>
      <div className="cart-image">image</div>
      <div className="cart-title">title product</div>
      <div className="cart-price">120 EUR</div>
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
