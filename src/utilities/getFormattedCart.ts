import { getNewToken } from '@src/services/AuthService/AuthService';
import { getCartById } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';

const getFormattedCart = async (): Promise<{ productId: string; id: string }[] | false> => {
  const cartId = Cookies.get('cart-id');
  let anonToken = Cookies.get('anon-token');
  const accessToken = Cookies.get('access-token');
  const anonRefreshToken = Cookies.get('anon-refresh-token');
  const authType = Cookies.get('auth-type');
  if (cartId) {
    if (authType === 'password' && accessToken) {
      const cart = await getCartById(accessToken, cartId);
      const formattedCart = cart.lineItems.map((lineItem) => ({
        productId: lineItem.productId,
        id: lineItem.id,
      }));
      return formattedCart;
    }
    if (anonRefreshToken && !anonToken) {
      const newToken = await getNewToken(anonRefreshToken);
      Cookies.set('anon-token', newToken.accessToken, { expires: 2 });
      anonToken = newToken.accessToken;
    }
    if (anonToken) {
      const cart = await getCartById(anonToken, cartId);
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
