import { getCartById, addToCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import addItemCart from '../addItemCart';
import getCookieToken from '../getCookieToken';

jest.mock('@src/services/CartService/CartService');
jest.mock('js-cookie');
jest.mock('../getCookieToken');

describe('addItemCart', () => {
  const product = 'mock-product3';
  const productId = 'mock-id3';
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

  const cartState = { ...mockCart };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('add an item to the cart and returns formatted result', async () => {
    (getCookieToken as jest.Mock).mockResolvedValue(token);
    (getCartById as jest.Mock).mockImplementation(() => Promise.resolve(cartState));
    (addToCart as jest.Mock).mockImplementation(() => {
      cartState.lineItems.push({ productId: product, id: productId });
      return Promise.resolve(cartState);
    });
    Cookies.get = jest.fn().mockReturnValue(cartId);

    const result = await addItemCart(product);

    expect(getCookieToken).toBeCalled();
    expect(Cookies.get).toBeCalledWith('cart-id');
    expect(getCartById).toBeCalledWith(token, cartId);
    expect(addToCart).toBeCalledWith(token, cartId, product, mockCart.version, 1);

    expect(result).toEqual([
      { productId: 'mock-product1', id: 'mock-id1' },
      { productId: 'mock-product2', id: 'mock-id2' },
      { productId: 'mock-product3', id: 'mock-id3' },
    ]);
  });
});
