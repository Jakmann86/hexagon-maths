// src/factories/triangleFactory.js
// V2.1 - Added type field for VisualizationRenderer compatibility
import _ from 'lodash';

// Common Pythagorean triples - SINGLE SOURCE OF TRUTH
// Used by generators via import, not duplicated
export const PYTHAGOREAN_TRIPLES = [
  // Basic triples (good for easy/medium difficulty)
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],    // 2× of 3,4,5
  [8, 15, 17],
  [7, 24, 25],
  
  // Scaled triples (good for medium/hard difficulty)
  [9, 12, 15],   // 3× of 3,4,5
  [12, 16, 20],  // 4× of 3,4,5
  [15, 20, 25],  // 5× of 3,4,5
  [10, 24, 26],  // 2× of 5,12,13
  
  // Larger triples (for challenge/extension)
  [9, 40, 41],
  [20, 21, 29],
  [11, 60, 61],
];

/**
 * Creates configuration for a right-angled triangle
 * Following Pattern 2 architecture: returns configuration only, no React elements
 * 
 * @param {Object} config - Configuration options
 * @param {number} config.base - Base length
 * @param {number} config.height - Height length
 * @param {string} config.unknownSide - Which side is unknown ('base', 'height', 'hypotenuse', or null)
 * @param {boolean} config.showRightAngle - Whether to show the right angle marker
 * @param {string} config.labelStyle - How to label sides ('numeric', 'algebraic', 'custom')
 * @param {Array|Object} config.labels - Custom labels for sides
 * @param {string} config.units - Units for measurements
 * @param {string} config.sectionType - Section type for styling
 * @param {Object} config.style - Custom styling
 * @param {string} config.orientation - Triangle orientation (optional)
 * @returns {Object} Configuration object for RightTriangleSVG component
 */
export function createPythagoreanTriangle({
  base = 3,
  height = 4,
  unknownSide = null,
  showRightAngle = true,
  labelStyle = 'custom',
  labels = null,
  units = 'cm',
  sectionType = 'default',
  style = {},
  orientation,
  ...otherProps
}) {
  // Calculate hypotenuse
  const hypotenuse = Math.sqrt(base * base + height * height);
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Create labels based on unknownSide
  let sideLabels;
  if (labels) {
    sideLabels = labels;
  } else if (unknownSide === 'base') {
    sideLabels = [`? ${units}`, `${height} ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'height') {
    sideLabels = [`${base} ${units}`, `? ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'hypotenuse') {
    sideLabels = [`${base} ${units}`, `${height} ${units}`, `? ${units}`];
  } else {
    sideLabels = [`${base} ${units}`, `${height} ${units}`, `${roundedHypotenuse} ${units}`];
  }

  // Set default style if not provided
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

  // Build the config object
  const config = {
    type: 'right-triangle',  // ← CRITICAL: Enables auto-rendering in StarterSectionBase
    base,
    height,
    hypotenuse: roundedHypotenuse,
    labelStyle: 'custom',
    labels: sideLabels,
    showRightAngle,
    unknownSide,
    units,
    sectionType,
    style: mergedStyle,
    ...otherProps
  };

  // Only add orientation if it was provided
  if (orientation !== undefined) {
    config.orientation = orientation;
  }

  return config;
}

/**
 * Creates configuration for a triangle using a Pythagorean triple
 */
export function createPythagoreanTripleTriangle({
  triple = [3, 4, 5],
  unknownSide = null,
  units = 'cm',
  sectionType = 'default',
  style = {},
  orientation,
  ...otherProps
}) {
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

  const config = {
    type: 'right-triangle',  // ← CRITICAL
    base: a,
    height: b,
    hypotenuse: c,
    labelStyle: 'custom',
    labels,
    showRightAngle: true,
    unknownSide,
    units,
    sectionType,
    style: mergedStyle,
    ...otherProps
  };

  if (orientation !== undefined) {
    config.orientation = orientation;
  }

  return config;
}

/**
 * Creates configuration object for an isosceles triangle
 */
export function createIsoscelesTriangle({
  base = 6,
  height,
  legLength,
  showEqualSides = true,
  showEqualAngles = false,
  showHeight = false,
  showArea = false,
  areaLabel = null,
  labelStyle = 'custom',
  labels = [],
  units = 'cm',
  sectionType = 'examples',
  orientation,
  ...otherProps
} = {}) {
  // If height isn't provided but legLength is, calculate height using Pythagoras
  if (height === undefined && legLength !== undefined) {
    const halfBase = base / 2;
    height = Math.sqrt(legLength * legLength - halfBase * halfBase);
    height = Math.round(height * 100) / 100;
  }

  // If legLength isn't provided but height is, calculate legLength using Pythagoras
  if (legLength === undefined && height !== undefined) {
    const halfBase = base / 2;
    legLength = Math.sqrt(height * height + halfBase * halfBase);
    legLength = Math.round(legLength * 100) / 100;
  }

  // If neither is provided, use defaults
  if (height === undefined && legLength === undefined) {
    height = 5;
    const halfBase = base / 2;
    legLength = Math.sqrt(height * height + halfBase * halfBase);
    legLength = Math.round(legLength * 100) / 100;
  }

  // Default labels if not provided
  if (labels.length === 0 && labelStyle === 'custom') {
    labels = [
      `${base} ${units}`,
      `${legLength} ${units}`,
      `${legLength} ${units}`
    ];
  }

  const config = {
    type: 'isosceles-triangle',  // ← CRITICAL
    base,
    height,
    legLength,
    showEqualSides,
    showEqualAngles,
    showHeight,
    showArea,
    areaLabel,
    labelStyle,
    labels,
    units,
    sectionType,
    ...otherProps
  };

  if (orientation !== undefined) {
    config.orientation = orientation;
  }

  return config;
}

// Simple right triangle creator
export const createRightTriangle = ({ base, height, ...props }) => {
  return {
    type: 'right-triangle',
    base,
    height,
    ...props
  };
};

export default {
  createPythagoreanTriangle,
  createPythagoreanTripleTriangle,
  createIsoscelesTriangle,
  createRightTriangle,
  PYTHAGOREAN_TRIPLES
};