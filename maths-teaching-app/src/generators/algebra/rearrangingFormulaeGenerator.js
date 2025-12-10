// src/generators/algebra/rearrangingFormulaeGenerator.js
// Generators for Rearranging Formulae
// Following Pattern 2: Returns config objects, not React components

import _ from 'lodash';

/**
 * TAB 1: Simple rearrangement (one step)
 * Example: Make x the subject of y = mx + c
 */
export const generateSimpleRearrangement = (options = {}) => {
  const { seed = Date.now() } = options;

  const problems = [
    {
      formula: 'y = mx + c',
      makeSubject: 'x',
      answer: 'x = \\frac{y - c}{m}',
      steps: [
        { explanation: 'Subtract c from both sides', formula: 'y - c = mx' },
        { explanation: 'Divide both sides by m', formula: 'x = \\frac{y - c}{m}' }
      ]
    },
    {
      formula: 'v = u + at',
      makeSubject: 't',
      answer: 't = \\frac{v - u}{a}',
      steps: [
        { explanation: 'Subtract u from both sides', formula: 'v - u = at' },
        { explanation: 'Divide both sides by a', formula: 't = \\frac{v - u}{a}' }
      ]
    },
    {
      formula: 'A = \\pi r^2',
      makeSubject: 'r',
      answer: 'r = \\sqrt{\\frac{A}{\\pi}}',
      steps: [
        { explanation: 'Divide both sides by π', formula: '\\frac{A}{\\pi} = r^2' },
        { explanation: 'Take the square root of both sides', formula: 'r = \\sqrt{\\frac{A}{\\pi}}' }
      ]
    },
    {
      formula: 'P = 2l + 2w',
      makeSubject: 'l',
      answer: 'l = \\frac{P - 2w}{2}',
      steps: [
        { explanation: 'Subtract 2w from both sides', formula: 'P - 2w = 2l' },
        { explanation: 'Divide both sides by 2', formula: 'l = \\frac{P - 2w}{2}' }
      ]
    },
    {
      formula: 'C = 2\\pi r',
      makeSubject: 'r',
      answer: 'r = \\frac{C}{2\\pi}',
      steps: [
        { explanation: 'Divide both sides by 2π', formula: 'r = \\frac{C}{2\\pi}' }
      ]
    }
  ];

  const selected = problems[seed % problems.length] || _.sample(problems);

  return {
    title: 'Simple Rearrangement',
    questionText: `Make $${selected.makeSubject}$ the subject of: $${selected.formula}$`,
    answer: selected.answer,
    solution: selected.steps,
    metadata: { type: 'simple' }
  };
};

/**
 * TAB 2: Rearrangement with squares and roots
 * Example: Make v the subject of E = ½mv²
 */
export const generateSquaresAndRoots = (options = {}) => {
  const { seed = Date.now() } = options;

  const problems = [
    {
      formula: 'E = \\frac{1}{2}mv^2',
      makeSubject: 'v',
      answer: 'v = \\sqrt{\\frac{2E}{m}}',
      steps: [
        { explanation: 'Multiply both sides by 2', formula: '2E = mv^2' },
        { explanation: 'Divide both sides by m', formula: '\\frac{2E}{m} = v^2' },
        { explanation: 'Take the square root', formula: 'v = \\sqrt{\\frac{2E}{m}}' }
      ]
    },
    {
      formula: 'c^2 = a^2 + b^2',
      makeSubject: 'a',
      answer: 'a = \\sqrt{c^2 - b^2}',
      steps: [
        { explanation: 'Subtract b² from both sides', formula: 'c^2 - b^2 = a^2' },
        { explanation: 'Take the square root', formula: 'a = \\sqrt{c^2 - b^2}' }
      ]
    },
    {
      formula: 'T = 2\\pi\\sqrt{\\frac{l}{g}}',
      makeSubject: 'l',
      answer: 'l = \\frac{gT^2}{4\\pi^2}',
      steps: [
        { explanation: 'Divide both sides by 2π', formula: '\\frac{T}{2\\pi} = \\sqrt{\\frac{l}{g}}' },
        { explanation: 'Square both sides', formula: '\\frac{T^2}{4\\pi^2} = \\frac{l}{g}' },
        { explanation: 'Multiply both sides by g', formula: 'l = \\frac{gT^2}{4\\pi^2}' }
      ]
    },
    {
      formula: 's = ut + \\frac{1}{2}at^2',
      makeSubject: 'a',
      answer: 'a = \\frac{2(s - ut)}{t^2}',
      steps: [
        { explanation: 'Subtract ut from both sides', formula: 's - ut = \\frac{1}{2}at^2' },
        { explanation: 'Multiply both sides by 2', formula: '2(s - ut) = at^2' },
        { explanation: 'Divide both sides by t²', formula: 'a = \\frac{2(s - ut)}{t^2}' }
      ]
    },
    {
      formula: 'v^2 = u^2 + 2as',
      makeSubject: 's',
      answer: 's = \\frac{v^2 - u^2}{2a}',
      steps: [
        { explanation: 'Subtract u² from both sides', formula: 'v^2 - u^2 = 2as' },
        { explanation: 'Divide both sides by 2a', formula: 's = \\frac{v^2 - u^2}{2a}' }
      ]
    }
  ];

  const selected = problems[seed % problems.length] || _.sample(problems);

  return {
    title: 'Squares and Roots',
    questionText: `Make $${selected.makeSubject}$ the subject of: $${selected.formula}$`,
    answer: selected.answer,
    solution: selected.steps,
    metadata: { type: 'squares-roots' }
  };
};

