// src/generators/geometry/squareGenerators.js
// V2.1 - Starter format: answer (final only) + workingOut (expandable)
import _ from 'lodash';
import { createSquare } from '../../factories/quadrilateralFactory';

/**
 * Generate a square with area and perimeter question - V2 format
 * Returns: { question, answer (final only), workingOut (expandable), visualization }
 */
export const describeSquare = ({ units = 'cm' } = {}) => {
  const side = _.random(3, 9);
  const area = side * side;
  const perimeter = side * 4;

  return {
    question: `Find the area and perimeter of a square with sides ${side} ${units}.`,
    // V2 format: answer is JUST the final values
    answer: `\\text{Area} = ${area}\\text{ ${units}}^2, \\quad \\text{Perimeter} = ${perimeter}\\text{ ${units}}`,
    // V2 format: workingOut is the expandable working
    workingOut: `\\text{Area} = ${side}^2 = ${area}\\text{ ${units}}^2 \\\\ \\text{Perimeter} = 4 \\times ${side} = ${perimeter}\\text{ ${units}}`,
    visualization: createSquare({
      sideLength: side,
      showDimensions: true,
      units,
      sectionType: 'starter',
      style: {
        fillColor: '#3498db',
        fillOpacity: 0.2
      }
    })
  };
};

/**
 * Generate square area question for diagnostic
 * Ensures all 4 options are unique
 */
export const generateSquareArea = ({ units = 'cm', sectionType = 'diagnostic' } = {}) => {
  // Avoid side=4 where area=perimeter=16
  const validSides = [3, 5, 6, 7, 8, 9];
  const side = _.sample(validSides);
  const area = side * side;
  const perimeter = side * 4;

  if (sectionType === 'starter') {
    return describeSquare({ units });
  }

  // Generate unique distractors
  const optionSet = new Set();
  optionSet.add(area);  // correct answer
  
  // Add distractors, checking for uniqueness
  const possibleDistractors = [
    perimeter,           // common mistake: perimeter instead of area
    side * 2,            // just doubled the side
    area + side,         // added instead of multiplied
    area - side,         // subtracted
    side + side,         // added sides
    Math.round(area * 1.5), // scaled up
  ];
  
  for (const d of possibleDistractors) {
    if (d > 0 && !optionSet.has(d)) {
      optionSet.add(d);
      if (optionSet.size >= 4) break;
    }
  }
  
  // Convert to LaTeX formatted strings
  const options = Array.from(optionSet).map(v => `${v}\\text{ ${units}}^2`);

  return {
    questionDisplay: {
      text: `Find the area of this square with side length`,
      math: `${side}\\text{ ${units}}`
    },
    correctAnswer: `${area}\\text{ ${units}}^2`,
    options: _.shuffle(options),
    explanation: `Area = side² = ${side}² = ${area} ${units}²`,
    visualization: createSquare({
      sideLength: side,
      showDimensions: true,
      units,
      sectionType: 'diagnostic',
      style: {
        fillColor: '#3498db',
        fillOpacity: 0.2
      }
    })
  };
};

/**
 * Generate square side length from area question
 */
export const generateSquareSideLength = ({ units = 'cm', sectionType = 'diagnostic' } = {}) => {
  const perfectSquares = [16, 25, 36, 49, 64, 81, 100, 121, 144];
  const area = _.sample(perfectSquares);
  const side = Math.sqrt(area);

  return {
    questionDisplay: {
      text: 'Find the side length of a square with area',
      math: `${area}\\text{ ${units}}^2`
    },
    correctAnswer: `${side}\\text{ ${units}}`,
    options: _.shuffle([
      `${side}\\text{ ${units}}`,
      `${area / 4}\\text{ ${units}}`,
      `${area / 2}\\text{ ${units}}`,
      `${side + 1}\\text{ ${units}}`
    ]),
    explanation: `Side length = √${area} = ${side} ${units}`,
    visualization: createSquare({
      sideLength: side,
      showDimensions: false,
      showArea: true,
      areaLabel: `${area} ${units}²`,
      units,
      sectionType: 'diagnostic'
    })
  };
};

export const squareGenerators = {
  describeSquare,
  generateSquareArea,
  generateSquareSideLength
};

export default squareGenerators;