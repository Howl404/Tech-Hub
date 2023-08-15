import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import FormErrors from '../FormErrors/FormErrors';
import './form-sign-in.scss';

function isValidEmail(email: string): string | boolean {
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

  return true;
}

function isValidatePassword(password: string): boolean | string {
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

  return true;
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
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const validateField = (fieldName: string, value: string): void => {
    const fieldValidationErrors = formErrors;
    let emailValidate = emailValid as boolean | string;
    let passwordValidate = passwordValid as boolean | string;
    switch (fieldName) {
      case 'email':
        setEmail(value);
        emailValidate = isValidEmail(value);
        if (typeof emailValidate === 'boolean') {
          fieldValidationErrors.email = '';
        } else {
          fieldValidationErrors.email = emailValidate;
        }

        break;
      case 'password':
        setPassword(value);
        passwordValidate = isValidatePassword(value);
        if (typeof passwordValidate === 'boolean') {
          fieldValidationErrors.password = '';
        } else {
          fieldValidationErrors.password = passwordValidate;
        }
        break;
      default:
        break;
    }
    setFormErrors(fieldValidationErrors);
    if (typeof emailValidate === 'boolean') {
      setEmailValid(emailValidate);
    }
    if (typeof passwordValidate === 'boolean') {
      setPasswordValid(passwordValidate);
    }
    setFormValid(emailValid && passwordValid);
  };

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === 'email') {
      validateField(name, value);
    } else if (name === 'password') {
      validateField(name, value);
    }
  };

  function errorClass(error: string): string {
    return error.length === 0 ? '' : 'has-error';
  }

  const onShowPass = (e: MouseEvent<HTMLButtonElement>): void => {
    const targetElement = e.target as HTMLButtonElement;
    if (targetElement !== null) {
      const node = targetElement.previousElementSibling as HTMLInputElement;
      node.type = 'text';
    }
  };

  const onBlurPass = (e: MouseEvent<HTMLButtonElement>): void => {
    const targetElement = e.target as HTMLButtonElement;
    if (targetElement !== null) {
      const node = targetElement.previousElementSibling as HTMLInputElement;
      node.type = 'password';
    }
  };

  const onSignIn = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    const outhResourse: Promise<{
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
    outhResourse
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
        <h2 className="login-form__title">Sign up</h2>
        <div className="form-group">
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            type="email"
            className={`form-control ${errorClass(formErrors.email)}`}
            id="email"
            value={email}
            name="email"
            onChange={handleUserInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password <span>*</span>
          </label>
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
            Показать пароль
          </button>
        </div>
        <button type="submit" className="btn btn-sign-in" disabled={!formValid} onClick={onSignIn}>
          Sign up
        </button>
        <button type="submit" className="btn btn-register">
          register
        </button>
      </form>
      <div className="panel panel-default">
        <FormErrors formErrors={formErrors} />
      </div>
    </div>
  );
}

export default SignInForm;
