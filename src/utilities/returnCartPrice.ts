import { getNewToken } from '@src/services/AuthService/AuthService';
import { getCartById } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';

const returnCartPrice = async (): Promise<number | false> => {
  const authType = Cookies.get('auth-type');
  const accessToken = Cookies.get('access-token');
  const anonToken = Cookies.get('anon-token');
  const anonRefreshToken = Cookies.get('anon-refresh-token');
  const cartId = Cookies.get('cart-id');
  if (cartId) {
    if (authType === 'password' && accessToken) {
      const cart = await getCartById(accessToken, cartId);
      return cart.totalPrice.centAmount;
    }
    if (anonToken) {
      const cart = await getCartById(anonToken, cartId);
      return cart.totalPrice.centAmount;
    }
    if (anonRefreshToken) {
      const token = await getNewToken(anonRefreshToken);
      Cookies.set('anon-token', token.accessToken, { expires: 2 });
      const cart = await getCartById(token.accessToken, cartId);
      return cart.totalPrice.centAmount;
    }
  }
  return false;
};

export default returnCartPrice;
