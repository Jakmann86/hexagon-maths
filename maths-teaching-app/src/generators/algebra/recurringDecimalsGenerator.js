// src/generators/algebra/recurringDecimalsGenerator.js
// Generators for Converting Recurring Decimals to Fractions
// Following Pattern 2: Returns config objects, not React components

import _ from 'lodash';

/**
 * DIAGNOSTIC: Simple fraction to decimal recognition
 * Questions like: "What is 1/9 as a decimal?" or "What fraction is 0.̄7?"
 */
export const generateSimpleRecurringDiagnostic = (options = {}) => {
  const {
    difficulty = 'easy',
    questionDirection = null // 'toDecimal', 'toFraction', or null for random
  } = options;

  const direction = questionDirection || _.sample(['toDecimal', 'toFraction']);

  // Simple ninths and ninety-ninths
  const simpleNinths = [
    { fraction: '\\frac{1}{9}', decimal: '0.\\dot{1}', value: 1 },
    { fraction: '\\frac{2}{9}', decimal: '0.\\dot{2}', value: 2 },
    { fraction: '\\frac{4}{9}', decimal: '0.\\dot{4}', value: 4 },
    { fraction: '\\frac{5}{9}', decimal: '0.\\dot{5}', value: 5 },
    { fraction: '\\frac{7}{9}', decimal: '0.\\dot{7}', value: 7 },
    { fraction: '\\frac{8}{9}', decimal: '0.\\dot{8}', value: 8 }
  ];

  const simpleNinetyNinths = [
    { fraction: '\\frac{1}{99}', decimal: '0.\\dot{0}\\dot{1}', value: 1 },
    { fraction: '\\frac{12}{99}', decimal: '0.\\dot{1}\\dot{2}', value: 12 },
    { fraction: '\\frac{23}{99}', decimal: '0.\\dot{2}\\dot{3}', value: 23 },
    { fraction: '\\frac{45}{99}', decimal: '0.\\dot{4}\\dot{5}', value: 45 },
    { fraction: '\\frac{67}{99}', decimal: '0.\\dot{6}\\dot{7}', value: 67 }
  ];

  const pool = difficulty === 'easy' ? simpleNinths : [...simpleNinths, ...simpleNinetyNinths];
  const selected = _.sample(pool);

  if (direction === 'toDecimal') {
    // Generate distractors
    const correctAnswer = selected.decimal;
    const incorrectOptions = [
      `0.${selected.value}`, // Non-recurring
      `0.\\dot{${(selected.value + 1) % 10}}`, // Wrong digit
      `0.${selected.value}${selected.value}` // Repeated but not recurring
    ].filter(opt => opt !== correctAnswer);

    return {
      questionDisplay: {
        text: 'Write as a recurring decimal:',
        math: selected.fraction
      },
      correctAnswer,
      options: _.shuffle([correctAnswer, ...incorrectOptions.slice(0, 3)]),
      explanation: `${selected.fraction} = ${selected.decimal}`
    };
  } else {
    // toFraction
    const correctAnswer = selected.fraction;
    const baseValue = selected.value;
    const incorrectOptions = [
      `\\frac{${baseValue}}{10}`,
      `\\frac{${baseValue}}{90}`,
      `\\frac{${baseValue + 1}}{9}`
    ].filter(opt => opt !== correctAnswer);

    return {
      questionDisplay: {
        text: 'Write as a fraction:',
        math: selected.decimal
      },
      correctAnswer,
      options: _.shuffle([correctAnswer, ...incorrectOptions.slice(0, 3)]),
      explanation: `${selected.decimal} = ${selected.fraction}`
    };
  }
};

/**
 * EXAMPLES TAB 1: Single digit recurring (0.̄4 = 4/9)
 * "Show that 0.̄4 = 4/9"
 */
export const generateSingleDigitRecurring = (options = {}) => {
  const { seed = Date.now() } = options;

  const digits = [1, 2, 3, 4, 5, 6, 7, 8];
  const digit = digits[seed % digits.length] || _.sample(digits);

  return {
    title: 'Single Digit Recurring',
    questionText: `Show that $0.\\dot{${digit}} = \\frac{${digit}}{9}$`,
    answer: `\\frac{${digit}}{9}`,
    solution: [
      {
        explanation: `Let x = 0.${digit}${digit}${digit}...`,
        formula: `x = 0.\\dot{${digit}}`
      },
      {
        explanation: 'Multiply both sides by 10 to shift the decimal point',
        formula: `10x = ${digit}.\\dot{${digit}}`
      },
      {
        explanation: 'Subtract the original equation to eliminate the recurring part',
        formula: `10x - x = ${digit}.\\dot{${digit}} - 0.\\dot{${digit}}`
      },
      {
        explanation: 'Simplify',
        formula: `9x = ${digit}`
      },
      {
        explanation: 'Solve for x',
        formula: `x = \\frac{${digit}}{9}`
      }
    ],
    metadata: { type: 'single-digit', digit }
  };
};

