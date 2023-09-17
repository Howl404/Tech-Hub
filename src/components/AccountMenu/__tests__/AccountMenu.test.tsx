import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AccountMenu from '../AccountMenu';

// Тест 1: Рендеринг компонента без ошибок
test('renders AccountMenu component without errors', () => {
  render(<AccountMenu />, { wrapper: BrowserRouter });
});
