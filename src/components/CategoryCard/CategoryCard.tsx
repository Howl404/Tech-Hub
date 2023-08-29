import { CategoryProps } from '@src/interfaces/Category';
import React, { useState } from 'react';
import './CategoryCard.scss';

function CategoryCard({ category, onCheckboxClick }: CategoryProps): JSX.Element {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = (): void => {
    setIsChecked(!isChecked);
    onCheckboxClick(!isChecked, category.id);
  };

  return (
    <div className="category">
      <h3>{category.name}</h3>
      <input type="checkbox" checked={isChecked} onClick={handleCheckboxClick} />
      {category.ancestors.map((subCategory) => (
        <div key={subCategory.id} className="sub-category">
          <CategoryCard category={subCategory} onCheckboxClick={onCheckboxClick} />
        </div>
      ))}
    </div>
  );
}

export default CategoryCard;
