import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import { ResponseErrorItem } from '@interfaces/Errors';
import { CustomerData, CustomerDraft, CustomersId } from '@interfaces/Customer';
import 'toastify-js/src/toastify.css';
import { Cart } from '@interfaces/Cart';
import Cookies from 'js-cookie';

const authHost = 'https://auth.europe-west1.gcp.commercetools.com';
const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';
const clientId = 'CBJ0upgR5dDSi7L9JIOeY-Ba';
const clientSecret = '2uZuBnnoXOtyVe8v_1oXCKybDsqEgAtS';

const anonId = 'Cshtoo22G2afdntJDUBkDtc0';
const anonSecret = '0xZeWTiFELWzFjDBT_vfD48YDRdlfALK';
const anonScope =
  'manage_my_shopping_lists:rs-alchemists-ecommerce manage_my_payments:rs-alchemists-ecommerce view_standalone_prices:rs-alchemists-ecommerce view_cart_discounts:rs-alchemists-ecommerce view_discount_codes:rs-alchemists-ecommerce view_orders:rs-alchemists-ecommerce view_messages:rs-alchemists-ecommerce view_shopping_lists:rs-alchemists-ecommerce create_anonymous_token:rs-alchemists-ecommerce view_shipping_methods:rs-alchemists-ecommerce manage_my_profile:rs-alchemists-ecommerce view_types:rs-alchemists-ecommerce view_categories:rs-alchemists-ecommerce view_order_edits:rs-alchemists-ecommerce manage_my_business_units:rs-alchemists-ecommerce view_products:rs-alchemists-ecommerce manage_my_orders:rs-alchemists-ecommerce';
const projectKey = 'rs-alchemists-ecommerce';

const registerUser = async (userData: CustomerDraft, token: string): Promise<CustomerData | boolean> => {
  let errorText = '';

  try {
    const response = await axios.post(`${apiUrl}/${projectKey}/me/signup`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      const result = response.data;
      return result;
    }
    errorText = response.data.message;
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
  return false;
};

const getAnonymousAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  const authHeader = `Basic ${btoa(`${anonId}:${anonSecret}`)}`;
  const response = await axios.post(`${authHost}/oauth/token`, `grant_type=client_credentials&scope=${anonScope}`, {
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const accessToken = response.data.access_token;
  return { accessToken };
};

const logInUser = async (
  email: string,
  password: string,
): Promise<
  | {
      accessToken: string;
      refreshToken: string;
    }
  | undefined
> => {
  let errorText;
  try {
    const scope = `manage_my_orders:${projectKey} manage_my_profile:${projectKey}`;
    const authHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
    const requestBody = `grant_type=password&username=${email}&password=${password}&scope=${scope}`;

    const response = await axios.post(`${authHost}/oauth/${projectKey}/customers/token`, requestBody, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    return { accessToken, refreshToken };
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

const getCustomerId = async (): Promise<CustomersId> => {
  const response = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
    },
  });
  return response.data;
};

export { registerUser, logInUser, getAnonymousAccessToken, createCart, getCustomerId };
