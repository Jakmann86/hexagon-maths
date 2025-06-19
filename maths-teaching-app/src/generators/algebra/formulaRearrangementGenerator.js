// src/generators/algebra/formulaRearrangementGenerator.js - Phase 3 New Generator
import _ from 'lodash';

/**
 * Generate simple formula rearrangement problems
 * Week 5 (Algebra V) - Rearranging Simple Equations
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateSimpleFormulaRearrangement = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Common simple formulas from mathematics and science
  const simpleFormulas = [
    {
      formula: 'A = lw',
      variables: { A: 'Area', l: 'length', w: 'width' },
      context: 'Rectangle area',
      rearrangements: {
        l: 'l = \\frac{A}{w}',
        w: 'w = \\frac{A}{l}'
      }
    },
    {
      formula: 'P = 2l + 2w',
      variables: { P: 'Perimeter', l: 'length', w: 'width' },
      context: 'Rectangle perimeter',
      rearrangements: {
        l: 'l = \\frac{P - 2w}{2}',
        w: 'w = \\frac{P - 2l}{2}'
      }
    },
    {
      formula: 'v = u + at',
      variables: { v: 'final velocity', u: 'initial velocity', a: 'acceleration', t: 'time' },
      context: 'Motion (SUVAT)',
      rearrangements: {
        u: 'u = v - at',
        a: 'a = \\frac{v - u}{t}',
        t: 't = \\frac{v - u}{a}'
      }
    },
    {
      formula: 'C = 2\\pi r',
      variables: { C: 'Circumference', r: 'radius' },
      context: 'Circle circumference',
      rearrangements: {
        r: 'r = \\frac{C}{2\\pi}'
      }
    },
    {
      formula: 'V = \\pi r^2 h',
      variables: { V: 'Volume', r: 'radius', h: 'height' },
      context: 'Cylinder volume',
      rearrangements: {
        r: 'r = \\sqrt{\\frac{V}{\\pi h}}',
        h: 'h = \\frac{V}{\\pi r^2}'
      }
    },
    {
      formula: 'F = ma',
      variables: { F: 'Force', m: 'mass', a: 'acceleration' },
      context: 'Force (Newton\'s 2nd law)',
      rearrangements: {
        m: 'm = \\frac{F}{a}',
        a: 'a = \\frac{F}{m}'
      }
    }
  ];

  // Select formula based on difficulty
  let selectedFormula;
  if (difficulty === 'easy') {
    selectedFormula = _.sample(simpleFormulas.filter(f => 
      f.formula === 'A = lw' || f.formula === 'C = 2\\pi r' || f.formula === 'F = ma'
    ));
  } else {
    selectedFormula = _.sample(simpleFormulas);
  }

  // Choose which variable to make the subject
  const availableVars = Object.keys(selectedFormula.rearrangements);
  const targetVariable = _.sample(availableVars);
  const correctRearrangement = selectedFormula.rearrangements[targetVariable];

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Rearrange ${selectedFormula.formula} to make ${targetVariable} the subject`,
      answer: `${selectedFormula.formula} \\Rightarrow ${correctRearrangement}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect rearrangements based on common mistakes
    const incorrectOptions = generateIncorrectRearrangements(
      selectedFormula.formula, 
      targetVariable, 
      correctRearrangement
    );

    return {
      questionDisplay: {
        text: `Rearrange to make ${targetVariable} the subject:`,
        math: selectedFormula.formula
      },
      correctAnswer: correctRearrangement,
      options: [correctRearrangement, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `To isolate ${targetVariable}, apply inverse operations step by step`
    };
  }

  else if (sectionType === 'examples') {
    const steps = generateRearrangementSteps(selectedFormula.formula, targetVariable, correctRearrangement);
    
    return {
      title: "Formula Rearrangement",
      questionText: `Rearrange ${selectedFormula.formula} to make ${targetVariable} the subject`,
      solution: steps
    };
  }

  return generateSimpleFormulaRearrangement({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate complex formula rearrangement problems
 * Week 5 (Algebra V) - More complex rearrangements
 * Includes nested operations, fractions, and powers
 */
