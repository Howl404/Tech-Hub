import Cookies from 'js-cookie';
import returnCartPrice from '../returnCartPrice';

jest.mock('@src/services/CartService/CartService');
jest.mock('js-cookie');
jest.mock('../getCookieToken');

describe('returnCartPrice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return false when cartId is not present', async () => {
    const mockGet = jest.spyOn(Cookies, 'get');
    mockGet.mockReturnValue({ key: 'false' });

    const result = await returnCartPrice();

    expect(Cookies.get).toHaveBeenCalledWith('cart-id');
    expect({ key: result.toString() }).toStrictEqual({ key: 'false' });
  });
});
