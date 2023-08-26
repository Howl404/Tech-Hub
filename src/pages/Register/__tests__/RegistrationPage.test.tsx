import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import RegistrationPage from '../RegistrationPage';

describe('RegistrationPage component', () => {
  test('Renders personal info inputs', () => {
    render(
      <MemoryRouter>
        <RegistrationPage checkLogIn={(): void => {}} />
      </MemoryRouter>,
    );

    const headingElement = screen.getByText('Registration Page');
    const emailLabel = screen.getByText('Email *');
    const passwordLabel = screen.getByText('Password *');
    const firstNameLabel = screen.getByText('First name *');
    const lastNameLabel = screen.getByText('Last name *');
    const dateOfBirthLabel = screen.getByText('Date of birth *');

    expect(headingElement).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(firstNameLabel).toBeInTheDocument();
    expect(lastNameLabel).toBeInTheDocument();
    expect(dateOfBirthLabel).toBeInTheDocument();
  });
});