/**
 * TAB 3: Subject appears twice
 * Example: Make x the subject of y = (x + 1)/(x - 1)
 */
export const generateSubjectAppearsTwice = (options = {}) => {
  const { seed = Date.now() } = options;

  const problems = [
    {
      formula: 'y = \\frac{x + 1}{x - 1}',
      makeSubject: 'x',
      answer: 'x = \\frac{y + 1}{y - 1}',
      steps: [
        { explanation: 'Multiply both sides by (x - 1)', formula: 'y(x - 1) = x + 1' },
        { explanation: 'Expand the left side', formula: 'xy - y = x + 1' },
        { explanation: 'Collect x terms on one side', formula: 'xy - x = y + 1' },
        { explanation: 'Factorise x', formula: 'x(y - 1) = y + 1' },
        { explanation: 'Divide by (y - 1)', formula: 'x = \\frac{y + 1}{y - 1}' }
      ]
    },
    {
      formula: 'y = \\frac{3x + 2}{x - 4}',
      makeSubject: 'x',
      answer: 'x = \\frac{4y + 2}{y - 3}',
      steps: [
        { explanation: 'Multiply both sides by (x - 4)', formula: 'y(x - 4) = 3x + 2' },
        { explanation: 'Expand', formula: 'xy - 4y = 3x + 2' },
        { explanation: 'Collect x terms', formula: 'xy - 3x = 4y + 2' },
        { explanation: 'Factorise x', formula: 'x(y - 3) = 4y + 2' },
        { explanation: 'Divide', formula: 'x = \\frac{4y + 2}{y - 3}' }
      ]
    },
    {
      formula: 'a = \\frac{b + cx}{d - x}',
      makeSubject: 'x',
      answer: 'x = \\frac{ad - b}{a + c}',
      steps: [
        { explanation: 'Multiply both sides by (d - x)', formula: 'a(d - x) = b + cx' },
        { explanation: 'Expand', formula: 'ad - ax = b + cx' },
        { explanation: 'Collect x terms on one side', formula: 'ad - b = ax + cx' },
        { explanation: 'Factorise x on the right', formula: 'ad - b = x(a + c)' },
        { explanation: 'Divide by (a + c)', formula: 'x = \\frac{ad - b}{a + c}' }
      ]
    },
    {
      formula: 'y = \\frac{2x}{x + 3}',
      makeSubject: 'x',
      answer: 'x = \\frac{3y}{2 - y}',
      steps: [
        { explanation: 'Multiply both sides by (x + 3)', formula: 'y(x + 3) = 2x' },
        { explanation: 'Expand', formula: 'xy + 3y = 2x' },
        { explanation: 'Collect x terms', formula: '3y = 2x - xy' },
        { explanation: 'Factorise x', formula: '3y = x(2 - y)' },
        { explanation: 'Divide', formula: 'x = \\frac{3y}{2 - y}' }
      ]
    }
  ];

  const selected = problems[seed % problems.length] || _.sample(problems);

  return {
    title: 'Subject Appears Twice',
    questionText: `Make $${selected.makeSubject}$ the subject of: $${selected.formula}$`,
    answer: selected.answer,
    solution: selected.steps,
    metadata: { type: 'appears-twice' }
  };
};

// Export all generators
export const rearrangingFormulaeGenerators = {
  generateSimpleRearrangement,
  generateSquaresAndRoots,
  generateSubjectAppearsTwice
};

export default rearrangingFormulaeGenerators;