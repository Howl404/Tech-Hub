import { getNewToken } from '@src/services/AuthService/AuthService';
import { getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';

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
    Toastify({
      text: 'Product is removed from the cart',
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)',
      },
    }).showToast();
    return formattedCart;
  }
  return false;
};

export default removeItemCart;
