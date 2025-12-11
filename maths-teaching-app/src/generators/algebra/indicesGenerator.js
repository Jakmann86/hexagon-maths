// src/generators/algebra/indicesGenerator.js
// Indices (Negative & Fractional Powers) Question Generator
// Following Generator Output Specification v2.0
//
// Question Types:
// 1. Numeric negative powers: 5^{-2}, 3^{-3}
// 2. Numeric fractional powers: 27^{2/3}, 16^{-3/4}
// 3. Algebraic negative powers: x^{-4}, (3x^2)^{-2}
// 4. Algebraic fractional powers: (8x^3)^{1/3}, (16x^4)^{-1/2}
// 5. Complex mixed: fractions with both negative and fractional powers

import _ from 'lodash';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Perfect powers for clean roots
 */
const PERFECT_SQUARES = [4, 9, 16, 25, 36, 49, 64, 81, 100];
const PERFECT_CUBES = [8, 27, 64, 125];
const PERFECT_FOURTH = [16, 81, 256];
const PERFECT_FIFTH = [32, 243];

/**
 * Get nth root of a number (returns integer or null if not perfect)
 */
const getNthRoot = (num, n) => {
  const root = Math.round(Math.pow(num, 1/n));
  return Math.pow(root, n) === num ? root : null;
};

/**
 * Format a fraction in LaTeX
 */
const formatFraction = (num, den) => {
  if (den === 1) return `${num}`;
  return `\\frac{${num}}{${den}}`;
};

/**
 * Generate unique incorrect options for diagnostic
 */
const generateIncorrectOptions = (correct, type, values) => {
  const incorrect = new Set();
  
  // Add common mistakes based on question type
  if (type === 'negative-numeric') {
    const { base, power, result } = values;
    incorrect.add(`-${result}`);  // Forgot it's positive
    incorrect.add(`${result}`);   // Forgot the fraction
    incorrect.add(`${base * power}`); // Multiplied instead
    incorrect.add(`-\\frac{1}{${result}}`); // Added negative
  } else if (type === 'fractional-numeric') {
    const { base, result } = values;
    incorrect.add(`${base}`);
    incorrect.add(`${result * 2}`);
    incorrect.add(`${Math.floor(result / 2)}`);
  }
  
  // Remove correct answer and return array
  incorrect.delete(correct);
  return [...incorrect].slice(0, 3);
};

// ============================================================
// GENERATORS: NUMERIC NEGATIVE POWERS
// ============================================================

/**
 * Generate numeric negative power: a^{-n} = 1/a^n
 * e.g., 5^{-2} = 1/25
 */
const generateNumericNegativePower = (options = {}) => {
  const { difficulty = 'medium' } = options;
  
  // Select base and power based on difficulty
  let base, power;
  if (difficulty === 'easy') {
    base = _.sample([2, 3, 4, 5]);
    power = 2;
  } else if (difficulty === 'hard') {
    base = _.sample([2, 3, 4, 5, 6, 7]);
    power = _.random(3, 4);
  } else {
    base = _.sample([2, 3, 4, 5, 6]);
    power = _.random(2, 3);
  }
  
  const result = Math.pow(base, power);
  const answer = formatFraction(1, result);
  
  return {
    instruction: 'Simplify',
    questionMath: `${base}^{-${power}}`,
    answer,
    
    workingOut: `${base}^{-${power}} = \\frac{1}{${base}^${power}} = \\frac{1}{${result}}`,
    
    solution: [
      {
        explanation: 'Apply negative power rule: a^{-n} = \\frac{1}{a^n}',
        formula: `${base}^{-${power}} = \\frac{1}{${base}^{${power}}}`
      },
      {
        explanation: `Calculate ${base}^{${power}}`,
        formula: `${base}^{${power}} = ${result}`
      },
      {
        explanation: 'Write final answer',
        formula: answer
      }
    ],
    
    metadata: {
      type: 'negative-power',
      subType: 'numeric',
      difficulty,
      topic: 'indices',
      tags: ['algebra', 'gcse', 'higher']
    },
    
    title: 'Negative Power (Numeric)',
    keyRule: 'a^{-n} = \\frac{1}{a^n}',
    
    // For diagnostic section
    diagnosticOptions: {
      correctAnswer: answer,
      incorrectOptions: generateIncorrectOptions(answer, 'negative-numeric', { base, power, result })
    }
  };
};

// ============================================================
// GENERATORS: NUMERIC FRACTIONAL POWERS
// ============================================================

