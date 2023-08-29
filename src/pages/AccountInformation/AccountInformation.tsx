import React, { useEffect, useState } from 'react';
import FormInput from '@src/components/FormInput/FormInput';
import {
  changeDateofBirthRequest,
  changeEmailRequest,
  changeFirstNameRequest,
  changeLastNameRequest,
  changePasswordRequest,
} from '@src/services/AuthService/AuthService';
import { CustomersId } from '@src/interfaces/Customer';
import { FaEdit, FaRegSave, FaExchangeAlt } from 'react-icons/fa';
import ModalAccountInformation from '@src/components/ModalAccountInformation/ModalAccountInformation';
import styles from './AccountInformation.module.scss';

function AccountInformation({
  onLogOut,
  user,
  setUser,
}: {
  onLogOut: () => void;
  user: CustomersId;
  setUser: (value: CustomersId) => void;
}): JSX.Element {
  const [modalActive, setModalActive] = useState(false);
  const [modalActiveEmail, setModalActiveEmail] = useState(false);
  const [passwordInformation, setPasswordInformation] = useState({ oldPasswowrd: '', newPassword: '' });
  const [emailInformation, setEmailInformation] = useState(user.email);
  const [editInformation, setEditInformation] = useState(false);
  const [editUserInformation, setEditUserInformation] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
  });

  useEffect(() => {
    setUser({ ...user, email: emailInformation });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailInformation]);

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

        <div className={styles.account__information_block}>
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
          <button
            type="button"
            className={`${styles.btn__save} ${styles.align}`}
            disabled={!editInformation}
            onClick={(): void => {
              changeLastNameRequest(editUserInformation.lastName).then(() =>
                changeFirstNameRequest(editUserInformation.firstName).then(() =>
                  changeDateofBirthRequest(editUserInformation.dateOfBirth).then(() => setEditInformation(false)),
                ),
              );
            }}
          >
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
          <ModalAccountInformation active={modalActiveEmail} setActive={setModalActiveEmail}>
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
                type="button"
                className={`${styles.btn__save} ${styles.align} ${styles.gapPass}`}
                onClick={(): void => {
                  changeEmailRequest(emailInformation);
                }}
              >
                save email <FaExchangeAlt />
              </button>
            </>
          </ModalAccountInformation>

          <button
            type="button"
            className={`${styles.btn__save} ${styles.align} ${styles.gapPass}`}
            onClick={(): void => setModalActive(true)}
          >
            change password <FaExchangeAlt />
          </button>
          <ModalAccountInformation active={modalActive} setActive={setModalActive}>
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
                type="button"
                className={`${styles.btn__save} ${styles.align} ${styles.gapPass}`}
                onClick={(): void => {
                  changePasswordRequest(passwordInformation.newPassword, passwordInformation.oldPasswowrd).then(() =>
                    onLogOut(),
                  );
                }}
              >
                save password <FaExchangeAlt />
              </button>
            </>
          </ModalAccountInformation>
        </div>
      </div>
    </div>
  );
}

export default AccountInformation;
