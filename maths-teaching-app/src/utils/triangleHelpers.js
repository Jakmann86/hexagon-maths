// maths-teaching-app/src/utils/triangleHelpers.js
import React from 'react';
import RightTriangle from '../components/math/shapes/RightTriangle';

/**
 * Helper function to create a right triangle with custom label positions
 * 
 * @param {Object} config Triangle configuration
 * @returns {JSX.Element} RightTriangle component
 */
export const createRightTriangle = ({
  base = 3,
  height = 4,
  labels = [],
  orientation = 'default',
  style = {},
  showRightAngle = true,
  units = 'cm',
  labelPositions = null
}) => {
  return (
    <RightTriangle
      base={base}
      height={height}
      labelStyle="custom"
      labels={labels}
      orientation={orientation}
      showRightAngle={showRightAngle}
      units={units}
      style={style}
      labelPositions={labelPositions}
    />
  );
};

/**
 * Gets default label positions for a right triangle
 * More precise than the automatic calculations
 * 
 * @param {number} base Triangle base length
 * @param {number} height Triangle height
 * @returns {Object} Label positions for all orientations
 */
export const getDefaultLabelPositions = (base, height) => {
  return {
    default: [
      { x: base/2, y: -0.6 * Math.min(1, base/10) },               // Base label
      { x: -0.6 * Math.min(1, height/10), y: height/2 },           // Height label
      { x: base/2.5, y: height/2.5 }                               // Hypotenuse label
    ],
    rotate90: [
      { x: -0.6 * Math.min(1, base/10), y: base/2 },               // Base label (on left)
      { x: height/2, y: -0.6 * Math.min(1, height/10) },           // Height label (on bottom)
      { x: height/2.5, y: base/2.5 }                               // Hypotenuse label
    ],
    rotate180: [
      { x: base/2, y: height + 0.6 * Math.min(1, base/10) },       // Base label (on top)
      { x: base + 0.6 * Math.min(1, height/10), y: height/2 },     // Height label (on right)
      { x: base/2.5, y: height/2.5 }                               // Hypotenuse label
    ],
    rotate270: [
      { x: height + 0.6 * Math.min(1, base/10), y: base/2 },       // Base label (on right)
      { x: height/2, y: base + 0.6 * Math.min(1, height/10) },     // Height label (on top) 
      { x: height/2.5, y: base/2.5 }                               // Hypotenuse label
    ]
  };
};

/**
 * Creates a triangle with optimal label positioning for all orientations
 * 
 * @param {Object} config Triangle configuration
 * @returns {JSX.Element} RightTriangle component with optimal label positions
 */
export const createOptimalTriangle = ({
  base = 3,
  height = 4, 
  labels = [],
  orientation = 'default',
  style = {},
  showRightAngle = true,
  units = 'cm'
}) => {
  const labelPositions = getDefaultLabelPositions(base, height);
  
  return createRightTriangle({
    base,
    height,
    labels,
    orientation,
    style,
    showRightAngle,
    units,
    labelPositions
  });
};

/**
 * Pythagorean triangle preset with optimal labels
 * 
 * @param {Object} config Triangle configuration
 * @returns {JSX.Element} Pythagorean triangle
 */
export const createPythagoreanTriangle = ({
  base = 3,
  height = 4,
  orientation = 'default',
  style = {},
  units = 'cm',
  unknownSide = null  // Can be 'base', 'height', or 'hypotenuse'
}) => {
  const hypotenuse = Math.sqrt(base * base + height * height).toFixed(2);
  
  // Create labels based on which side is unknown
  let labels;
  if (unknownSide === 'base') {
    labels = [`? ${units}`, `${height} ${units}`, `${hypotenuse} ${units}`];
  } else if (unknownSide === 'height') {
    labels = [`${base} ${units}`, `? ${units}`, `${hypotenuse} ${units}`];
  } else if (unknownSide === 'hypotenuse') {
    labels = [`${base} ${units}`, `${height} ${units}`, `? ${units}`];
  } else {
    labels = [`${base} ${units}`, `${height} ${units}`, `${hypotenuse} ${units}`];
  }
  
  return createOptimalTriangle({
    base,
    height,
    labels,
    orientation,
    style,
    showRightAngle: true,
    units
  });
};