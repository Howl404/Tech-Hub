import { getCategories } from '@src/services/ProductsService/ProductsService';
import formattedCategoryList from '../formattedCategoryList';

jest.mock('@src/services/ProductsService/ProductsService');

describe('formattedCategoryList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format categories correctly', async () => {
    const mockMainCategoryData = {
      results: [
        { id: '1', name: { en: 'MainCat1' }, slug: { en: 'main-cat1' } },
        { id: '2', name: { en: 'MainCat2' }, slug: { en: 'main-cat2' } },
      ],
    };

    const mockSubCategoryData = {
      results: [
        { id: '3', name: { en: 'SubCat1' }, slug: { en: 'sub-cat1' }, parent: { id: '1' } },
        { id: '4', name: { en: 'SubCat2' }, slug: { en: 'sub-cat2' }, parent: { id: '2' } },
        { id: '5', name: { en: 'SubCat3' }, slug: { en: 'sub-cat3' }, parent: { id: '3' } },
      ],
    };

    (getCategories as jest.Mock).mockResolvedValueOnce(mockMainCategoryData).mockResolvedValueOnce(mockSubCategoryData);

    const result = await formattedCategoryList();

    expect(result.mainCategories).toEqual([
      { id: '1', name: 'MainCat1', slug: 'main-cat1', ancestors: expect.any(Array) },
      { id: '2', name: 'MainCat2', slug: 'main-cat2', ancestors: expect.any(Array) },
    ]);

    expect(result.subCategories).toEqual([
      { id: '3', name: 'SubCat1', slug: 'sub-cat1', ancestors: expect.any(Array) },
      { id: '4', name: 'SubCat2', slug: 'sub-cat2', ancestors: expect.any(Array) },
    ]);

    expect(result.subCategories2).toEqual([
      { id: '5', name: 'SubCat3', slug: 'sub-cat3', ancestors: expect.any(Array) },
    ]);
  });
});
