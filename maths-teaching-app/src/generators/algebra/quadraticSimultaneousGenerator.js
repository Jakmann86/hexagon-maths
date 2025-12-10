// src/generators/algebra/quadraticSimultaneousGenerator.js
// Generators for Quadratic Simultaneous Equations
// Following Pattern 2: Returns config objects, not React components

import _ from 'lodash';

/**
 * TAB 1: Linear + Circle (x² + y² = r²)
 * Example: y = x + 1 and x² + y² = 5
 */
export const generateLinearCircle = (options = {}) => {
  const { seed = Date.now() } = options;

  const problems = [
    {
      linear: 'y = x + 1',
      quadratic: 'x^2 + y^2 = 5',
      solutions: '(1, 2) \\text{ and } (-2, -1)',
      steps: [
        { explanation: 'Substitute y = x + 1 into the circle equation', formula: 'x^2 + (x + 1)^2 = 5' },
        { explanation: 'Expand the bracket', formula: 'x^2 + x^2 + 2x + 1 = 5' },
        { explanation: 'Simplify', formula: '2x^2 + 2x - 4 = 0' },
        { explanation: 'Divide by 2', formula: 'x^2 + x - 2 = 0' },
        { explanation: 'Factorise', formula: '(x + 2)(x - 1) = 0' },
        { explanation: 'Solve for x', formula: 'x = -2 \\text{ or } x = 1' },
        { explanation: 'Find corresponding y values using y = x + 1', formula: 'x = 1: y = 2, \\quad x = -2: y = -1' }
      ]
    },
    {
      linear: 'y = x - 1',
      quadratic: 'x^2 + y^2 = 13',
      solutions: '(3, 2) \\text{ and } (-2, -3)',
      steps: [
        { explanation: 'Substitute y = x - 1 into the circle equation', formula: 'x^2 + (x - 1)^2 = 13' },
        { explanation: 'Expand', formula: 'x^2 + x^2 - 2x + 1 = 13' },
        { explanation: 'Simplify', formula: '2x^2 - 2x - 12 = 0' },
        { explanation: 'Divide by 2', formula: 'x^2 - x - 6 = 0' },
        { explanation: 'Factorise', formula: '(x - 3)(x + 2) = 0' },
        { explanation: 'Solve', formula: 'x = 3 \\text{ or } x = -2' },
        { explanation: 'Find y values', formula: 'x = 3: y = 2, \\quad x = -2: y = -3' }
      ]
    },
    {
      linear: 'y = 2x',
      quadratic: 'x^2 + y^2 = 20',
      solutions: '(2, 4) \\text{ and } (-2, -4)',
      steps: [
        { explanation: 'Substitute y = 2x into the circle equation', formula: 'x^2 + (2x)^2 = 20' },
        { explanation: 'Expand', formula: 'x^2 + 4x^2 = 20' },
        { explanation: 'Simplify', formula: '5x^2 = 20' },
        { explanation: 'Solve for x²', formula: 'x^2 = 4' },
        { explanation: 'Take square root', formula: 'x = \\pm 2' },
        { explanation: 'Find y values using y = 2x', formula: 'x = 2: y = 4, \\quad x = -2: y = -4' }
      ]
    }
  ];

  const selected = problems[seed % problems.length] || _.sample(problems);

  return {
    title: 'Linear + Circle',
    questionText: `Solve simultaneously: $${selected.linear}$ and $${selected.quadratic}$`,
    answer: selected.solutions,
    solution: selected.steps,
    metadata: { type: 'linear-circle' }
  };
};

/**
 * TAB 2: Linear + Parabola (y = x²)
 * Example: y = x + 2 and y = x²
 */
