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
      if (brand) {
        getProductsByCategory(
          `categories.id: subtree("${
            currentCategory[currentCategory.length - 1].key
          }")&filter=${formatPriceRange}&filter=variants.attributes.brand:"${brand}"`,
          sort,
        ).then((data) => {
          setProducts(data.results);
        });
      } else {
        getProductsByCategory(
          `categories.id: subtree("${currentCategory[currentCategory.length - 1].key}")&filter=${formatPriceRange}`,
          sort,
        ).then((data) => {
          setProducts(data.results);
        });
      }
    } else if (brand) {
      getProductsByCategory(`${formatPriceRange}&filter=variants.attributes.brand:"${brand}"`, sort).then((data) => {
        setProducts(data.results);
      });
    } else {
      getProductsByCategory(`${formatPriceRange}`, sort).then((data) => {
        setProducts(data.results);
      });
    }
  }, [priceRange, sort, brand, currentCategory]);

  useEffect(() => {
    switch (currentCategory.length) {
      case 1:
        getCategories(`slug(en = "${currentCategory[0].name}")`).then((data) => {
          setBreadcrumb([{ name: data.results[0].name.en, slug: data.results[0].slug.en }]);
        });
        break;
      case 2:
        Promise.all([
          getCategories(`slug(en = "${currentCategory[0].name}")`),
          getCategories(`slug(en = "${currentCategory[1].name}")`),
        ]).then(([data1, data2]) => {
          const mainCategory = {
            name: data1.results[0].name.en,
            slug: data1.results[0].slug.en,
          };

          const subCategory = {
            name: data2.results[0].name.en,
            slug: data2.results[0].slug.en,
          };

          setBreadcrumb([mainCategory, subCategory]);
        });
        break;
      case 3:
        Promise.all([
          getCategories(`slug(en = "${currentCategory[0].name}")`),
          getCategories(`slug(en = "${currentCategory[1].name}")`),
          getCategories(`slug(en = "${currentCategory[2].name}")`),
        ]).then(([data1, data2, data3]) => {
          const mainCategory = {
            name: data1.results[0].name.en,
            slug: data1.results[0].slug.en,
          };

          const subCategory = {
            name: data2.results[0].name.en,
            slug: data2.results[0].slug.en,
          };

          const subCategory2 = {
            name: data3.results[0].name.en,
            slug: data3.results[0].slug.en,
          };

          setBreadcrumb([mainCategory, subCategory, subCategory2]);
        });
        break;
      default:
        break;
    }
  }, [currentCategory]);

  useEffect(() => {
    formattedCategoryList().then((data) => {
      setCategories(data.mainCategories);
    });
  }, []);

  useEffect(() => {
    getNewProducts();
  }, [sort, getNewProducts]);

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
          {displayCategories ? (
            <div className="categories">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : null}

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
