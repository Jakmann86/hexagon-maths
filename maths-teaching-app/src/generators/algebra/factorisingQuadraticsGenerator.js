// src/generators/algebra/factorisingQuadraticsGenerator.js
// Factorising Quadratics Question Generator
// Following Generator Output Specification v1.0

import _ from 'lodash';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Format a quadratic expression: ax² + bx + c
 * Returns clean LaTeX without $ wrappers
 */
const formatQuadratic = (a, b, c, variable = 'x') => {
  let terms = [];
  
  // x² term
  if (a === 1) {
    terms.push(`${variable}^2`);
  } else if (a === -1) {
    terms.push(`-${variable}^2`);
  } else if (a !== 0) {
    terms.push(`${a}${variable}^2`);
  }
  
  // x term
  if (b === 1) {
    terms.push(`+ ${variable}`);
  } else if (b === -1) {
    terms.push(`- ${variable}`);
  } else if (b > 0) {
    terms.push(`+ ${b}${variable}`);
  } else if (b < 0) {
    terms.push(`- ${Math.abs(b)}${variable}`);
  }
  
  // constant term
  if (c > 0) {
    terms.push(`+ ${c}`);
  } else if (c < 0) {
    terms.push(`- ${Math.abs(c)}`);
  }
  
  // Clean up: remove leading + and extra spaces
  let result = terms.join(' ').trim();
  if (result.startsWith('+ ')) {
    result = result.slice(2);
  }
  
  return result;
};

/**
 * Format factored form: (x + p)(x + q)
 */
const formatFactoredSimple = (p, q, variable = 'x') => {
  const formatBracket = (val) => {
    if (val === 0) return variable;
    if (val > 0) return `${variable} + ${val}`;
    return `${variable} - ${Math.abs(val)}`;
  };
  
  return `(${formatBracket(p)})(${formatBracket(q)})`;
};

/**
 * Format factored form for complex: (ax + b)(cx + d)
 */
const formatFactoredComplex = (a, b, c, d, variable = 'x') => {
  const formatBracket = (coef, constant) => {
    let term = '';
    if (coef === 1) term = variable;
    else if (coef === -1) term = `-${variable}`;
    else term = `${coef}${variable}`;
    
    if (constant === 0) return term;
    if (constant > 0) return `${term} + ${constant}`;
    return `${term} - ${Math.abs(constant)}`;
  };
  
  return `(${formatBracket(a, b)})(${formatBracket(c, d)})`;
};

/**
 * Format difference of squares: a²x² - b²
 */
const formatDifferenceOfSquares = (a, b, variable = 'x') => {
  const aSquared = a * a;
  const bSquared = b * b;
  
  if (a === 1) {
    return `${variable}^2 - ${bSquared}`;
  }
  return `${aSquared}${variable}^2 - ${bSquared}`;
};

/**
 * GCD for simplification
 */
const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

// ============================================================
// GENERATORS
// ============================================================

/**
 * Generate simple quadratic (a = 1): x² + bx + c
 * Factors to (x + p)(x + q) where pq = c and p + q = b
 */
const generateSimpleQuadratic = (options = {}) => {
  const { seed = Date.now(), difficulty = 'medium' } = options;
  
  // Use seed for reproducibility
  const rng = seed ? _.stubTrue : _.stubTrue; // lodash doesn't have seeded random, use Math.random
  
  // Generate p and q based on difficulty
  let p, q;
  if (difficulty === 'easy') {
    // Both positive, small numbers
    p = _.random(1, 5);
    q = _.random(1, 5);
  } else if (difficulty === 'hard') {
    // Can be negative, larger range
    p = _.random(-8, 8);
    q = _.random(-8, 8);
    // Avoid both zero
    if (p === 0) p = _.random(1, 6);
  } else {
    // Medium: one might be negative
    p = _.random(-6, 6);
    q = _.random(1, 6);
    if (p === 0) p = _.random(1, 4);
  }
  
  // Calculate coefficients
  const b = p + q;
  const c = p * q;
  
  // Format expression and answer
  const questionMath = formatQuadratic(1, b, c);
  const answer = formatFactoredSimple(p, q);
  
  // Build working out (single string for starters)
  const workingOut = `\\text{Find: } ? \\times ? = ${c} \\text{ and } ? + ? = ${b} \\\\ \\text{Numbers: } ${p} \\text{ and } ${q}`;
  
  return {
    instruction: 'Factorise',
    questionMath,
    answer,
    
    workingOut,
    
    solution: [
      { 
        explanation: 'Identify the coefficients', 
        formula: `a = 1, \\quad b = ${b}, \\quad c = ${c}` 
      },
      { 
        explanation: 'Find two numbers that multiply to c', 
        formula: `? \\times ? = ${c}` 
      },
      { 
        explanation: 'And add to b', 
        formula: `? + ? = ${b}` 
      },
      { 
        explanation: 'The numbers are', 
        formula: `${p} \\text{ and } ${q}` 
      },
      { 
        explanation: 'Write in factored form', 
        formula: answer 
      }
    ],
    
    metadata: {
      type: 'simple',
      subType: 'a-equals-1',
      difficulty,
      topic: 'factorising-quadratics',
      tags: ['algebra', 'gcse', 'foundation'],
      values: { p, q, b, c }
    },
    
    title: 'Simple Quadratic (a = 1)',
    keyRule: 'x^2 + bx + c = (x + p)(x + q) \\text{ where } pq = c \\text{ and } p + q = b'
  };
};

