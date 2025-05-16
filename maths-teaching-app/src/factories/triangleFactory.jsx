// src/factories/triangleFactory.js

import { shapes } from '../config';

/**
 * Creates props for a Pythagorean triangle with unknown side
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.unknownSide - Which side to mark as unknown ('base', 'height', 'hypotenuse')
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {Object} Props for the RightTriangle component
 */
export function createPythagoreanTriangle({ 
  base = 6,
  height = 5,
  unknownSide = null,
  sectionType = 'examples',
  orientation = 'default',
  units = 'cm'
}) {
  // Calculate hypotenuse
  const hypotenuse = Math.sqrt(base * base + height * height);
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;
  
  // Create labels based on which side is unknown
  let labels;
  if (unknownSide === 'base') {
    labels = [`? ${units}`, `${height} ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'height') {
    labels = [`${base} ${units}`, `? ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'hypotenuse') {
    labels = [`${base} ${units}`, `${height} ${units}`, `? ${units}`];
  } else {
    labels = [`${base} ${units}`, `${height} ${units}`, `${roundedHypotenuse} ${units}`];
  }
  
  // Return properties object for the RightTriangle component
  return {
    base,
    height,
    orientation,
    labelStyle: 'custom',
    labels,
    showRightAngle: true,
    units,
    sectionType
  };
}

/**
 * Creates props for a triangle using a Pythagorean triple
 * 
 * @param {Object} config - Configuration options
 * @param {Array} config.triple - Array of 3 integers representing a Pythagorean triple [a, b, c]
 * @param {string} config.unknownSide - Which side to mark as unknown
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {Object} Props for the RightTriangle component
 */
export function createPythagoreanTripleTriangle({
  triple = [3, 4, 5],
  unknownSide = null,
  orientation = 'default',
  units = 'cm',
  sectionType = 'examples'
}) {
  // Extract the triple values
  const [a, b, c] = triple;
  
  // Create labels based on which side is unknown
  let labels;
  if (unknownSide === 'base') {
    labels = [`? ${units}`, `${b} ${units}`, `${c} ${units}`];
  } else if (unknownSide === 'height') {
    labels = [`${a} ${units}`, `? ${units}`, `${c} ${units}`];
  } else if (unknownSide === 'hypotenuse') {
    labels = [`${a} ${units}`, `${b} ${units}`, `? ${units}`];
  } else {
    labels = [`${a} ${units}`, `${b} ${units}`, `${c} ${units}`];
  }
  
  // Return properties object for the RightTriangle component
  return {
    base: a,
    height: b,
    orientation,
    labelStyle: 'custom',
    labels,
    showRightAngle: true,
    units,
    sectionType
  };
}

/**
 * Creates props for an isosceles triangle
 * 
 * @param {Object} config - Configuration options
 * @param {number} config.base - Base length
 * @param {number} config.height - Height
 * @param {boolean} config.showHeight - Whether to show height line
 * @param {boolean} config.showEqualSides - Whether to show hash marks on equal sides
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {Object} Props for the IsoscelesTriangle component (when implemented)
 */
export function createIsoscelesTriangle({
  base = 6,
  height = 5,
  showHeight = false,
  showEqualSides = true,
  orientation = 'default',
  units = 'cm',
  sectionType = 'examples'
}) {
  // Calculate leg length (the equal sides)
  const halfBase = base / 2;
  const legLength = Math.sqrt(halfBase * halfBase + height * height);
  const roundedLegLength = Math.round(legLength * 100) / 100;
  
  // Create labels for sides
  const labels = [
    `${base} ${units}`,
    `${roundedLegLength} ${units}`,
    `${roundedLegLength} ${units}`
  ];
  
  // Return properties object (for future IsoscelesTriangle component)
  return {
    base,
    height,
    orientation,
    labelStyle: 'custom',
    labels,
    showHeight,
    showEqualSides,
    units,
    sectionType
  };
}

/**
 * Creates a triangle for special angle cases
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.type - Type of special triangle ('30-60-90' or '45-45-90')
 * @param {string} config.unknownSide - Which side to mark as unknown
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {Object} Props for the RightTriangle component
 */
export function createSpecialAngleTriangle({
  type = '30-60-90',
  unknownSide = null,
  orientation = 'default',
  units = 'cm',
  sectionType = 'examples'
}) {
  // Default dimensions
  let base, height, hypotenuse;
  let angles = [30, 60]; // Default for 30-60-90 triangle
  
  // Set dimensions based on type
  if (type === '30-60-90') {
    base = 6;
    height = 6 * Math.sqrt(3);
    hypotenuse = 12;
    angles = [30, 60];
  } else if (type === '45-45-90') {
    base = 6;
    height = 6;
    hypotenuse = 6 * Math.sqrt(2);
    angles = [45, 45];
  }
  
  // Round for display
  const roundedBase = Math.round(base * 100) / 100;
  const roundedHeight = Math.round(height * 100) / 100;
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;
  
  // Create labels based on unknown side
  let labels;
  if (unknownSide === 'base') {
    labels = [`? ${units}`, `${roundedHeight} ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'height') {
    labels = [`${roundedBase} ${units}`, `? ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'hypotenuse') {
    labels = [`${roundedBase} ${units}`, `${roundedHeight} ${units}`, `? ${units}`];
  } else {
    labels = [`${roundedBase} ${units}`, `${roundedHeight} ${units}`, `${roundedHypotenuse} ${units}`];
  }
  
  // Return properties object for the RightTriangle component
  return {
    base: roundedBase,
    height: roundedHeight,
    orientation,
    labelStyle: 'custom',
    labels,
    showRightAngle: true,
    showAngles: [true, true],
    angleLabels: [`${angles[0]}°`, `${angles[1]}°`],
    units,
    sectionType
  };
}

// Common Pythagorean triples for convenience
export const PYTHAGOREAN_TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [6, 8, 10],
  [15, 20, 25]
];