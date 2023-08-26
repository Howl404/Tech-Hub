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

export default getProducts;
