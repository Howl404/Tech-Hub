import { getCategories, getProductsByCategory } from '@src/services/ProductsService/ProductsService';
import CatalogProductCard from '@src/components/CatalogProductCard/CatalogProductCard';
import React, { useCallback, useEffect, useState } from 'react';
import { ProductCatalog, ProductFormattedData } from '@src/interfaces/Product';
import CategoryCard from '@src/components/CategoryCard/CategoryCard';
import './CatalogPage.scss';
import PriceRangeSlider from '@src/components/PriceRange/PriceRange';
import formattedCategoryList from '@src/utilities/formattedCategoryList';
import SortingSelect from '@src/components/SortingSelect/SortingSelect';
import BrandFilter from '@src/components/BrandFilter/BrandFilter';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '@src/components/Breadcrumb/Breadcrumb';
import sortingOptions from '@src/utilities/sortingOptions';
import searchIcon from '@assets/search.svg';
import { getCartById, createCart, addToCart, removeFromCart } from '@src/services/CartService/CartService';
import { getAnonymousToken, getNewToken } from '@src/services/AuthService/AuthService';
import Cookies from 'js-cookie';

export default function Catalog(): JSX.Element {
  const navigate = useNavigate();

  const { categoryslug, subcategoryslug, subcategoryslug2 } = useParams<{
    categoryslug: string;
    subcategoryslug: string;
    subcategoryslug2: string;
  }>();

  const minPrice = 0;
  const maxPrice = 5000;
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductCatalog[]>([]);
  const [categories, setCategories] = useState<ProductFormattedData[]>([]);
  const [sort, setSort] = useState('name.en asc');
  const [brand, setBrand] = useState('');
  const [savedBrands, setSavedBrands] = useState<ProductCatalog[]>([]);
  const [currentCategory, setCurrentCategory] = useState<{ name: string; key?: string }[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; slug: string }[]>([]);

  const [cartList, setCartList] = useState<{ id: string; productId: string }[]>([]);

  const [displayCategories, setDisplayCategories] = useState(false);

  const handleSortingChange = (newOption: string): void => {
    setSort(newOption);
  };

  const handlePriceChange = (newRange: number[]): void => {
    setPriceRange(newRange);
  };

  const handleBrandChange = (newBrand: string): void => {
    setBrand(newBrand);
  };

  const handleAddToCart = async (product: string): Promise<void> => {
    const cartId = Cookies.get('cart-id');
    const anonToken = Cookies.get('anon-token');
    const authType = Cookies.get('auth-type');
    const accessToken = Cookies.get('access-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    let resultCart;
    if (cartId) {
      if (authType === 'password' && accessToken) {
        console.log(cartId);
        const cart = await getCartById(accessToken, cartId);
        resultCart = await addToCart(accessToken, cart.id, product, cart.version, 1);
      } else if (anonToken) {
        const cart = await getCartById(anonToken, cartId);
        resultCart = await addToCart(anonToken, cart.id, product, cart.version, 1);
      } else if (anonRefreshToken) {
        const response = await getNewToken(anonRefreshToken);
        Cookies.set('anon-token', response.accessToken, { expires: 2 });
        const cart = await getCartById(response.accessToken, cartId);
        resultCart = await addToCart(response.accessToken, cart.id, product, cart.version, 1);
      }
    } else {
      const response = await getAnonymousToken();
      const threeHours = 180 / (24 * 60);

      Cookies.set('anon-token', response.accessToken, { expires: threeHours });
      Cookies.set('anon-refresh-token', response.refreshToken, { expires: 200 });

      const cart = await createCart(response.accessToken);
      Cookies.set('cart-id', cart.id, { expires: 999 });

      resultCart = await addToCart(response.accessToken, cart.id, product, cart.version, 1);
    }

    if (resultCart) {
      const formattedCart = resultCart.lineItems.map((lineItem) => ({
        productId: lineItem.productId,
        id: lineItem.id,
      }));
      setCartList(formattedCart);
    }

    return Promise.resolve();
  };

  const handleRemoveFromCart = async (product: string): Promise<void> => {
    const cartId = Cookies.get('cart-id');
    const anonToken = Cookies.get('anon-token');
    const authType = Cookies.get('auth-type');
    const accessToken = Cookies.get('access-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    let resultCart;
    if (cartId) {
      if (anonToken) {
        const cart = await getCartById(anonToken, cartId);
        resultCart = await removeFromCart(anonToken, cart.id, product, cart.version);
      } else if (authType === 'password' && accessToken) {
        const cart = await getCartById(accessToken, cartId);
        resultCart = await removeFromCart(accessToken, cart.id, product, cart.version);
      } else if (anonRefreshToken) {
        const response = await getNewToken(anonRefreshToken);
        Cookies.set('anon-token', response.accessToken, { expires: 2 });

        const cart = await getCartById(response.accessToken, cartId);
        resultCart = await removeFromCart(response.accessToken, cart.id, product, cart.version);
      }
    }

    if (resultCart) {
      const formattedCart = resultCart.lineItems.map((lineItem) => ({
        productId: lineItem.productId,
        id: lineItem.id,
      }));
      setCartList(formattedCart);
    }
    return Promise.resolve();
  };

  const clearBrand = useCallback(() => {
    setBrand('');
  }, []);

  const getNewProducts = useCallback(() => {
    let formatPriceRange;
    if (priceRange[0] === 0) {
      formatPriceRange = `variants.price.centAmount:range (0 to ${priceRange[1]}00)`;
    } else {
      formatPriceRange = `variants.price.centAmount:range (${priceRange[0]}00 to ${priceRange[1]}00)`;
    }

    if (currentCategory.length > 0) {
      getProductsByCategory(
        `categories.id: subtree("${currentCategory[currentCategory.length - 1].key}")&filter=${formatPriceRange}`,
        sort,
        search,
        brand,
      ).then((data) => {
        setProducts(data.results);
      });
    } else {
      getProductsByCategory(`${formatPriceRange}`, sort, search, brand).then((data) => {
        setProducts(data.results);
      });
    }
  }, [priceRange, sort, brand, currentCategory, search]);

  useEffect(() => {
    const fetchCategory = async (
      name: string,
    ): Promise<{
      name: string;
      slug: string;
    }> => {
      const data = await getCategories(`slug(en = "${name}")`);
      return {
        name: data.results[0].name.en,
        slug: data.results[0].slug.en,
      };
    };

    async function fetchCategoriesInOrder(
      currentCategories: {
        name: string;
        key?: string | undefined;
      }[],
    ): Promise<
      {
        name: string;
        slug: string;
      }[]
    > {
      const breadcrumbArray = [];

      const fetchPromises = currentCategories.map((category) => fetchCategory(category.name));

      const results = await Promise.all(fetchPromises);

      breadcrumbArray.push(...results);

      return breadcrumbArray;
    }

    if (currentCategory.length > 0) {
      fetchCategoriesInOrder(currentCategory).then((array) => {
        setBreadcrumb(array);
      });
    }
  }, [currentCategory]);

  useEffect(() => {
    formattedCategoryList().then((data) => {
      setCategories(data.mainCategories);
    });
  }, []);

  useEffect(() => {
    const cartId = Cookies.get('cart-id');
    const anonToken = Cookies.get('anon-token');
    const accessToken = Cookies.get('access-token');
    const authType = Cookies.get('auth-type');
    if (cartId && authType === 'password' && accessToken) {
      getCartById(accessToken, cartId).then((cart) => {
        const formattedCart = cart.lineItems.map((lineItem) => ({
          productId: lineItem.productId,
          id: lineItem.id,
        }));
        setCartList(formattedCart);
      });
    } else if (cartId && anonToken) {
      getCartById(anonToken, cartId).then((cart) => {
        const formattedCart = cart.lineItems.map((lineItem) => ({
          productId: lineItem.productId,
          id: lineItem.id,
        }));
        setCartList(formattedCart);
      });
    }
  }, []);

  useEffect(() => {
    getNewProducts();
  }, [sort, priceRange, getNewProducts]);

  useEffect(() => {
    if (categories.length > 1 && categoryslug) {
      const mainCategory = categories.filter((category) => category.slug === categoryslug);
      if (mainCategory.length > 0) {
        if (subcategoryslug) {
          const subcategory = mainCategory[0].ancestors.filter((category) => category.slug === subcategoryslug);
          if (subcategory.length === 0) {
            navigate('/NotFound');
          }
        }
      } else {
        navigate('/NotFound');
      }
    }

    if (subcategoryslug && categoryslug) {
      getCategories(`slug(en = "${subcategoryslug}")`).then((data) => {
        setCurrentCategory([{ name: categoryslug }, { name: subcategoryslug, key: data.results[0].id }]);
        getProductsByCategory(`categories.id: subtree("${data.results[0].id}")`, sort).then((result) => {
          setSavedBrands(result.results);
          setProducts(result.results);
        });
      });
    } else if (categoryslug) {
      getCategories(`slug(en = "${categoryslug}")`).then((data) => {
        setCurrentCategory([{ name: categoryslug, key: data.results[0].id }]);
        getProductsByCategory(`categories.id: subtree("${data.results[0].id}")`, sort).then((result) => {
          setSavedBrands(result.results);
          setProducts(result.results);
        });
      });
    } else {
      setCurrentCategory([]);
      getProductsByCategory(`variants.prices:exists`, sort).then((data) => {
        setSavedBrands(data.results);
        setProducts(data.results);
      });
    }
  }, [categories, sort, categoryslug, subcategoryslug, subcategoryslug2, navigate]);

  return (
    <div className="catalog-content">
      <div className="catalog-header">
        <div className="info-header">
          <button
            type="button"
            className="open-categories"
            onClick={(): void => {
              setDisplayCategories(!displayCategories);
            }}
          >
            Categories
          </button>
          <div className={`categories ${displayCategories ? 'categories-open' : ''}`}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="breadcrumb">
            <div>
              <span> / </span>
              <Link
                to="/catalog"
                onClick={(): void => {
                  setBreadcrumb([]);
                }}
              >
                Catalog
              </Link>
            </div>

            <Breadcrumb breadcrumb={breadcrumb} />
          </div>
        </div>
        <div className="options-header">
          <div className="search-products">
            <img src={searchIcon} alt="Search icon" />
            <input
              name="search"
              type="text"
              onChange={(event): void => {
                const { value } = event.target;
                setSearch(value);
              }}
            />
          </div>
          <div className="sort-container">
            <SortingSelect selectedOption={sort} options={sortingOptions} onSelect={handleSortingChange} />
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="filter-list">
          <PriceRangeSlider min={minPrice} max={maxPrice} onChange={handlePriceChange} />
          <BrandFilter products={savedBrands} onChange={handleBrandChange} clearBrand={clearBrand} />
        </div>
        <div className="product-list">
          {products.map((product) => (
            <CatalogProductCard
              key={product.name.en}
              product={product}
              cartList={cartList}
              addToCart={handleAddToCart}
              removeFromCart={handleRemoveFromCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
