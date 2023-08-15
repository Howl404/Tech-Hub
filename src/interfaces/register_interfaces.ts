import { BaseAddress } from './Customer';

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

export interface AddressData {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}
