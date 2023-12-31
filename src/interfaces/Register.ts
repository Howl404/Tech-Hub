import { BaseAddress } from '@interfaces/Customer';

export interface RegistrationFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  defaultShippingAddress: boolean;
  defaultBillingAddress: boolean;
  sameBillingShipping: boolean;
  billingAddress: BaseAddress;
  shippingAddress: BaseAddress;
}

export interface PostalCodePattern {
  [key: string]: string;
}
