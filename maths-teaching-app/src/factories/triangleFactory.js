// src/factories/triangleFactory.js
/**
 * Triangle Factory - Generates configuration objects for triangle shapes
 * ONLY returns configuration objects, never React components
 */
import sections from '../config/sections';

/**
 * Creates configuration for a Pythagorean triangle with unknown side
 * 
 * @param {Object} config - Configuration options
 * @param {number} config.base - Base length
 * @param {number} config.height - Height
 * @param {string} config.unknownSide - Which side to mark as unknown ('base', 'height', 'hypotenuse')
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @param {Object} config.style - Custom styling
 * @param {string} config.orientation - Triangle orientation (now optional, added by generators)
 * @returns {Object} Configuration object for RightTriangle component
 */
export function createPythagoreanTriangle({
  base = 6,
  height = 5,
  unknownSide = null,
  sectionType = 'examples',
  // orientation removed from parameters - generators will add it conditionally
  units = 'cm',
  style = {},
  // But we still accept it if passed (for backward compatibility)
  orientation,
  ...otherProps
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

  // Set default style if not provided
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

  // Build the config object
  const config = {
    base,
    height,
    labelStyle: 'custom',
    labels,
    showRightAngle: true,
    units,
    sectionType,
    style: mergedStyle,
    ...otherProps // Include any other props passed
  };

  // Only add orientation if it was provided (generators will add it conditionally)
  if (orientation !== undefined) {
    config.orientation = orientation;
  }

  return config;
}

/**
 * Creates configuration for a triangle using a Pythagorean triple
 * 
 * @param {Object} config - Configuration options
 * @param {Array} config.triple - Array of 3 integers representing a Pythagorean triple [a, b, c]
 * @param {string} config.unknownSide - Which side to mark as unknown
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @param {Object} config.style - Custom styling
 * @param {string} config.orientation - Triangle orientation (now optional, added by generators)
 * @returns {Object} Configuration object for RightTriangle component
 */
export function createPythagoreanTripleTriangle({
  triple = [3, 4, 5],
  unknownSide = null,
  // orientation removed from parameters - generators will add it conditionally
  units = 'cm',
  sectionType = 'default',
  style = {},
  // But we still accept it if passed (for backward compatibility)
  orientation,
  ...otherProps
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

  // Set default style if not provided
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

  // Build the config object
  const config = {
    base: a,
    height: b,
    labelStyle: 'custom',
    labels,
    showRightAngle: true,
    units,
    sectionType,
    style: mergedStyle,
    ...otherProps // Include any other props passed
  };

  // Only add orientation if it was provided (generators will add it conditionally)
  if (orientation !== undefined) {
    config.orientation = orientation;
  }

  return config;
}

/**
 * Creates configuration object for an isosceles triangle
 * Following Pattern 2 architecture: returns configuration only, no React elements
 * 
 * @param {Object} config - Configuration options
 * @param {number} config.base - Base length of the triangle
 * @param {number} config.height - Height of the triangle (optional if legLength provided)
 * @param {number} config.legLength - Length of the equal sides (optional if height provided)
 * @param {boolean} config.showEqualSides - Whether to show hash marks for equal sides
 * @param {boolean} config.showHeight - Whether to show the height line
 * @param {boolean} config.showArea - Whether to show area label
 * @param {string} config.areaLabel - Custom area label
 * @param {string} config.labelStyle - Label style ('numeric', 'algebraic', 'custom')
 * @param {Array} config.labels - Custom labels for sides when labelStyle is 'custom'
 * @param {string} config.units - Units for measurements (cm, m, etc.)
 * @param {string} config.sectionType - Section type for styling
 * @param {string} config.orientation - Orientation of triangle (now optional, added by generators)
 * @returns {Object} - Configuration object for IsoscelesTriangle component
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
  // orientation removed from parameters - generators will add it conditionally
  units = 'cm',
  sectionType = 'examples',
  // But we still accept it if passed (for backward compatibility)
  orientation,
  ...otherProps
} = {}) {
  // If height isn't provided but legLength is, calculate height using Pythagoras
  if (height === undefined && legLength !== undefined) {
    const halfBase = base / 2;
    height = Math.sqrt(legLength * legLength - halfBase * halfBase);
    // Round for cleaner display
    height = Math.round(height * 100) / 100;
  }

  // If legLength isn't provided but height is, calculate legLength using Pythagoras
  if (legLength === undefined && height !== undefined) {
    const halfBase = base / 2;
    legLength = Math.sqrt(height * height + halfBase * halfBase);
    // Round for cleaner display
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

  // Build the config object
  const config = {
    base,
    height,
    showEqualSides,
    showEqualAngles,
    showHeight,
    showArea,
    areaLabel,
    labelStyle,
    labels,
    units,
    sectionType,
    ...otherProps // Include any other props passed
  };

  // Only add orientation if it was provided (generators will add it conditionally)
  if (orientation !== undefined) {
    config.orientation = orientation;
  }

  return config;
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

// Make sure the export is properly defined
export const createRightTriangle = ({ base, height, ...props }) => {
    return {
        type: 'rightTriangle',
        base,
        height,
        ...props
    };
};

export default {
  createPythagoreanTriangle,
  createPythagoreanTripleTriangle,
  createIsoscelesTriangle,
  PYTHAGOREAN_TRIPLES,
  createRightTriangle
};