import { getCartById } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';

const getFormattedCart = async (): Promise<{ productId: string; id: string }[] | false> => {
  const cartId = Cookies.get('cart-id');
  const anonToken = Cookies.get('anon-token');
  const accessToken = Cookies.get('access-token');
  const authType = Cookies.get('auth-type');
  if (cartId && authType === 'password' && accessToken) {
    const cart = await getCartById(accessToken, cartId);
    const formattedCart = cart.lineItems.map((lineItem) => ({
      productId: lineItem.productId,
      id: lineItem.id,
    }));
    return formattedCart;
  }
  if (cartId && anonToken) {
    const cart = await getCartById(anonToken, cartId);
    const formattedCart = cart.lineItems.map((lineItem) => ({
      productId: lineItem.productId,
      id: lineItem.id,
    }));
    return formattedCart;
  }
  return false;
};

export default getFormattedCart;
