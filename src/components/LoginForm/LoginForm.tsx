import React, { useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.scss';
import '@components/Button/Button.scss';
import '@components/Heading/Heading.scss';
import { logInUser } from '@services/AuthService/AuthService';
import FormInput from '@components/FormInput/FormInput';

function isValidEmail(email: string): string {
  const atIndex = email.indexOf('@');
  const dotIndex = email.lastIndexOf('.');

  if (atIndex < 1) {
    return 'Missing symbol @';
  }

  const localPart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex + 1);

  if (!localPart.match(/^[a-zA-Z0-9._%+-]+$/)) {
    return 'Email contains invalid characters';
  }

  if (!domainPart.match(/^[a-zA-Z0-9.-]+$/)) {
    return 'The domain part of the address with an error';
  }

  if (dotIndex === -1 || dotIndex < atIndex + 2) {
    return 'There is no point between the domain part and the top-level domain';
  }

  const tld = email.substring(dotIndex + 1);
  if (!tld.match(/^[a-zA-Z]{2,}$/)) {
    return 'The top-level domain is written with an error';
  }

  return 'true';
}

function isValidatePassword(password: string): string {
  if (password.length < 8) {
    return 'The password must be more than 8 characters long';
  }

  if (!/[A-Z]/.test(password)) {
    return 'The password must contain capital letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'The password must contain a lowercase letter';
  }

  if (!/\d/.test(password)) {
    return 'The password must contain a digit';
  }

  if (/^\s|\s$/.test(password)) {
    return 'Contains spaces';
  }

  return 'true';
}

function SignInForm({ checkLogIn }: { checkLogIn: () => void }): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const authType = Cookies.get('auth-type');
    if (authType === 'password') {
      navigate('/');
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState('');
  const [passwordValid, setPasswordValid] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateField = (fieldName: string, value: string, element: HTMLElement): void => {
    let emailValidate = emailValid;
    let passwordValidate = passwordValid;
    if (fieldName === 'email') {
      setEmail(value);
      emailValidate = isValidEmail(value);
      if (emailValidate === 'true') {
        setEmailError('');
        setEmailValid(emailValidate);
      } else {
        element.classList.add('error');
        setEmailError(emailValidate);
      }
    } else {
      setPassword(value);
      passwordValidate = isValidatePassword(value);
      if (passwordValidate === 'true') {
        setPasswordError('');
        setPasswordValid(passwordValidate);
      } else {
        element.classList.add('error');
        setPasswordError(passwordValidate);
      }
    }

    if (passwordValidate === 'true' && emailValidate === 'true') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    validateField(id, value, e.target);
    if (id === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const showPassword = (e: MouseEvent<HTMLInputElement>): void => {
    const targetElement = e.target;

    if (targetElement instanceof HTMLInputElement) {
      const node = targetElement.previousElementSibling as HTMLInputElement;
      if (targetElement.checked === true) {
        node.type = 'text';
        node.style.setProperty('-webkit-text-security', 'none');
        node.style.setProperty('text-security', 'none');
      } else {
        node.type = 'password';
        node.style.setProperty('-webkit-text-security', 'disc');
        node.style.setProperty('text-security', 'disc');
      }
    }
  };

  const onSignIn = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    logInUser(email, password).then((response) => {
      if (response) {
        Cookies.set('access-token', response.accessToken, { expires: 2 });
        Cookies.set('refresh-token', response.refreshToken, { expires: 200 });
        Cookies.set('auth-type', 'password', { expires: 2 });
        checkLogIn();
        navigate('/');
      }
    });
  };

  const showButton = (
    <input type="checkbox" className="btn btn__show-pass" onClick={showPassword} disabled={!password.length} />
  );

  return (
    <div className="container__form">
      <form className="login-form">
        <h2 className="login-form__title main-heading">Log in</h2>
        <FormInput
          label="Email *"
          errorMessage={emailError}
          onChange={handleUserInput}
          id="email"
          type="email"
          pattern="*"
          title="Valid email address"
          value={email}
        />
        <FormInput
          label="Password *"
          errorMessage={passwordError}
          onChange={handleUserInput}
          id="password"
          type="password"
          pattern="*"
          title="Valid password"
          value={password}
          button={showButton}
        />
        <div className="wrapper-btn">
          <button type="submit" className="btn btn-enabled" disabled={!formValid} onClick={onSignIn}>
            Log in
          </button>
          <Link to="/register">
            <button type="button" className="btn btn-disabled">
              register
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
