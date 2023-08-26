export interface Product {
  masterData: {
    current: {
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
          },
        ];
      };
      categories: [
        {
          typeId: string;
          id: string;
        },
      ];
    };
  };
}
