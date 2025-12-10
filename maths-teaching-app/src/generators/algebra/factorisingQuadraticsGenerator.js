// src/generators/algebra/factorisingQuadraticsGenerator.js
// Generators for Factorising Quadratic Expressions
// Following Pattern 2: Returns config objects, not React components

import _ from 'lodash';

/**
 * TAB 1: Simple quadratics (coefficient of x² = 1)
 * x² + 5x + 6 = (x + 2)(x + 3)
 */
export const generateSimpleQuadratic = (options = {}) => {
  const { seed = Date.now() } = options;

  // Generate two numbers that multiply to give c and add to give b
  const factorPairs = [
    { p: 1, q: 2, sum: 3, product: 2 },
    { p: 1, q: 3, sum: 4, product: 3 },
    { p: 1, q: 4, sum: 5, product: 4 },
    { p: 1, q: 5, sum: 6, product: 5 },
    { p: 1, q: 6, sum: 7, product: 6 },
    { p: 2, q: 3, sum: 5, product: 6 },
    { p: 2, q: 4, sum: 6, product: 8 },
    { p: 2, q: 5, sum: 7, product: 10 },
    { p: 2, q: 6, sum: 8, product: 12 },
    { p: 3, q: 4, sum: 7, product: 12 },
    { p: 3, q: 5, sum: 8, product: 15 },
    { p: 3, q: 6, sum: 9, product: 18 },
    { p: 4, q: 5, sum: 9, product: 20 },
    // Negative options
    { p: -1, q: -2, sum: -3, product: 2 },
    { p: -1, q: -3, sum: -4, product: 3 },
    { p: -2, q: -3, sum: -5, product: 6 },
    { p: -2, q: -4, sum: -6, product: 8 },
    // Mixed signs
    { p: -1, q: 4, sum: 3, product: -4 },
    { p: -2, q: 5, sum: 3, product: -10 },
    { p: -1, q: 6, sum: 5, product: -6 },
    { p: -3, q: 5, sum: 2, product: -15 },
    { p: -2, q: 7, sum: 5, product: -14 }
  ];

  const selected = factorPairs[seed % factorPairs.length] || _.sample(factorPairs);
  const { p, q, sum, product } = selected;

  // Build expression string
  const bTerm = sum === 0 ? '' : (sum > 0 ? ` + ${sum}x` : ` - ${Math.abs(sum)}x`);
  const cTerm = product === 0 ? '' : (product > 0 ? ` + ${product}` : ` - ${Math.abs(product)}`);
  const expression = `x^2${bTerm}${cTerm}`;

  // Build factored form
  const factor1 = p >= 0 ? `(x + ${p})` : `(x - ${Math.abs(p)})`;
  const factor2 = q >= 0 ? `(x + ${q})` : `(x - ${Math.abs(q)})`;
  const factored = `${factor1}${factor2}`;

  return {
    title: 'Simple Quadratic',
    questionText: `Factorise: $${expression}$`,
    answer: factored,
    solution: [
      {
        explanation: 'Find two numbers that multiply to give the constant term and add to give the coefficient of x',
        formula: `\\text{Need: } ? \\times ? = ${product} \\text{ and } ? + ? = ${sum}`
      },
      {
        explanation: `The numbers are ${p} and ${q}`,
        formula: `${p} \\times ${q} = ${product} \\text{ and } ${p} + ${q} = ${sum}`
      },
      {
        explanation: 'Write in factored form',
        formula: `${expression} = ${factored}`
      }
    ],
    metadata: { type: 'simple', p, q }
  };
};

/**
 * TAB 2: Difference of two squares
 * x² - 9 = (x + 3)(x - 3)
 */
