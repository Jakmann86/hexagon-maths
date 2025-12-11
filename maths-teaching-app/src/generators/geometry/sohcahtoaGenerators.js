// src/generators/geometry/sohcahtoaGenerators.js
// SOHCAHTOA Trigonometry Question Generator
// Following Generator Output Specification v2.0
//
// Question Types:
// 1. Find missing side using sin/cos/tan
// 2. Find missing angle using inverse trig
// 3. Calculator practice (evaluate sin/cos/tan)
// 4. Exact trig values (30°, 45°, 60°)

import _ from 'lodash';

// ============================================================
// CONSTANTS
// ============================================================

// Common angles for nice numbers
const COMMON_ANGLES = [25, 30, 35, 40, 45, 50, 55, 60, 65];
const SPECIAL_ANGLES = [30, 45, 60]; // For exact values

// Exact trig values (no calculator needed)
const EXACT_VALUES = {
  30: { sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}' },
  45: { sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '1' },
  60: { sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}' }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Round to specified decimal places
 */
const roundTo = (num, places = 1) => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => degrees * Math.PI / 180;

/**
 * Get trig function value
 */
const getTrigValue = (func, angle) => {
  const rad = toRadians(angle);
  switch (func) {
    case 'sin': return Math.sin(rad);
    case 'cos': return Math.cos(rad);
    case 'tan': return Math.tan(rad);
    default: return 0;
  }
};

/**
 * Get inverse trig function value (returns degrees)
 */
const getInverseTrigValue = (func, ratio) => {
  let radians;
  switch (func) {
    case 'sin': radians = Math.asin(ratio); break;
    case 'cos': radians = Math.acos(ratio); break;
    case 'tan': radians = Math.atan(ratio); break;
    default: radians = 0;
  }
  return radians * 180 / Math.PI;
};

/**
 * Format answer with units
 */
const formatAnswer = (value, units) => {
  return units ? `${value} \\text{ ${units}}` : `${value}`;
};

// ============================================================
// GENERATORS: FIND MISSING SIDE
// ============================================================

/**
 * Find missing side using trigonometry
 * Given angle and one side, find another side
 */
const generateFindSide = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    ratio = null // 'sin', 'cos', 'tan' or null for random
  } = options;
  
  // Select angle
  const angles = difficulty === 'easy' ? SPECIAL_ANGLES : COMMON_ANGLES;
  const angle = _.sample(angles);
  
  // Select trig ratio
  const chosenRatio = ratio || _.sample(['sin', 'cos', 'tan']);
  
  // Generate triangle dimensions
  let knownSide, unknownSide, knownSideName, unknownSideName;
  let opposite, adjacent, hypotenuse;
  
  if (chosenRatio === 'sin') {
    // sin(θ) = opposite / hypotenuse
    hypotenuse = _.random(8, 15);
    opposite = roundTo(hypotenuse * getTrigValue('sin', angle), 1);
    adjacent = roundTo(Math.sqrt(hypotenuse * hypotenuse - opposite * opposite), 1);
    
    knownSide = hypotenuse;
    unknownSide = opposite;
    knownSideName = 'hypotenuse';
    unknownSideName = 'opposite';
    
  } else if (chosenRatio === 'cos') {
    // cos(θ) = adjacent / hypotenuse
    hypotenuse = _.random(8, 15);
    adjacent = roundTo(hypotenuse * getTrigValue('cos', angle), 1);
    opposite = roundTo(Math.sqrt(hypotenuse * hypotenuse - adjacent * adjacent), 1);
    
    knownSide = hypotenuse;
    unknownSide = adjacent;
    knownSideName = 'hypotenuse';
    unknownSideName = 'adjacent';
    
  } else {
    // tan(θ) = opposite / adjacent
    // Randomly choose which side to give
    if (Math.random() > 0.5) {
      adjacent = _.random(5, 12);
      opposite = roundTo(adjacent * getTrigValue('tan', angle), 1);
      knownSide = adjacent;
      unknownSide = opposite;
      knownSideName = 'adjacent';
      unknownSideName = 'opposite';
    } else {
      opposite = _.random(5, 12);
      adjacent = roundTo(opposite / getTrigValue('tan', angle), 1);
      knownSide = opposite;
      unknownSide = adjacent;
      knownSideName = 'opposite';
      unknownSideName = 'adjacent';
    }
    hypotenuse = roundTo(Math.sqrt(opposite * opposite + adjacent * adjacent), 1);
  }
  
  // Build the ratio formula
  const ratioFormula = chosenRatio === 'sin' 
    ? `\\sin(${angle}°) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`
    : chosenRatio === 'cos'
    ? `\\cos(${angle}°) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`
    : `\\tan(${angle}°) = \\frac{\\text{opposite}}{\\text{adjacent}}`;
  
  return {
    instruction: 'Find the missing side',
    questionMath: `\\theta = ${angle}°, \\quad \\text{${knownSideName}} = ${knownSide}`,
    questionText: `Find the ${unknownSideName} side of a right-angled triangle with angle ${angle}° and ${knownSideName} ${knownSide} ${units}.`,
    
    answer: formatAnswer(unknownSide, units),
    answerUnits: units,
    
    workingOut: `\\text{Using } ${chosenRatio.toUpperCase()}: ${ratioFormula} \\\\ ${unknownSideName} = ${knownSide} \\times ${chosenRatio}(${angle}°) = ${unknownSide}`,
    
    solution: [
      {
        explanation: `Identify what we have: angle = ${angle}°, ${knownSideName} = ${knownSide} ${units}`,
        formula: `\\theta = ${angle}°, \\quad \\text{${knownSideName}} = ${knownSide}`
      },
      {
        explanation: `Since we know the ${knownSideName} and need the ${unknownSideName}, use ${chosenRatio.toUpperCase()}`,
        formula: ratioFormula
      },
      {
        explanation: 'Rearrange to find the unknown side',
        formula: `\\text{${unknownSideName}} = \\text{${knownSideName}} \\times ${chosenRatio}(${angle}°)`
      },
      {
        explanation: 'Substitute and calculate',
        formula: `\\text{${unknownSideName}} = ${knownSide} \\times ${chosenRatio}(${angle}°) = ${unknownSide} \\text{ ${units}}`
      }
    ],
    
    visualization: {
      type: 'right-triangle',
      base: adjacent || knownSide,
      height: opposite || unknownSide,
      hypotenuse,
      angle,
      showAngle: true,
      anglePosition: 'bottom-right',
      unknownSide: unknownSideName,
      labels: {
        base: unknownSideName === 'adjacent' ? '?' : `${adjacent} ${units}`,
        height: unknownSideName === 'opposite' ? '?' : `${opposite} ${units}`,
        hypotenuse: unknownSideName === 'hypotenuse' ? '?' : `${hypotenuse} ${units}`,
        angle: `${angle}°`
      },
      showRightAngle: true,
      units
    },
    visualizationType: 'right-triangle',
    visualizationHeight: '130px',
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'find-side',
      trigRatio: chosenRatio,
      difficulty,
      topic: 'trigonometry',
      tags: ['geometry', 'gcse', 'higher'],
      values: { angle, opposite, adjacent, hypotenuse, knownSide, unknownSide }
    },
    
    title: `Finding a Side using ${chosenRatio.toUpperCase()}`,
    keyRule: ratioFormula
  };
};

