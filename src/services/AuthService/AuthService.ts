import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import { ResponseErrorItem } from '@interfaces/Errors';
import { CustomerData, CustomerDraft, CustomersId, SendAddress } from '@interfaces/Customer';
import 'toastify-js/src/toastify.css';
import Cookies from 'js-cookie';
import { Cart } from '@src/interfaces/Cart';

const authHost = 'https://auth.europe-west1.gcp.commercetools.com';
const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';

const apiId = "tSqpnzsWeYPl3uKgnJSrsK1l";
const apiSecret = "YGsSDp40CizMeLQPOgfxJRQ8g9DgfwxV"
const projectKey = 'ecomapp2'
const apiScope = "view_categories:ecomapp2 manage_my_shopping_lists:ecomapp2 view_order_edits:ecomapp2 view_published_products:ecomapp2 view_orders:ecomapp2 manage_my_profile:ecomapp2 view_types:ecomapp2 create_anonymous_token:ecomapp2 view_products:ecomapp2 view_messages:ecomapp2 view_shipping_methods:ecomapp2 view_cart_discounts:ecomapp2 view_shopping_lists:ecomapp2 manage_my_payments:ecomapp2 manage_my_orders:ecomapp2 manage_my_business_units:ecomapp2 view_standalone_prices:ecomapp2 view_discount_codes:ecomapp2"

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

const getClientAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  const authHeader = `Basic ${btoa(`${apiId}:${apiSecret}`)}`;
  const response = await axios.post(`${authHost}/oauth/token`, `grant_type=client_credentials&scope=${apiScope}`, {
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const accessToken = response.data.access_token;
  return { accessToken };
};

const getAnonymousToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const scope = `create_anonymous_token:${projectKey} manage_my_orders:${projectKey} manage_my_profile:${projectKey}`;
  const authHeader = `Basic ${btoa(`${apiId}:${apiSecret}`)}`;
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

const logInUserWithCart = async (
  email: string,
  password: string,
): Promise<{ cart: Cart | undefined; customer: CustomerData } | undefined> => {
  let errorText;
  try {
    const token = Cookies.get('anon-token');
    const authHeader = `Bearer ${token}`;
    const requestBody = {
      email,
      password,
    };

    const response = await axios.post(`${apiUrl}/${projectKey}/me/login`, requestBody, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    const { customer, cart } = response.data;

    return { customer, cart };
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
    const authHeader = `Basic ${btoa(`${apiId}:${apiSecret}`)}`;
    const requestBody = `grant_type=password&username=${email}&password=${password}&scope=${apiScope}`;

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

const getCustomerId = async (): Promise<CustomersId> => {
  const response = await axios.get(`${apiUrl}/${projectKey}/me`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('access-token')}`,
    },
  });
  return response.data;
};

const getNewToken = async (
  refreshToken: string,
): Promise<{
  accessToken: string;
}> => {
  const authHeader = `Basic ${btoa(`${apiId}:${apiSecret}`)}`;
  const response = await axios.post(
    `${authHost}/oauth/token`,
    `grant_type=refresh_token&refresh_token=${refreshToken}`,
    {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const accessToken = response.data.access_token;
  return { accessToken };
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
  logInUserWithCart,
  getAnonymousToken,
  getClientAccessToken,
  getCustomerId,
  getNewToken,
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
