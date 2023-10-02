import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import { Cart } from '@interfaces/Cart';
import { ResponseErrorItem } from '@src/interfaces/Errors';

const projectKey = 'ecomapp2'
const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';

const createCart = async (token: string): Promise<Cart> => {
  const cartEndpoint = `${apiUrl}/${projectKey}/me/carts`;

  const requestBody = {
    currency: 'EUR',
  };

  const response = await axios.post(cartEndpoint, JSON.stringify(requestBody), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const cart: Cart = response.data;
  return cart;
};

const addToCart = async (
  token: string,
  cartId: string,
  productSku: string,
  version: number,
  quantity: number,
): Promise<Cart> => {
  const cartEndpoint = `${apiUrl}/${projectKey}/me/carts/${cartId}`;

  const requestBody = {
    version,
    actions: [
      {
        action: 'addLineItem',
        quantity,
        sku: productSku,
      },
    ],
  };

  const response = await axios.post(cartEndpoint, JSON.stringify(requestBody), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const cart: Cart = response.data;
  return cart;
};

const getCartByCustomerId = async (token: string, customerId: string): Promise<Cart> => {
  let url = `${apiUrl}/${projectKey}/me/carts`;

  url += `?where=customerId="${customerId}"`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const cart: Cart = response.data.results[0];
  return cart;
};

const getCartByAnonId = async (token: string, anonymousId: string): Promise<Cart> => {
  let url = `${apiUrl}/${projectKey}/me/carts`;

  url += `?where=anonymousId="${anonymousId}"`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const cart: Cart = response.data.results[0];
  return cart;
};

const getCartById = async (token: string, id: string): Promise<Cart> => {
  const url = `${apiUrl}/${projectKey}/me/carts/${id}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const cart: Cart = response.data;
  return cart;
};

const removeFromCart = async (
  token: string,
  cartId: string,
  itemId: string,
  version: number,
  quantity?: number,
): Promise<Cart> => {
  const cartEndpoint = `${apiUrl}/${projectKey}/me/carts/${cartId}`;

  const requestBody = {
    version,
    actions: [
      {
        action: 'removeLineItem',
        lineItemId: itemId,
        quantity,
      },
    ],
  };

  const response = await axios.post(cartEndpoint, JSON.stringify(requestBody), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const cart: Cart = response.data;
  return cart;
};

const addDiscountCode = async (
  token: string,
  cartId: string,
  version: number,
  code: string,
): Promise<Cart | undefined> => {
  const cartEndpoint = `${apiUrl}/${projectKey}/me/carts/${cartId}`;

  const requestBody = {
    version,
    actions: [
      {
        action: 'addDiscountCode',
        code,
      },
    ],
  };

  let errorText;
  try {
    const response = await axios.post(cartEndpoint, JSON.stringify(requestBody), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const cart: Cart = response.data;
    return cart;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.data) {
      if (e.response.data?.errors.length) {
        errorText = e.response.data.errors
          .map((errItem: ResponseErrorItem) => errItem.detailedErrorMessage || errItem.message)
          .join('\r\n');
      } else {
        errorText = e.response.data?.message;
      }
    } else if (e instanceof Error) {
      errorText = e.message;
    } else if (typeof e === 'string') {
      errorText = e;
    }
  }

  Toastify({
    text: errorText,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: 'linear-gradient(to right, #ff0000, #fdacac)',
    },
  }).showToast();
  return undefined;
};

const removeDiscountCode = async (
  token: string,
  cartId: string,
  version: number,
  discountId: string,
): Promise<Cart | undefined> => {
  const cartEndpoint = `${apiUrl}/${projectKey}/me/carts/${cartId}`;

  const requestBody = {
    version,
    actions: [
      {
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discount-code',
          id: discountId,
        },
      },
    ],
  };
  let errorText;
  try {
    const response = await axios.post(cartEndpoint, JSON.stringify(requestBody), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const cart: Cart = response.data;
    return cart;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.data) {
      if (e.response.data?.errors.length) {
        errorText = e.response.data.errors
          .map((errItem: ResponseErrorItem) => errItem.detailedErrorMessage || errItem.message)
          .join('\r\n');
      } else {
        errorText = e.response.data?.message;
      }
    } else if (e instanceof Error) {
      errorText = e.message;
    } else if (typeof e === 'string') {
      errorText = e;
    }
  }

  Toastify({
    text: errorText,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: 'linear-gradient(to right, #ff0000, #fdacac)',
    },
  }).showToast();
  return undefined;
};

export {
  createCart,
  addToCart,
  removeFromCart,
  addDiscountCode,
  removeDiscountCode,
  getCartByCustomerId,
  getCartByAnonId,
  getCartById,
};
