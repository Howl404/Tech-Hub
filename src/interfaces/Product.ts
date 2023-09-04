export interface ProductDetailedPage {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    isPlatformClient: true;
    user: {
      typeId: string;
      id: string;
    };
  };
  createdBy: {
    isPlatformClient: boolean;
    user: {
      typeId: string;
      id: string;
    };
  };
  productType: {
    typeId: string;
    id: string;
  };
  masterData: {
    current: {
      name: {
        en: string;
      };
      description: {
        en: string;
      };
      categories: [
        {
          typeId: string;
          id: string;
        },
      ];
      slug: {
        en: string;
      };
      masterVariant: {
        id: number;
        sku: string;
        prices: [
          {
            id: string;
            value: {
              type: string;
              currencyCode: string;
              centAmount: number;
              fractionDigits: number;
            };
            discounted: {
              value: {
                type: string;
                currencyCode: string;
                centAmount: number;
                fractionDigits: number;
              };
              discount: {
                typeId: string;
                id: string;
              };
            };
          },
        ];
        images: [
          {
            url: string;
            label: string;
            dimensions: {
              w: number;
              h: number;
            };
          },
        ];
        attributes: [
          {
            name: string;
            value: string;
          },
        ];
        assets: [];
      };
      variants: [];
    };
    published: boolean;
    hasStagedChanges: boolean;
  };
  key: string;
  lastVariantId: number;
}

export interface ProductFormattedData {
  name: string;
  id: string;
  slug: string;
  ancestors: ProductFormattedData[];
  parent?: string;
}
