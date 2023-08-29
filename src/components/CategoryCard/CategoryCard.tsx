import { CategoryProps } from '@src/interfaces/Category';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import './CategoryCard.scss';
import openIcon from '@assets/chevron-down-solid.svg';

function CategoryCard({ category, onCheckboxClick }: CategoryProps): JSX.Element {
  const [isSubcategoriesOpen, setIsSubcategoriesOpen] = useState(false);

  const [hasSubcategories, setHasSubcategories] = useState(category.ancestors.length > 0);

  useEffect(() => {
    setHasSubcategories(category.ancestors.length > 0);
  }, [category.ancestors]);

  const subcategories = isSubcategoriesOpen
    ? category.ancestors.map((subCategory) => (
        <div key={subCategory.id} className="sub-category">
          <CategoryCard category={subCategory} onCheckboxClick={onCheckboxClick} />
        </div>
      ))
    : null;

  const handleCheckboxClick: MouseEventHandler<HTMLButtonElement> = (event): void => {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.toggle('expand-active');
    }
    setIsSubcategoriesOpen(!isSubcategoriesOpen);
  };

  return (
    <div className="category">
      <div className="name-expand-wrapper">
        <h3>{category.name}</h3>
        {hasSubcategories && (
          <button type="button" onClick={handleCheckboxClick}>
            <img src={openIcon} alt="Expand category" />
          </button>
        )}
      </div>
      <div className="subcategories-list">{subcategories}</div>
    </div>
  );
}

export default CategoryCard;
