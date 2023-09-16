import { getCartById, removeFromCart } from '@src/services/CartService/CartService';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import getCookieToken from './getCookieToken';

const removeItemCart = async (product: string): Promise<{ productId: string; id: string }[] | false> => {
  const cartId = Cookies.get('cart-id');
  let resultCart;

  if (cartId) {
    const token = await getCookieToken();
    if (token) {
      const cart = await getCartById(token, cartId);
      resultCart = await removeFromCart(token, cart.id, product, cart.version);
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
