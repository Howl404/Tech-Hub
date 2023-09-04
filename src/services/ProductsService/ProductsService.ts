import { ResponseErrorItem } from '@src/interfaces/Errors';
import { Product } from '@src/interfaces/Product';
import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import Cookies from 'js-cookie';
import 'toastify-js/src/toastify.css';

const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';
const projectKey = 'rs-alchemists-ecommerce';

const getProductById = async (id: string): Promise<Product | undefined> => {
  const token = Cookies.get('access-token');
  const url = `${apiUrl}/${projectKey}/products/${id}`;
  let errorText;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
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

const getProductByKey = async (key: string): Promise<Product> => {
  const token = Cookies.get('access-token');
  const url = `${apiUrl}/${projectKey}/products/key=${key}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { getProductByKey, getProductById };
