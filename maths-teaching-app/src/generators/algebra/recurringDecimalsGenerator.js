// src/generators/algebra/recurringDecimalsGenerator.js
// Recurring Decimals Question Generator
// Following Generator Output Specification v1.0

import _ from 'lodash';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate GCD for fraction simplification
 */
const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

/**
 * Simplify a fraction
 */
const simplifyFraction = (num, den) => {
  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
};

/**
 * Format fraction in LaTeX
 */
const formatFraction = (num, den) => {
  if (den === 1) return `${num}`;
  return `\\frac{${num}}{${den}}`;
};

/**
 * Format recurring decimal with dot notation
 * Single digit: 0.3̇ = \dot{3}
 * Two digits: 0.1̇2̇ = \dot{1}\dot{2}  
 * Or: 0.12̇3̇ (only last digits recur)
 */
const formatRecurringDecimal = (nonRecurring, recurringPart) => {
  if (nonRecurring === '') {
    // Pure recurring: 0.333... or 0.121212...
    if (recurringPart.length === 1) {
      return `0.\\dot{${recurringPart}}`;
    } else if (recurringPart.length === 2) {
      return `0.\\dot{${recurringPart[0]}}\\dot{${recurringPart[1]}}`;
    } else if (recurringPart.length === 3) {
      return `0.\\dot{${recurringPart[0]}}${recurringPart[1]}\\dot{${recurringPart[2]}}`;
    }
  } else {
    // Has non-recurring prefix: 0.1666... 
    if (recurringPart.length === 1) {
      return `0.${nonRecurring}\\dot{${recurringPart}}`;
    } else {
      return `0.${nonRecurring}\\dot{${recurringPart[0]}}\\dot{${recurringPart[recurringPart.length - 1]}}`;
    }
  }
  return `0.${nonRecurring}\\overline{${recurringPart}}`;
};

// ============================================================
// GENERATORS
// ============================================================

/**
 * Single digit recurring: 0.3̇ = 3/9 = 1/3
 */
const generateSingleDigitRecurring = (options = {}) => {
  const { seed = Date.now() } = options;
  
  // Pick a digit 1-9 (not 0)
  const digit = _.random(1, 9);
  
  // Simplify fraction
  const simplified = simplifyFraction(digit, 9);
  const answerFraction = formatFraction(simplified.num, simplified.den);
  
  // Format the question: "0.3̇ = 1/3"
  const decimalDisplay = `0.\\dot{${digit}}`;
  const questionMath = `${decimalDisplay} = ${answerFraction}`;
  
  // Working out for starters
  const workingOut = `\\text{Let } x = 0.${digit}${digit}${digit}... \\\\ 10x = ${digit}.${digit}${digit}${digit}... \\\\ 10x - x = ${digit} \\\\ 9x = ${digit} \\\\ x = ${formatFraction(digit, 9)}${simplified.den !== 9 ? ` = ${answerFraction}` : ''}`;
  
  return {
    instruction: 'Show that',
    questionMath,
    answer: answerFraction,
    
    workingOut,
    
    solution: [
      { 
        explanation: 'Let x equal the recurring decimal', 
        formula: `x = 0.\\dot{${digit}}` 
      },
      { 
        explanation: 'Multiply both sides by 10', 
        formula: `10x = ${digit}.\\dot{${digit}}` 
      },
      { 
        explanation: 'Subtract the original equation (10x - x)', 
        formula: `10x - x = ${digit}.\\dot{${digit}} - 0.\\dot{${digit}}` 
      },
      { 
        explanation: 'Simplify', 
        formula: `9x = ${digit}` 
      },
      { 
        explanation: 'Solve for x', 
        formula: `x = ${formatFraction(digit, 9)}` 
      },
      ...(simplified.den !== 9 ? [{ 
        explanation: 'Simplify the fraction', 
        formula: `x = ${answerFraction}` 
      }] : [])
    ],
    
    metadata: {
      type: 'single-digit',
      difficulty: 'easy',
      topic: 'recurring-decimals',
      tags: ['number', 'gcse', 'higher'],
      values: { digit, numerator: simplified.num, denominator: simplified.den }
    },
    
    title: 'Single Digit Recurring',
    keyRule: '0.\\dot{a} = \\frac{a}{9}'
  };
};

/**
 * Two digit recurring: 0.1̇2̇ = 12/99
 */
