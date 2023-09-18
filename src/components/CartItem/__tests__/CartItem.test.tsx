import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartItem from '../CartItem';

const mockSetCart = jest.fn();

const props = {
  id: 'test-id',
  image: [{ url: 'test-url' }],
  name: 'Test Item',
  setCart: mockSetCart,
  quantity: 1,
  price: {
    value: { currencyCode: 'USD', centAmount: 1000, fractionDigits: 2 },
    discounted: { value: { currencyCode: 'USD', centAmount: 800, fractionDigits: 2 } },
  },
  discountedPrice: { currencyCode: 'USD', centAmount: 700, fractionDigits: 2 },
};

describe('CartItem component', () => {
  beforeEach(() => {
    render(
      <CartItem
        id={props.id}
        image={props.image}
        name={props.name}
        setCart={props.setCart}
        quantity={props.quantity}
        price={props.price}
        discountedPrice={props.discountedPrice}
      />,
    );
  });

  test('renders item image correctly', () => {
    const image = screen.getByAltText('');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('srcSet', props.image[0].url);
  });

  test('renders item name correctly', () => {
    const itemName = screen.getByText(/Test Item/i);
    expect(itemName).toBeInTheDocument();
  });

  test('renders item quantity correctly', () => {
    const itemQuantity = screen.getByText('1');
    expect(itemQuantity).toBeInTheDocument();
  });
});
