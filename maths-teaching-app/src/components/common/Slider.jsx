// src/components/common/Slider.jsx
import React from 'react';

/**
 * Slider - A customizable slider component for numeric inputs with theme support
 * 
 * @param {Object} props
 * @param {number} props.value - Current value
 * @param {function} props.onChange - Function called when value changes
 * @param {number} props.min - Minimum value (default: 0)
 * @param {number} props.max - Maximum value (default: 100)
 * @param {number} props.step - Step increment (default: 1)
 * @param {string} props.className - Additional CSS classes including theme-specific classes
 */
export const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}) => {
  // Custom styles to handle theme-based slider track and thumb
  const sliderStyles = {
    // Apply CSS variables for track and thumb colors based on theme
    // These will be populated by the accent-{color} class provided in className
    // "--slider-accent" is defined in a style block in the component
    '--slider-track': 'var(--slider-accent-light, #e5e7eb)',
    '--slider-thumb': 'var(--slider-accent, #4b5563)',
  };

  return (
    <div className={`w-full ${className}`}>
      <style jsx>{`
        /* Extract the accent color from any accent-{color}-500 class */
        .accent-blue-500 { --slider-accent: #3b82f6; --slider-accent-light: #dbeafe; }
        .accent-green-500 { --slider-accent: #22c55e; --slider-accent-light: #dcfce7; }
        .accent-purple-500 { --slider-accent: #a855f7; --slider-accent-light: #f3e8ff; }
        .accent-orange-500 { --slider-accent: #f97316; --slider-accent-light: #ffedd5; }
        .accent-red-500 { --slider-accent: #ef4444; --slider-accent-light: #fee2e2; }
        
        /* Default color if no accent class provided */
        .slider-input { --slider-accent: #6b7280; --slider-accent-light: #f3f4f6; }
        
        /* Custom styling for the range input */
        .slider-input::-webkit-slider-thumb {
          background: var(--slider-thumb);
        }
        .slider-input::-moz-range-thumb {
          background: var(--slider-thumb);
        }
        .slider-input::-webkit-slider-runnable-track {
          background: var(--slider-track);
        }
        .slider-input::-moz-range-track {
          background: var(--slider-track);
        }
      `}</style>

      <div className="flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="slider-input w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={sliderStyles}
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