export const generateComplexFormulaRearrangement = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  // More complex formulas requiring multiple steps
  const complexFormulas = [
    {
      formula: 's = ut + \\frac{1}{2}at^2',
      variables: { s: 'displacement', u: 'initial velocity', a: 'acceleration', t: 'time' },
      context: 'Motion (SUVAT)',
      rearrangements: {
        u: 'u = \\frac{s - \\frac{1}{2}at^2}{t}',
        a: 'a = \\frac{2(s - ut)}{t^2}',
        t: 't = \\frac{-u \\pm \\sqrt{u^2 + 2as}}{a}' // Quadratic solution
      }
    },
    {
      formula: 'A = \\pi(R^2 - r^2)',
      variables: { A: 'Area', R: 'outer radius', r: 'inner radius' },
      context: 'Annulus (ring) area',
      rearrangements: {
        R: 'R = \\sqrt{\\frac{A}{\\pi} + r^2}',
        r: 'r = \\sqrt{R^2 - \\frac{A}{\\pi}}'
      }
    },
    {
      formula: 'V = \\frac{4}{3}\\pi r^3',
      variables: { V: 'Volume', r: 'radius' },
      context: 'Sphere volume',
      rearrangements: {
        r: 'r = \\sqrt[3]{\\frac{3V}{4\\pi}}'
      }
    },
    {
      formula: 'E = \\frac{1}{2}mv^2',
      variables: { E: 'Kinetic energy', m: 'mass', v: 'velocity' },
      context: 'Kinetic energy',
      rearrangements: {
        m: 'm = \\frac{2E}{v^2}',
        v: 'v = \\sqrt{\\frac{2E}{m}}'
      }
    },
    {
      formula: '\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}',
      variables: { f: 'focal length', u: 'object distance', v: 'image distance' },
      context: 'Lens equation',
      rearrangements: {
        u: 'u = \\frac{fv}{v - f}',
        v: 'v = \\frac{fu}{u - f}'
      }
    }
  ];

  // Select formula based on difficulty
  let selectedFormula;
  if (difficulty === 'medium') {
    selectedFormula = _.sample(complexFormulas.filter(f => 
      !f.formula.includes('\\frac{1}{f}') // Avoid the most complex ones
    ));
  } else {
    selectedFormula = _.sample(complexFormulas);
  }

  const availableVars = Object.keys(selectedFormula.rearrangements);
  const targetVariable = _.sample(availableVars);
  const correctRearrangement = selectedFormula.rearrangements[targetVariable];

  if (sectionType === 'examples') {
    const steps = generateComplexRearrangementSteps(
      selectedFormula.formula, 
      targetVariable, 
      correctRearrangement
    );
    
    return {
      title: "Complex Formula Rearrangement",
      questionText: `Rearrange ${selectedFormula.formula} to make ${targetVariable} the subject`,
      solution: steps
    };
  }

  else if (sectionType === 'starter') {
    return {
      question: `Rearrange ${selectedFormula.formula} to make ${targetVariable} the subject`,
      answer: `${correctRearrangement}`,
      difficulty: 'algebra'
    };
  }

  return generateComplexFormulaRearrangement({ ...options, sectionType: 'examples' });
};

/**
 * Generate formula identification questions
 * Students identify which variable is the subject of a formula
 */
