import { getCartById } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import getCookieToken from './getCookieToken';

const getFormattedCart = async (): Promise<{ productId: string; id: string }[] | false> => {
  const cartId = Cookies.get('cart-id');
  if (cartId) {
    const token = await getCookieToken();
    if (token) {
      const cart = await getCartById(token, cartId);
      const formattedCart = cart.lineItems.map((lineItem) => ({
        productId: lineItem.productId,
        id: lineItem.id,
      }));
      return formattedCart;
    }
  }
  Cookies.remove('cart-id');
  return false;
};

export default getFormattedCart;
