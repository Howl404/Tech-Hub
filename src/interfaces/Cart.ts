import { BaseAddress, CreatedBy, LastModifiedBy } from '@interfaces/Customer';

export interface Cart {
  type: string;
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: LastModifiedBy;
  createdBy: CreatedBy;
  anonymousId: string;
  lineItems: string[];
  cartState: string;
  totalPrice: string;
  shippingMode: string;
  shipping: string[];
  customLineItems: string[];
  discountCodes: string[];
  directDiscounts: string[];
  inventoryMode: string;
  taxMode: string;
  taxRoundingMode: string;
  taxCalculationMode: string;
  deleteDaysAfterLastModification: number;
  refusedGifts: string[];
  origin: string;
  itemShippingAddresses: BaseAddress[];
}
