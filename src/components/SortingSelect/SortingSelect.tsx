import React from 'react';
import './SortingSelect.scss';

function SortingSelect({
  selectedOption,
  options,
  onSelect,
}: {
  selectedOption: string;
  options: { value: string; label: string }[];
  onSelect: (newOption: string) => void;
}): JSX.Element {
  return (
    <div className="sorting-select-container">
      <label htmlFor="sorting-select">
        Sort by:
        <select
          id="sorting-select"
          className="sorting-select"
          value={selectedOption}
          onChange={(e): void => onSelect(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default SortingSelect;