const generateTwoDigitRecurring = (options = {}) => {
  const { seed = Date.now() } = options;
  
  // Pick two digits (10-99, avoiding multiples of 11 for variety)
  let twoDigit;
  do {
    twoDigit = _.random(10, 98);
  } while (twoDigit % 11 === 0);
  
  const d1 = Math.floor(twoDigit / 10);
  const d2 = twoDigit % 10;
  
  // Simplify fraction
  const simplified = simplifyFraction(twoDigit, 99);
  const answerFraction = formatFraction(simplified.num, simplified.den);
  
  // Format question
  const decimalDisplay = `0.\\dot{${d1}}\\dot{${d2}}`;
  const questionMath = `${decimalDisplay} = ${answerFraction}`;
  
  // Working out
  const needsSimplification = simplified.den !== 99;
  const workingOut = `\\text{Let } x = 0.${d1}${d2}${d1}${d2}... \\\\ 100x = ${d1}${d2}.${d1}${d2}... \\\\ 99x = ${twoDigit} \\\\ x = ${formatFraction(twoDigit, 99)}${needsSimplification ? ` = ${answerFraction}` : ''}`;
  
  return {
    instruction: 'Show that',
    questionMath,
    answer: answerFraction,
    
    workingOut,
    
    solution: [
      { 
        explanation: 'Let x equal the recurring decimal', 
        formula: `x = ${decimalDisplay}` 
      },
      { 
        explanation: 'Multiply both sides by 100 (2 recurring digits)', 
        formula: `100x = ${d1}${d2}.\\dot{${d1}}\\dot{${d2}}` 
      },
      { 
        explanation: 'Subtract the original equation', 
        formula: `100x - x = ${twoDigit}` 
      },
      { 
        explanation: 'Simplify', 
        formula: `99x = ${twoDigit}` 
      },
      { 
        explanation: 'Solve for x', 
        formula: `x = ${formatFraction(twoDigit, 99)}` 
      },
      ...(needsSimplification ? [{ 
        explanation: 'Simplify the fraction', 
        formula: `x = ${answerFraction}` 
      }] : [])
    ],
    
    metadata: {
      type: 'two-digit',
      difficulty: 'medium',
      topic: 'recurring-decimals',
      tags: ['number', 'gcse', 'higher'],
      values: { twoDigit, numerator: simplified.num, denominator: simplified.den }
    },
    
    title: 'Two Digit Recurring',
    keyRule: '0.\\dot{a}\\dot{b} = \\frac{ab}{99}'
  };
};

/**
 * Three digit recurring: 0.1̇23̇ = 123/999
 */
const generateThreeDigitRecurring = (options = {}) => {
  const { seed = Date.now() } = options;
  
  // Pick three digits (100-999)
  let threeDigit;
  do {
    threeDigit = _.random(100, 998);
  } while (threeDigit % 111 === 0); // Avoid 111, 222, etc.
  
  const d1 = Math.floor(threeDigit / 100);
  const d2 = Math.floor((threeDigit % 100) / 10);
  const d3 = threeDigit % 10;
  
  // Simplify fraction
  const simplified = simplifyFraction(threeDigit, 999);
  const answerFraction = formatFraction(simplified.num, simplified.den);
  
  // Format question
  const decimalDisplay = `0.\\dot{${d1}}${d2}\\dot{${d3}}`;
  const questionMath = `${decimalDisplay} = ${answerFraction}`;
  
  // Working out
  const needsSimplification = simplified.den !== 999;
  const workingOut = `\\text{Let } x = 0.${d1}${d2}${d3}${d1}${d2}${d3}... \\\\ 1000x = ${d1}${d2}${d3}.${d1}${d2}${d3}... \\\\ 999x = ${threeDigit} \\\\ x = ${formatFraction(threeDigit, 999)}${needsSimplification ? ` = ${answerFraction}` : ''}`;
  
  return {
    instruction: 'Show that',
    questionMath,
    answer: answerFraction,
    
    workingOut,
    
    solution: [
      { 
        explanation: 'Let x equal the recurring decimal', 
        formula: `x = ${decimalDisplay}` 
      },
      { 
        explanation: 'Multiply both sides by 1000 (3 recurring digits)', 
        formula: `1000x = ${d1}${d2}${d3}.\\dot{${d1}}${d2}\\dot{${d3}}` 
      },
      { 
        explanation: 'Subtract the original equation', 
        formula: `999x = ${threeDigit}` 
      },
      { 
        explanation: 'Solve for x', 
        formula: `x = ${formatFraction(threeDigit, 999)}` 
      },
      ...(needsSimplification ? [{ 
        explanation: 'Simplify the fraction', 
        formula: `x = ${answerFraction}` 
      }] : [])
    ],
    
    metadata: {
      type: 'three-digit',
      difficulty: 'medium',
      topic: 'recurring-decimals',
      tags: ['number', 'gcse', 'higher'],
      values: { threeDigit, numerator: simplified.num, denominator: simplified.den }
    },
    
    title: 'Three Digit Recurring',
    keyRule: '0.\\dot{a}bc\\dot{d} = \\frac{abcd}{9999} \\text{ (or similar)}'
  };
};

/**
 * Non-recurring prefix: 0.16̇ = 1/6 (has non-recurring part before recurring)
 * This is the trickiest type - needs two multiplications
 */
