import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
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
});
