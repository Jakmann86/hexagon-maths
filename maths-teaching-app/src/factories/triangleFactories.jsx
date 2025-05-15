// maths-teaching-app/src/factories/triangleFactories.jsx
import React from 'react';
import { RightTriangle, IsoscelesTriangle } from '../components/math/shapes/triangles';
import { STANDARD_SHAPES } from '../config/standardShapes';
import _ from 'lodash';

/**
 * Factory functions for creating standardized educational triangles
 * with consistent sizing and improved configurability
 */

// Standard dimensions from configuration
const STANDARD_RIGHT_TRIANGLE = STANDARD_SHAPES.rightTriangle || { base: 6, height: 5 };
const STANDARD_ISOSCELES_TRIANGLE = STANDARD_SHAPES.isoscelesTriangle || { base: 6, height: 5 };

/**
 * Creates a Pythagorean triangle with appropriate styling and labels
 * Uses standard dimensions for consistent sizing
 * 
 * @param {Object} config - Configuration for the triangle
 * @param {string} config.unknownSide - Which side to mark as unknown ('base', 'height', 'hypotenuse', or null)
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling ('diagnostic', 'example', etc.)
 * @returns {JSX.Element} RightTriangle component with appropriate configuration
 */
export const createPythagoreanTriangle = ({
  unknownSide = null, // null, 'base', 'height', or 'hypotenuse'
  orientation = 'default',
  units = 'cm',
  sectionType = 'diagnostic'
}) => {
  // Use standard dimensions for consistent sizing
  const base = STANDARD_RIGHT_TRIANGLE.base;
  const height = STANDARD_RIGHT_TRIANGLE.height;

  // Calculate hypotenuse
  const hypotenuse = Math.sqrt(base * base + height * height);
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Create custom labels based on which side is unknown
  let labels;
  if (unknownSide === 'base') {
    labels = [`? ${units}`, `${height} ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'height') {
    labels = [`${base} ${units}`, `? ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'hypotenuse') {
    labels = [`${base} ${units}`, `${height} ${units}`, `? ${units}`];
  } else {
    // No unknown side, show all values
    labels = [`${base} ${units}`, `${height} ${units}`, `${roundedHypotenuse} ${units}`];
  }

  // Return configured triangle with section-appropriate styling
  return (
    <RightTriangle
      base={base}
      height={height}
      labelStyle="custom"
      labels={labels}
      orientation={orientation}
      showRightAngle={true}
      units={units}
      sectionType={sectionType}
    />
  );
};

/**
 * Creates a triangle using a Pythagorean triple with consistent sizing
 * Scales the triple to fit within standard dimensions
 * 
 * @param {Object} config - Configuration for the triangle
 * @param {Array} config.triple - Array of 3 integers representing a Pythagorean triple [a, b, c]
 * @param {string} config.unknownSide - Which side to mark as unknown
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {JSX.Element} RightTriangle using the specified triple
 */
export const createPythagoreanTripleTriangle = ({
  triple = [3, 4, 5],
  unknownSide = null,
  orientation = 'default',
  units = 'cm',
  sectionType = 'examples'
}) => {
  // Extract the triple values
  const [a, b, c] = triple;

  // Scale the triple to fit within standard dimensions
  // Find the largest value in the triple and calculate scale factor
  const maxTripleValue = Math.max(a, b);
  const maxStandardDim = Math.max(STANDARD_RIGHT_TRIANGLE.base, STANDARD_RIGHT_TRIANGLE.height);
  const scaleFactor = maxStandardDim / maxTripleValue;

  // Used scaled dimensions to maintain the triple's proportions
  // but keep overall size consistent with other triangles
  const scaledBase = a * scaleFactor;
  const scaledHeight = b * scaleFactor;

  // Create labels based on which side is unknown
  let labels;
  if (unknownSide === 'base') {
    labels = [`? ${units}`, `${b} ${units}`, `${c} ${units}`];
  } else if (unknownSide === 'height') {
    labels = [`${a} ${units}`, `? ${units}`, `${c} ${units}`];
  } else if (unknownSide === 'hypotenuse') {
    labels = [`${a} ${units}`, `${b} ${units}`, `? ${units}`];
  } else {
    // No unknown side, show all values
    labels = [`${a} ${units}`, `${b} ${units}`, `${c} ${units}`];
  }

  return (
    <RightTriangle
      base={scaledBase}
      height={scaledHeight}
      labelStyle="custom"
      labels={labels}
      orientation={orientation}
      showRightAngle={true}
      units={units}
      sectionType={sectionType}
    />
  );
};

/**
 * Creates a triangle for SOHCAHTOA problems with consistent sizing
 * 
 * @param {Object} config - Configuration for the triangle
 * @param {number} config.angle - Angle in degrees
 * @param {string} config.knownSide - Which side is known ('opposite', 'adjacent', 'hypotenuse')
 * @param {number} config.knownValue - Value of the known side
 * @param {string} config.unknownSide - Which side to find ('opposite', 'adjacent', 'hypotenuse')
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {JSX.Element} RightTriangle configured for SOHCAHTOA
 */
export const createSOHCAHTOATriangle = ({
  angle = 30,
  knownSide = 'hypotenuse',
  knownValue = 5,
  unknownSide = 'opposite',
  orientation = 'default',
  units = 'cm',
  sectionType = 'diagnostic'
}) => {
  // Use standard dimensions as a reference, but maintain the angle
  const standardBase = STANDARD_RIGHT_TRIANGLE.base;
  const standardHeight = STANDARD_RIGHT_TRIANGLE.height;

  // Calculate all side lengths based on angle
  const sinAngle = Math.sin(angle * Math.PI / 180);
  const cosAngle = Math.cos(angle * Math.PI / 180);
  const tanAngle = Math.tan(angle * Math.PI / 180);

  // Start with standard dimensions for the known side
  let base, height, hypotenuse;

  if (knownSide === 'hypotenuse') {
    hypotenuse = standardBase > standardHeight
      ? standardBase / cosAngle  // Use base dimension for sizing
      : standardHeight / sinAngle; // Use height dimension for sizing

    base = hypotenuse * cosAngle;
    height = hypotenuse * sinAngle;
  } else if (knownSide === 'adjacent') {
    base = standardBase;
    height = base * tanAngle;
    hypotenuse = base / cosAngle;
  } else if (knownSide === 'opposite') {
    height = standardHeight;
    base = height / tanAngle;
    hypotenuse = height / sinAngle;
  }

  // Round values for display
  const roundedBase = Math.round(base * 100) / 100;
  const roundedHeight = Math.round(height * 100) / 100;
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Create labels based on which side is unknown
  let labels;
  if (unknownSide === 'opposite') {
    labels = [`${roundedBase} ${units}`, `? ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'adjacent') {
    labels = [`? ${units}`, `${roundedHeight} ${units}`, `${roundedHypotenuse} ${units}`];
  } else if (unknownSide === 'hypotenuse') {
    labels = [`${roundedBase} ${units}`, `${roundedHeight} ${units}`, `? ${units}`];
  } else {
    // No unknown side, show all values
    labels = [`${roundedBase} ${units}`, `${roundedHeight} ${units}`, `${roundedHypotenuse} ${units}`];
  }

  return (
    <RightTriangle
      base={roundedBase}
      height={roundedHeight}
      labelStyle="custom"
      labels={labels}
      orientation={orientation}
      showRightAngle={true}
      showAngles={[true, false]}
      angleLabels={[`${angle}°`, '']}
      units={units}
      sectionType={sectionType}
    />
  );
};

/**
 * Creates a triangle for special angle cases with consistent sizing
 * 
 * @param {Object} config - Configuration for the triangle
 * @param {string} config.type - Type of special triangle ('30-60-90' or '45-45-90')
 * @param {string} config.unknownSide - Which side to mark as unknown
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {JSX.Element} RightTriangle with special angle configuration
 */
export const createSpecialAngleTriangle = ({
  type = '30-60-90',
  unknownSide = null,
  orientation = 'default',
  units = 'cm',
  sectionType = 'examples'
}) => {
  // Use standard dimension as a reference scale
  const standardBase = STANDARD_RIGHT_TRIANGLE.base;

  let base, height, hypotenuse;
  let angles = [30, 60]; // Default for 30-60-90 triangle

  if (type === '30-60-90') {
    base = standardBase;
    height = standardBase * Math.sqrt(3);
    hypotenuse = standardBase * 2;
    angles = [30, 60];
  } else if (type === '45-45-90') {
    base = standardBase;
    height = standardBase;
    hypotenuse = standardBase * Math.sqrt(2);
    angles = [45, 45];
  }

  // Round values
  const roundedBase = Math.round(base * 100) / 100;
  const roundedHeight = Math.round(height * 100) / 100;
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Create labels
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

  return (
    <RightTriangle
      base={roundedBase}
      height={roundedHeight}
      labelStyle="custom"
      labels={labels}
      orientation={orientation}
      showRightAngle={true}
      showAngles={[true, true]}
      angleLabels={[`${angles[0]}°`, `${angles[1]}°`]}
      units={units}
      sectionType={sectionType}
    />
  );
};

/**
 * Creates an isosceles triangle with consistent sizing
 * 
 * @param {Object} config - Configuration for the triangle
 * @param {boolean} config.showArea - Whether to show the area
 * @param {string} config.areaLabel - Custom area label text
 * @param {boolean} config.showHeight - Show height line
 * @param {string} config.unknownSide - Which side to mark as unknown ('base', 'leg', or 'height')
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {JSX.Element} IsoscelesTriangle component with appropriate configuration
 */
export const createIsoscelesTriangle = ({
  // Use parameters but with defaults from STANDARD_ISOSCELES_TRIANGLE
  base = STANDARD_ISOSCELES_TRIANGLE.base,
  height = STANDARD_ISOSCELES_TRIANGLE.height,
  legLength = null,  // Add parameter for leg length (slant height)
  showArea = false,
  areaLabel = null,
  showHeight = false,
  unknownSide = null,
  orientation = 'default',
  units = 'cm',
  sectionType = 'examples',
  labelOffsetMultiplier = 1.2,
  useStandardShape = false  // Add flag to override with standard shape
}) => {
  // If useStandardShape is true, override dimensions with standard ones
  const effectiveBase = useStandardShape ? STANDARD_ISOSCELES_TRIANGLE.base : base;
  const effectiveHeight = useStandardShape ? STANDARD_ISOSCELES_TRIANGLE.height : height;

  // Calculate legs (the equal sides)
  const effectiveLegLength = legLength ||
    Math.sqrt((effectiveBase / 2) * (effectiveBase / 2) + effectiveHeight * effectiveHeight);
  const roundedLegLength = Math.round(effectiveLegLength * 100) / 100;

  // Calculate area
  const area = (effectiveBase * effectiveHeight) / 2;
  const roundedArea = Math.round(area * 100) / 100;

  // Create custom labels based on which side is unknown
  let labels;
  if (unknownSide === 'base') {
    labels = [`? ${units}`, `${roundedLegLength} ${units}`, `${roundedLegLength} ${units}`];
  } else if (unknownSide === 'leg') {
    labels = [`${effectiveBase} ${units}`, `? ${units}`, `? ${units}`];
  } else if (unknownSide === 'height') {
    labels = [`${effectiveBase} ${units}`, `${roundedLegLength} ${units}`, `${roundedLegLength} ${units}`];
  } else {
    // No unknown side, use the dimensions from the question
    labels = [`${base} ${units}`, `${legLength || roundedLegLength} ${units}`, `${legLength || roundedLegLength} ${units}`];
  }

  console.log("[Factory] Creating isosceles triangle:", {
    visualBase: effectiveBase,
    visualHeight: effectiveHeight,
    questionBase: base,
    questionLeg: legLength,
    calculatedLeg: roundedLegLength,
    labels
  });

  // Return triangle with standard shape but question-based labels
  return (
    <IsoscelesTriangle
      base={effectiveBase}
      height={effectiveHeight}
      labelStyle="custom"
      labels={labels}
      orientation={orientation}
      showArea={showArea}
      areaLabel={areaLabel || (showArea ? `Area = ${roundedArea} ${units}²` : null)}
      showEqualSides={true}
      showHeight={unknownSide === 'height' ? true : showHeight}
      units={units}
      sectionType={sectionType}
      labelOffsetMultiplier={labelOffsetMultiplier}
    />
  );
};

// Export a list of common Pythagorean triples for convenience
export const PYTHAGOREAN_TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [6, 8, 10],
  [5, 12, 13],
  [15, 20, 25]
];