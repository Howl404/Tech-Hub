export interface CustomerDraft {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  anonymousId?: string;
  dateOfBirth: string;
  addresses?: BaseAddress[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
  billingAddresses: number[];
  shippingAddresses: number[];
}

export interface BaseAddress {
  country: string;
  streetName: string;
  city: string;
  postalCode: string;
}

export interface CustomerData {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: LastModifiedBy;
  createdBy: CreatedBy;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  addresses: BaseAddress[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  stores: [];
  authenticationMode: string;
}

export interface CreatedBy {
  clientId: string;
  isPlatformClient: boolean;
  anonymousId: string;
}

export interface LastModifiedBy {
  clientId: string;
  isPlatformClient: boolean;
  anonymousId: string;
}

export interface Address {
  city: string;
  country: string;
  id: string;
  postalCode: string;
  streetName: string;
}

export interface CustomersId {
  email: string;
  firstName: string;
  lastName: string;
  billingAddressIds: string[];
  shippingAddressIds: string[];
  defaultShippingAddressId: string;
  defaultBillingAddressId: string;
  addresses: Address[];
  dateOfBirth: string;
  id: string;
}
