import React, { useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import FormErrors from '@components/FormErrors/FormErrors';
import './LoginForm.scss';
import '@components/Button/Button.scss';
import '@components/Heading/Heading.scss';
import { logInUser } from '@services/AuthService/AuthService';

function isValidEmail(email: string): string {
  const atIndex = email.indexOf('@');
  const dotIndex = email.lastIndexOf('.');

  if (atIndex < 1) {
    return 'missing symbol @';
  }

  const localPart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex + 1);

  if (!localPart.match(/^[a-zA-Z0-9._%+-]+$/)) {
    return 'username contains invalid characters';
  }

  if (!domainPart.match(/^[a-zA-Z0-9.-]+$/)) {
    return 'the domain part of the address with an error';
  }

  if (dotIndex === -1 || dotIndex < atIndex + 2) {
    return 'there is no point between the domain part and the top-level domain';
  }

  const tld = email.substring(dotIndex + 1);
  if (!tld.match(/^[a-zA-Z]{2,}$/)) {
    return 'the top-level domain is written with an error';
  }

  return 'true';
}

function isValidatePassword(password: string): string {
  if (password.length < 8) {
    return 'the password must be more than 8 characters long';
  }

  if (!/[A-Z]/.test(password)) {
    return 'the password must contain capital letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'the password must contain a lowercase letter';
  }

  if (!/\d/.test(password)) {
    return 'the password must contain a digit';
  }

  if (/^\s|\s$/.test(password)) {
    return 'contains spaces';
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
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [emailValid, setEmailValid] = useState('');
  const [passwordValid, setPasswordValid] = useState('');
  const [formValid, setFormValid] = useState(false);

  const validateField = (fieldName: string, value: string): void => {
    const fieldValidationErrors = formErrors;
    let emailValidate = emailValid;
    let passwordValidate = passwordValid;
    if (fieldName === 'email') {
      setEmail(value);
      emailValidate = isValidEmail(value);
      if (emailValidate === 'true') {
        fieldValidationErrors.email = '';
        setEmailValid(emailValidate);
      } else {
        fieldValidationErrors.email = emailValidate;
      }
    } else {
      setPassword(value);
      passwordValidate = isValidatePassword(value);
      if (passwordValidate === 'true') {
        fieldValidationErrors.password = '';
        setPasswordValid(passwordValidate);
      } else {
        fieldValidationErrors.password = passwordValidate;
      }
    }

    setFormErrors(fieldValidationErrors);

    if (passwordValidate === 'true' && emailValidate === 'true') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  function errorClass(error: string): string {
    return error.length === 0 ? '' : 'has-error';
  }

  const onShowPass = (e: MouseEvent<HTMLButtonElement>): void => {
    const targetElement = e.target;
    if (targetElement instanceof HTMLButtonElement) {
      const node = targetElement.previousElementSibling as HTMLInputElement;
      node.type = 'text';
    }
  };

  const onBlurPass = (e: MouseEvent<HTMLButtonElement>): void => {
    const targetElement = e.target;
    if (targetElement instanceof HTMLButtonElement) {
      const node = targetElement.previousElementSibling as HTMLInputElement;
      node.type = 'password';
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

  return (
    <div className="container__form">
      <form className="login-form">
        <h2 className="login-form__title main-heading">Log in</h2>
        <div className="form-group">
          <label htmlFor="email">
            Email <span>*</span>
            <input
              type="email"
              className={`form-control ${errorClass(formErrors.email)}`}
              id="email"
              value={email}
              name="email"
              onChange={handleUserInput}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password <span>*</span>
            <input
              type="password"
              className={`form-control ${errorClass(formErrors.password)}`}
              id="password"
              value={password}
              name="password"
              onChange={handleUserInput}
            />
            <button
              type="button"
              className="btn btn__show-pass"
              onMouseDown={onShowPass}
              onMouseUp={onBlurPass}
              disabled={!password.length}
            >
              show
            </button>
          </label>
        </div>
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
      <div className="panel panel-default">
        <FormErrors formErrors={formErrors} />
      </div>
    </div>
  );
}

export default SignInForm;
