import { AuthorBy } from './Product';

export interface DiscountCode {
  id: string;
  version: number;
  name: {
    en: string;
  };
  description: {
    en: string;
  };
  code: string;
  cartDiscounts: CartDiscountReference[];
  cartPredicate: string;
  isActive: boolean;
  references: { id: string; typeId: string };
  maxApplications: number;
  maxApplicationsPerCustomer: number;
  groups: string[];
  validFrom: string;
  validUntil: string;
  applicationVersion: number;
  createdAt: string;
  createdBy: AuthorBy;
  lastModifiedAt: string;
  lastModifiedBy: AuthorBy;
}

export interface CartDiscountReference {
  id: string;
  typeId: string;
  obj: DiscountCode;
}
