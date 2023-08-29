import React, { ChangeEvent, useState } from 'react';
import Slider from 'react-slider';
import './PriceRange.scss';

function PriceRangeSlider({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (newRange: number[]) => void;
}): JSX.Element {
  const [range, setRange] = useState([min, max]);

  const handleSliderChange = (newRange: number[]): void => {
    setRange(newRange);
    onChange(newRange);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, index: number): void => {
    const newValue = parseInt(event.target.value, 10);
    if (!Number.isNaN(newValue)) {
      const newRange = [...range];
      newRange[index] = newValue;
      setRange(newRange);
      onChange(newRange);
    }
  };

  return (
    <div className="price-range-slider">
      <div className="label-currency-wrapper">
        <h3>Price range</h3>
        <p className="price-currency">EUR</p>
      </div>
      <div className="price-labels">
        <input
          name="min-range"
          type="number"
          className="price-input"
          value={range[0]}
          onChange={(event): void => handleInputChange(event, 0)}
        />
        <input
          type="number"
          className="price-input"
          value={range[1]}
          onChange={(event): void => handleInputChange(event, 1)}
        />
      </div>
      <Slider
        min={min}
        max={max}
        value={range}
        onChange={handleSliderChange}
        className="custom-slider"
        thumbClassName="custom-thumb"
      />
    </div>
  );
}

export default PriceRangeSlider;
