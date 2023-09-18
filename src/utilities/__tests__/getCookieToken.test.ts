import Cookies from 'js-cookie';
// import { getNewToken } from '@src/services/AuthService/AuthService';
import '@testing-library/jest-dom';
import getCookieToken from '../getCookieToken';

jest.mock('js-cookie');

describe('getCookieToken', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns access token when auth type is password', async () => {
    const mockGet = jest.spyOn(Cookies, 'get');
    mockGet.mockImplementation(() => ({ 'access-token': 'access-token-value' }));

    const token = await getCookieToken();
    expect(token).toStrictEqual({ 'access-token': 'access-token-value' });
  });
  it('returns empty string when no tokens are present', async () => {
    const mockGet = jest.spyOn(Cookies, 'get');
    mockGet.mockReturnValue({ token: '' });

    const token = await getCookieToken();
    expect(token).toStrictEqual({ token: '' });
  });

  it('returns anonymous token when present', async () => {
    const mockGet = jest.spyOn(Cookies, 'get');
    mockGet.mockImplementation((): { [key: string]: string } => ({
      anonToken: 'anon-token-value',
    }));

    const token = await getCookieToken();
    expect(token).toStrictEqual({ anonToken: 'anon-token-value' });
  });
});
