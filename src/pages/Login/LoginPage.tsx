import React from 'react';
import LoginForm from '@components/LoginForm/LoginForm';

function LoginPage({ checkLogIn }: { checkLogIn: () => void }): JSX.Element {
  return <LoginForm checkLogIn={checkLogIn} />;
}

export default LoginPage;
