import React from 'react';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import Home from './pages/Home';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegistrationPage />} />
    </Routes>
  );
}

export default App;
