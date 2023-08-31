import React, { useState } from 'react';
import './CategoryCard.scss';
import openIcon from '@assets/chevron-down-solid.svg';
import { CategoryProps } from '@src/interfaces/Category';
import { Link } from 'react-router-dom';

function CategoryCard({ category }: CategoryProps): JSX.Element {
  const { name, slug, ancestors } = category;

  const [isCategoryOpen, setCategoryOpen] = useState(false);

  const handleButtonClick = (): void => {
    setCategoryOpen(!isCategoryOpen);
  };

  return (
    <div className={`category ${isCategoryOpen ? 'category-open' : ''}`}>
      <div className="category-header">
        <Link to={`/catalog/${slug}`}>{name}</Link>
        <button type="button" onClick={handleButtonClick}>
          <img src={openIcon} alt="Open subcategories" />
        </button>
      </div>

      <div className="subcategories">
        {ancestors.map((subcategory) => (
          <div key={subcategory.slug}>
            <Link to={`/catalog/${slug}/${subcategory.slug}`}>{subcategory.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryCard;
