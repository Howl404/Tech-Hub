import React from 'react';
import { render, getByAltText } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryCard from '../CategoryCard';
import '@testing-library/jest-dom';

const mockCategory = {
  id: 'Test Category',
  name: 'Test Category',
  slug: 'test-category',
  ancestors: [],
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: (): { pathname: string } => ({ pathname: '/catalog' }),
}));

test('CategoryCard renders correctly', () => {
  const { getByText } = render(
    <BrowserRouter>
      <CategoryCard category={mockCategory} />
    </BrowserRouter>,
  );

  const categoryName = getByText('Test Category');
  expect(categoryName).toBeInTheDocument();

  const openButton = getByAltText(document.body, 'Open subcategories');
  expect(openButton).toBeInTheDocument();
});
