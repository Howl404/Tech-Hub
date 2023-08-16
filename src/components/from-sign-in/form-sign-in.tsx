import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import FormErrors from '../FormErrors/FormErrors';
import './form-sign-in.scss';

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

const PROJECT_KEY = 'rs-alchemists-ecommerce';
const CLIENT_ID = 'Nj8bGpFcdhrQD12ajRSthmO5';
const SECRET_ID = 'lGjHR6k3_epMGxDV0DCQSjy4rLG8t5CK';
const OAUTH_HOST = `https://auth.europe-west1.gcp.commercetools.com/oauth/${PROJECT_KEY}/customers/token`;
const LOGIN_HOST = `https://api.europe-west1.gcp.commercetools.com/${PROJECT_KEY}/me/login`;

function SignInForm(): JSX.Element {
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
      } else {
        fieldValidationErrors.email = emailValidate;
      }
    }

    if (fieldName === 'password') {
      setPassword(value);
      passwordValidate = isValidatePassword(value);
      if (passwordValidate === 'true') {
        fieldValidationErrors.password = '';
      } else {
        fieldValidationErrors.password = passwordValidate;
      }
    }

    setFormErrors(fieldValidationErrors);

    if (emailValidate === 'true') {
      setEmailValid(emailValidate);
    }
    if (passwordValidate === 'true') {
      setPasswordValid(passwordValidate);
    }

    if (passwordValidate && emailValidate) setFormValid(false);
    if (passwordValidate === 'true' && emailValidate === 'true') setFormValid(true);
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
    if (targetElement !== null && targetElement instanceof HTMLButtonElement) {
      const node = targetElement.previousElementSibling as HTMLInputElement;
      node.type = 'text';
    }
  };

  const onBlurPass = (e: MouseEvent<HTMLButtonElement>): void => {
    const targetElement = e.target;
    if (targetElement !== null && targetElement instanceof HTMLButtonElement) {
      const node = targetElement.previousElementSibling as HTMLInputElement;
      node.type = 'password';
    }
  };

  const onSignIn = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    const authResourse: Promise<{
      data: {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
      };
    }> = axios.post(OAUTH_HOST, `grant_type=password&username=${email}&password=${password}`, {
      headers: {
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${SECRET_ID}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    authResourse
      .then((item) => {
        console.log('key', item);
        //   const getCustomers = axios.get(`https://api.europe-west1.gcp.commercetools.com/${projectKey}/me`, {
        //     headers: { Authorization: `Bearer ${item.access_token}` },
        //   });
        //   getCustomers.then(console.log);
        const getLogin = axios.post(
          LOGIN_HOST,
          {
            email,
            password,
            anonymousCart: {
              id: 77,
              typeId: 'cart',
            },
          },
          {
            headers: {
              Authorization: `Bearer ${item.data.access_token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        getLogin.then(console.log);
      })
      .catch((err) => {
        if (err.response.status === 400) console.error('email or password invalid');
      });
  };

  return (
    <div className="container__form">
      <form className="login-form">
        <h2 className="login-form__title">Sign in</h2>
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
          </label>
          <button
            type="button"
            className="btn btn__show-pass"
            onMouseDown={onShowPass}
            onMouseUp={onBlurPass}
            disabled={!password.length}
          >
            show
          </button>
        </div>
        <div className="wrapper-btn">
          <button type="submit" className="btn btn-sign-in" disabled={!formValid} onClick={onSignIn}>
            Sign in
          </button>
          <button type="submit" className="btn btn-register">
            register
          </button>
        </div>
      </form>
      <div className="panel panel-default">
        <FormErrors formErrors={formErrors} />
      </div>
    </div>
  );
}

export default SignInForm;