const generateWithNonRecurringPrefix = (options = {}) => {
  const { seed = Date.now() } = options;
  
  // Pre-computed examples that give nice fractions
  // Format: [nonRecurring, recurring, numerator, denominator]
  const examples = [
    ['1', '6', 1, 6],      // 0.1666... = 1/6
    ['8', '3', 5, 6],      // 0.8333... = 5/6
    ['4', '1', 37, 90],    // 0.4111... = 37/90
    ['1', '2', 11, 90],    // 0.1222... = 11/90
    ['5', '4', 49, 90],    // 0.5444... = 49/90
    ['08', '3', 1, 12],    // 0.08333... = 1/12
    ['41', '6', 5, 12],    // 0.41666... = 5/12
    ['58', '3', 7, 12],    // 0.58333... = 7/12
  ];
  
  const [nonRec, rec, num, den] = _.sample(examples);
  
  const answerFraction = formatFraction(num, den);
  
  // Format decimal display
  const decimalDisplay = rec.length === 1 
    ? `0.${nonRec}\\dot{${rec}}`
    : `0.${nonRec}\\overline{${rec}}`;
  
  const questionMath = `${decimalDisplay} = ${answerFraction}`;
  
  // Working out - this type needs two equations
  const mult1 = Math.pow(10, nonRec.length);
  const mult2 = Math.pow(10, nonRec.length + rec.length);
  
  const workingOut = `\\text{Let } x = 0.${nonRec}${rec}${rec}... \\\\ ${mult1}x = ${nonRec}.${rec}${rec}... \\\\ ${mult2}x = ${nonRec}${rec}.${rec}... \\\\ ${mult2}x - ${mult1}x = ${parseInt(nonRec + rec) - parseInt(nonRec)} \\\\ x = ${answerFraction}`;
  
  return {
    instruction: 'Show that',
    questionMath,
    answer: answerFraction,
    
    workingOut,
    
    solution: [
      { 
        explanation: 'Let x equal the recurring decimal', 
        formula: `x = ${decimalDisplay}` 
      },
      { 
        explanation: `Multiply by ${mult1} to move past non-recurring part`, 
        formula: `${mult1}x = ${nonRec}.\\dot{${rec}}` 
      },
      { 
        explanation: `Multiply by ${mult2} to align recurring parts`, 
        formula: `${mult2}x = ${nonRec}${rec}.\\dot{${rec}}` 
      },
      { 
        explanation: 'Subtract to eliminate the recurring part', 
        formula: `${mult2}x - ${mult1}x = ${parseInt(nonRec + rec)} - ${parseInt(nonRec)}` 
      },
      { 
        explanation: 'Simplify and solve', 
        formula: `${mult2 - mult1}x = ${parseInt(nonRec + rec) - parseInt(nonRec)}` 
      },
      { 
        explanation: 'Final answer', 
        formula: `x = ${answerFraction}` 
      }
    ],
    
    metadata: {
      type: 'non-recurring-prefix',
      difficulty: 'hard',
      topic: 'recurring-decimals',
      tags: ['number', 'gcse', 'higher'],
      values: { nonRecurring: nonRec, recurring: rec, numerator: num, denominator: den }
    },
    
    title: 'Non-Recurring Prefix',
    keyRule: '\\text{Use two multiplications: one past non-recurring, one past all digits}'
  };
};

/**
 * Simple diagnostic: convert recurring decimal to fraction (not "show that")
 */
const generateSimpleConversion = (options = {}) => {
  const { seed = Date.now() } = options;
  
  const digit = _.random(1, 9);
  const simplified = simplifyFraction(digit, 9);
  const answerFraction = formatFraction(simplified.num, simplified.den);
  
  const decimalDisplay = `0.\\dot{${digit}}`;
  
  return {
    instruction: 'Convert to a fraction',
    questionMath: decimalDisplay,
    answer: answerFraction,
    
    workingOut: `9x = ${digit}, \\quad x = ${answerFraction}`,
    
    solution: [
      { explanation: 'Recognise the pattern', formula: `0.\\dot{a} = \\frac{a}{9}` },
      { explanation: 'Apply', formula: `0.\\dot{${digit}} = \\frac{${digit}}{9}` },
      ...(simplified.den !== 9 ? [{ explanation: 'Simplify', formula: answerFraction }] : [])
    ],
    
    metadata: {
      type: 'simple-conversion',
      difficulty: 'easy',
      topic: 'recurring-decimals',
      tags: ['number', 'gcse', 'diagnostic']
    },
    
    title: 'Convert to Fraction'
  };
};

/**
 * Generate a random recurring decimal question
 */
const generateRandom = (options = {}) => {
  const { seed = Date.now(), difficulty = 'medium', types = ['single', 'two', 'three', 'prefix'] } = options;
  
  const type = _.sample(types);
  
  switch (type) {
    case 'single':
      return generateSingleDigitRecurring({ seed });
    case 'two':
      return generateTwoDigitRecurring({ seed });
    case 'three':
      return generateThreeDigitRecurring({ seed });
    case 'prefix':
      return generateWithNonRecurringPrefix({ seed });
    default:
      return generateSingleDigitRecurring({ seed });
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const recurringDecimalsGenerators = {
  generateSingleDigitRecurring,
  generateTwoDigitRecurring,
  generateThreeDigitRecurring,
  generateWithNonRecurringPrefix,
  generateSimpleConversion,
  generateRandom
};

export default recurringDecimalsGenerators;