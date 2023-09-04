import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import '@testing-library/jest-dom';

// Mock data for testing
const mockBreadcrumb = [
  { name: 'Home', slug: 'home' },
  { name: 'Category 1', slug: 'category1' },
  { name: 'Subcategory 1', slug: 'subcategory1' },
];

test('Breadcrumb renders correctly', () => {
  const { getByText, container } = render(
    <Router>
      <Breadcrumb breadcrumb={mockBreadcrumb} />
    </Router>,
  );

  mockBreadcrumb.forEach((item) => {
    const breadcrumbLink = getByText(item.name);
    expect(breadcrumbLink).toBeInTheDocument();
  });

  const separatorSpan = container.querySelector('span');

  expect(separatorSpan).toBeInTheDocument();
});

test('Breadcrumb link URLs are generated correctly', () => {
  const { getByText } = render(
    <Router>
      <Breadcrumb breadcrumb={mockBreadcrumb} />
    </Router>,
  );

  const homeLink = getByText('Home');
  expect(homeLink).toHaveAttribute('href', '/catalog/home');

  const categoryLink = getByText('Category 1');
  expect(categoryLink).toHaveAttribute('href', '/catalog/home/category1');

  const subcategoryLink = getByText('Subcategory 1');
  expect(subcategoryLink).toHaveAttribute('href', '/catalog/home/category1/subcategory1');
});