export const generateDifferenceOfSquares = (options = {}) => {
  const { seed = Date.now() } = options;

  const squares = [
    { n: 2, nSquared: 4 },
    { n: 3, nSquared: 9 },
    { n: 4, nSquared: 16 },
    { n: 5, nSquared: 25 },
    { n: 6, nSquared: 36 },
    { n: 7, nSquared: 49 },
    { n: 8, nSquared: 64 },
    { n: 9, nSquared: 81 },
    { n: 10, nSquared: 100 }
  ];

  const selected = squares[seed % squares.length] || _.sample(squares);
  const { n, nSquared } = selected;

  // Sometimes use a coefficient
  const useCoefficient = (seed % 3 === 0);
  
  if (useCoefficient) {
    // 4x² - 9 = (2x + 3)(2x - 3)
    const coeffSquares = [
      { coeff: 2, coeffSq: 4, n: 3, nSq: 9 },
      { coeff: 2, coeffSq: 4, n: 5, nSq: 25 },
      { coeff: 3, coeffSq: 9, n: 2, nSq: 4 },
      { coeff: 3, coeffSq: 9, n: 4, nSq: 16 },
      { coeff: 5, coeffSq: 25, n: 2, nSq: 4 }
    ];
    const sel = coeffSquares[seed % coeffSquares.length] || _.sample(coeffSquares);
    
    return {
      title: 'Difference of Two Squares',
      questionText: `Factorise: $${sel.coeffSq}x^2 - ${sel.nSq}$`,
      answer: `(${sel.coeff}x + ${sel.n})(${sel.coeff}x - ${sel.n})`,
      solution: [
        {
          explanation: 'Recognise this as a difference of two squares: a² - b²',
          formula: `${sel.coeffSq}x^2 - ${sel.nSq} = (${sel.coeff}x)^2 - ${sel.n}^2`
        },
        {
          explanation: 'Apply the formula: a² - b² = (a + b)(a - b)',
          formula: `= (${sel.coeff}x + ${sel.n})(${sel.coeff}x - ${sel.n})`
        }
      ],
      metadata: { type: 'difference-of-squares-coeff' }
    };
  }

  return {
    title: 'Difference of Two Squares',
    questionText: `Factorise: $x^2 - ${nSquared}$`,
    answer: `(x + ${n})(x - ${n})`,
    solution: [
      {
        explanation: 'Recognise this as a difference of two squares: a² - b²',
        formula: `x^2 - ${nSquared} = x^2 - ${n}^2`
      },
      {
        explanation: 'Apply the formula: a² - b² = (a + b)(a - b)',
        formula: `= (x + ${n})(x - ${n})`
      }
    ],
    metadata: { type: 'difference-of-squares', n }
  };
};

/**
 * TAB 3: Quadratics with coefficient ≠ 1
 * 2x² + 7x + 3 = (2x + 1)(x + 3)
 */
export const generateComplexQuadratic = (options = {}) => {
  const { seed = Date.now() } = options;

  // Pre-computed factorisable quadratics with a ≠ 1
  const complexQuadratics = [
    { a: 2, b: 5, c: 2, factors: '(2x + 1)(x + 2)' },
    { a: 2, b: 7, c: 3, factors: '(2x + 1)(x + 3)' },
    { a: 2, b: 5, c: 3, factors: '(2x + 3)(x + 1)' },
    { a: 2, b: 9, c: 4, factors: '(2x + 1)(x + 4)' },
    { a: 3, b: 7, c: 2, factors: '(3x + 1)(x + 2)' },
    { a: 3, b: 10, c: 3, factors: '(3x + 1)(x + 3)' },
    { a: 3, b: 8, c: 4, factors: '(3x + 2)(x + 2)' },
    { a: 2, b: 1, c: -3, factors: '(2x + 3)(x - 1)' },
    { a: 2, b: -1, c: -3, factors: '(2x - 3)(x + 1)' },
    { a: 3, b: 5, c: -2, factors: '(3x - 1)(x + 2)' },
    { a: 2, b: -5, c: 3, factors: '(2x - 3)(x - 1)' },
    { a: 3, b: -10, c: 3, factors: '(3x - 1)(x - 3)' },
    { a: 5, b: 7, c: 2, factors: '(5x + 2)(x + 1)' },
    { a: 5, b: 11, c: 2, factors: '(5x + 1)(x + 2)' }
  ];

  const selected = complexQuadratics[seed % complexQuadratics.length] || _.sample(complexQuadratics);
  const { a, b, c, factors } = selected;

  // Build expression
  const bTerm = b === 0 ? '' : (b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`);
  const cTerm = c === 0 ? '' : (c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`);
  const expression = `${a}x^2${bTerm}${cTerm}`;

  // Calculate ac for the method
  const ac = a * c;

  return {
    title: 'Quadratic (a ≠ 1)',
    questionText: `Factorise: $${expression}$`,
    answer: factors,
    solution: [
      {
        explanation: `Multiply a × c = ${a} × ${c} = ${ac}`,
        formula: `\\text{Find two numbers that multiply to } ${ac} \\text{ and add to } ${b}`
      },
      {
        explanation: 'Split the middle term and factorise by grouping',
        formula: `${expression}`
      },
      {
        explanation: 'Write the final factored form',
        formula: `= ${factors}`
      }
    ],
    metadata: { type: 'complex', a, b, c }
  };
};

/**
 * Generate all examples for the Examples Section (3 tabs)
 */
export const generateFactorisingExamples = (options = {}) => {
  const { seed = Date.now() } = options;
  
  return [
    generateSimpleQuadratic({ seed }),
    generateDifferenceOfSquares({ seed: seed + 1000 }),
    generateComplexQuadratic({ seed: seed + 2000 })
  ];
};

// Export all generators
export const factorisingQuadraticsGenerators = {
  generateSimpleQuadratic,
  generateDifferenceOfSquares,
  generateComplexQuadratic,
  generateFactorisingExamples
};

export default factorisingQuadraticsGenerators;