import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import NotFound from '../NotFound';
import '@testing-library/jest-dom';

describe('NotFound', () => {
  test('renders NotFound component without crashing', () => {
    render(
      <Router>
        <NotFound />
      </Router>,
    );
  });
  test('displays "404" text', () => {
    render(
      <Router>
        <NotFound />
      </Router>,
    );
    expect(screen.getByText('404')).toBeInTheDocument();
  });
  test('displays "Page not found" text', () => {
    render(
      <Router>
        <NotFound />
      </Router>,
    );
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
  test('displays "Home" button', () => {
    render(
      <Router>
        <NotFound />
      </Router>,
    );
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });
});
