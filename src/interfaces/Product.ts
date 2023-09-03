export interface Product {
  description: {
    en: string;
  };
  name: {
    en: string;
  };
  key: string;
  masterVariant: {
    id: number;
    sku: string;
    images: [
      {
        url: string;
      },
    ];
    prices: [
      {
        id: string;
        value: {
          currencyCode: string;
          centAmount: number;
          fractionDigits: number;
        };
        discounted?: {
          value: {
            centAmount: number;
          };
        };
      },
    ];
    attributes: [
      {
        name: string;
        value: string;
      },
    ];
  };
  categories: [
    {
      typeId: string;
      id: string;
    },
  ];
}

export interface ProductFormattedData {
  name: string;
  id: string;
  slug: string;
  ancestors: ProductFormattedData[];
  parent?: string;
}
