import React, { useEffect, useState } from 'react';
import FormInput from '@src/components/FormInput/FormInput';
import {
  changeDateofBirthRequest,
  changeEmailRequest,
  changeFirstNameRequest,
  changeLastNameRequest,
  changePasswordRequest,
  getCustomerId,
  // getCustomerId,
} from '@src/services/AuthService/AuthService';
import { CustomersId } from '@src/interfaces/Customer';
import { FaEdit, FaRegSave, FaExchangeAlt } from 'react-icons/fa';
import ModalAccountInformation from '@src/components/ModalAccountInformation/ModalAccountInformation';
import Toastify from 'toastify-js';
import styles from './AccountInformation.module.scss';

function AccountInformation({ onLogOut }: { onLogOut: () => void }): JSX.Element {
  const [user, setUser] = useState<CustomersId>({
    email: '',
    firstName: '',
    lastName: '',
    billingAddressIds: [],
    shippingAddressIds: [],
    defaultShippingAddressId: '',
    defaultBillingAddressId: '',
    addresses: [],
    dateOfBirth: '',
    id: '',
  });

  const [emailInformation, setEmailInformation] = useState(user.email);
  const [editUserInformation, setEditUserInformation] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
  });
  useEffect(() => {
    setUser({ ...user, email: emailInformation });
    getCustomerId().then((item) => {
      setUser(item);
      setEditUserInformation({ firstName: item.firstName, lastName: item.lastName, dateOfBirth: item.dateOfBirth });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailInformation]);

  const [modalActive, setModalActive] = useState(false);
  const [modalActiveEmail, setModalActiveEmail] = useState(false);
  const [passwordInformation, setPasswordInformation] = useState({ oldPasswowrd: '', newPassword: '' });

  const [editInformation, setEditInformation] = useState(false);

  function getFormattedDate(): string {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getFullYear();
    currentDate.setFullYear(currentYear - 13);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const [isEmailInputExist, setEmailInputExist] = useState(false);

  const [isFormComplete, setIsFormComplete] = useState(false);

  const [isPasswordInputsExist, setIsPasswordInputsExist] = useState(false);

  useEffect(() => {
    if (passwordInformation.oldPasswowrd !== '' && passwordInformation.newPassword !== '') {
      setIsPasswordInputsExist(true);
    } else {
      setIsPasswordInputsExist(false);
    }
  }, [passwordInformation.oldPasswowrd, passwordInformation.newPassword]);

  useEffect(() => {
    if (emailInformation !== '') {
      setEmailInputExist(true);
    } else {
      setEmailInputExist(false);
    }
  }, [emailInformation]);

  useEffect(() => {
    if (
      [editUserInformation.firstName, editUserInformation.dateOfBirth, editUserInformation.lastName].every(
        (value) => value !== '',
      ) === true
    ) {
      setIsFormComplete(true);
    } else setIsFormComplete(false);
  }, [editUserInformation.firstName, editUserInformation.dateOfBirth, editUserInformation.lastName]);

  return (
    <div className={styles.dashboard__description}>
      <h3 className={styles.account__information_title}>Edit Account Information</h3>
      <div className={styles.account__information_block}>
        <button
          type="button"
          className={`${styles.btn} ${styles.align}`}
          onClick={(): void => setEditInformation(!editInformation)}
        >
          {!editInformation ? 'Edit' : 'Close edit'} Information <FaEdit />
        </button>

        <form
          className={styles.account__information_block}
          onSubmit={(e): void => {
            e.preventDefault();
            changeLastNameRequest(editUserInformation.lastName).then((item) => {
              if (item !== undefined) {
                changeFirstNameRequest(editUserInformation.firstName).then((items) => {
                  if (items !== undefined) {
                    changeDateofBirthRequest(editUserInformation.dateOfBirth).then((birth) => {
                      if (birth !== undefined) {
                        Toastify({
                          text: 'Information is successfully update!',
                          duration: 3000,
                          newWindow: true,
                          close: true,
                          gravity: 'top',
                          position: 'right',
                          stopOnFocus: true,
                          style: {
                            background: 'linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)',
                          },
                        }).showToast();
                        setEditInformation(false);
                      }
                    });
                  }
                });
              }
            });
          }}
        >
          <FormInput
            label="First name *"
            errorMessage="Must contain at least one character and no special characters or numbers"
            onChange={(e): void => setEditUserInformation({ ...editUserInformation, firstName: e.target.value })}
            id="firstName"
            type="text"
            pattern="[A-Za-z]+"
            title="Must contain at least one character and no special characters or numbers"
            value={editUserInformation.firstName}
            disabled={!editInformation}
          />
          <FormInput
            label="Last name *"
            errorMessage="Must contain at least one character and no special characters or numbers"
            onChange={(e): void => setEditUserInformation({ ...editUserInformation, lastName: e.target.value })}
            id="lastName"
            type="text"
            pattern="[A-Za-z]+"
            title="Must contain at least one character and no special characters or numbers"
            value={editUserInformation.lastName}
            disabled={!editInformation}
          />
          <FormInput
            label="Date of birth *"
            errorMessage="You need to be older than 13 years old"
            onChange={(e): void => {
              setEditUserInformation({ ...editUserInformation, dateOfBirth: e.target.value });
            }}
            id="dateOfBirth"
            type="date"
            pattern=".*"
            title="You need to be older than 13 years old"
            max={getFormattedDate()}
            value={editUserInformation.dateOfBirth}
            disabled={!editInformation}
          />
          <button type="submit" className={`${styles.btn__save} ${styles.align}`} disabled={!isFormComplete}>
            save
            <FaRegSave />
          </button>
          <button
            type="button"
            className={`${styles.btn__save} ${styles.align} ${styles.gapPass}`}
            onClick={(): void => setModalActiveEmail(true)}
          >
            change email <FaExchangeAlt />
          </button>
          <button
            type="button"
            className={`${styles.btn__save} ${styles.align} ${styles.gapPass}`}
            onClick={(): void => setModalActive(true)}
          >
            change password <FaExchangeAlt />
          </button>
        </form>
        <ModalAccountInformation
          active={modalActiveEmail}
          setActive={setModalActiveEmail}
          onSubmit={(e): void => {
            e.preventDefault();
            changeEmailRequest(emailInformation).then((item) => {
              if (item !== undefined) {
                Toastify({
                  text: 'Email is successfully update!',
                  duration: 3000,
                  newWindow: true,
                  close: true,
                  gravity: 'top',
                  position: 'right',
                  stopOnFocus: true,
                  style: {
                    background: 'linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)',
                  },
                }).showToast();
                setModalActiveEmail(false);
              }
            });
          }}
        >
          <>
            <h3>Edit email</h3>
            <FormInput
              label="Enter new email *"
              errorMessage="Invalid email"
              onChange={(e): void => {
                setEmailInformation(e.target.value);
              }}
              id="email"
              type="text"
              pattern="[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
              title="Must contain a valid email"
              value={emailInformation}
            />
            <button
              type="submit"
              className={`${styles.btn__save} ${styles.align} ${styles.gapPass}`}
              disabled={!isEmailInputExist}
            >
              save email <FaExchangeAlt />
            </button>
          </>
        </ModalAccountInformation>
        <ModalAccountInformation
          active={modalActive}
          setActive={setModalActive}
          onSubmit={(e): void => {
            e.preventDefault();
            changePasswordRequest(passwordInformation.newPassword, passwordInformation.oldPasswowrd).then((item) => {
              if (item !== undefined) {
                Toastify({
                  text: 'Password is successfully update!',
                  duration: 3000,
                  newWindow: true,
                  close: true,
                  gravity: 'top',
                  position: 'right',
                  stopOnFocus: true,
                  style: {
                    background: 'linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)',
                  },
                }).showToast();
                onLogOut();
              }
            });
          }}
        >
          <>
            <h3>Edit password</h3>
            <FormInput
              label="Enter old password *"
              errorMessage="Minimum 8 characters, 1 uppercase letter, 1 lowercase, and 1 number"
              onChange={(e): void => setPasswordInformation({ ...passwordInformation, oldPasswowrd: e.target.value })}
              id="old_password"
              type="password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
              title="Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number"
              value={passwordInformation.oldPasswowrd}
            />
            <FormInput
              label="Enter new password *"
              errorMessage="Minimum 8 characters, 1 uppercase letter, 1 lowercase, and 1 number"
              onChange={(e): void => setPasswordInformation({ ...passwordInformation, newPassword: e.target.value })}
              id="new_password"
              type="password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
              title="Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number"
              value={passwordInformation.newPassword}
            />
            <button
              type="submit"
              className={`${styles.btn__save} ${styles.align} ${styles.gapPass}`}
              disabled={!isPasswordInputsExist}
            >
              save password <FaExchangeAlt />
            </button>
          </>
        </ModalAccountInformation>
      </div>
    </div>
  );
}

export default AccountInformation;
