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
import { useNavigate, useParams } from 'react-router-dom';

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
  const [productsCategoriesList] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [savedBrands, setSavedBrands] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<{ name: string; key?: string }[]>([]);

  const sortingOptions = [
    { value: 'name.en asc', label: 'Name (Ascending)' },
    { value: 'name.en desc', label: 'Name (Descending)' },
    { value: 'price asc', label: 'Price (Ascending)' },
    { value: 'price desc', label: 'Price (Descending)' },
  ];

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

  const handleSortingChange = (newOption: string): void => {
    setSort(newOption);
  };

  useEffect(() => {
    getNewProducts();
  }, [sort, getNewProducts]);

  const handlePriceChange = (newRange: number[]): void => {
    setPriceRange(newRange);
  };

  const handleBrandChange = (newBrand: string): void => {
    setBrand(newBrand);
  };

  function handleFilterCheckbox(checked: boolean, key: string): void {
    if (checked) {
      productsCategoriesList.push(key);
    } else {
      const index = productsCategoriesList.indexOf(key);
      productsCategoriesList.splice(index, 1);
      if (productsCategoriesList.length === 0) {
        getProductsByCategory(`variants.prices:exists`, sort).then((data) => {
          setProducts(data.results);
        });
        return;
      }
    }
    getNewProducts();
  }

  useEffect(() => {
    formattedCategoryList().then((data) => {
      setCategories(data.mainCategories);
    });
  }, []);

  useEffect(() => {
    if (subcategoryslug2 && subcategoryslug && categoryslug) {
      getCategories(`slug(en = "${subcategoryslug2}")`)
        .then((data) => {
          setCurrentCategory([
            { name: categoryslug },
            { name: subcategoryslug },
            { name: subcategoryslug2, key: data.results[0].id },
          ]);
          getProductsByCategory(`categories.id: subtree("${data.results[0].id}")`, sort).then((result) => {
            setSavedBrands(result.results);
            setProducts(result.results);
          });
        })
        .catch(() => {
          navigate('/NotFound');
        });
    } else if (subcategoryslug && categoryslug) {
      getCategories(`slug(en = "${subcategoryslug}")`)
        .then((data) => {
          setCurrentCategory([{ name: categoryslug }, { name: subcategoryslug, key: data.results[0].id }]);
          getProductsByCategory(`categories.id: subtree("${data.results[0].id}")`, sort).then((result) => {
            setSavedBrands(result.results);
            setProducts(result.results);
          });
        })
        .catch(() => {
          navigate('/NotFound');
        });
    } else if (categoryslug) {
      getCategories(`slug(en = "${categoryslug}")`)
        .then((data) => {
          setCurrentCategory([{ name: categoryslug, key: data.results[0].id }]);
          getProductsByCategory(`categories.id: subtree("${data.results[0].id}")`, sort).then((result) => {
            setSavedBrands(result.results);
            setProducts(result.results);
          });
        })
        .catch(() => {
          navigate('/NotFound');
        });
    } else {
      getProductsByCategory(`variants.prices:exists`, sort).then((data) => {
        setSavedBrands(data.results);
        setProducts(data.results);
      });
    }
  }, [sort, categoryslug, subcategoryslug, subcategoryslug2, navigate]);

  return (
    <div className="catalog-content">
      <div className="catalog-header">
        <div className="categories">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onCheckboxClick={(isChecked, key): void => {
                handleFilterCheckbox(isChecked, key);
              }}
            />
          ))}
        </div>
        <div className="sort-container">
          <SortingSelect selectedOption={sort} options={sortingOptions} onSelect={handleSortingChange} />
        </div>
      </div>
      <div className="main-content">
        <div className="filter-list">
          <PriceRangeSlider min={minPrice} max={maxPrice} onChange={handlePriceChange} />
          <BrandFilter products={savedBrands} onChange={handleBrandChange} />
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
