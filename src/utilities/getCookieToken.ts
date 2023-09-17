import { getNewToken } from '@src/services/AuthService/AuthService';
import Cookies from 'js-cookie';

async function getCookieToken(): Promise<string> {
  const threeHours = 180 / (24 * 60);
  const currentDate = new Date();
  const currentPlusFiveMinutes = currentDate.getTime() + 250000;

  const authType = Cookies.get('auth-type');
  const accessToken = Cookies.get('access-token');
  let anonToken = Cookies.get('anon-token');
  const anonRefreshToken = Cookies.get('anon-refresh-token');
  const anonTokenExpires = Cookies.get('anon-token-expires');

  if (anonTokenExpires) {
    const anonExpiryDate = new Date(anonTokenExpires);

    if (currentPlusFiveMinutes >= anonExpiryDate.getTime()) {
      anonToken = '';
      Cookies.remove('anon-token');
      Cookies.remove('anon-token-expires');
    }
  }

  if (authType === 'password' && accessToken) return accessToken;

  if (anonToken) return anonToken;

  if (anonRefreshToken) {
    const token = await getNewToken(anonRefreshToken);
    Cookies.set('anon-token', token.accessToken, { expires: threeHours });
    Cookies.set('anon-refresh-token', anonRefreshToken, { expires: 200 });
    currentDate.setHours(currentDate.getHours() + 3);
    Cookies.set('anon-token-expires', currentDate.toISOString(), { expires: threeHours });
    return token.accessToken;
  }

  return '';
}

export default getCookieToken;
