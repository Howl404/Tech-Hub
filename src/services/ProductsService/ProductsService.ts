import { Category } from '@src/interfaces/Category';
import { Product } from '@src/interfaces/Product';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';
const projectKey = 'rs-alchemists-ecommerce';

const getProducts = async (): Promise<{
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
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
): Promise<{
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
}> => {
  const token = Cookies.get('access-token');
  let url = `${apiUrl}/${projectKey}/product-projections/search?filter=${filter}&sort=${sort}`;

  if (text) {
    url += `&text.en=${text}`;
  }

  if (brand) {
    url += `&filter=variants.attributes.brand:"${brand}"`;
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { getProducts, getCategories, getCategory, getProductsByCategory };