/**
 * Generate numeric fractional power: a^{m/n}
 * e.g., 27^{2/3} = 9, 16^{-3/4} = 1/8
 */
const generateNumericFractionalPower = (options = {}) => {
  const { difficulty = 'medium', includeNegative = null } = options;
  
  // Decide if negative fractional power
  const isNegative = includeNegative !== null 
    ? includeNegative 
    : (difficulty === 'hard' || (difficulty === 'medium' && Math.random() > 0.5));
  
  let base, rootIndex, powerNum, root, result;
  
  if (difficulty === 'easy') {
    // Square roots only: 16^{1/2} = 4
    base = _.sample(PERFECT_SQUARES);
    rootIndex = 2;
    powerNum = 1;
    root = Math.sqrt(base);
    result = root;
  } else if (difficulty === 'hard') {
    // Higher roots with powers: 32^{2/5} = 4
    if (Math.random() > 0.5) {
      base = _.sample(PERFECT_CUBES);
      rootIndex = 3;
      powerNum = 2;
      root = getNthRoot(base, 3);
    } else {
      base = _.sample(PERFECT_FOURTH);
      rootIndex = 4;
      powerNum = 3;
      root = getNthRoot(base, 4);
    }
    result = Math.pow(root, powerNum);
  } else {
    // Cube roots: 27^{2/3} = 9
    base = _.sample(PERFECT_CUBES);
    rootIndex = 3;
    powerNum = _.sample([1, 2]);
    root = getNthRoot(base, 3);
    result = Math.pow(root, powerNum);
  }
  
  // Build question and answer
  const fractionPower = powerNum === 1 
    ? `\\frac{1}{${rootIndex}}`
    : `\\frac{${powerNum}}{${rootIndex}}`;
  
  let questionMath, answer, workingOut;
  
  if (isNegative) {
    questionMath = `${base}^{-${fractionPower}}`;
    answer = formatFraction(1, result);
    workingOut = `${base}^{-${fractionPower}} = \\frac{1}{${base}^{${fractionPower}}} = \\frac{1}{(\\sqrt[${rootIndex}]{${base}})^{${powerNum}}} = \\frac{1}{${root}^{${powerNum}}} = \\frac{1}{${result}}`;
  } else {
    questionMath = `${base}^{${fractionPower}}`;
    answer = `${result}`;
    workingOut = `${base}^{${fractionPower}} = (\\sqrt[${rootIndex}]{${base}})^{${powerNum}} = ${root}^{${powerNum}} = ${result}`;
  }
  
  return {
    instruction: 'Evaluate',
    questionMath,
    answer,
    
    workingOut,
    
    solution: [
      {
        explanation: isNegative 
          ? 'Apply negative power rule first' 
          : 'Convert fractional power to root form',
        formula: isNegative
          ? `${base}^{-${fractionPower}} = \\frac{1}{${base}^{${fractionPower}}}`
          : `${base}^{${fractionPower}} = (\\sqrt[${rootIndex}]{${base}})^{${powerNum}}`
      },
      {
        explanation: `Find the ${rootIndex === 2 ? 'square' : rootIndex === 3 ? 'cube' : `${rootIndex}th`} root of ${base}`,
        formula: `\\sqrt[${rootIndex}]{${base}} = ${root}`
      },
      {
        explanation: powerNum > 1 ? `Raise to power ${powerNum}` : 'Write final answer',
        formula: powerNum > 1 ? `${root}^{${powerNum}} = ${result}` : `= ${result}`
      },
      ...(isNegative ? [{
        explanation: 'Apply the negative power',
        formula: `= \\frac{1}{${result}}`
      }] : [])
    ],
    
    metadata: {
      type: 'fractional-power',
      subType: isNegative ? 'negative-fractional-numeric' : 'fractional-numeric',
      difficulty,
      topic: 'indices',
      tags: ['algebra', 'gcse', 'higher']
    },
    
    title: isNegative ? 'Negative Fractional Power' : 'Fractional Power',
    keyRule: 'a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m = \\sqrt[n]{a^m}'
  };
};

// ============================================================
// GENERATORS: ALGEBRAIC NEGATIVE POWERS
// ============================================================

/**
 * Generate algebraic negative power: x^{-n} or (ax^m)^{-n}
 * e.g., x^{-4} = 1/x^4, (3x^2)^{-2} = 1/(9x^4)
 */
