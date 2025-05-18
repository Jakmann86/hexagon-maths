// src/factories/quadrilateralFactory.js
import _ from 'lodash';

/**
 * Creates configuration for a square with appropriate styling and labels
 * Returns ONLY a configuration object, not a React component
 * 
 * @param {Object} config - Configuration options
 * @param {number} config.sideLength - Length of square sides
 * @param {boolean} config.showDimensions - Whether to show dimensions
 * @param {boolean} config.showArea - Whether to show area
 * @param {string} config.areaLabel - Optional custom area label
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling 
 * @param {Object} config.style - Custom styling properties
 * @returns {Object} Configuration object for Square component
 */
export const createSquare = ({
  sideLength = 5,
  showDimensions = true,
  showArea = false,
  areaLabel = null,
  units = 'cm',
  sectionType = 'diagnostic',
  style = {}
}) => {
  // Calculate area for use in labels if needed
  const area = sideLength * sideLength;
  
  // Set default style with blue theme if not provided
  const defaultStyle = {
    fillColor: '#3498db',     // Nice blue color
    fillOpacity: 0.2,
    strokeColor: '#0284c7',   // Slightly darker blue for stroke
    strokeWidth: 2
  };
  
  // Merge provided style with defaults
  const mergedStyle = {
    ...defaultStyle,
    ...style
  };
  
  // Return ONLY configuration object, not a React component
  return {
    sideLength,
    showDimensions,
    showArea,
    areaLabel: areaLabel || (showArea ? `Area = ${area} ${units}²` : null),
    units,
    sectionType,
    style: mergedStyle
  };
};

/**
 * Creates configuration for a rectangle with appropriate styling and labels
 * Returns ONLY a configuration object, not a React component
 * 
 * @param {Object} config - Configuration options
 * @param {number} config.width - Width of rectangle
 * @param {number} config.height - Height of rectangle
 * @param {boolean} config.showDimensions - Whether to show dimensions
 * @param {boolean} config.showArea - Whether to show area
 * @param {string} config.areaLabel - Optional custom area label
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @param {Object} config.style - Custom styling properties
 * @returns {Object} Configuration object for Rectangle component
 */
export const createRectangle = ({
  width = 6,
  height = 4,
  showDimensions = true,
  showArea = false,
  areaLabel = null,
  units = 'cm',
  sectionType = 'diagnostic',
  style = {}
}) => {
  // Calculate area for use in labels if needed
  const area = width * height;
  
  // Set default style with blue theme if not provided
  const defaultStyle = {
    fillColor: '#3498db',     // Nice blue color
    fillOpacity: 0.2,
    strokeColor: '#0284c7',   // Slightly darker blue for stroke
    strokeWidth: 2
  };
  
  // Merge provided style with defaults
  const mergedStyle = {
    ...defaultStyle,
    ...style
  };
  
  // Return ONLY configuration object, not a React component
  return {
    width,
    height,
    showDimensions,
    showArea,
    areaLabel: areaLabel || (showArea ? `Area = ${width * height} ${units}²` : null),
    units,
    sectionType,
    style: mergedStyle
  };
};

// Export a group of factory functions
export default {
  createSquare,
  createRectangle
};