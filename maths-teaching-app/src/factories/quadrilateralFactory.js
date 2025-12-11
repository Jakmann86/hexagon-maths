// src/factories/quadrilateralFactory.js
// V2.1 - Added type field for VisualizationRenderer compatibility
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
    fillColor: '#3498db',
    fillOpacity: 0.2,
    strokeColor: '#0284c7',
    strokeWidth: 2
  };
  
  // Merge provided style with defaults
  const mergedStyle = {
    ...defaultStyle,
    ...style
  };
  
  // Return configuration object WITH type for VisualizationRenderer
  return {
    type: 'square',  // ← CRITICAL: Enables auto-rendering in StarterSectionBase
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
  const area = width * height;
  
  const defaultStyle = {
    fillColor: '#3498db',
    fillOpacity: 0.2,
    strokeColor: '#0284c7',
    strokeWidth: 2
  };
  
  const mergedStyle = {
    ...defaultStyle,
    ...style
  };
  
  return {
    type: 'rectangle',  // ← For future VisualizationRenderer support
    width,
    height,
    showDimensions,
    showArea,
    areaLabel: areaLabel || (showArea ? `Area = ${area} ${units}²` : null),
    units,
    sectionType,
    style: mergedStyle
  };
};

export default {
  createSquare,
  createRectangle
};