// ============================================================
// GENERATORS: FIND MISSING ANGLE
// ============================================================

/**
 * Find missing angle using inverse trigonometry
 * Given two sides, find the angle
 */
const generateFindAngle = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    ratio = null
  } = options;
  
  // Target a nice angle for the answer
  const targetAngles = difficulty === 'easy' ? [30, 45, 60] : COMMON_ANGLES;
  const targetAngle = _.sample(targetAngles);
  
  // Select trig ratio
  const chosenRatio = ratio || _.sample(['sin', 'cos', 'tan']);
  
  // Generate triangle to give that angle
  let side1, side2, side1Name, side2Name;
  let opposite, adjacent, hypotenuse;
  
  if (chosenRatio === 'sin') {
    // sin⁻¹(opposite / hypotenuse) = angle
    hypotenuse = _.random(10, 15);
    opposite = roundTo(hypotenuse * getTrigValue('sin', targetAngle), 1);
    adjacent = roundTo(Math.sqrt(hypotenuse * hypotenuse - opposite * opposite), 1);
    
    side1 = opposite;
    side2 = hypotenuse;
    side1Name = 'opposite';
    side2Name = 'hypotenuse';
    
  } else if (chosenRatio === 'cos') {
    // cos⁻¹(adjacent / hypotenuse) = angle
    hypotenuse = _.random(10, 15);
    adjacent = roundTo(hypotenuse * getTrigValue('cos', targetAngle), 1);
    opposite = roundTo(Math.sqrt(hypotenuse * hypotenuse - adjacent * adjacent), 1);
    
    side1 = adjacent;
    side2 = hypotenuse;
    side1Name = 'adjacent';
    side2Name = 'hypotenuse';
    
  } else {
    // tan⁻¹(opposite / adjacent) = angle
    adjacent = _.random(6, 12);
    opposite = roundTo(adjacent * getTrigValue('tan', targetAngle), 1);
    hypotenuse = roundTo(Math.sqrt(opposite * opposite + adjacent * adjacent), 1);
    
    side1 = opposite;
    side2 = adjacent;
    side1Name = 'opposite';
    side2Name = 'adjacent';
  }
  
  const inverseFunc = `${chosenRatio}^{-1}`;
  
  return {
    instruction: 'Find the angle',
    questionMath: `\\text{${side1Name}} = ${side1}, \\quad \\text{${side2Name}} = ${side2}`,
    questionText: `Find angle θ in a right-angled triangle with ${side1Name} ${side1} ${units} and ${side2Name} ${side2} ${units}.`,
    
    answer: `${targetAngle}°`,
    answerUnits: '°',
    
    workingOut: `${chosenRatio}(\\theta) = \\frac{${side1}}{${side2}} \\\\ \\theta = ${inverseFunc}\\left(\\frac{${side1}}{${side2}}\\right) = ${targetAngle}°`,
    
    solution: [
      {
        explanation: `Identify what we have: ${side1Name} = ${side1} ${units}, ${side2Name} = ${side2} ${units}`,
        formula: `\\text{${side1Name}} = ${side1}, \\quad \\text{${side2Name}} = ${side2}`
      },
      {
        explanation: `Since we know ${side1Name} and ${side2Name}, use ${chosenRatio.toUpperCase()}`,
        formula: `${chosenRatio}(\\theta) = \\frac{\\text{${side1Name}}}{\\text{${side2Name}}}`
      },
      {
        explanation: 'Substitute the values',
        formula: `${chosenRatio}(\\theta) = \\frac{${side1}}{${side2}}`
      },
      {
        explanation: `Use inverse ${chosenRatio} to find the angle`,
        formula: `\\theta = ${inverseFunc}\\left(\\frac{${side1}}{${side2}}\\right)`
      },
      {
        explanation: 'Calculate using a calculator',
        formula: `\\theta = ${targetAngle}°`
      }
    ],
    
    visualization: {
      type: 'right-triangle',
      base: adjacent,
      height: opposite,
      hypotenuse,
      angle: targetAngle,
      showAngle: true,
      anglePosition: 'bottom-right',
      unknownSide: null,
      unknownAngle: true,
      labels: {
        base: side1Name === 'adjacent' || side2Name === 'adjacent' ? `${adjacent} ${units}` : null,
        height: side1Name === 'opposite' || side2Name === 'opposite' ? `${opposite} ${units}` : null,
        hypotenuse: side1Name === 'hypotenuse' || side2Name === 'hypotenuse' ? `${hypotenuse} ${units}` : null,
        angle: '?'
      },
      knownSides: [side1Name, side2Name], // Only these sides get labels
      showRightAngle: true,
      units
    },
    visualizationType: 'right-triangle',
    visualizationHeight: '130px',
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'find-angle',
      trigRatio: chosenRatio,
      difficulty,
      topic: 'trigonometry',
      tags: ['geometry', 'gcse', 'higher'],
      values: { targetAngle, opposite, adjacent, hypotenuse, side1, side2 }
    },
    
    title: `Finding an Angle using inverse ${chosenRatio.toUpperCase()}`,
    keyRule: `\\theta = ${inverseFunc}\\left(\\frac{\\text{${side1Name}}}{\\text{${side2Name}}}\\right)`
  };
};

