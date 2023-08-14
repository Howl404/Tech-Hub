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
  lastModifiedBy: {
    clientId: string;
    isPlatformClient: boolean;
    anonymousId: string;
  };
  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
    anonymousId: string;
  };
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