export const generateLinearParabola = (options = {}) => {
  const { seed = Date.now() } = options;

  const problems = [
    {
      linear: 'y = x + 2',
      quadratic: 'y = x^2',
      solutions: '(2, 4) \\text{ and } (-1, 1)',
      steps: [
        { explanation: 'Set the equations equal (both equal y)', formula: 'x + 2 = x^2' },
        { explanation: 'Rearrange to standard form', formula: 'x^2 - x - 2 = 0' },
        { explanation: 'Factorise', formula: '(x - 2)(x + 1) = 0' },
        { explanation: 'Solve for x', formula: 'x = 2 \\text{ or } x = -1' },
        { explanation: 'Find y values using y = x²', formula: 'x = 2: y = 4, \\quad x = -1: y = 1' }
      ]
    },
    {
      linear: 'y = 2x + 3',
      quadratic: 'y = x^2',
      solutions: '(3, 9) \\text{ and } (-1, 1)',
      steps: [
        { explanation: 'Set the equations equal', formula: '2x + 3 = x^2' },
        { explanation: 'Rearrange', formula: 'x^2 - 2x - 3 = 0' },
        { explanation: 'Factorise', formula: '(x - 3)(x + 1) = 0' },
        { explanation: 'Solve', formula: 'x = 3 \\text{ or } x = -1' },
        { explanation: 'Find y values', formula: 'x = 3: y = 9, \\quad x = -1: y = 1' }
      ]
    },
    {
      linear: 'y = 3x - 2',
      quadratic: 'y = x^2',
      solutions: '(2, 4) \\text{ and } (1, 1)',
      steps: [
        { explanation: 'Set the equations equal', formula: '3x - 2 = x^2' },
        { explanation: 'Rearrange', formula: 'x^2 - 3x + 2 = 0' },
        { explanation: 'Factorise', formula: '(x - 2)(x - 1) = 0' },
        { explanation: 'Solve', formula: 'x = 2 \\text{ or } x = 1' },
        { explanation: 'Find y values', formula: 'x = 2: y = 4, \\quad x = 1: y = 1' }
      ]
    }
  ];

  const selected = problems[seed % problems.length] || _.sample(problems);

  return {
    title: 'Linear + Parabola',
    questionText: `Solve simultaneously: $${selected.linear}$ and $${selected.quadratic}$`,
    answer: selected.solutions,
    solution: selected.steps,
    metadata: { type: 'linear-parabola' }
  };
};

/**
 * TAB 3: Two equations requiring rearrangement
 * Example: x + y = 5 and xy = 6
 */
export const generateProductSum = (options = {}) => {
  const { seed = Date.now() } = options;

  const problems = [
    {
      eq1: 'x + y = 5',
      eq2: 'xy = 6',
      solutions: '(2, 3) \\text{ and } (3, 2)',
      steps: [
        { explanation: 'From equation 1, express y in terms of x', formula: 'y = 5 - x' },
        { explanation: 'Substitute into equation 2', formula: 'x(5 - x) = 6' },
        { explanation: 'Expand', formula: '5x - x^2 = 6' },
        { explanation: 'Rearrange', formula: 'x^2 - 5x + 6 = 0' },
        { explanation: 'Factorise', formula: '(x - 2)(x - 3) = 0' },
        { explanation: 'Solve', formula: 'x = 2 \\text{ or } x = 3' },
        { explanation: 'Find y values', formula: 'x = 2: y = 3, \\quad x = 3: y = 2' }
      ]
    },
    {
      eq1: 'x + y = 7',
      eq2: 'xy = 12',
      solutions: '(3, 4) \\text{ and } (4, 3)',
      steps: [
        { explanation: 'From equation 1, express y in terms of x', formula: 'y = 7 - x' },
        { explanation: 'Substitute into equation 2', formula: 'x(7 - x) = 12' },
        { explanation: 'Expand', formula: '7x - x^2 = 12' },
        { explanation: 'Rearrange', formula: 'x^2 - 7x + 12 = 0' },
        { explanation: 'Factorise', formula: '(x - 3)(x - 4) = 0' },
        { explanation: 'Solve', formula: 'x = 3 \\text{ or } x = 4' },
        { explanation: 'Find y values', formula: 'x = 3: y = 4, \\quad x = 4: y = 3' }
      ]
    },
    {
      eq1: 'x + y = 8',
      eq2: 'x^2 + y^2 = 34',
      solutions: '(3, 5) \\text{ and } (5, 3)',
      steps: [
        { explanation: 'From equation 1, express y in terms of x', formula: 'y = 8 - x' },
        { explanation: 'Substitute into equation 2', formula: 'x^2 + (8 - x)^2 = 34' },
        { explanation: 'Expand', formula: 'x^2 + 64 - 16x + x^2 = 34' },
        { explanation: 'Simplify', formula: '2x^2 - 16x + 30 = 0' },
        { explanation: 'Divide by 2', formula: 'x^2 - 8x + 15 = 0' },
        { explanation: 'Factorise', formula: '(x - 3)(x - 5) = 0' },
        { explanation: 'Solve and find y', formula: 'x = 3: y = 5, \\quad x = 5: y = 3' }
      ]
    }
  ];

  const selected = problems[seed % problems.length] || _.sample(problems);

  return {
    title: 'Product and Sum',
    questionText: `Solve simultaneously: $${selected.eq1}$ and $${selected.eq2}$`,
    answer: selected.solutions,
    solution: selected.steps,
    metadata: { type: 'product-sum' }
  };
};

// Export all generators
export const quadraticSimultaneousGenerators = {
  generateLinearCircle,
  generateLinearParabola,
  generateProductSum
};

export default quadraticSimultaneousGenerators;