// ============================================================
// GENERATORS: CALCULATOR PRACTICE
// ============================================================

/**
 * Practice using calculator for trig values
 */
const generateCalculatorPractice = (options = {}) => {
  const { difficulty = 'easy' } = options;
  
  const func = _.sample(['sin', 'cos', 'tan']);
  const angle = _.sample(COMMON_ANGLES);
  const value = roundTo(getTrigValue(func, angle), 3);
  
  return {
    instruction: 'Use your calculator to find',
    questionMath: `${func}(${angle}°)`,
    questionText: `Use your calculator to find ${func}(${angle}°). Give your answer to 3 decimal places.`,
    
    answer: `${value}`,
    
    workingOut: `\\text{Make sure calculator is in DEGREE mode} \\\\ ${func}(${angle}°) = ${value}`,
    
    solution: [
      {
        explanation: 'Ensure your calculator is in degree mode (DEG)',
        formula: '\\text{Check: DEG not RAD}'
      },
      {
        explanation: `Enter ${func}(${angle}) on your calculator`,
        formula: `${func}(${angle}°)`
      },
      {
        explanation: 'Read the result',
        formula: `= ${value}`
      }
    ],
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'calculator',
      trigFunc: func,
      difficulty,
      topic: 'trigonometry',
      tags: ['calculator', 'gcse'],
      values: { func, angle, value }
    },
    
    title: 'Calculator Practice',
    keyRule: '\\text{Always check calculator is in DEGREE mode}'
  };
};

