import React from 'react';
import './App.scss';
import SigninPage from './pages/Signin/SigninPage';
import Header from './components/header/header';

function App(): JSX.Element {
  return (
    <>
      <Header />
      <SigninPage />
    </>
  );
}

export default App;
