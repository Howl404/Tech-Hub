import { ResponseErrorItem } from '@src/interfaces/Errors';
import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import Cookies from 'js-cookie';
import 'toastify-js/src/toastify.css';
import { DiscountCode } from '@src/interfaces/Discount';

const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';
const projectKey = 'rs-alchemists-ecommerce';

const getDiscountCodes = async (): Promise<DiscountCode[] | undefined> => {
  const token = Cookies.get('access-token');
  const url = `${apiUrl}/${projectKey}/discount-codes`;
  let errorText;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results;
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

const getDiscountCodeById = async (id: string): Promise<DiscountCode | undefined> => {
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

export { getDiscountCodes, getDiscountCodeById };
