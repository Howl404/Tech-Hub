import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { Product } from '@src/interfaces/Product';
import { BrowserRouter } from 'react-router-dom';
import CatalogProductCard from '../CatalogProductCard';

const mockProductWithDiscount: Product = {
  name: { en: 'Product Name' },
  description: { en: 'Product Description' },
  key: '1',
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
  key: '1',
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

describe('CatalogProductCard Component', () => {
  it('renders product information correctly', () => {
    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <CatalogProductCard product={mockProductWithDiscount} />
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

describe('CatalogProductCard Component', () => {
  it('renders product card with discounted price when discounted price exists', () => {
    const { getByText } = render(
      <BrowserRouter>
        <CatalogProductCard product={mockProductWithDiscount} />
      </BrowserRouter>,
    );

    expect(getByText('5 USD')).toBeInTheDocument();
    expect(getByText('10 USD')).toBeInTheDocument();
  });

  it('renders product card with regular price when discounted price does not exist', () => {
    const { getByText } = render(
      <BrowserRouter>
        <CatalogProductCard product={mockProductWithoutDiscount} />
      </BrowserRouter>,
    );

    expect(getByText('10 USD')).toBeInTheDocument();
  });
});