/**
 * EXAMPLES TAB 2: Two digit recurring (0.̄1̄2 = 12/99)
 * "Show that 0.̄1̄2 = 12/99"
 */
export const generateTwoDigitRecurring = (options = {}) => {
  const { seed = Date.now() } = options;

  const twoDigitOptions = [
    { digits: '12', num: 12 },
    { digits: '23', num: 23 },
    { digits: '34', num: 34 },
    { digits: '45', num: 45 },
    { digits: '56', num: 56 },
    { digits: '67', num: 67 },
    { digits: '78', num: 78 },
    { digits: '89', num: 89 },
    { digits: '13', num: 13 },
    { digits: '27', num: 27 },
    { digits: '36', num: 36 },
    { digits: '54', num: 54 },
    { digits: '81', num: 81 }
  ];

  const selected = twoDigitOptions[seed % twoDigitOptions.length] || _.sample(twoDigitOptions);
  const d1 = selected.digits[0];
  const d2 = selected.digits[1];

  // Check if fraction can be simplified
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(selected.num, 99);
  const simplified = divisor > 1 
    ? `= \\frac{${selected.num / divisor}}{${99 / divisor}}`
    : '';

  return {
    title: 'Two Digit Recurring',
    questionText: `Show that $0.\\dot{${d1}}\\dot{${d2}} = \\frac{${selected.num}}{99}$`,
    answer: `\\frac{${selected.num}}{99}${simplified}`,
    solution: [
      {
        explanation: `Let x = 0.${selected.digits}${selected.digits}${selected.digits}...`,
        formula: `x = 0.\\dot{${d1}}\\dot{${d2}}`
      },
      {
        explanation: 'Multiply both sides by 100 to shift two decimal places',
        formula: `100x = ${selected.digits}.\\dot{${d1}}\\dot{${d2}}`
      },
      {
        explanation: 'Subtract the original equation',
        formula: `100x - x = ${selected.digits}.\\dot{${d1}}\\dot{${d2}} - 0.\\dot{${d1}}\\dot{${d2}}`
      },
      {
        explanation: 'Simplify',
        formula: `99x = ${selected.num}`
      },
      {
        explanation: 'Solve for x',
        formula: `x = \\frac{${selected.num}}{99}${simplified}`
      }
    ],
    metadata: { type: 'two-digit', digits: selected.digits }
  };
};

/**
 * EXAMPLES TAB 3: Three digit recurring (0.̄1̄2̄3 = 123/999)
 * "Show that 0.̄1̄2̄3 = 123/999"
 */
export const generateThreeDigitRecurring = (options = {}) => {
  const { seed = Date.now() } = options;

  const threeDigitOptions = [
    { digits: '123', num: 123 },
    { digits: '234', num: 234 },
    { digits: '345', num: 345 },
    { digits: '456', num: 456 },
    { digits: '567', num: 567 },
    { digits: '142', num: 142 },
    { digits: '285', num: 285 },
    { digits: '428', num: 428 },
    { digits: '571', num: 571 },
    { digits: '714', num: 714 },
    { digits: '857', num: 857 }
  ];

  const selected = threeDigitOptions[seed % threeDigitOptions.length] || _.sample(threeDigitOptions);
  const d1 = selected.digits[0];
  const d2 = selected.digits[1];
  const d3 = selected.digits[2];

  // Check if fraction can be simplified
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(selected.num, 999);
  const simplified = divisor > 1 
    ? `= \\frac{${selected.num / divisor}}{${999 / divisor}}`
    : '';

  return {
    title: 'Three Digit Recurring',
    questionText: `Show that $0.\\dot{${d1}}${d2}\\dot{${d3}} = \\frac{${selected.num}}{999}$`,
    answer: `\\frac{${selected.num}}{999}${simplified}`,
    solution: [
      {
        explanation: `Let x = 0.${selected.digits}${selected.digits}...`,
        formula: `x = 0.\\dot{${d1}}${d2}\\dot{${d3}}`
      },
      {
        explanation: 'Multiply both sides by 1000 to shift three decimal places',
        formula: `1000x = ${selected.digits}.\\dot{${d1}}${d2}\\dot{${d3}}`
      },
      {
        explanation: 'Subtract the original equation',
        formula: `1000x - x = ${selected.digits}.\\dot{${d1}}${d2}\\dot{${d3}} - 0.\\dot{${d1}}${d2}\\dot{${d3}}`
      },
      {
        explanation: 'Simplify',
        formula: `999x = ${selected.num}`
      },
      {
        explanation: 'Solve for x',
        formula: `x = \\frac{${selected.num}}{999}${simplified}`
      }
    ],
    metadata: { type: 'three-digit', digits: selected.digits }
  };
};

/**
 * EXAMPLES TAB 4: Non-recurring prefix (0.1̄6 = 1/6)
 * "Show that 0.1̄6 = 1/6" (where only the 6 recurs)
 */
