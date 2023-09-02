import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { Product } from '@src/interfaces/Product';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';

const mockProductWithDiscount: Product = {
  name: { en: 'Product Name' },
  description: { en: 'Product Description' },
  masterVariant: {
    id: 123,
    sku: 'test',
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

const mockProductWithoutDiscount: Product = {
  name: { en: 'Product Name' },
  description: { en: 'Product Description' },
  masterVariant: {
    id: 123,
    sku: 'test',
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

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <ProductCard product={mockProductWithDiscount} />
      </BrowserRouter>,
    );

    expect(getByText('Product Name')).toBeInTheDocument();
    expect(getByText('Product Description')).toBeInTheDocument();
    expect(getByText('10 USD')).toBeInTheDocument();
    expect(getByText('5 USD')).toBeInTheDocument();

    const productImage = getByAltText('Product Name');
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute('src', 'image_url');
  });
});

describe('ProductCard Component', () => {
  it('renders product card with discounted price when discounted price exists', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProductCard product={mockProductWithDiscount} />
      </BrowserRouter>,
    );

    expect(getByText('5 USD')).toBeInTheDocument();
    expect(getByText('10 USD')).toBeInTheDocument();
  });

  it('renders product card with regular price when discounted price does not exist', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProductCard product={mockProductWithoutDiscount} />
      </BrowserRouter>,
    );

    expect(getByText('10 USD')).toBeInTheDocument();
  });
});
