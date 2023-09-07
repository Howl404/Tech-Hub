import { ProductFormattedData } from './Product';

export interface Category {
  id: string;
  name: {
    en: string;
  };
  slug: {
    en: string;
  };
  ancestors: [
    {
      typeId: string;
      id: string;
    },
  ];
  parent?: {
    id: string;
  };
  used?: boolean;
}

export interface CategoryFormattedData {
  name: string;
  id: string;
  ancestors: CategoryFormattedData[];
}

export interface CategoryProps {
  category: ProductFormattedData;
}