const generateAlgebraicNegativePower = (options = {}) => {
  const { difficulty = 'medium' } = options;
  
  const variable = _.sample(['x', 'a', 'y', 'm', 'n']);
  
  if (difficulty === 'easy') {
    // Simple: x^{-n}
    const power = _.random(2, 5);
    
    return {
      instruction: 'Simplify',
      questionMath: `${variable}^{-${power}}`,
      answer: `\\frac{1}{${variable}^{${power}}}`,
      
      workingOut: `${variable}^{-${power}} = \\frac{1}{${variable}^{${power}}}`,
      
      solution: [
        {
          explanation: 'Apply negative power rule',
          formula: `${variable}^{-${power}} = \\frac{1}{${variable}^{${power}}}`
        }
      ],
      
      metadata: {
        type: 'negative-power',
        subType: 'algebraic-simple',
        difficulty,
        topic: 'indices',
        tags: ['algebra', 'gcse', 'higher']
      },
      
      title: 'Algebraic Negative Power',
      keyRule: 'a^{-n} = \\frac{1}{a^n}'
    };
  }
  
  // Medium/Hard: (ax^m)^{-n}
  const coeff = _.sample([2, 3, 4, 5]);
  const innerPower = _.random(2, 4);
  const outerPower = difficulty === 'hard' ? _.random(2, 3) : 2;
  
  const resultCoeff = Math.pow(coeff, outerPower);
  const resultPower = innerPower * outerPower;
  
  return {
    instruction: 'Simplify',
    questionMath: `(${coeff}${variable}^{${innerPower}})^{-${outerPower}}`,
    answer: `\\frac{1}{${resultCoeff}${variable}^{${resultPower}}}`,
    
    workingOut: `(${coeff}${variable}^{${innerPower}})^{-${outerPower}} = \\frac{1}{(${coeff}${variable}^{${innerPower}})^{${outerPower}}} = \\frac{1}{${coeff}^{${outerPower}} \\cdot ${variable}^{${innerPower} \\times ${outerPower}}} = \\frac{1}{${resultCoeff}${variable}^{${resultPower}}}`,
    
    solution: [
      {
        explanation: 'Apply negative power rule',
        formula: `(${coeff}${variable}^{${innerPower}})^{-${outerPower}} = \\frac{1}{(${coeff}${variable}^{${innerPower}})^{${outerPower}}}`
      },
      {
        explanation: 'Apply power to coefficient and variable separately',
        formula: `= \\frac{1}{${coeff}^{${outerPower}} \\cdot (${variable}^{${innerPower}})^{${outerPower}}}`
      },
      {
        explanation: 'Simplify using power rules',
        formula: `= \\frac{1}{${resultCoeff} \\cdot ${variable}^{${resultPower}}}`
      },
      {
        explanation: 'Write final answer',
        formula: `= \\frac{1}{${resultCoeff}${variable}^{${resultPower}}}`
      }
    ],
    
    metadata: {
      type: 'negative-power',
      subType: 'algebraic-bracket',
      difficulty,
      topic: 'indices',
      tags: ['algebra', 'gcse', 'higher']
    },
    
    title: 'Bracket with Negative Power',
    keyRule: '(ab)^{-n} = \\frac{1}{a^n b^n}'
  };
};

// ============================================================
// GENERATORS: ALGEBRAIC FRACTIONAL POWERS
// ============================================================

/**
 * Generate algebraic fractional power: (ax^m)^{p/q}
 * e.g., (27x^6)^{2/3} = 9x^4, (16x^4)^{-1/2} = 1/(4x^2)
 */
