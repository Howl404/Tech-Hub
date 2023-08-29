import { getCategories, getProductsByCategory } from '@src/services/ProductsService/ProductsService';
import ProductCard from '@src/components/ProductCard/ProductCard';
import React, { useEffect, useState } from 'react';
import { Product, ProductFormattedData } from '@src/interfaces/Product';
import CategoryCard from '@src/components/CategoryCard/CategoryCard';
import './CatalogPage.scss';

export default function Catalog(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductFormattedData[]>([]);
  const [productsQueryList] = useState<string[]>([]);

  function handleFilterCheckbox(checked: boolean, key: string): void {
    if (checked) {
      productsQueryList.push(key);
    } else {
      const index = productsQueryList.indexOf(key);
      productsQueryList.splice(index, 1);
      if (productsQueryList.length === 0) {
        getProductsByCategory(`variants.prices:exists`).then((data) => {
          setProducts(data.results);
        });
        return;
      }
    }
    const formattedQuery = productsQueryList
      .map((id, index) => (index === 0 ? `categories.id: subtree("${id}")` : `subtree("${id}")`))
      .join(', ');
    getProductsByCategory(formattedQuery).then((data) => {
      setProducts(data.results);
    });
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
