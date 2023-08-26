import getProducts from '@services/ProductsService/ProductsService';
import ProductCard from '@src/components/ProductCard/ProductCard';
import React, { useEffect, useState } from 'react';
import { Product } from '@src/interfaces/Product';

export default function Catalog(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.results);
    });
  }, []);
  return (
    <div>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.masterData.current.masterVariant.id} product={product} />
        ))}
      </div>
    </div>
  );
}
