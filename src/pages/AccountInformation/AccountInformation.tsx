import React, { useEffect, useState } from 'react';
import FormInput from '@src/components/FormInput/FormInput';
import { getCustomerId } from '@src/services/AuthService/AuthService';
import { CustomersId } from '@src/interfaces/Customer';
import { FaEdit, FaRegSave } from 'react-icons/fa';
import styles from './AccountInformation.module.scss';

function AccountInformation(): JSX.Element {
  const [user, setUser] = useState<CustomersId>({
    email: '',
    firstName: '',
    lastName: '',
    billingAddressIds: [],
    shippingAddressIds: [],
    defaultShippingAddressId: '',
    defaultBillingAddressId: '',
    addresses: [
      {
        city: '',
        country: '',
        id: '',
        postalCode: '',
        streetName: '',
      },
    ],
    dateOfBirth: '',
  });
  useEffect(() => {
    getCustomerId().then((item) => setUser(item));
  }, []);

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
        <button type="button" className={styles.btn} onClick={(): void => {}}>
          Edit Information <FaEdit />
        </button>

        <div className={styles.account__information_block}>
          <FormInput
            label="First name *"
            errorMessage="Must contain at least one character and no special characters or numbers"
            onChange={(): void => {}}
            id="firstName"
            type="text"
            pattern="[A-Za-z]+"
            title="Must contain at least one character and no special characters or numbers"
            value={user.firstName}
            disabled
          />
          <FormInput
            label="Last name *"
            errorMessage="Must contain at least one character and no special characters or numbers"
            onChange={(): void => {}}
            id="lastName"
            type="text"
            pattern="[A-Za-z]+"
            title="Must contain at least one character and no special characters or numbers"
            value={user.lastName}
            disabled
          />
          <FormInput
            label="Date of birth *"
            errorMessage="You need to be older than 13 years old"
            onChange={(): void => {}}
            id="dateOfBirth"
            type="date"
            pattern=".*"
            title="You need to be older than 13 years old"
            max={getFormattedDate()}
            value={user.dateOfBirth}
            disabled
          />
          <FormInput
            label="Email *"
            errorMessage="Invalid email"
            onChange={(): void => {}}
            id="email"
            type="text"
            pattern="[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
            title="Must contain a valid email"
            value={user.email}
            disabled
          />
          <FormInput
            label="Change Password *"
            errorMessage="Minimum 8 characters, 1 uppercase letter, 1 lowercase, and 1 number"
            onChange={(): void => {}}
            id="password"
            type="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
            title="Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number"
            value="***********"
            disabled
          />
        </div>
        <button type="button" className={styles.btn__save} onClick={(): void => {}}>
          save <FaRegSave />
        </button>
      </div>
    </div>
  );
}

export default AccountInformation;
