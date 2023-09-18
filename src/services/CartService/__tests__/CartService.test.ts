import axios from 'axios';
import { createCart, addToCart, removeFromCart, addDiscountCode, removeDiscountCode } from '../CartService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Cart actions', () => {
  const token = 'test-token';
  const mockCart = {
    id: '1',
    version: 1,
    lineItems: [],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createCart returns a cart', async () => {
    mockedAxios.post.mockResolvedValue({ data: mockCart });

    const result = await createCart(token);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });

  test('addToCart adds a product', async () => {
    mockedAxios.post.mockResolvedValue({ data: mockCart });

    const cartId = '1';
    const productSku = 'p1';
    const version = 1;
    const quantity = 2;

    const result = await addToCart(token, cartId, productSku, version, quantity);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });

  test('addDiscountCode add', async () => {
    mockedAxios.post.mockResolvedValue({ data: mockCart });

    const cartId = '1';
    const productSku = 'p1';
    const version = 1;

    const result = await addDiscountCode(token, cartId, version, productSku);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });

  test('removeDiscountCode remove', async () => {
    mockedAxios.post.mockResolvedValue({ data: mockCart });

    const cartId = '1';
    const productSku = 'p1';
    const version = 1;

    const result = await removeDiscountCode(token, cartId, version, productSku);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });

  test('removeFromCard remove', async () => {
    mockedAxios.post.mockResolvedValue({ data: mockCart });

    const cartId = '1';
    const version = 1;
    const quantity = 2;
    const itemId = '1';

    const result = await removeFromCart(token, cartId, itemId, version, quantity);
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });
});
