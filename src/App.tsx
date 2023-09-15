import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import LoginPage from '@pages/Login/LoginPage';
import NotFound from '@pages/NotFound/NotFound';
import RegistrationPage from '@pages/Register/RegistrationPage';
import Cookies from 'js-cookie';
import CatalogPage from '@pages/Catalog/CatalogPage';
import Header from '@components/Header/Header';
import ProductPage from '@pages/Product/ProductPage';
import AccountDashboard from '@pages/AccountDashboard/AccountDashboard';
import { getClientAccessToken, getCustomerId } from '@services/AuthService/AuthService';
import Home from '@pages/Home/Home';
import Basket from '@pages/Basket/Basket';
import ClipLoader from 'react-spinners/ClipLoader';
import returnCartPrice from './utilities/returnCartPrice';
import { getCartByCustomerId } from './services/CartService/CartService';

function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [auth, setIsAuth] = useState(false);
  const [totalSumInCart, setTotalSumInCart] = useState(0);

  const onLogOut = (): void => {
    setIsLoading(true);
    Object.keys(Cookies.get()).forEach((item) => {
      Cookies.remove(item);
    });
    getClientAccessToken().then((result) => {
      Cookies.set('access-token', result.accessToken, { expires: 2 });
      Cookies.set('auth-type', 'anon', { expires: 2 });
      setIsLoading(false);
    });
    setTotalSumInCart(0);
    navigate('/');
    setIsAuth(false);
  };

  const checkLogIn = async (): Promise<void> => {
    setIsLoading(true);
    if (Cookies.get('auth-type') !== undefined || Cookies.get('auth-type') !== 'anon') setIsAuth(true);

    getCustomerId().then(async (item) => {
      const token = Cookies.get('access-token');
      if (token) {
        try {
          const result = await getCartByCustomerId(token, item.id);
          Cookies.set('cart-id', result.id, { expires: 2 });

          const cartPrice = await returnCartPrice();
          if (cartPrice !== false) {
            setTotalSumInCart(cartPrice);
          }
        } catch (error) {
          // no cart found
        }
      }
    });

    setIsLoading(false);
  };

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true);
      const accessToken = Cookies.get('access-token');
      const authType = Cookies.get('auth-type');
      if (authType === 'password') {
        setIsAuth(true);
      } else if (!accessToken) {
        const result = await getClientAccessToken();
        Cookies.set('access-token', result.accessToken, { expires: 2 });
        Cookies.set('auth-type', 'anon', { expires: 2 });
      }
      const cartPrice = await returnCartPrice();
      if (cartPrice !== false) {
        setTotalSumInCart(cartPrice);
      }

      setIsLoading(false);
    }
    fetchData();
  }, []);

  return isLoading ? (
    <div className="centered-loader">
      <ClipLoader size={160} />
    </div>
  ) : (
    <>
      <Header authh={auth} logOut={onLogOut} totalSumInCart={totalSumInCart} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationPage checkLogIn={checkLogIn} />} />
        <Route path="/login" element={<LoginPage checkLogIn={checkLogIn} />} />
        <Route path="/products/:key?" element={<ProductPage setTotalSumInCart={setTotalSumInCart} />} />
        <Route path="/MyAccount/*" element={<AccountDashboard onLogOut={onLogOut} />} />
        <Route
          path="/catalog/:categoryslug?/:subcategoryslug?"
          element={<CatalogPage setTotalSumInCart={setTotalSumInCart} />}
        />
        <Route path="/basket" element={<Basket setTotalSumInCart={setTotalSumInCart} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
