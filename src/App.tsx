import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import SigninPage from './pages/Signin/SigninPage';
import Header from './components/header/header';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound/NotFound';
import RegistrationPage from './pages/RegistrationPage';

function App(): JSX.Element {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
<!--       <SigninPage /> -->
    </>
  );
}

export default App;
