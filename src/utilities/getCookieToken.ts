import { getNewToken } from '@src/services/AuthService/AuthService';
import Cookies from 'js-cookie';

async function getCookieToken(): Promise<string> {
  const authType = Cookies.get('auth-type');
  const accessToken = Cookies.get('access-token');
  const anonToken = Cookies.get('anon-token');
  const anonRefreshToken = Cookies.get('anon-refresh-token');

  if (authType === 'password' && accessToken) return accessToken;

  if (anonToken) return anonToken;

  if (anonRefreshToken) {
    const token = await getNewToken(anonRefreshToken);
    Cookies.set('anon-token', token.accessToken, { expires: 2 });
    Cookies.set('anon-refresh-token', anonRefreshToken, { expires: 200 });
    return token.accessToken;
  }
  return '';
}

export default getCookieToken;
