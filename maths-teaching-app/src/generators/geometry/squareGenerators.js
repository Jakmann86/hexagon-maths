// src/generators/geometry/squareGenerators.js - Unified Architecture
import _ from 'lodash';
import { createSquare } from '../../factories/quadrilateralFactory';

/**
 * Ensure all options are unique and randomize order
 * Prevents duplicate answers in multiple choice questions
 */
const generateUniqueOptions = (optionsArray) => {
  // Remove duplicates while preserving order
  const uniqueOptions = [];
  const seen = new Set();

  for (const option of optionsArray) {
    if (!seen.has(option)) {
      seen.add(option);
      uniqueOptions.push(option);
    }
  }

  // If we lost options due to duplicates, add fallback options
  while (uniqueOptions.length < 4) {
    const fallback = `${_.random(10, 99)}\\text{ cm}^2`; // Generic fallback
    if (!seen.has(fallback)) {
      seen.add(fallback);
      uniqueOptions.push(fallback);
    }
  }

  // Randomize the order
  return uniqueOptions.sort(() => Math.random() - 0.5);
};

/**
 * Unified square side length (from area) question generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 * Now includes unsimplified surds and decimal alternatives
 */
export const generateSquareSideLength = (options = {}) => {
  const {
    units = 'cm',
    sectionType = 'diagnostic',
    difficulty = 'medium'
  } = options;

  // UNIFIED MATH LOGIC - mix of perfect squares and non-perfect squares
  const shouldUsePerfectSquare = Math.random() > 0.4; // 60% non-perfect, 40% perfect
  let area, side, sideDisplay, answerType;

  if (shouldUsePerfectSquare) {
    // Perfect squares for clean integer answers
    const perfectSquares = [16, 25, 36, 49, 64, 81, 100];
    area = _.sample(perfectSquares);
    side = Math.sqrt(area);
    sideDisplay = `${side}`; // Clean integer
    answerType = 'integer';
  } else {
    // Non-perfect squares for unsimplified surd/decimal answers
    const nonPerfectAreas = [
      { area: 8, unsimplifiedSurd: '\\sqrt{8}', simplifiedSurd: '2\\sqrt{2}', decimal: '2.83' },
      { area: 12, unsimplifiedSurd: '\\sqrt{12}', simplifiedSurd: '2\\sqrt{3}', decimal: '3.46' },
      { area: 18, unsimplifiedSurd: '\\sqrt{18}', simplifiedSurd: '3\\sqrt{2}', decimal: '4.24' },
      { area: 20, unsimplifiedSurd: '\\sqrt{20}', simplifiedSurd: '2\\sqrt{5}', decimal: '4.47' },
      { area: 27, unsimplifiedSurd: '\\sqrt{27}', simplifiedSurd: '3\\sqrt{3}', decimal: '5.20' },
      { area: 32, unsimplifiedSurd: '\\sqrt{32}', simplifiedSurd: '4\\sqrt{2}', decimal: '5.66' },
      { area: 45, unsimplifiedSurd: '\\sqrt{45}', simplifiedSurd: '3\\sqrt{5}', decimal: '6.71' },
      { area: 50, unsimplifiedSurd: '\\sqrt{50}', simplifiedSurd: '5\\sqrt{2}', decimal: '7.07' },
      { area: 72, unsimplifiedSurd: '\\sqrt{72}', simplifiedSurd: '6\\sqrt{2}', decimal: '8.49' },
      { area: 75, unsimplifiedSurd: '\\sqrt{75}', simplifiedSurd: '5\\sqrt{3}', decimal: '8.66' },
      { area: 98, unsimplifiedSurd: '\\sqrt{98}', simplifiedSurd: '7\\sqrt{2}', decimal: '9.90' }
    ];

    const chosen = _.sample(nonPerfectAreas);
    area = chosen.area;
    side = Math.sqrt(area);

    // Randomize between surd and decimal (50/50 split)
    const useSurd = Math.random() > 0.5;
    if (useSurd) {
      sideDisplay = chosen.unsimplifiedSurd;
      answerType = 'surd';
    } else {
      sideDisplay = chosen.decimal;
      answerType = 'decimal';
    }
  }

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Find the side length of a square with area ${area} ${units}².`,
      answer: answerType === 'surd'
        ? `\\text{Side length} = \\sqrt{${area}} = ${sideDisplay}\\text{ ${units}}`
        : `\\text{Side length} = \\sqrt{${area}} = ${sideDisplay}\\text{ ${units}}`,
      visualization: createSquare({
        sideLength: side,
        showDimensions: false,
        showArea: true,
        areaLabel: `${area} ${units}²`,
        units,
        sectionType: 'starter',
        style: {
          fillColor: '#3498db',
          fillOpacity: 0.3
        }
      })
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate appropriate distractors based on answer type
    let distractors;
    if (answerType === 'surd') {
      // Surd-based distractors
      distractors = [
        `\\sqrt{${Math.round(area / 2)}}`, // Half the area under square root
        `\\sqrt{${area * 2}}`, // Double the area under square root
        `${Math.round(area / 4)}` // Common mistake: divide by 4
      ];
    } else if (answerType === 'decimal') {
      // Decimal-based distractors
      const exactSide = Math.sqrt(area);
      distractors = [
        `${Math.round(area / 4 * 100) / 100}`, // Mistake: dividing by 4
        `${Math.round(area / 2 * 100) / 100}`, // Mistake: dividing by 2  
        `${Math.round((exactSide + _.random(0.5, 1.5)) * 100) / 100}` // Close but wrong
      ];
    } else {
      // Integer-based distractors
      distractors = [
        `${Math.round(area / 4)}`, // Mistake: dividing by 4
        `${Math.round(area / 2)}`, // Mistake: dividing by 2
        `${side + _.random(1, 2)}` // Close but wrong
      ];
    }

    return {
      questionDisplay: {
        text: `Find the side length of a square with area`,
        math: `${area}\\text{ ${units}}^2`
      },
      correctAnswer: `${sideDisplay}\\text{ ${units}}`,
      options: generateUniqueOptions([
        `${sideDisplay}\\text{ ${units}}`, // Correct answer
        ...distractors.map(d => `${d}\\text{ ${units}}`) // Apply units to all distractors
      ]),
      explanation: answerType === 'surd'
        ? `Side length = √${area} = ${sideDisplay} ${units}`
        : `Side length = √${area} = ${sideDisplay} ${units}`,
      visualization: createSquare({
        sideLength: side,
        showDimensions: false,
        showArea: true,
        areaLabel: `${area} ${units}²`,
        units,
        containerHeight: 240,
        style: {
          fillColor: '#3498db',
          fillOpacity: 0.3
        }
      })
    };
  }

  else if (sectionType === 'examples') {
    return {
      title: "Finding the Side Length of a Square",
      questionText: `Find the side length of a square with area ${area} ${units}².`,
      solution: generateSquareSolution(side, 'findSide', units, sideDisplay, answerType, area),
      visualization: createSquare({
        sideLength: side,
        showDimensions: false,
        showArea: true,
        areaLabel: `${area} ${units}²`,
        units,
        containerHeight: 240,
        style: {
          fillColor: '#3498db',
          fillOpacity: 0.3
        }
      })
    };
  }

  // Fallback to diagnostic format
  return generateSquareSideLength({ ...options, sectionType: 'diagnostic' });
};

/**
 * Square-related solution steps generator
 * Enhanced to handle area calculation for starter questions
 */
export const generateSquareSolution = (side, questionType, units = 'cm') => {
  const steps = [];

  if (questionType === 'findArea') {
    steps.push({
      explanation: "Use the formula for the area of a square",
      formula: "\\text{Area} = \\text{side}^2"
    });

    steps.push({
      explanation: "Substitute the side length",
      formula: `\\text{Area} = ${side}^2 = ${side * side}\\text{ ${units}}^2`
    });
  }
  else if (questionType === 'findSide') {
    const sideDisplay = arguments[3] || side; // Get sideDisplay from 4th parameter
    const answerType = arguments[4] || 'integer'; // Get answerType from 5th parameter  
    const area = arguments[5] || (side * side); // Get area from 6th parameter

    steps.push({
      explanation: "Use the formula for the area of a square",
      formula: "\\text{Area} = \\text{side}^2"
    });

    steps.push({
      explanation: "Rearrange to find the side length",
      formula: "\\text{side} = \\sqrt{\\text{Area}}"
    });

    steps.push({
      explanation: "Substitute the area",
      formula: `\\text{side} = \\sqrt{${area}}`
    });

    // Different final step based on answer type
    if (answerType === 'surd') {
      steps.push({
        explanation: "Leave the answer in surd form",
        formula: `\\text{side} = ${sideDisplay}\\text{ ${units}}`
      });
    } else if (answerType === 'decimal') {
      steps.push({
        explanation: "Calculate the decimal approximation",
        formula: `\\text{side} = ${sideDisplay}\\text{ ${units}}`
      });
    } else {
      steps.push({
        explanation: "Calculate the exact answer",
        formula: `\\text{side} = ${sideDisplay}\\text{ ${units}}`
      });
    }

    return steps;
  }
  else if (questionType === 'findPerimeter') {
    steps.push({
      explanation: "Use the formula for the perimeter of a square",
      formula: "\\text{Perimeter} = 4 \\times \\text{side}"
    });

    steps.push({
      explanation: "Substitute the side length",
      formula: `\\text{Perimeter} = 4 \\times ${side} = ${side * 4}\\text{ ${units}}`
    });
  }
  else if (questionType === 'findSide') {
    steps.push({
      explanation: "Use the formula for the area of a square",
      formula: "\\text{Area} = \\text{side}^2"
    });

    steps.push({
      explanation: "Rearrange to find the side length",
      formula: "\\text{side} = \\sqrt{\\text{Area}}"
    });

    const area = side * side;
    steps.push({
      explanation: "Substitute the area",
      formula: `\\text{side} = \\sqrt{${area}} = ${side}\\text{ ${units}}`
    });
  }

  return steps;
};

// Export unified generators
export const squareGenerators = {
  // New unified functions
  generateSquareArea,
  generateSquareSideLength,
  generateSquareSolution,

  // Legacy aliases for backward compatibility (temporary)
  describeSquare: (options) => generateSquareArea({ ...options, sectionType: 'starter' }),
  squareAreaDiagnostic: (options) => generateSquareArea({ ...options, sectionType: 'diagnostic' }),
  squareRootDiagnostic: (options) => generateSquareSideLength({ ...options, sectionType: 'diagnostic' })
};

export default squareGenerators;