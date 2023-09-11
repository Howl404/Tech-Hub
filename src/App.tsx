import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import Home from '@pages/Home/Home';
import LoginPage from '@pages/Login/LoginPage';
import NotFound from '@pages/NotFound/NotFound';
import RegistrationPage from '@pages/Register/RegistrationPage';
import Cookies from 'js-cookie';
import CatalogPage from '@pages/Catalog/CatalogPage';
import Header from '@components/Header/Header';
import ProductPage from '@pages/Product/ProductPage';
import AccountDashboard from '@pages/AccountDashboard/AccountDashboard';
import { getClientAccessToken } from '@services/AuthService/AuthService';
import AuthData from '@interfaces/AuthData';
import Basket from './pages/Basket/Basket';

function App(): JSX.Element {
  const navigate = useNavigate();
  const [auth, setIsAuth] = useState(false);
  const onLogOut = (): void => {
    Object.keys(Cookies.get()).forEach((item) => {
      Cookies.remove(item);
    });
    getClientAccessToken().then((result) => {
      Cookies.set('access-token', result.accessToken, { expires: 2 });
      Cookies.set('auth-type', 'anon', { expires: 2 });
    });
    navigate('/');
    setIsAuth(false);
  };

  const [authData, setAuthData] = useState<AuthData>({
    anonToken: '',
    anonRefreshToken: '',
    authType: '',
    cartId: '',
    accessToken: '',
    refreshToken: '',
  });

  console.log(authData); // authData never used error

  const checkLogIn = (): void => {
    if (Cookies.get('auth-type') !== undefined || Cookies.get('auth-type') !== 'anon') setIsAuth(true);
  };

  useEffect(() => {
    const accessToken = Cookies.get('access-token');
    const refreshToken = Cookies.get('refresh-token');
    const authType = Cookies.get('auth-type');
    const anonToken = Cookies.get('anon-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    const cartId = Cookies.get('cart-id');

    setAuthData((prevAuthData) => ({
      ...prevAuthData,
      accessToken: accessToken || prevAuthData.accessToken,
      refreshToken: refreshToken || prevAuthData.refreshToken,
      authType: authType || prevAuthData.authType,
      anonToken: anonToken || prevAuthData.anonToken,
      anonRefreshToken: anonRefreshToken || prevAuthData.anonRefreshToken,
      cartId: cartId || prevAuthData.cartId,
    }));

    if (authType === 'password') {
      setIsAuth(true);
    } else {
      getClientAccessToken().then((result) => {
        Cookies.set('access-token', result.accessToken, { expires: 2 });
        Cookies.set('auth-type', 'anon', { expires: 2 });
      });
    }
  }, []);
  return (
    <>
      <Header authh={auth} logOut={onLogOut} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationPage checkLogIn={checkLogIn} />} />
        <Route path="/login" element={<LoginPage checkLogIn={checkLogIn} />} />
        <Route path="/products/:key?" element={<ProductPage />} />
        <Route path="/MyAccount/*" element={<AccountDashboard onLogOut={onLogOut} />} />
        <Route path="/catalog/:categoryslug?/:subcategoryslug?" element={<CatalogPage />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