const generateAlgebraicFractionalPower = (options = {}) => {
  const { difficulty = 'medium', includeNegative = null } = options;
  
  const variable = _.sample(['x', 'a', 'y']);
  const isNegative = includeNegative !== null 
    ? includeNegative 
    : (difficulty === 'hard' || (difficulty === 'medium' && Math.random() > 0.6));
  
  let base, rootIndex, powerNum, root, innerPower;
  
  if (difficulty === 'easy') {
    // Square root: (16x^4)^{1/2} = 4x^2
    base = _.sample([4, 9, 16, 25]);
    rootIndex = 2;
    powerNum = 1;
    root = Math.sqrt(base);
    innerPower = _.sample([2, 4, 6]);
  } else {
    // Cube root: (27x^6)^{2/3} = 9x^4
    base = _.sample(PERFECT_CUBES.slice(0, 3)); // 8, 27, 64
    rootIndex = 3;
    powerNum = difficulty === 'hard' ? 2 : _.sample([1, 2]);
    root = getNthRoot(base, 3);
    innerPower = _.sample([3, 6, 9]);
  }
  
  const resultCoeff = Math.pow(root, powerNum);
  const resultPower = (innerPower * powerNum) / rootIndex;
  
  const fractionPower = powerNum === 1 
    ? `\\frac{1}{${rootIndex}}`
    : `\\frac{${powerNum}}{${rootIndex}}`;
  
  let questionMath, answer, workingOut;
  
  if (isNegative) {
    questionMath = `(${base}${variable}^{${innerPower}})^{-${fractionPower}}`;
    answer = `\\frac{1}{${resultCoeff}${variable}^{${resultPower}}}`;
    workingOut = `(${base}${variable}^{${innerPower}})^{-${fractionPower}} = \\frac{1}{(${base}${variable}^{${innerPower}})^{${fractionPower}}} = \\frac{1}{${resultCoeff}${variable}^{${resultPower}}}`;
  } else {
    questionMath = `(${base}${variable}^{${innerPower}})^{${fractionPower}}`;
    answer = `${resultCoeff}${variable}^{${resultPower}}`;
    workingOut = `(${base}${variable}^{${innerPower}})^{${fractionPower}} = ${root}^{${powerNum}} \\cdot ${variable}^{${innerPower} \\times ${fractionPower}} = ${resultCoeff}${variable}^{${resultPower}}`;
  }
  
  return {
    instruction: 'Simplify',
    questionMath,
    answer,
    
    workingOut,
    
    solution: [
      ...(isNegative ? [{
        explanation: 'Apply negative power rule first',
        formula: `(${base}${variable}^{${innerPower}})^{-${fractionPower}} = \\frac{1}{(${base}${variable}^{${innerPower}})^{${fractionPower}}}`
      }] : []),
      {
        explanation: 'Apply fractional power to coefficient',
        formula: `${base}^{${fractionPower}} = (\\sqrt[${rootIndex}]{${base}})^{${powerNum}} = ${root}^{${powerNum}} = ${resultCoeff}`
      },
      {
        explanation: 'Apply fractional power to variable',
        formula: `(${variable}^{${innerPower}})^{${fractionPower}} = ${variable}^{${innerPower} \\times ${fractionPower}} = ${variable}^{${resultPower}}`
      },
      {
        explanation: 'Combine',
        formula: isNegative ? `= \\frac{1}{${resultCoeff}${variable}^{${resultPower}}}` : `= ${resultCoeff}${variable}^{${resultPower}}`
      }
    ],
    
    metadata: {
      type: 'fractional-power',
      subType: isNegative ? 'algebraic-negative-fractional' : 'algebraic-fractional',
      difficulty,
      topic: 'indices',
      tags: ['algebra', 'gcse', 'higher']
    },
    
    title: isNegative ? 'Algebraic Negative Fractional Power' : 'Algebraic Fractional Power',
    keyRule: '(a^m)^{\\frac{p}{q}} = a^{\\frac{mp}{q}}'
  };
};

// ============================================================
// GENERATORS: COMPLEX MIXED (Challenge level)
// ============================================================

/**
 * Generate complex fraction with indices
 * e.g., (4x²y⁶ / 9x⁸y²)^{-1/2}
 */
