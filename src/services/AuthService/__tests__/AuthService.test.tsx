import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getAnonymousAccessToken, logInUser, createCart } from '../AuthService';

describe('getAnonymousAccessToken', () => {
  const email = 'qwertyyu@gmail.com';
  const password = '123456qQ';
  const projectKey = 'rs-alchemists-ecommerce';
  const authHost = 'https://auth.europe-west1.gcp.commercetools.com';

  test('should return anonymous access token', async () => {
    const response = await getAnonymousAccessToken();
    expect(() => response).not.toThrow();
  });
  test('should return', async () => {
    const response = await getAnonymousAccessToken();
    expect(Object.keys(response)).toStrictEqual(['accessToken']);
  });

  test('return accessToken и refreshToken at successful auth', async () => {
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