/**
 * Generate difference of two squares: x² - k² or a²x² - b²
 * Factors to (x + k)(x - k) or (ax + b)(ax - b)
 */
const generateDifferenceOfSquares = (options = {}) => {
  const { seed = Date.now(), difficulty = 'medium' } = options;
  
  let a, b;
  
  if (difficulty === 'easy') {
    // Simple: x² - k²
    a = 1;
    b = _.random(2, 9);
  } else if (difficulty === 'hard') {
    // Complex: a²x² - b²
    a = _.sample([2, 3, 4, 5]);
    b = _.random(2, 7);
  } else {
    // Medium: mix
    a = _.sample([1, 1, 1, 2, 3]);
    b = _.random(2, 8);
  }
  
  const aSquared = a * a;
  const bSquared = b * b;
  
  // Format question and answer
  const questionMath = formatDifferenceOfSquares(a, b);
  
  let answer;
  if (a === 1) {
    answer = `(x + ${b})(x - ${b})`;
  } else {
    answer = `(${a}x + ${b})(${a}x - ${b})`;
  }
  
  // Working out
  const workingOut = a === 1
    ? `\\text{Recognise } x^2 - ${bSquared} = x^2 - ${b}^2 \\\\ = (x + ${b})(x - ${b})`
    : `\\text{Recognise } ${aSquared}x^2 - ${bSquared} = (${a}x)^2 - ${b}^2 \\\\ = (${a}x + ${b})(${a}x - ${b})`;
  
  return {
    instruction: 'Factorise',
    questionMath,
    answer,
    
    workingOut,
    
    solution: [
      { 
        explanation: 'Recognise the difference of two squares pattern', 
        formula: `a^2 - b^2 = (a + b)(a - b)` 
      },
      { 
        explanation: 'Identify the square terms', 
        formula: a === 1 
          ? `x^2 = (x)^2, \\quad ${bSquared} = (${b})^2`
          : `${aSquared}x^2 = (${a}x)^2, \\quad ${bSquared} = (${b})^2`
      },
      { 
        explanation: 'Apply the formula', 
        formula: answer 
      }
    ],
    
    metadata: {
      type: 'difference-of-squares',
      subType: a === 1 ? 'simple' : 'with-coefficient',
      difficulty,
      topic: 'factorising-quadratics',
      tags: ['algebra', 'gcse', 'foundation'],
      values: { a, b, aSquared, bSquared }
    },
    
    title: a === 1 ? 'Difference of Two Squares' : 'Difference of Two Squares (with coefficient)',
    keyRule: 'a^2 - b^2 = (a + b)(a - b)'
  };
};

/**
 * Generate complex quadratic (a ≠ 1): ax² + bx + c
 * Uses pre-computed factorisable quadratics for clean answers
 */
