import axios from 'axios';
import { CustomerData, CustomerDraft } from '../interfaces/Customer';

const authHost = 'https://auth.europe-west1.gcp.commercetools.com';
const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';
const clientId = 'CBJ0upgR5dDSi7L9JIOeY-Ba';
const clientSecret = '2uZuBnnoXOtyVe8v_1oXCKybDsqEgAtS';
const projectKey = 'rs-alchemists-ecommerce';

const registerUser = async (userData: CustomerDraft, token: string): Promise<CustomerData> => {
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
  throw new Error('User registration failed');
};

const getAnonymousAccessToken = async (): Promise<
  | {
      accessToken: string;
      refreshToken: string;
    }
  | undefined
> => {
  const scope = `create_anonymous_token:${projectKey} manage_my_orders:${projectKey} manage_my_profile:${projectKey}`;
  const authHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  const response = await axios.post(
    `${authHost}/oauth/${projectKey}/anonymous/token`,
    `grant_type=client_credentials&scope=${scope}`,
    {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const accessToken = response.data.access_token;
  const refreshToken = response.data.refresh_token;
  return { accessToken, refreshToken };
};

export { registerUser, getAnonymousAccessToken };
