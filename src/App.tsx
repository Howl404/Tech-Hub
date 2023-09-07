import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import Home from '@pages/Home/Home';
import LoginPage from '@pages/Login/LoginPage';
import NotFound from '@pages/NotFound/NotFound';
import RegistrationPage from '@pages/Register/RegistrationPage';
import Cookies from 'js-cookie';
import Header from './components/Header/Header';

function App(): JSX.Element {
  const navigate = useNavigate();
  const [auth, setIsAuth] = useState(false);
  const onLogOut = (): void => {
    Object.keys(Cookies.get()).forEach((item) => {
      Cookies.remove(item);
      navigate('/');
      setIsAuth(false);
    });
    getAnonymousAccessToken().then((result) => {
      Cookies.set('access-token', result.accessToken, { expires: 2 });
      Cookies.set('auth-type', 'anon', { expires: 2 });
    });
  };
  const checkLogInn = (): boolean => Cookies.get('auth-type') !== undefined && Cookies.get('auth-type') !== 'anon';

  const checkLogIn = (): void => {
    if (Cookies.get('auth-type') !== undefined || Cookies.get('auth-type') !== 'anon') setIsAuth(true);
  };

  useEffect(() => {
    const res = checkLogInn();
    if (res) {
      setIsAuth(true);
    } else {
      getAnonymousAccessToken().then((result) => {
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
