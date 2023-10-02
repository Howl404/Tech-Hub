import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getClientAccessToken, logInUser } from '../AuthService';

describe('Get client access token', () => {
  const email = 'qwertyyu@gmail.com';
  const password = '123456qQ';
  const projectKey = 'ecomapp2'
  const authHost = 'https://auth.europe-west1.gcp.commercetools.com';

  test('should return client access token', async () => {
    const response = await getClientAccessToken();
    expect(() => response).not.toThrow();
  });
  test('should return access token', async () => {
    const response = await getClientAccessToken();
    expect(Object.keys(response)).toStrictEqual(['accessToken']);
  });

  test('return accessToken at successful auth', async () => {
    const result = await logInUser(email, password);
    if (result !== undefined) expect(Object.keys(result)).toStrictEqual(['accessToken', 'refreshToken']);
  });

  // test('createCart post', async () => {
  //   const response = await getAnonymousAccessToken();
  //   const result = await createCart(response.accessToken);
  //   expect(Object.keys(result)).toStrictEqual([
  //     'type',
  //     'id',
  //     'version',
  //     'versionModifiedAt',
  //     'lastMessageSequenceNumber',
  //     'createdAt',
  //     'lastModifiedAt',
  //     'lastModifiedBy',
  //     'createdBy',
  //     'anonymousId',
  //     'lineItems',
  //     'cartState',
  //     'totalPrice',
  //     'shippingMode',
  //     'shipping',
  //     'customLineItems',
  //     'discountCodes',
  //     'directDiscounts',
  //     'inventoryMode',
  //     'taxMode',
  //     'taxRoundingMode',
  //     'taxCalculationMode',
  //     'deleteDaysAfterLastModification',
  //     'refusedGifts',
  //     'origin',
  //     'itemShippingAddresses',
  //   ]);
  // });

  test('Error with errorMessage from object response.data.errors', async () => {
    const mock = new MockAdapter(axios);
    const detailedErrorMessage = 'Детальное сообщение об ошибке';
    const errorMessage = 'Сообщение об ошибке';

    mock.onPost(`${authHost}/oauth/${projectKey}/customers/token`).reply(400, {
      errors: [{ message: errorMessage, detailedErrorMessage }],
    });

    const result = await logInUser(email, password);

    expect(result).toBeUndefined();
    mock.reset();
  });
});
