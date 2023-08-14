import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import RegistrationPage from './pages/RegistrationPage';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
