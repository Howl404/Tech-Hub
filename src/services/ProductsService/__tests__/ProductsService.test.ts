import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getProducts, getCategories, getCategory, getProductsByCategory } from '../ProductsService';

const mock = new MockAdapter(axios);

describe('API Functions', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should get products', async () => {
    const responseData = {
      limit: 10,
      offset: 0,
      count: 10,
      total: 100,
      results: [{}],
    };

    mock
      .onGet('https://api.europe-west1.gcp.commercetools.com/rs-alchemists-ecommerce/products')
      .reply(200, responseData);

    const products = await getProducts();

    expect(products).toEqual(responseData);
  });

  it('should get categories', async () => {
    const responseData = {
      limit: 10,
      offset: 0,
      count: 10,
      total: 100,
      results: [{}],
    };

    mock
      .onGet('https://api.europe-west1.gcp.commercetools.com/rs-alchemists-ecommerce/categories')
      .reply(200, responseData);

    const categories = await getCategories();

    expect(categories).toEqual(responseData);
  });

  it('should get categories with query', async () => {
    const responseData = {
      limit: 10,
      offset: 0,
      count: 10,
      total: 100,
      results: [{}],
    };

    const query = 'test-query';

    mock
      .onGet('https://api.europe-west1.gcp.commercetools.com/rs-alchemists-ecommerce/categories?where=test-query')
      .reply(200, responseData);

    const categories = await getCategories(query);

    expect(categories).toEqual(responseData);
  });

  it('should get a category with where filter', async () => {
    const categoryKey = 'test-category-key';
    const responseData = {};

    mock
      .onGet(`https://api.europe-west1.gcp.commercetools.com/rs-alchemists-ecommerce/categories/key=${categoryKey}`)
      .reply(200, responseData);

    const category = await getCategory(categoryKey);

    expect(category).toEqual(responseData);
  });

  it('should get products by category', async () => {
    const filter = 'test-filter';
    const sort = 'test-sort';
    const responseData = {
      limit: 10,
      offset: 0,
      count: 10,
      total: 100,
      results: [{}],
    };

    mock.onGet().reply((config) => {
      expect(config.url).toContain('product-projections/search');
      if (config.headers) {
        expect(config.headers.Authorization).toContain('Bearer');
      }

      return [200, responseData];
    });

    const products = await getProductsByCategory(filter, sort);

    expect(products).toEqual(responseData);
  });

  it('should get products by category with brand and text filter', async () => {
    const filter = 'test-filter';
    const sort = 'test-sort';
    const brand = 'test-brand';
    const text = 'test-text';
    const responseData = {
      limit: 10,
      offset: 0,
      count: 10,
      total: 100,
      results: [{}],
    };

    mock.onGet().reply((config) => {
      expect(config.url).toContain('product-projections/search');
      if (config.headers) {
        expect(config.headers.Authorization).toContain('Bearer');
      }

      return [200, responseData];
    });

    const products = await getProductsByCategory(filter, sort, text, brand);

    expect(products).toEqual(responseData);
  });
});
