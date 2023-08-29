import { Product } from '@src/interfaces/Product';
import React, { useState } from 'react';
import './BrandFilter.scss';

function BrandFilter({ products, onChange }: { products: Product[]; onChange: (brands: string) => void }): JSX.Element {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const brandCounts: { [key: string]: number } = {};

  products.forEach((product) => {
    const brand = product.masterVariant.attributes[0].value;

    if (brandCounts[brand]) {
      brandCounts[brand] += 1;
    } else {
      brandCounts[brand] = 1;
    }
  });

  const handleBrandChange = (brand: string): void => {
    if (selectedBrands.includes(brand)) {
      const updatedBrands = selectedBrands.filter((selectedBrand) => selectedBrand !== brand);
      onChange('');
      setSelectedBrands(updatedBrands);
    } else {
      onChange(brand);
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const brandCountEntries = Object.entries(brandCounts);

  brandCountEntries.sort();

  return (
    <div className="brand-list">
      {brandCountEntries.map(([brand, count]) => (
        <div key={brand} className="brand-div">
          <label htmlFor={brand}>
            <input
              name={brand}
              type="checkbox"
              value={brand}
              checked={selectedBrands.includes(brand)}
              onChange={(): void => handleBrandChange(brand)}
              disabled={selectedBrands.length > 0 && !selectedBrands.includes(brand)}
            />
            {brand} ({count})
          </label>
        </div>
      ))}
    </div>
  );
}

export default BrandFilter;
