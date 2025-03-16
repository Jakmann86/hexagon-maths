// src/components/common/Slider.jsx
import React from 'react';

/**
 * Slider - A customizable slider component for numeric inputs
 * 
 * @param {Object} props
 * @param {number} props.value - Current value
 * @param {function} props.onChange - Function called when value changes
 * @param {number} props.min - Minimum value (default: 0)
 * @param {number} props.max - Maximum value (default: 100)
 * @param {number} props.step - Step increment (default: 1)
 * @param {string} props.className - Additional CSS classes
 */
export const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;