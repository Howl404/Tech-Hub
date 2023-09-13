import { BaseAddress, CreatedBy, LastModifiedBy } from '@interfaces/Customer';
import { AuthorBy } from './Product';

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
  lineItems: ProductInCart[];
  cartState: string;
  totalPrice: LinePrice;
  shippingMode: string;
  shipping: string[];
  customerId: string;
  customLineItems: string[];
  discountCodes: {
    discountCode: {
      typeId: string;
      id: string;
    };
    state: string;
  }[];
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

export interface ProductInCart {
  id: string;
  productId: string;
  productKey: string;
  quantity: number;
  price: {
    value: LinePrice;
    discounted?: {
      value: LinePrice;
    };
  };
  discountedPrice?: {
    value: LinePrice;
  };
  totalPrice: LinePrice;
  name: {
    en: string;
  };
  variant: {
    images: { url: string }[];
  };
}

export interface LinePrice {
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
}

export interface CartDiscount {
  id: string;
  version: number;
  key: string;
  name: {
    en: string;
  };
  description: {
    en: string;
  };
  value: string;
  CartDiscountValue: string;
  cartPredicate: string;
  target: {
    type: string;
    predicate: string;
  };
  sortOrder: string;
  stores: { key: string; typeId: string };
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  requiresDiscountCode: boolean;
  stackingMode: string;
  createdAt: string;
  createdBy: AuthorBy;
  lastModifiedAt: string;
  lastModifiedBy: AuthorBy;
}
