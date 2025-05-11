// maths-teaching-app/src/factories/triangleFactories.jsx
import React from 'react';
import { RightTriangle, IsoscelesTriangle } from '../components/math/shapes/triangles';
import _ from 'lodash';

/**
 * Factory functions for creating standardized educational triangles
 * These make it easy to create consistent triangles for specific educational scenarios
 */

/**
 * Creates a Pythagorean triangle with appropriate styling and labels
 * 
 * @param {Object} config - Configuration for the triangle
 * @param {number} config.base - Base length
 * @param {number} config.height - Height 
 * @param {string} config.unknownSide - Which side to mark as unknown ('base', 'height', 'hypotenuse', or null)
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling ('diagnostic', 'example', etc.)
 * @returns {JSX.Element} RightTriangle component with appropriate configuration
 */
export const createPythagoreanTriangle = ({
  base = 3,
  height = 4,
  unknownSide = null, // null, 'base', 'height', or 'hypotenuse'
  orientation = 'default',
  units = 'cm',
  sectionType = 'diagnostic'
}) => {
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
 * Creates a triangle for SOHCAHTOA problems with angle and appropriate labels
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
  // Calculate all side lengths based on angle and known side
  let base, height, hypotenuse;

  const sinAngle = Math.sin(angle * Math.PI / 180);
  const cosAngle = Math.cos(angle * Math.PI / 180);
  const tanAngle = Math.tan(angle * Math.PI / 180);

  if (knownSide === 'hypotenuse') {
    hypotenuse = knownValue;
    base = hypotenuse * cosAngle;
    height = hypotenuse * sinAngle;
  } else if (knownSide === 'adjacent') {
    base = knownValue;
    height = base * tanAngle;
    hypotenuse = base / cosAngle;
  } else if (knownSide === 'opposite') {
    height = knownValue;
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
 * Creates a triangle using a Pythagorean triple with expected integer values
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
      base={a}
      height={b}
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
 * Creates a triangle for special angle cases (30-60-90 or 45-45-90)
 * 
 * @param {Object} config - Configuration for the triangle
 * @param {string} config.type - Type of special triangle ('30-60-90' or '45-45-90')
 * @param {number} config.scale - Scale factor for the triangle
 * @param {string} config.unknownSide - Which side to mark as unknown
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {JSX.Element} RightTriangle with special angle configuration
 */
export const createSpecialAngleTriangle = ({
  type = '30-60-90',
  scale = 5,
  unknownSide = null,
  orientation = 'default',
  units = 'cm',
  sectionType = 'examples'
}) => {
  let base, height, hypotenuse;
  let angles = [30, 60]; // Default for 30-60-90 triangle

  if (type === '30-60-90') {
    base = scale;
    height = scale * Math.sqrt(3);
    hypotenuse = scale * 2;
    angles = [30, 60];
  } else if (type === '45-45-90') {
    base = scale;
    height = scale;
    hypotenuse = scale * Math.sqrt(2);
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
 * Creates an isosceles triangle with appropriate styling and labels
 * 
 * @param {Object} config - Configuration for the triangle
 * @param {number} config.base - Base length (the unequal side)
 * @param {number} config.height - Height of the triangle
 * @param {boolean} config.showArea - Whether to show the area
 * @param {string} config.areaLabel - Custom area label text
 * @param {string} config.unknownSide - Which side to mark as unknown ('base', 'leg', or 'height')
 * @param {string} config.orientation - Triangle orientation
 * @param {string} config.units - Units to display
 * @param {string} config.sectionType - Section type for styling
 * @returns {JSX.Element} IsoscelesTriangle component with appropriate configuration
 */
export const createIsoscelesTriangle = ({
  base = 6,
  height = 4,
  showArea = false,
  areaLabel = null,
  showHeight = false, // Make sure showHeight has a default value
  unknownSide = null,
  orientation = 'default',
  units = 'cm',
  sectionType = 'examples',
  labelOffsets = null
}) => {
  // Calculate legs (the equal sides)
  const legLength = Math.sqrt((base / 2) * (base / 2) + height * height);
  const roundedLegLength = Math.round(legLength * 100) / 100;

  // Calculate area
  const area = (base * height) / 2;
  const roundedArea = Math.round(area * 100) / 100;

  // Create custom labels based on which side is unknown
  let labels;
  if (unknownSide === 'base') {
    labels = [`? ${units}`, `${roundedLegLength} ${units}`, `${roundedLegLength} ${units}`];
  } else if (unknownSide === 'leg') {
    labels = [`${base} ${units}`, `? ${units}`, `? ${units}`];
  } else if (unknownSide === 'height') {
    labels = [`${base} ${units}`, `${roundedLegLength} ${units}`, `${roundedLegLength} ${units}`];
    // Height is not directly a side, so we'll handle it in the component
  } else {
    // No unknown side, show all values
    labels = [`${base} ${units}`, `${roundedLegLength} ${units}`, `${roundedLegLength} ${units}`];
  }

  // Return configured triangle with section-appropriate styling
  return (
    <IsoscelesTriangle
      base={base}
      height={height}
      labelStyle="custom"
      labels={labels}
      orientation={orientation}
      showArea={showArea}
      areaLabel={areaLabel || (showArea ? `Area = ${roundedArea} ${units}²` : null)}
      showEqualSides={true}
      showHeight={unknownSide === 'height' ? true : false} // Use false directly, not the variable
      units={units}
      sectionType={sectionType}
      labelOffsets={labelOffsets}
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