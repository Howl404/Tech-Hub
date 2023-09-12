import axios from 'axios';

import { Cart } from '@interfaces/Cart';

const projectKey = 'rs-alchemists-ecommerce';
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

const addDiscountCode = async (token: string, cartId: string, version: number, code: string): Promise<Cart> => {
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

  const response = await axios.post(cartEndpoint, JSON.stringify(requestBody), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const cart: Cart = response.data;
  return cart;
};

const removeDiscountCode = async (
  token: string,
  cartId: string,
  version: number,
  discountId: string,
): Promise<Cart> => {
  const cartEndpoint = `${apiUrl}/${projectKey}/me/carts/${cartId}`;

  const requestBody = {
    version,
    actions: [
      {
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discountCode',
          id: discountId,
        },
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

// const removeCart = async (token: string, cartId: string, version: string): Promise<Cart> => {
//   const url = `${apiUrl}/${projectKey}/me/carts/${cartId}/?version=${version}`;

//   const response = await axios.delete(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });
//   // console.log(response);
//   const cart: Cart = response.data;
//   return cart;
// };

export {
  createCart,
  addToCart,
  removeFromCart,
  addDiscountCode,
  removeDiscountCode,
  getCartByCustomerId,
  getCartByAnonId,
  getCartById,
  // removeCart,
};
