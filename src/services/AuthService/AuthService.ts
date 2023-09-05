import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import { ResponseErrorItem } from '@interfaces/Errors';
import { CustomerData, CustomerDraft, CustomersId, SendAddress } from '@interfaces/Customer';
import 'toastify-js/src/toastify.css';
import { Cart } from '@interfaces/Cart';
import Cookies from 'js-cookie';

const authHost = 'https://auth.europe-west1.gcp.commercetools.com';
const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';
const clientId = 'CBJ0upgR5dDSi7L9JIOeY-Ba';
const clientSecret = '2uZuBnnoXOtyVe8v_1oXCKybDsqEgAtS';
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
  refreshToken: string;
}> => {
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

const sendData = async (data: SendAddress, id: string, addressId: string): Promise<CustomersId> => {
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  const response = await axios.post(
    `${apiUrl}/${projectKey}/me`,
    {
      version: currentVersion,
      actions: [
        {
          action: 'changeAddress',
          addressId: `${addressId}`,
          address: data,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('access-token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

const changePasswordRequest = async (
  currentPassword: string,
  newPassword: string,
): Promise<CustomersId | undefined> => {
  let errorText;
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  try {
    const response = await axios.post(
      `${apiUrl}/${projectKey}/me/password`,
      {
        version: currentVersion,
        currentPassword: newPassword,
        newPassword: currentPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('access-token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
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

const changeEmailRequest = async (newEmail: string): Promise<CustomersId | undefined> => {
  let errorText;
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  try {
    const response = await axios.post(
      `${apiUrl}/${projectKey}/me`,
      {
        version: currentVersion,
        actions: [
          {
            action: 'changeEmail',
            email: newEmail,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('access-token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
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

const changeFirstNameRequest = async (firstName: string): Promise<CustomersId | undefined> => {
  let errorText;
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  try {
    const response = await axios.post(
      `${apiUrl}/${projectKey}/me`,
      {
        version: currentVersion,
        actions: [
          {
            action: 'setFirstName',
            firstName,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('access-token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
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

const changeDateofBirthRequest = async (dateofBirth: string): Promise<CustomersId | undefined> => {
  let errorText;
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  try {
    const response = await axios.post(
      `${apiUrl}/${projectKey}/me`,
      {
        version: currentVersion,
        actions: [
          {
            action: 'setDateOfBirth',
            dateOfBirth: String(dateofBirth),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('access-token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
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

const changeLastNameRequest = async (lastName: string): Promise<CustomersId | undefined> => {
  let errorText;
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  try {
    const response = await axios.post(
      `${apiUrl}/${projectKey}/me`,
      {
        version: currentVersion,
        actions: [
          {
            action: 'setLastName',
            lastName,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('access-token')}`,
          'Content-Type': 'application/json',
        },
      },
    );

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

const requestRemoveAddress = async (addressId: string): Promise<CustomersId> => {
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  const response = await axios.post(
    `${apiUrl}/${projectKey}/me`,
    {
      version: currentVersion,
      actions: [
        {
          action: 'removeAddress',
          addressId,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('access-token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  console.log('resp:', response.data);
  return response.data;
};

const requestAddShippingAddress = async (
  streetName: string,
  postalCode: string,
  city: string,
  country: string,
): Promise<CustomersId> => {
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  const response = await axios.post(
    `${apiUrl}/${projectKey}/me`,
    {
      version: currentVersion,
      actions: [
        {
          action: 'addAddress',
          address: {
            streetName,
            postalCode,
            city,
            country,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('access-token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

const requestIdShippingAddress = async (idAddress: string): Promise<CustomersId> => {
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  const response = await axios.post(
    `${apiUrl}/${projectKey}/me`,
    {
      version: currentVersion,
      actions: [
        {
          action: 'addShippingAddressId',
          addressId: idAddress,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('access-token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

const requestIdBillingAddress = async (idAddress: string): Promise<CustomersId> => {
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  const response = await axios.post(
    `${apiUrl}/${projectKey}/me`,
    {
      version: currentVersion,
      actions: [
        {
          action: 'addBillingAddressId',
          addressId: idAddress,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('access-token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

const requestAddBillingAddress = async (
  streetName: string,
  postalCode: string,
  city: string,
  country: string,
): Promise<CustomersId> => {
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  const response = await axios.post(
    `${apiUrl}/${projectKey}/me`,
    {
      version: currentVersion,
      actions: [
        {
          action: 'addAddress',
          address: {
            streetName,
            postalCode,
            city,
            country,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('access-token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

const requestDefaultBillingAddress = async (addressId: string): Promise<CustomersId> => {
  console.log(addressId);
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  const response = await axios.post(
    `${apiUrl}/${projectKey}/me`,
    {
      version: currentVersion,
      actions: [
        {
          action: 'setDefaultBillingAddress',
          addressId,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('access-token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

const requestDefaultShippingAddress = async (addressId: string): Promise<CustomersId> => {
  const profileResponse = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
      'Content-Type': 'application/json',
    },
  });
  const currentVersion = profileResponse.data.version;
  const response = await axios.post(
    `${apiUrl}/${projectKey}/me`,
    {
      version: currentVersion,
      actions: [
        {
          action: 'setDefaultShippingAddress',
          addressId,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('access-token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export {
  registerUser,
  logInUser,
  getAnonymousAccessToken,
  createCart,
  getCustomerId,
  sendData,
  changePasswordRequest,
  changeEmailRequest,
  changeLastNameRequest,
  changeFirstNameRequest,
  changeDateofBirthRequest,
  requestRemoveAddress,
  requestAddShippingAddress,
  requestIdShippingAddress,
  requestIdBillingAddress,
  requestAddBillingAddress,
  requestDefaultBillingAddress,
  requestDefaultShippingAddress,
};
