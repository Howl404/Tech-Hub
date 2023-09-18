import { getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import removeItemCart from '../removeItemCart';
import getCookieToken from '../getCookieToken';

jest.mock('@src/services/CartService/CartService');
jest.mock('js-cookie');
jest.mock('../getCookieToken');

describe('removeItemCart', () => {
  const product = 'mock-product';
  const cartId = 'mock-cart-id';
  const token = 'mock-token';
  const mockCart = {
    id: 'mock-cart-id',
    version: 1,
    lineItems: [
      { productId: 'mock-product1', id: 'mock-id1' },
      { productId: 'mock-product2', id: 'mock-id2' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('removes an item from the cart and returns formatted result', async () => {
    (getCookieToken as jest.Mock).mockResolvedValue(token);
    (getCartById as jest.Mock).mockResolvedValue(mockCart);
    (removeFromCart as jest.Mock).mockResolvedValue(mockCart);

    Cookies.get = jest.fn().mockReturnValue(cartId);

    const result = await removeItemCart(product);

    expect(getCookieToken).toBeCalled();
    expect(Cookies.get).toBeCalledWith('cart-id');
    expect(getCartById).toBeCalledWith(token, cartId);
    expect(removeFromCart).toBeCalledWith(token, cartId, product, mockCart.version);

    expect(result).toEqual([
      { productId: 'mock-product1', id: 'mock-id1' },
      { productId: 'mock-product2', id: 'mock-id2' },
    ]);
  });

  test('returns false when no cart found', async () => {
    Cookies.get = jest.fn().mockReturnValue(null);
    const result = await removeItemCart(product);
    expect(result).toBe(false);
  });

  test('returns false when no token found', async () => {
    (getCookieToken as jest.Mock).mockResolvedValue(null);
    Cookies.get = jest.fn().mockReturnValue(cartId);
    const result = await removeItemCart(product);
    expect(result).toBe(false);
  });

  test('returns false when removeFromCart fails', async () => {
    (getCookieToken as jest.Mock).mockResolvedValue(token);
    (getCartById as jest.Mock).mockResolvedValue(mockCart);
    (removeFromCart as jest.Mock).mockResolvedValue(null);

    Cookies.get = jest.fn().mockReturnValue(cartId);

    const result = await removeItemCart(product);
    expect(result).toBe(false);
  });
});