export const generateSubjectIdentification = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const formulas = [
    { formula: 'y = mx + c', subject: 'y', context: 'Linear equation' },
    { formula: 'A = \\pi r^2', subject: 'A', context: 'Circle area' },
    { formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', subject: 'x', context: 'Quadratic formula' },
    { formula: 'v^2 = u^2 + 2as', subject: 'v^2', context: 'Motion equation' },
    { formula: 'r = \\sqrt{\\frac{A}{\\pi}}', subject: 'r', context: 'Radius from area' }
  ];

  const selectedFormula = _.sample(formulas);
  const allVariables = extractVariables(selectedFormula.formula);
  
  if (sectionType === 'starter') {
    return {
      question: `What is the subject of the formula ${selectedFormula.formula}?`,
      answer: `The subject is ${selectedFormula.subject} because it appears alone on one side of the equation`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Create distractors from other variables in the formula
    const incorrectOptions = allVariables.filter(v => v !== selectedFormula.subject);
    
    // Ensure we have 4 options total
    while (incorrectOptions.length < 3) {
      const extraVars = ['x', 'y', 'z', 'a', 'b', 'c', 't', 'n'];
      const extraVar = _.sample(extraVars);
      if (!incorrectOptions.includes(extraVar) && extraVar !== selectedFormula.subject) {
        incorrectOptions.push(extraVar);
      }
    }

    return {
      questionDisplay: {
        text: 'What is the subject of this formula?',
        math: selectedFormula.formula
      },
      correctAnswer: selectedFormula.subject,
      options: [selectedFormula.subject, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `${selectedFormula.subject} is the subject because it appears alone on the left side`
    };
  }

  return generateSubjectIdentification({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate word problems requiring formula rearrangement
 * Real-world contexts where students need to rearrange then substitute
 */
export const generateFormulaWordProblem = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'starter'
  } = options;

  const problems = [
    {
      context: "A rectangle has an area of 48 cm² and a width of 6 cm.",
      question: "Find the length.",
      formula: "A = lw",
      given: { A: 48, w: 6 },
      target: 'l',
      answer: 8
    },
    {
      context: "A ball is thrown upward with an initial velocity of 20 m/s. After 3 seconds, its velocity is 50 m/s.",
      question: "Find the acceleration.",
      formula: "v = u + at",
      given: { v: 50, u: 20, t: 3 },
      target: 'a',
      answer: 10
    },
    {
      context: "A circle has a circumference of 31.4 cm.",
      question: "Find the radius. (Use π = 3.14)",
      formula: "C = 2\\pi r",
      given: { C: 31.4 },
      target: 'r',
      answer: 5
    },
    {
      context: "A cylinder has a volume of 785 cm³ and a radius of 5 cm.",
      question: "Find the height. (Use π = 3.14)",
      formula: "V = \\pi r^2 h",
      given: { V: 785, r: 5 },
      target: 'h',
      answer: 10
    }
  ];

  const problem = difficulty === 'easy' ? 
    _.sample(problems.filter(p => p.formula === 'A = lw' || p.formula === 'C = 2\\pi r')) :
    _.sample(problems);

  if (sectionType === 'starter') {
    const givenText = Object.entries(problem.given)
      .map(([key, value]) => `${key} = ${value}`)
      .join(', ');

    return {
      question: `${problem.context} ${problem.question}
                 Formula: ${problem.formula}
                 Given: ${givenText}`,
      answer: `Rearrange to make ${problem.target} the subject, then substitute values.
               Answer: ${problem.target} = ${problem.answer}`,
      difficulty: 'algebra'
    };
  }

  return generateFormulaWordProblem({ ...options, sectionType: 'starter' });
};

/**
 * Helper function to generate incorrect rearrangements based on common mistakes
 */
const generateIncorrectRearrangements = (originalFormula, targetVar, correctAnswer) => {
  const incorrectOptions = [];

  // Common mistakes:
  
  // 1. Wrong operation (multiply instead of divide, etc.)
  if (correctAnswer.includes('\\frac{')) {
    // If correct answer has a fraction, create version without division
    const withoutFraction = correctAnswer.replace(/\\frac{([^}]+)}{([^}]+)}/g, '$1 \\times $2');
    incorrectOptions.push(withoutFraction);
  }

  // 2. Incomplete rearrangement (forgetting to apply operation to all terms)
  if (originalFormula.includes('+') || originalFormula.includes('-')) {
    // Create version where only part of the expression is moved
    incorrectOptions.push(`${targetVar} = \\text{incomplete rearrangement}`);
  }

  // 3. Sign errors
  if (correctAnswer.includes('+')) {
    incorrectOptions.push(correctAnswer.replace('+', '-'));
  } else if (correctAnswer.includes('-')) {
    incorrectOptions.push(correctAnswer.replace('-', '+'));
  }

  // 4. Reciprocal errors
  if (correctAnswer.includes('\\frac{')) {
    const flipped = correctAnswer.replace(/\\frac{([^}]+)}{([^}]+)}/g, '\\frac{$2}{$1}');
    incorrectOptions.push(flipped);
  }

  // Fill with generic wrong answers if not enough specific ones
  while (incorrectOptions.length < 3) {
    incorrectOptions.push(`${targetVar} = \\text{wrong rearrangement}`);
  }

  return incorrectOptions.slice(0, 3);
};

/**
 * Helper function to generate step-by-step rearrangement solutions
 */
const generateRearrangementSteps = (formula, targetVar, correctAnswer) => {
  return [
    {
      explanation: "Start with the original formula",
      formula: formula
    },
    {
      explanation: `Apply inverse operations to isolate ${targetVar}`,
      formula: "\\text{Use inverse operations step by step}"
    },
    {
      explanation: `${targetVar} is now the subject`,
      formula: correctAnswer
    }
  ];
};

/**
 * Helper function for complex rearrangement steps
 */
const generateComplexRearrangementSteps = (formula, targetVar, correctAnswer) => {
  return [
    {
      explanation: "Start with the original formula",
      formula: formula
    },
    {
      explanation: "Apply inverse operations carefully, handling fractions and powers",
      formula: "\\text{Step-by-step algebraic manipulation}"
    },
    {
      explanation: "Isolate the required variable",
      formula: "\\text{Apply square roots, reciprocals as needed}"
    },
    {
      explanation: `Final rearranged formula with ${targetVar} as subject`,
      formula: correctAnswer
    }
  ];
};

/**
 * Helper function to extract variables from a formula string
 */
const extractVariables = (formula) => {
  // Simple regex to find single letter variables
  const matches = formula.match(/[a-zA-Z]/g);
  if (!matches) return [];
  
  // Remove duplicates and common function names
  const variables = [...new Set(matches)].filter(v => 
    !['sin', 'cos', 'tan', 'log', 'ln', 'pi'].includes(v)
  );
  
  return variables;
};

// Export all formula rearrangement generators
export const formulaRearrangementGenerators = {
  generateSimpleFormulaRearrangement,
  generateComplexFormulaRearrangement,
  generateSubjectIdentification,
  generateFormulaWordProblem
};

export default formulaRearrangementGenerators;