const generateComplexQuadratic = (options = {}) => {
  const { seed = Date.now(), difficulty = 'medium' } = options;
  
  // Pre-computed factorisable quadratics: [a, b, c, factor1_a, factor1_b, factor2_a, factor2_b]
  // (factor1_a * x + factor1_b)(factor2_a * x + factor2_b) = ax² + bx + c
  const easyQuadratics = [
    [2, 5, 3, 2, 3, 1, 1],     // (2x + 3)(x + 1) = 2x² + 5x + 3
    [2, 7, 3, 2, 1, 1, 3],     // (2x + 1)(x + 3) = 2x² + 7x + 3
    [3, 7, 2, 3, 1, 1, 2],     // (3x + 1)(x + 2) = 3x² + 7x + 2
    [2, 5, 2, 2, 1, 1, 2],     // (2x + 1)(x + 2) = 2x² + 5x + 2
    [3, 10, 3, 3, 1, 1, 3],    // (3x + 1)(x + 3) = 3x² + 10x + 3
  ];
  
  const mediumQuadratics = [
    [2, 1, -3, 2, 3, 1, -1],   // (2x + 3)(x - 1) = 2x² + x - 3
    [3, 5, -2, 3, -1, 1, 2],   // (3x - 1)(x + 2) = 3x² + 5x - 2
    [2, -5, 3, 2, -3, 1, -1],  // (2x - 3)(x - 1) = 2x² - 5x + 3
    [3, -7, 2, 3, -1, 1, -2],  // (3x - 1)(x - 2) = 3x² - 7x + 2
    [2, -1, -3, 2, -3, 1, 1],  // (2x - 3)(x + 1) = 2x² - x - 3
    [4, 8, 3, 2, 1, 2, 3],     // (2x + 1)(2x + 3) = 4x² + 8x + 3
  ];
  
  const hardQuadratics = [
    [6, 7, 2, 3, 2, 2, 1],     // (3x + 2)(2x + 1) = 6x² + 7x + 2
    [6, -7, 2, 3, -2, 2, -1],  // (3x - 2)(2x - 1) = 6x² - 7x + 2
    [6, 1, -2, 3, 2, 2, -1],   // (3x + 2)(2x - 1) = 6x² + x - 2
    [4, -4, -3, 2, 1, 2, -3],  // (2x + 1)(2x - 3) = 4x² - 4x - 3
    [6, 11, 3, 3, 1, 2, 3],    // (3x + 1)(2x + 3) = 6x² + 11x + 3
  ];
  
  // Select based on difficulty
  let quadratics;
  if (difficulty === 'easy') {
    quadratics = easyQuadratics;
  } else if (difficulty === 'hard') {
    quadratics = hardQuadratics;
  } else {
    quadratics = mediumQuadratics;
  }
  
  const [a, b, c, f1a, f1b, f2a, f2b] = _.sample(quadratics);
  
  // Format question and answer
  const questionMath = formatQuadratic(a, b, c);
  const answer = formatFactoredComplex(f1a, f1b, f2a, f2b);
  
  // AC method working
  const ac = a * c;
  
  const workingOut = `\\text{AC method: } a \\times c = ${a} \\times ${c} = ${ac} \\\\ \\text{Find factors of } ${ac} \\text{ that sum to } ${b} \\\\ \\text{Split middle term and factorise}`;
  
  return {
    instruction: 'Factorise',
    questionMath,
    answer,
    
    workingOut,
    
    solution: [
      { 
        explanation: 'Use the AC method: multiply a × c', 
        formula: `${a} \\times ${c} = ${ac}` 
      },
      { 
        explanation: `Find two numbers that multiply to ${ac} and sum to ${b}`, 
        formula: `? \\times ? = ${ac}, \\quad ? + ? = ${b}` 
      },
      { 
        explanation: 'Split the middle term', 
        formula: formatQuadratic(a, 0, 0) + ' + ... + ' + c
      },
      { 
        explanation: 'Factorise by grouping', 
        formula: answer
      }
    ],
    
    metadata: {
      type: 'complex',
      subType: 'a-not-1',
      difficulty,
      topic: 'factorising-quadratics',
      tags: ['algebra', 'gcse', 'higher'],
      values: { a, b, c, f1a, f1b, f2a, f2b }
    },
    
    title: 'Complex Quadratic (a ≠ 1)',
    keyRule: '\\text{Use AC method: find factors of } ac \\text{ that sum to } b'
  };
};

/**
 * Generate a random factorising question
 */
const generateRandom = (options = {}) => {
  const { seed = Date.now(), difficulty = 'medium', types = ['simple', 'difference', 'complex'] } = options;
  
  const type = _.sample(types);
  
  switch (type) {
    case 'simple':
      return generateSimpleQuadratic({ seed, difficulty });
    case 'difference':
      return generateDifferenceOfSquares({ seed, difficulty });
    case 'complex':
      return generateComplexQuadratic({ seed, difficulty });
    default:
      return generateSimpleQuadratic({ seed, difficulty });
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const factorisingQuadraticsGenerators = {
  generateSimpleQuadratic,
  generateDifferenceOfSquares,
  generateComplexQuadratic,
  generateRandom
};

export default factorisingQuadraticsGenerators;