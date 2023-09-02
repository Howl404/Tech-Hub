import { getCategories, getProductsByCategory } from '@src/services/ProductsService/ProductsService';
import ProductCard from '@src/components/ProductCard/ProductCard';
import React, { useCallback, useEffect, useState } from 'react';
import { Product, ProductFormattedData } from '@src/interfaces/Product';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductFormattedData[]>([]);
  const [sort, setSort] = useState('name.en asc');
  const [brand, setBrand] = useState('');
  const [savedBrands, setSavedBrands] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<{ name: string; key?: string }[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; slug: string }[]>([]);

  const [displayCategories, setDisplayCategories] = useState(true);

  const handleSortingChange = (newOption: string): void => {
    setSort(newOption);
  };

  const handlePriceChange = (newRange: number[]): void => {
    setPriceRange(newRange);
  };

  const handleBrandChange = (newBrand: string): void => {
    setBrand(newBrand);
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

    const updateBreadcrumb = async (): Promise<void> => {
      const breadcrumbArray: { name: string; slug: string }[] = [];

      for (let i = 0; i < currentCategory.length; i += 1) {
        fetchCategory(currentCategory[i].name).then((data) => {
          breadcrumbArray.push(data);
        });
      }

      setBreadcrumb(breadcrumbArray);
    };

    if (currentCategory.length > 0) {
      updateBreadcrumb();
    }
  }, [currentCategory]);

  useEffect(() => {
    formattedCategoryList().then((data) => {
      setCategories(data.mainCategories);
    });
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
            <ProductCard key={product.name.en} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
