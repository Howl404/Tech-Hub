import { getNewToken } from '@src/services/AuthService/AuthService';
import { getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';

const removeItemCart = async (product: string): Promise<{ productId: string; id: string }[] | false> => {
  const cartId = Cookies.get('cart-id');
  const anonToken = Cookies.get('anon-token');
  const authType = Cookies.get('auth-type');
  const accessToken = Cookies.get('access-token');
  const anonRefreshToken = Cookies.get('anon-refresh-token');
  let resultCart;

  if (cartId) {
    if (authType === 'password' && accessToken) {
      const cart = await getCartById(accessToken, cartId);
      resultCart = await removeFromCart(accessToken, cart.id, product, cart.version);
    } else if (anonToken) {
      const cart = await getCartById(anonToken, cartId);
      resultCart = await removeFromCart(anonToken, cart.id, product, cart.version);
    } else if (anonRefreshToken) {
      const response = await getNewToken(anonRefreshToken);
      Cookies.set('anon-token', response.accessToken, { expires: 2 });

      const cart = await getCartById(response.accessToken, cartId);
      resultCart = await removeFromCart(response.accessToken, cart.id, product, cart.version);
    }
  }

  if (resultCart) {
    const formattedCart = resultCart.lineItems.map((lineItem) => ({
      productId: lineItem.productId,
      id: lineItem.id,
    }));
    // setCartList(formattedCart);
    return formattedCart; // Возвращаем formattedCart как результат промиса
  }
  return false; // Возвращаем пустой массив, если resultCart не определен
};

export default removeItemCart;
