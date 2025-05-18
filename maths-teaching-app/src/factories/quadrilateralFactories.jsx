// maths-teaching-app/src/factories/quadrilateralFactories.jsx
import React from 'react';
import Square from '../components/math/shapes/quadrilaterals/Square';
import _ from 'lodash';

/**
 * Creates a square with appropriate styling and labels
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
  
  return (
    <Square
      sideLength={sideLength}
      showDimensions={showDimensions}
      showArea={showArea}
      areaLabel={areaLabel || (showArea ? `Area = ${area} ${units}²` : null)}
      units={units}
      sectionType={sectionType}
      style={mergedStyle}
    />
  );
};

/**
 * Creates a rectangle with appropriate styling and labels
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
  // Note: We'll need to implement the Rectangle component similar to Square
  // For now, we'll return a Square as a placeholder
  console.warn('Rectangle component not yet implemented - using Square as fallback');
  
  return createSquare({
    sideLength: Math.max(width, height),
    showDimensions,
    showArea,
    areaLabel: areaLabel || (showArea ? `Area = ${width * height} ${units}²` : null),
    units,
    sectionType,
    style
  });
};

// We can add more quadrilateral factory functions here in the future
// (Rhombus, Parallelogram, Trapezoid, etc.)