import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import LoginPage from './pages/Login/LoginPage';
import NotFound from './pages/NotFound/NotFound';
import RegistrationPage from './pages/Register/RegistrationPage';

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
    </>
  );
}

export default App;
