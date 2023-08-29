export interface Product {
  description: {
    en: string;
  };
  name: {
    en: string;
  };
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
  ancestors: ProductFormattedData[];
  parent?: string;
}
