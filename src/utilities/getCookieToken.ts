import { getNewToken } from '@src/services/AuthService/AuthService';
import Cookies from 'js-cookie';

async function getToken(): Promise<string> {
  const authType = Cookies.get('auth-type');
  const accessToken = Cookies.get('access-token');
  const anonToken = Cookies.get('anon-token');
  const anonRefreshToken = Cookies.get('anon-refresh-token');

  if (authType === 'password' && accessToken) return accessToken;

  if (anonToken) return anonToken;

  if (anonRefreshToken) {
    const item = await getNewToken(anonRefreshToken);
    Cookies.set('anon-token', item.accessToken, { expires: 2 });
    return item.accessToken;
  }
  return '';
}

export default getToken;
