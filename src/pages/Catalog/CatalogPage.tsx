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
import removeItemCart from '@src/utilities/removeItemCart';
import addItemCart from '@src/utilities/addItemCart';
import getFormattedCart from '@src/utilities/getFormattedCart';
import ReactPaginate from 'react-paginate';
import { ClipLoader } from 'react-spinners';

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
  const [amountOfProducts, setAmountOfProducts] = useState(0);
  const [categories, setCategories] = useState<ProductFormattedData[]>([]);
  const [sort, setSort] = useState('name.en asc');
  const [brand, setBrand] = useState('');
  const [savedBrands, setSavedBrands] = useState<ProductCatalog[]>([]);
  const [currentCategory, setCurrentCategory] = useState<{ name: string; key?: string }[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; slug: string }[]>([]);

  const productsPerPage = 6;
  const [currentOffset, setCurrentOffset] = useState(0);

  const [gettingNewProducts, setGettingNewProducts] = useState(false);

  const [cartList, setCartList] = useState<{ id: string; productId: string }[]>([]);

  const [displayCategories, setDisplayCategories] = useState(false);

  const handleAddToCart = async (productSku: string): Promise<void> => {
    const result = await addItemCart(productSku);
    if (result) {
      setCartList(result);
    }
    return Promise.resolve();
  };

  const handleRemoveFromCart = async (productSku: string): Promise<void> => {
    const result = await removeItemCart(productSku);
    if (result) {
      setCartList(result);
    }
    return Promise.resolve();
  };

  const clearBrand = useCallback(() => {
    setBrand('');
  }, []);

  const getNewProducts = useCallback(() => {
    setGettingNewProducts(true);
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
        productsPerPage,
        currentOffset,
      ).then((data) => {
        setProducts(data.results);
        setAmountOfProducts(data.total);
        setGettingNewProducts(false);
      });
    } else {
      getProductsByCategory(`${formatPriceRange}`, sort, search, brand, productsPerPage, currentOffset).then((data) => {
        setProducts(data.results);
        setAmountOfProducts(data.total);
        setGettingNewProducts(false);
      });
    }
  }, [priceRange, sort, brand, currentCategory, search, currentOffset]);

  const handlePageChange = (selectedPage: { selected: number }): void => {
    setCurrentOffset(selectedPage.selected * productsPerPage);
  };

  const handleSortingChange = (newOption: string): void => {
    setSort(newOption);
    setCurrentOffset(0);
  };

  const handlePriceChange = (newRange: number[]): void => {
    setPriceRange(newRange);
    setCurrentOffset(0);
  };

  const handleBrandChange = (newBrand: string): void => {
    setBrand(newBrand);
    setCurrentOffset(0);
  };

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
    async function fetchData(): Promise<void> {
      const cart = await getFormattedCart();
      if (cart) {
        setCartList(cart);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    getNewProducts();
  }, [sort, priceRange, getNewProducts]);

  useEffect(() => {
    setGettingNewProducts(true);
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
        getProductsByCategory(`categories.id: subtree("${data.results[0].id}")`, sort, undefined, undefined)
          .then((result) => {
            setSavedBrands(result.results);
          })
          .then(() => {
            getProductsByCategory(
              `categories.id: subtree("${data.results[0].id}")`,
              sort,
              undefined,
              undefined,
              productsPerPage,
            ).then((result) => {
              setProducts(result.results);
              setAmountOfProducts(data.total);
              setGettingNewProducts(false);
            });
          });
      });
    } else if (categoryslug) {
      getCategories(`slug(en = "${categoryslug}")`).then((data) => {
        setCurrentCategory([{ name: categoryslug, key: data.results[0].id }]);
        getProductsByCategory(`categories.id: subtree("${data.results[0].id}")`, sort, undefined, undefined)
          .then((result) => {
            setSavedBrands(result.results);
          })
          .then(() => {
            getProductsByCategory(
              `categories.id: subtree("${data.results[0].id}")`,
              sort,
              undefined,
              undefined,
              productsPerPage,
            ).then((result) => {
              setProducts(result.results);
              setAmountOfProducts(data.total);
              setGettingNewProducts(false);
            });
          });
      });
    } else {
      setCurrentCategory([]);
      getProductsByCategory(`variants.prices:exists`, sort, undefined, undefined)
        .then((data) => {
          setSavedBrands(data.results);
        })
        .then(() => {
          getProductsByCategory(`variants.prices:exists`, sort, undefined, undefined, productsPerPage).then((data) => {
            setProducts(data.results);
            setAmountOfProducts(data.total);
            setGettingNewProducts(false);
          });
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
        {gettingNewProducts ? (
          <div className="centered-loader">
            <ClipLoader size={160} />
          </div>
        ) : (
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
        )}
      </div>

      <ReactPaginate
        pageCount={Math.ceil(amountOfProducts / productsPerPage)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName="catalog-pagination"
        activeClassName="pagination-active"
        previousLabel="<"
        nextLabel=">"
        forcePage={currentOffset / productsPerPage}
      />
    </div>
  );
}