const generateComplexFraction = (options = {}) => {
  const { difficulty = 'hard' } = options;
  
  // Pre-computed examples for clean answers
  const examples = [
    {
      question: '\\left(\\frac{4x^2y^6}{9x^8y^2}\\right)^{-\\frac{1}{2}}',
      answer: '\\frac{3x^3}{2y^2}',
      steps: [
        { explanation: 'Simplify the fraction inside first', formula: '\\frac{4x^2y^6}{9x^8y^2} = \\frac{4y^4}{9x^6}' },
        { explanation: 'Apply negative power (flip fraction)', formula: '\\left(\\frac{4y^4}{9x^6}\\right)^{-\\frac{1}{2}} = \\left(\\frac{9x^6}{4y^4}\\right)^{\\frac{1}{2}}' },
        { explanation: 'Take square root of each part', formula: '= \\frac{\\sqrt{9} \\cdot \\sqrt{x^6}}{\\sqrt{4} \\cdot \\sqrt{y^4}} = \\frac{3x^3}{2y^2}' }
      ]
    },
    {
      question: '\\left(\\frac{8x^3y^6}{27x^9y^3}\\right)^{-\\frac{2}{3}}',
      answer: '\\frac{9x^4}{4y^2}',
      steps: [
        { explanation: 'Simplify the fraction inside', formula: '\\frac{8x^3y^6}{27x^9y^3} = \\frac{8y^3}{27x^6}' },
        { explanation: 'Apply negative power (flip fraction)', formula: '\\left(\\frac{8y^3}{27x^6}\\right)^{-\\frac{2}{3}} = \\left(\\frac{27x^6}{8y^3}\\right)^{\\frac{2}{3}}' },
        { explanation: 'Apply \\frac{2}{3} power: cube root then square', formula: '= \\frac{(\\sqrt[3]{27})^2 \\cdot (\\sqrt[3]{x^6})^2}{(\\sqrt[3]{8})^2 \\cdot (\\sqrt[3]{y^3})^2} = \\frac{9x^4}{4y^2}' }
      ]
    },
    {
      question: '\\left(\\frac{16a^4b^8}{81a^{12}b^4}\\right)^{\\frac{3}{4}}',
      answer: '\\frac{8b^3}{27a^6}',
      steps: [
        { explanation: 'Simplify the fraction inside', formula: '\\frac{16a^4b^8}{81a^{12}b^4} = \\frac{16b^4}{81a^8}' },
        { explanation: 'Apply \\frac{3}{4} power: fourth root then cube', formula: '= \\frac{(\\sqrt[4]{16})^3 \\cdot (\\sqrt[4]{b^4})^3}{(\\sqrt[4]{81})^3 \\cdot (\\sqrt[4]{a^8})^3}' },
        { explanation: 'Simplify', formula: '= \\frac{2^3 \\cdot b^3}{3^3 \\cdot a^6} = \\frac{8b^3}{27a^6}' }
      ]
    }
  ];
  
  const selected = _.sample(examples);
  
  return {
    instruction: 'Simplify fully',
    questionMath: selected.question,
    answer: selected.answer,
    
    workingOut: selected.steps.map(s => s.formula).join(' \\\\ '),
    
    solution: selected.steps,
    
    metadata: {
      type: 'complex-fraction',
      subType: 'mixed-indices',
      difficulty: 'hard',
      topic: 'indices',
      tags: ['algebra', 'gcse', 'higher', 'challenge']
    },
    
    title: 'Complex Fraction with Indices',
    keyRule: '\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n'
  };
};

// ============================================================
// RANDOM/MIXED GENERATORS
// ============================================================

/**
 * Generate random indices question based on difficulty
 */
const generateRandom = (options = {}) => {
  const { difficulty = 'medium', types = null } = options;
  
  const allTypes = types || (difficulty === 'easy' 
    ? ['numeric-negative', 'numeric-fractional', 'algebraic-negative-simple']
    : difficulty === 'hard'
    ? ['algebraic-fractional', 'complex-fraction']
    : ['numeric-negative', 'numeric-fractional', 'algebraic-negative', 'algebraic-fractional']
  );
  
  const type = _.sample(allTypes);
  
  switch (type) {
    case 'numeric-negative':
      return generateNumericNegativePower({ difficulty });
    case 'numeric-fractional':
      return generateNumericFractionalPower({ difficulty });
    case 'algebraic-negative-simple':
      return generateAlgebraicNegativePower({ difficulty: 'easy' });
    case 'algebraic-negative':
      return generateAlgebraicNegativePower({ difficulty });
    case 'algebraic-fractional':
      return generateAlgebraicFractionalPower({ difficulty });
    case 'complex-fraction':
      return generateComplexFraction({ difficulty });
    default:
      return generateNumericNegativePower({ difficulty });
  }
};

/**
 * Generate question for specific tab in Examples section
 */
const generateForExamplesTab = (tabIndex, options = {}) => {
  switch (tabIndex) {
    case 1: // Tab 1: Numeric
      return Math.random() > 0.5 
        ? generateNumericNegativePower({ difficulty: 'medium' })
        : generateNumericFractionalPower({ difficulty: 'medium' });
    case 2: // Tab 2: Algebraic
      return Math.random() > 0.5
        ? generateAlgebraicNegativePower({ difficulty: 'medium' })
        : generateAlgebraicFractionalPower({ difficulty: 'medium', includeNegative: false });
    case 3: // Tab 3: Complex
      return Math.random() > 0.5
        ? generateAlgebraicFractionalPower({ difficulty: 'hard', includeNegative: true })
        : generateComplexFraction({ difficulty: 'hard' });
    default:
      return generateRandom(options);
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const indicesGenerators = {
  // Individual generators
  generateNumericNegativePower,
  generateNumericFractionalPower,
  generateAlgebraicNegativePower,
  generateAlgebraicFractionalPower,
  generateComplexFraction,
  
  // Utility generators
  generateRandom,
  generateForExamplesTab
};

export default indicesGenerators;