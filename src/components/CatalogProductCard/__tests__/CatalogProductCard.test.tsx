import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { ProductCatalog } from '@src/interfaces/Product';
import { BrowserRouter } from 'react-router-dom';
import CatalogProductCard from '../CatalogProductCard';

const addToCart = async (product: string): Promise<void> => {
  console.log(product);
};

const removeFromCart = async (product: string): Promise<void> => {
  console.log(product);
};

const mockProductWithDiscount: ProductCatalog = {
  id: '1',
  name: { en: 'Product Name' },
  description: { en: 'Product Description' },
  key: '1',
  masterVariant: {
    id: 123,
    sku: 'testSKU',
    images: [{ url: 'image_url' }],
    prices: [
      {
        id: 'price_id',
        value: {
          currencyCode: 'USD',
          centAmount: 1000,
          fractionDigits: 2,
        },
        discounted: {
          value: {
            centAmount: 500,
          },
        },
      },
    ],
    attributes: [
      {
        name: 'brand',
        value: 'test',
      },
    ],
  },
  categories: [
    {
      typeId: 'test',
      id: 'test',
    },
  ],
};

const mockProductWithoutDiscount: ProductCatalog = {
  id: '1',
  name: { en: 'Product Name' },
  description: { en: 'Product Description' },
  key: '1',
  masterVariant: {
    id: 123,
    sku: 'testSKU',
    images: [{ url: 'image_url' }],
    prices: [
      {
        id: 'price_id',
        value: {
          currencyCode: 'USD',
          centAmount: 1000,
          fractionDigits: 2,
        },
      },
    ],
    attributes: [
      {
        name: 'brand',
        value: 'test',
      },
    ],
  },
  categories: [
    {
      typeId: 'test',
      id: 'test',
    },
  ],
};

describe('CatalogProductCard Component', () => {
  it('renders product information correctly', () => {
    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <CatalogProductCard
          product={mockProductWithDiscount}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cartList={[]}
        />
      </BrowserRouter>,
    );

    expect(getByText('Product Name')).toBeInTheDocument();
    expect(getByText('10 USD')).toBeInTheDocument();
    expect(getByText('5 USD')).toBeInTheDocument();

    const productImage = getByAltText('Product Name');
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute('src', 'image_url');
  });

  it('renders product card with discounted price when discounted price exists', () => {
    const { getByText } = render(
      <BrowserRouter>
        <CatalogProductCard
          product={mockProductWithDiscount}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cartList={[]}
        />
      </BrowserRouter>,
    );

    expect(getByText('5 USD')).toBeInTheDocument();
    expect(getByText('10 USD')).toBeInTheDocument();
  });

  it('renders product card with regular price when discounted price does not exist', () => {
    const { getByText } = render(
      <BrowserRouter>
        <CatalogProductCard
          product={mockProductWithoutDiscount}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cartList={[]}
        />
      </BrowserRouter>,
    );

    expect(getByText('10 USD')).toBeInTheDocument();
  });
});
