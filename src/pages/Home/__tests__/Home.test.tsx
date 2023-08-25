import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import '@testing-library/jest-dom';

describe('Home Component', () => {
  it('renders properly', () => {
    const { getByText, container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    expect(getByText('Home')).toBeInTheDocument();
    expect(container.querySelector('.main-heading')).toBeInTheDocument();
    expect(container.querySelector('.wrapper-btn')).toBeInTheDocument();
  });
});
