import { ResponseErrorItem } from '@src/interfaces/Errors';
import { ProductDetailedPage, ProductCatalog } from '@src/interfaces/Product';
import { Category } from '@src/interfaces/Category';
import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import Cookies from 'js-cookie';
import 'toastify-js/src/toastify.css';

const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';
const projectKey = 'ecomapp2';

const getProductById = async (id: string): Promise<ProductDetailedPage | undefined> => {
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

const getProductByKey = async (key: string): Promise<ProductDetailedPage> => {
  const token = Cookies.get('access-token');
  const url = `${apiUrl}/${projectKey}/products/key=${key}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getProducts = async (): Promise<{
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: ProductCatalog[];
}> => {
  const token = Cookies.get('access-token');
  const url = `${apiUrl}/${projectKey}/products`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getCategories = async (
  query?: string,
): Promise<{
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Category[];
}> => {
  const token = Cookies.get('access-token');
  let url = `${apiUrl}/${projectKey}/categories`;

  if (query) {
    const encodedQuery = encodeURIComponent(query);
    url += `?where=${encodedQuery}`;
  }
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getCategory = async (key: string): Promise<Category> => {
  const token = Cookies.get('access-token');
  const url = `${apiUrl}/${projectKey}/categories/key=${key}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getProductsByCategory = async (
  filter: string,
  sort: string,
  text?: string,
  brand?: string,
  limit?: number,
  offset?: number,
): Promise<{
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: ProductCatalog[];
}> => {
  const token = Cookies.get('access-token');
  let url = `${apiUrl}/${projectKey}/product-projections/search?filter=${filter}&sort=${sort}`;

  if (text) {
    url += `&text.en=${text}`;
  }

  if (brand) {
    url += `&filter=variants.attributes.brand:"${brand}"`;
  }

  if (limit) {
    url += `&limit=${limit}`;
  }

  if (offset) {
    url += `&offset=${offset}`;
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { getProducts, getCategories, getCategory, getProductsByCategory, getProductByKey, getProductById };
