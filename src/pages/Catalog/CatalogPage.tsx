import { getCategories, getProductsByCategory } from '@src/services/ProductsService/ProductsService';
import ProductCard from '@src/components/ProductCard/ProductCard';
import React, { useEffect, useState } from 'react';
import { Product, ProductFormattedData } from '@src/interfaces/Product';
import CategoryCard from '@src/components/CategoryCard/CategoryCard';
import './CatalogPage.scss';
import PriceRangeSlider from '@src/components/PriceRange/PriceRange';

export default function Catalog(): JSX.Element {
  const minPrice = 0;
  const maxPrice = 5000;
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductFormattedData[]>([]);
  const [productsCategoriesList] = useState<string[]>([]);

  function getNewProducts(): void {
    let formatPriceRange;
    if (priceRange[0] === 0) {
      formatPriceRange = `variants.price.centAmount:range (0 to ${priceRange[1]}00)`;
    } else {
      formatPriceRange = `variants.price.centAmount:range (${priceRange[0]}00 to ${priceRange[1]}00)`;
    }
    if (productsCategoriesList.length > 0) {
      const formattedCategories = productsCategoriesList
        .map((id, index) => (index === 0 ? `categories.id: subtree("${id}")` : `subtree("${id}")`))
        .join(', ');

      getProductsByCategory(`${formattedCategories}&filter=${formatPriceRange}`).then((data) => {
        setProducts(data.results);
      });
    } else {
      getProductsByCategory(formatPriceRange).then((data) => {
        setProducts(data.results);
      });
    }
  }

  const handlePriceChange = (newRange: number[]): void => {
    setPriceRange(newRange);
  };

  const handlePriceApply = (): void => {
    getNewProducts();
  };

  function handleFilterCheckbox(checked: boolean, key: string): void {
    if (checked) {
      productsCategoriesList.push(key);
    } else {
      const index = productsCategoriesList.indexOf(key);
      productsCategoriesList.splice(index, 1);
      if (productsCategoriesList.length === 0) {
        getProductsByCategory(`variants.prices:exists`).then((data) => {
          setProducts(data.results);
        });
        return;
      }
    }
    getNewProducts();
  }

  useEffect(() => {
    getProductsByCategory(`variants.prices:exists`).then((data) => {
      setProducts(data.results);
    });
  }, []);

  useEffect(() => {
    const mainCategories: ProductFormattedData[] = [];
    const subCategories: ProductFormattedData[] = [];
    const subCategories2: ProductFormattedData[] = [];
    getCategories('parent is not defined')
      .then((data) => {
        data.results.forEach((item) => {
          const category: ProductFormattedData = {
            name: item.name.en,
            id: item.id,
            ancestors: [],
          };
          mainCategories.push(category);
        });
        return Promise;
      })
      .then(() => {
        getCategories('parent is defined')
          .then((data) => {
            data.results.forEach((item) => {
              const category: ProductFormattedData = {
                name: item.name.en,
                id: item.id,
                ancestors: [],
              };

              if (item.parent?.id) {
                mainCategories
                  .filter((c) => c.id === item.parent?.id)
                  .forEach((c) => {
                    if (Object.values(c.ancestors).find((object) => object.id === item.id) === undefined) {
                      subCategories.push(category);
                      c.ancestors.push(category);
                      const itemCopy = item;
                      itemCopy.used = true;
                    }
                    return false;
                  });
              }
            });
            return data;
          })
          .then((data) => {
            data.results
              .filter((c) => c.used !== true)
              .forEach((item) => {
                const category: ProductFormattedData = {
                  name: item.name.en,
                  id: item.id,
                  ancestors: [],
                };

                if (item.parent?.id) {
                  subCategories
                    .filter((c) => c.id === item.parent?.id)
                    .forEach((c) => {
                      if (Object.values(c.ancestors).find((object) => object.id === item.id) === undefined) {
                        subCategories2.push(category);
                        c.ancestors.push(category);
                        const itemCopy = item;
                        itemCopy.used = true;
                      }
                      return false;
                    });
                }
              });
            return Promise;
          })
          .then(() => {
            setCategories(mainCategories);
          });
      });
  }, []);

  return (
    <div className="catalog-content">
      <div className="filter-list">
        <PriceRangeSlider min={minPrice} max={maxPrice} onChange={handlePriceChange} onApply={handlePriceApply} />
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
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.name.en} product={product} />
        ))}
      </div>
    </div>
  );
}
