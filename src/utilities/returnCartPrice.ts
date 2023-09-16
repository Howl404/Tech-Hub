import { getCartById } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import getCookieToken from './getCookieToken';

const returnCartPrice = async (): Promise<number | false> => {
  const cartId = Cookies.get('cart-id');
  if (cartId) {
    const token = await getCookieToken();
    if (token) {
      const cart = await getCartById(token, cartId);
      return cart.totalPrice.centAmount;
    }
  }
  return false;
};

export default returnCartPrice;