// ============================================================
// GENERATORS: EXACT TRIG VALUES
// ============================================================

/**
 * Exact trig values from special triangles (30-60-90, 45-45-90)
 */
const generateExactValue = (options = {}) => {
  const { difficulty = 'medium' } = options;
  
  const angle = _.sample(SPECIAL_ANGLES);
  const func = _.sample(['sin', 'cos', 'tan']);
  const exactAnswer = EXACT_VALUES[angle][func];
  
  // Triangle dimensions for visualization
  let base, height, hypotenuse;
  
  if (angle === 45) {
    // 45-45-90 triangle: sides in ratio 1:1:√2
    base = 1;
    height = 1;
    hypotenuse = '\\sqrt{2}';
  } else {
    // 30-60-90 triangle: sides in ratio 1:√3:2
    base = '\\sqrt{3}';
    height = 1;
    hypotenuse = 2;
  }
  
  return {
    instruction: 'Find the exact value of',
    questionMath: `${func}(${angle}°)`,
    questionText: `Find the exact value of ${func}(${angle}°) without a calculator.`,
    
    answer: exactAnswer,
    
    workingOut: `\\text{Using special triangle ratios:} \\\\ ${func}(${angle}°) = ${exactAnswer}`,
    
    solution: [
      {
        explanation: angle === 45 
          ? 'Use the 45-45-90 triangle with sides in ratio 1:1:√2'
          : 'Use the 30-60-90 triangle with sides in ratio 1:√3:2',
        formula: angle === 45 
          ? '\\text{sides: } 1, 1, \\sqrt{2}'
          : '\\text{sides: } 1, \\sqrt{3}, 2'
      },
      {
        explanation: `Apply the ${func.toUpperCase()} ratio`,
        formula: func === 'sin' 
          ? `\\sin(${angle}°) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`
          : func === 'cos'
          ? `\\cos(${angle}°) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`
          : `\\tan(${angle}°) = \\frac{\\text{opposite}}{\\text{adjacent}}`
      },
      {
        explanation: 'Substitute the values',
        formula: `${func}(${angle}°) = ${exactAnswer}`
      }
    ],
    
    visualization: {
      type: 'special-triangle',
      triangleType: angle === 45 ? '45-45-90' : '30-60-90',
      showAngles: true,
      labels: {
        base: `${base}`,
        height: `${height}`,
        hypotenuse: `${hypotenuse}`,
        angles: angle === 45 ? ['45°', '45°'] : ['30°', '60°']
      }
    },
    visualizationType: 'special-triangle',
    visualizationHeight: '140px',
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'exact-value',
      trigFunc: func,
      difficulty,
      topic: 'trigonometry',
      tags: ['exact-values', 'gcse', 'higher'],
      values: { angle, func, exactAnswer }
    },
    
    title: `Exact Value: ${func}(${angle}°)`,
    keyRule: angle === 45 
      ? '45°\\text{ triangle: } 1:1:\\sqrt{2}'
      : '30°/60°\\text{ triangle: } 1:\\sqrt{3}:2'
  };
};

// ============================================================
// RANDOM/MIXED GENERATORS
// ============================================================

/**
 * Generate random SOHCAHTOA question
 */
const generateRandom = (options = {}) => {
  const { difficulty = 'medium', types = null } = options;
  
  const allTypes = types || (difficulty === 'easy'
    ? ['find-side', 'calculator']
    : ['find-side', 'find-angle', 'exact-value']
  );
  
  const type = _.sample(allTypes);
  
  switch (type) {
    case 'find-side':
      return generateFindSide({ difficulty });
    case 'find-angle':
      return generateFindAngle({ difficulty });
    case 'calculator':
      return generateCalculatorPractice({ difficulty });
    case 'exact-value':
      return generateExactValue({ difficulty });
    default:
      return generateFindSide({ difficulty });
  }
};

/**
 * Generate for specific Examples tab
 */
const generateForExamplesTab = (tabIndex, options = {}) => {
  switch (tabIndex) {
    case 1: // Tab 1: Find Side (tangent focus)
      return generateFindSide({ difficulty: 'medium', ratio: 'tan', ...options });
    case 2: // Tab 2: Find Side (mixed)
      return generateFindSide({ difficulty: 'medium', ...options });
    case 3: // Tab 3: Find Angle
      return generateFindAngle({ difficulty: 'medium', ...options });
    default:
      return generateRandom(options);
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const sohcahtoaGenerators = {
  // Individual generators
  generateFindSide,
  generateFindAngle,
  generateCalculatorPractice,
  generateExactValue,
  
  // Utility generators
  generateRandom,
  generateForExamplesTab
};

export default sohcahtoaGenerators;