export const generateNonRecurringPrefix = (options = {}) => {
  const { seed = Date.now() } = options;

  // Common examples where a digit doesn't recur
  const prefixOptions = [
    { 
      display: '0.1\\dot{6}', 
      prefix: '1', 
      recurring: '6',
      working: {
        let10x: '1.\\dot{6}',
        let100x: '16.\\dot{6}',
        subtract: '100x - 10x = 16.\\dot{6} - 1.\\dot{6}',
        result: '90x = 15',
        answer: '\\frac{15}{90} = \\frac{1}{6}'
      },
      finalAnswer: '\\frac{1}{6}'
    },
    { 
      display: '0.8\\dot{3}', 
      prefix: '8', 
      recurring: '3',
      working: {
        let10x: '8.\\dot{3}',
        let100x: '83.\\dot{3}',
        subtract: '100x - 10x = 83.\\dot{3} - 8.\\dot{3}',
        result: '90x = 75',
        answer: '\\frac{75}{90} = \\frac{5}{6}'
      },
      finalAnswer: '\\frac{5}{6}'
    },
    { 
      display: '0.4\\dot{1}', 
      prefix: '4', 
      recurring: '1',
      working: {
        let10x: '4.\\dot{1}',
        let100x: '41.\\dot{1}',
        subtract: '100x - 10x = 41.\\dot{1} - 4.\\dot{1}',
        result: '90x = 37',
        answer: '\\frac{37}{90}'
      },
      finalAnswer: '\\frac{37}{90}'
    },
    { 
      display: '0.2\\dot{7}', 
      prefix: '2', 
      recurring: '7',
      working: {
        let10x: '2.\\dot{7}',
        let100x: '27.\\dot{7}',
        subtract: '100x - 10x = 27.\\dot{7} - 2.\\dot{7}',
        result: '90x = 25',
        answer: '\\frac{25}{90} = \\frac{5}{18}'
      },
      finalAnswer: '\\frac{5}{18}'
    },
    { 
      display: '0.5\\dot{8}', 
      prefix: '5', 
      recurring: '8',
      working: {
        let10x: '5.\\dot{8}',
        let100x: '58.\\dot{8}',
        subtract: '100x - 10x = 58.\\dot{8} - 5.\\dot{8}',
        result: '90x = 53',
        answer: '\\frac{53}{90}'
      },
      finalAnswer: '\\frac{53}{90}'
    },
    { 
      display: '0.3\\dot{6}', 
      prefix: '3', 
      recurring: '6',
      working: {
        let10x: '3.\\dot{6}',
        let100x: '36.\\dot{6}',
        subtract: '100x - 10x = 36.\\dot{6} - 3.\\dot{6}',
        result: '90x = 33',
        answer: '\\frac{33}{90} = \\frac{11}{30}'
      },
      finalAnswer: '\\frac{11}{30}'
    }
  ];

  const selected = prefixOptions[seed % prefixOptions.length] || _.sample(prefixOptions);

  return {
    title: 'Non-Recurring Prefix',
    questionText: `Show that $${selected.display} = ${selected.finalAnswer}$`,
    answer: selected.finalAnswer,
    solution: [
      {
        explanation: 'Let x equal the recurring decimal',
        formula: `x = ${selected.display}`
      },
      {
        explanation: 'Multiply by 10 to move past the non-recurring digit',
        formula: `10x = ${selected.working.let10x}`
      },
      {
        explanation: 'Multiply by 100 to move one full cycle of the recurring part',
        formula: `100x = ${selected.working.let100x}`
      },
      {
        explanation: 'Subtract 10x from 100x to eliminate the recurring part',
        formula: selected.working.subtract
      },
      {
        explanation: 'Simplify',
        formula: selected.working.result
      },
      {
        explanation: 'Solve for x and simplify the fraction',
        formula: `x = ${selected.working.answer}`
      }
    ],
    metadata: { type: 'non-recurring-prefix', display: selected.display }
  };
};

/**
 * Generate all examples for the Examples Section (4 tabs)
 */
export const generateRecurringDecimalsExamples = (options = {}) => {
  const { seed = Date.now() } = options;
  
  return [
    generateSingleDigitRecurring({ seed }),
    generateTwoDigitRecurring({ seed: seed + 1000 }),
    generateThreeDigitRecurring({ seed: seed + 2000 }),
    generateNonRecurringPrefix({ seed: seed + 3000 })
  ];
};

// Export all generators
export const recurringDecimalsGenerators = {
  // Diagnostic
  generateSimpleRecurringDiagnostic,
  
  // Examples (4 types)
  generateSingleDigitRecurring,
  generateTwoDigitRecurring,
  generateThreeDigitRecurring,
  generateNonRecurringPrefix,
  
  // Combined
  generateRecurringDecimalsExamples
};

export default recurringDecimalsGenerators;