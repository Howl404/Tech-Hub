export interface ProductCatalog {
  id: string;
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
  inCart?: boolean;
}

export interface ProductDetailedPage {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: AuthorBy;
  createdBy: AuthorBy;
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

export interface AuthorBy {
  isPlatformClient: true;
  user: {
    typeId: string;
    id: string;
  };
}
