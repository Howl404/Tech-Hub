import { getCartById } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import getFormattedCart from '../getFormattedCart';
import getCookieToken from '../getCookieToken';

jest.mock('@src/services/CartService/CartService');
jest.mock('../getCookieToken');
jest.mock('js-cookie');

describe('getFormattedCart', () => {
  const mockCart = {
    lineItems: [
      { productId: 'mock-product1', id: 'mock-id1' },
      { productId: 'mock-product2', id: 'mock-id2' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns formatted cart when cart and token are found', async () => {
    (getCookieToken as jest.Mock).mockResolvedValue('mock-token');
    (getCartById as jest.Mock).mockResolvedValue(mockCart);
    Cookies.get = jest.fn().mockReturnValue('mock-cart-id');

    const result = await getFormattedCart();

    expect(getCookieToken).toBeCalled();
    expect(Cookies.get).toBeCalledWith('cart-id');
    expect(getCartById).toBeCalledWith('mock-token', 'mock-cart-id');
    expect(result).toEqual([
      { productId: 'mock-product1', id: 'mock-id1' },
      { productId: 'mock-product2', id: 'mock-id2' },
    ]);
  });

  it('returns false when no cartId found', async () => {
    Cookies.get = jest.fn().mockReturnValue(undefined);

    const result = await getFormattedCart();

    expect(result).toBe(false);
  });

  it('returns false when no token found', async () => {
    (getCookieToken as jest.Mock).mockResolvedValue(null);
    Cookies.get = jest.fn().mockReturnValue('mock-cart-id');

    const result = await getFormattedCart();

    expect(result).toBe(false);
  });
});
