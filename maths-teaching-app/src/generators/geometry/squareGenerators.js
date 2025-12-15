// src/generators/geometry/squareGenerators.js
// V3.0 - Gold Standard: Uses factories, unique options, centralised constants
import _ from 'lodash';
import { createSquare } from '../../factories/quadrilateralFactory';

// ============================================================
// CONSTANTS - Single source of truth
// ============================================================

// Perfect squares useful for non-calculator questions
export const PERFECT_SQUARES = [16, 25, 36, 49, 64, 81, 100, 121, 144];

// Non-perfect squares for calculator questions
export const NON_PERFECT_SQUARES = [20, 30, 45, 50, 72, 75, 80, 90, 125, 150];

// Valid sides that avoid area=perimeter (side=4 gives both=16)
export const VALID_SIDES = [3, 5, 6, 7, 8, 9];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate unique options from a correct answer and possible distractors
 */
const generateUniqueOptions = (correctValue, possibleDistractors, formatFn) => {
  const optionSet = new Set();
  optionSet.add(correctValue);
  
  for (const d of possibleDistractors) {
    if (d > 0 && d !== correctValue && !optionSet.has(d)) {
      optionSet.add(d);
      if (optionSet.size >= 4) break;
    }
  }
  
  // Fallback: add offset variations if needed
  let offset = 1;
  while (optionSet.size < 4) {
    const candidate = correctValue + offset;
    if (!optionSet.has(candidate) && candidate > 0) {
      optionSet.add(candidate);
    }
    offset = offset > 0 ? -offset : -offset + 1;
  }
  
  return _.shuffle(Array.from(optionSet).map(formatFn));
};

// ============================================================
// GENERATORS
// ============================================================

/**
 * Generate a square with area and perimeter question - Starter format
 * Returns: { question, answer (final only), workingOut (expandable), visualization }
 */
export const describeSquare = ({ units = 'cm' } = {}) => {
  const side = _.sample(VALID_SIDES);
  const area = side * side;
  const perimeter = side * 4;

  return {
    question: `Find the area and perimeter of a square with sides ${side} ${units}.`,
    answer: `\\text{Area} = ${area}\\text{ ${units}}^2, \\quad \\text{Perimeter} = ${perimeter}\\text{ ${units}}`,
    workingOut: `\\text{Area} = ${side}^2 = ${area}\\text{ ${units}}^2 \\\\ \\text{Perimeter} = 4 \\times ${side} = ${perimeter}\\text{ ${units}}`,
    visualization: createSquare({
      sideLength: side,
      showDimensions: true,
      units,
      sectionType: 'starter'
    })
  };
};

/**
 * Generate square area question for diagnostic
 * Ensures all 4 options are unique
 */
export const generateSquareArea = ({ units = 'cm', sectionType = 'diagnostic' } = {}) => {
  if (sectionType === 'starter') {
    return describeSquare({ units });
  }

  const side = _.sample(VALID_SIDES);
  const area = side * side;
  const perimeter = side * 4;

  const possibleDistractors = [
    perimeter,              // common mistake: perimeter instead of area
    side * 2,               // just doubled the side
    area + side,            // added instead of multiplied
    area - side,            // subtracted
    side + side,            // added sides
    Math.round(area * 1.5), // scaled up
  ];
  
  const options = generateUniqueOptions(
    area,
    possibleDistractors,
    v => `${v}\\text{ ${units}}^2`
  );

  return {
    questionDisplay: {
      text: `Find the area of this square with side length`,
      math: `${side}\\text{ ${units}}`
    },
    correctAnswer: `${area}\\text{ ${units}}^2`,
    options,
    explanation: `Area = side² = ${side}² = ${area} ${units}²`,
    visualization: createSquare({
      sideLength: side,
      showDimensions: true,
      units,
      sectionType: 'diagnostic'
    })
  };
};

/**
 * Generate square side length from area question (square root)
 * Supports both perfect squares (no calculator) and non-perfect (calculator)
 */
export const generateSquareSideLength = ({ 
  units = 'cm', 
  sectionType = 'diagnostic',
  useCalculator = null  // null = random, true = force calculator, false = force no calculator
} = {}) => {
  const needsCalculator = useCalculator !== null 
    ? useCalculator 
    : Math.random() > 0.5;
  
  let area, side;
  
  if (needsCalculator) {
    area = _.sample(NON_PERFECT_SQUARES);
    side = Math.round(Math.sqrt(area) * 100) / 100;
  } else {
    area = _.sample(PERFECT_SQUARES);
    side = Math.sqrt(area);
  }

  const possibleDistractors = [
    Math.round((side + 0.5) * 100) / 100,
    Math.round((side - 0.5) * 100) / 100,
    side + 1,
    side - 1,
    side + 2,
    area / 4,
    area / 2,
    area / 3,
    side * 2,
  ];
  
  const options = generateUniqueOptions(
    side,
    possibleDistractors,
    v => `${v}\\text{ ${units}}`
  );

  return {
    questionDisplay: {
      text: 'Find the side length of a square with area',
      math: `${area}\\text{ ${units}}^2`
    },
    correctAnswer: `${side}\\text{ ${units}}`,
    options,
    explanation: needsCalculator 
      ? `Side length = √${area} ≈ ${side} ${units} (calculator needed)`
      : `Side length = √${area} = ${side} ${units}`,
    visualization: createSquare({
      sideLength: side,
      showDimensions: false,
      showArea: true,
      areaLabel: `${area} ${units}²`,
      units,
      sectionType: 'diagnostic'
    }),
    needsCalculator
  };
};

// ============================================================
// EXPORTS
// ============================================================

export const squareGenerators = {
  describeSquare,
  generateSquareArea,
  generateSquareSideLength,
  
  // Re-export constants
  PERFECT_SQUARES,
  NON_PERFECT_SQUARES,
  VALID_SIDES
};

export default squareGenerators;