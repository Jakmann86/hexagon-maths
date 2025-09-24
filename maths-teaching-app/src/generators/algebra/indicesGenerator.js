// src/generators/algebra/indicesGenerator.js
import _ from 'lodash';

/**
 * Helper function to ensure unique options
 */
const getUniqueOptions = (correctAnswer, incorrectOptions, count = 3) => {
  const uniqueIncorrect = [...new Set(incorrectOptions)]
    .filter(opt => opt !== correctAnswer)
    .slice(0, count);
  
  return [correctAnswer, ...uniqueIncorrect].sort(() => Math.random() - 0.5);
};

/**
 * Generate basic index laws questions
 * Tests: x^a × x^b, x^a ÷ x^b, (x^a)^b
 * FIXED: Better power display and added coefficients
 */
export const generateBasicIndexLaws = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const lawTypes = ['multiply', 'divide', 'power_of_power'];
  const lawType = _.sample(lawTypes);

  let question, correctAnswer, explanation;

  if (lawType === 'multiply') {
    // x^a × x^b = x^(a+b) or with coefficients: 2x^a × 3x^b = 6x^(a+b)
    const useCoefficients = Math.random() > 0.5;
    
    if (useCoefficients) {
      const coeff1 = _.random(2, 5);
      const coeff2 = _.random(2, 5);
      const a = _.random(2, 4);
      const b = _.random(2, 4);
      const resultCoeff = coeff1 * coeff2;
      const resultPower = a + b;

      question = `${coeff1}x^{${a}} \\times ${coeff2}x^{${b}}`;
      correctAnswer = `${resultCoeff}x^{${resultPower}}`;
      explanation = `Multiply coefficients (${coeff1} × ${coeff2} = ${resultCoeff}) and add indices (${a} + ${b} = ${resultPower})`;

      const incorrectOptions = [
        `${resultCoeff}x^{${a * b}}`, // Multiplied powers
        `${coeff1 * coeff2}x^{${a}}x^{${b}}`, // Didn't combine powers
        `${coeff1 + coeff2}x^{${resultPower}}`, // Added coefficients
        `${resultCoeff}x^{${Math.abs(a - b)}}` // Subtracted powers
      ];

      if (sectionType === 'diagnostic') {
        return {
          questionDisplay: {
            text: 'Simplify:',
            math: question
          },
          correctAnswer,
          options: getUniqueOptions(correctAnswer, incorrectOptions),
          explanation
        };
      }
    } else {
      const a = _.random(2, 4);
      const b = _.random(2, 4);
      const result = a + b;

      question = `x^{${a}} \\times x^{${b}}`;
      correctAnswer = `x^{${result}}`;
      explanation = `When multiplying powers with the same base, add the indices: ${a} + ${b} = ${result}`;

      const incorrectOptions = [
        `x^{${a * b}}`, // Multiplied instead of added
        `x^{${a}}x^{${b}}`, // Didn't simplify
        `x^{${Math.abs(a - b)}}`, // Subtracted instead
        `${a * b}x` // Complete confusion
      ];

      if (sectionType === 'diagnostic') {
        return {
          questionDisplay: {
            text: 'Simplify:',
            math: question
          },
          correctAnswer,
          options: getUniqueOptions(correctAnswer, incorrectOptions),
          explanation
        };
      }
    }
  }

  else if (lawType === 'divide') {
    // x^a ÷ x^b = x^(a-b)
    const a = _.random(5, 8);
    const b = _.random(2, a - 1);
    const result = a - b;

    question = `x^{${a}} \\div x^{${b}}`;
    correctAnswer = `x^{${result}}`;
    explanation = `When dividing powers with the same base, subtract the indices: ${a} - ${b} = ${result}`;

    const incorrectOptions = [
      `x^{${a + b}}`, // Added instead of subtracted
      `x^{${Math.floor(a / b)}}`, // Divided the indices
      `\\frac{x^{${a}}}{x^{${b}}}`, // Didn't simplify
      `x^{${b - a}}` // Subtracted wrong way
    ];

    if (sectionType === 'diagnostic') {
      return {
        questionDisplay: {
          text: 'Simplify:',
          math: question
        },
        correctAnswer,
        options: getUniqueOptions(correctAnswer, incorrectOptions),
        explanation
      };
    }
  }

  else { // power_of_power
    // (x^a)^b = x^(ab)
    const a = _.random(2, 4);
    const b = _.random(2, 3);
    const result = a * b;

    question = `(x^{${a}})^{${b}}`;
    correctAnswer = `x^{${result}}`;
    explanation = `When raising a power to a power, multiply the indices: ${a} × ${b} = ${result}`;

    const incorrectOptions = [
      `x^{${a + b}}`, // Added instead of multiplied
      `(x^{${a}})^{${b}}`, // Didn't simplify - keep the brackets
      `x^{${Math.pow(a, b)}}`, // Calculated a^b instead of a×b
      `${result}x` // Wrong format
    ];

    if (sectionType === 'diagnostic') {
      return {
        questionDisplay: {
          text: 'Simplify:',
          math: question
        },
        correctAnswer,
        options: getUniqueOptions(correctAnswer, incorrectOptions),
        explanation
      };
    }
  }

  // Fallback
  return generateBasicIndexLaws({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate evaluating powers questions
 * Includes: (4x^2)^3, expressions with zero power, etc.
 */
export const generateEvaluatingPowers = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const questionTypes = ['bracket_power', 'zero_power', 'simple_evaluation'];
  const questionType = _.sample(questionTypes);

  let question, correctAnswer, explanation;

  if (questionType === 'bracket_power') {
    // Questions like (4x^2)^3
    const coefficient = _.sample([2, 3, 4, 5]);
    const innerPower = _.random(2, 4);
    const outerPower = _.sample([2, 3]);

    const resultCoeff = Math.pow(coefficient, outerPower);
    const resultPower = innerPower * outerPower;

    question = `(${coefficient}x^{${innerPower}})^{${outerPower}}`;
    correctAnswer = `${resultCoeff}x^{${resultPower}}`;
    explanation = `Raise both the coefficient and the power: ${coefficient}^${outerPower} = ${resultCoeff}, and ${innerPower} × ${outerPower} = ${resultPower}`;

    const incorrectOptions = [
      `${coefficient * outerPower}x^{${resultPower}}`, // Multiplied coefficient instead of raising
      `${resultCoeff}x^{${innerPower + outerPower}}`, // Added powers instead of multiplying
      `${coefficient}x^{${resultPower}}`, // Forgot to raise coefficient
      `${resultCoeff}x^{${innerPower}}` // Forgot to multiply powers
    ];

    if (sectionType === 'diagnostic') {
      return {
        questionDisplay: {
          text: 'Simplify:',
          math: question
        },
        correctAnswer,
        options: getUniqueOptions(correctAnswer, incorrectOptions),
        explanation
      };
    }
  }

  else if (questionType === 'zero_power') {
    // Questions involving x^0 = 1
    const choices = [
      { q: `5x^0`, a: `5`, exp: `x^0 = 1, so 5 × 1 = 5` },
      { q: `(3x)^0`, a: `1`, exp: `Anything to the power 0 equals 1` },
      { q: `7^0`, a: `1`, exp: `Any number to the power 0 equals 1` },
      { q: `x^{3} \\times x^0`, a: `x^{3}`, exp: `x^0 = 1, so x^3 × 1 = x^3` }
    ];

    const selected = _.sample(choices);
    question = selected.q;
    correctAnswer = selected.a;
    explanation = selected.exp;

    let incorrectOptions = [];
    if (question === `5x^0`) {
      incorrectOptions = [`0`, `5x`, `x`];
    } else if (question === `(3x)^0`) {
      incorrectOptions = [`0`, `3x`, `3`];
    } else if (question === `7^0`) {
      incorrectOptions = [`0`, `7`, `-1`];
    } else {
      incorrectOptions = [`x^0`, `1`, `x`];
    }

    if (sectionType === 'diagnostic') {
      return {
        questionDisplay: {
          text: 'Simplify:',
          math: question
        },
        correctAnswer,
        options: getUniqueOptions(correctAnswer, incorrectOptions),
        explanation
      };
    }
  }

  else { // simple_evaluation
    // Evaluate simple powers like 2^4, 3^3
    const bases = [2, 3, 4, 5];
    const base = _.sample(bases);
    const power = _.random(2, 4);
    const result = Math.pow(base, power);

    question = `${base}^{${power}}`;
    correctAnswer = `${result}`;
    explanation = `${base}^${power} = ${base}${power > 2 ? ` × ${base}`.repeat(power - 1) : ` × ${base}`} = ${result}`;

    const incorrectOptions = [
      `${base * power}`, // Multiplied instead
      `${base + power}`, // Added instead
      `${result + 1}`, // Off by one
      `${result - 1}` // Off by one
    ].filter(opt => opt !== correctAnswer);

    if (sectionType === 'diagnostic') {
      return {
        questionDisplay: {
          text: 'Calculate:',
          math: question
        },
        correctAnswer,
        options: getUniqueOptions(correctAnswer, incorrectOptions),
        explanation
      };
    }
  }

  return generateEvaluatingPowers({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate understanding roots questions
 * Tests: square roots, cube roots, 4th roots, 5th roots
 */
export const generateUnderstandingRoots = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const rootTypes = ['square', 'cube', 'fourth', 'fifth'];
  const rootType = _.sample(rootTypes);

  let question, correctAnswer, explanation, incorrectOptions;

  if (rootType === 'square') {
    // Square root questions
    const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
    const number = _.sample(perfectSquares);
    const result = Math.sqrt(number);

    question = `\\sqrt{${number}}`;
    correctAnswer = `${result}`;
    explanation = `${result} × ${result} = ${number}`;

    incorrectOptions = [
      `${result + 1}`,
      `${result - 1}`,
      `${number / 2}`,
      `${Math.floor(number / result)}`
    ].filter(opt => opt !== correctAnswer && parseInt(opt) > 0);

  } else if (rootType === 'cube') {
    // Cube root questions
    const perfectCubes = [8, 27, 64, 125];
    const number = _.sample(perfectCubes);
    const result = Math.round(Math.pow(number, 1/3));

    question = `\\sqrt[3]{${number}}`;
    correctAnswer = `${result}`;
    explanation = `${result} × ${result} × ${result} = ${number}`;

    incorrectOptions = [
      `${result + 1}`,
      `${result - 1}`,
      `${Math.floor(number / 3)}`,
      `${result * 2}`
    ].filter(opt => opt !== correctAnswer && parseInt(opt) > 0);

  } else if (rootType === 'fourth') {
    // 4th root questions
    const perfectFourths = [16, 81, 256];
    const number = _.sample(perfectFourths);
    const result = Math.round(Math.pow(number, 1/4));

    question = `\\sqrt[4]{${number}}`;
    correctAnswer = `${result}`;
    explanation = `${result} × ${result} × ${result} × ${result} = ${number}`;

    incorrectOptions = [
      `${result + 1}`,
      `${result - 1}`,
      `${Math.floor(number / 4)}`,
      `${result * 2}`
    ].filter(opt => opt !== correctAnswer && parseInt(opt) > 0);

  } else { // fifth
    // 5th root questions
    const perfectFifths = [32, 243];
    const number = _.sample(perfectFifths);
    const result = Math.round(Math.pow(number, 1/5));

    question = `\\sqrt[5]{${number}}`;
    correctAnswer = `${result}`;
    explanation = `${result}^5 = ${number}`;

    incorrectOptions = [
      `${result + 1}`,
      `${result - 1}`,
      `${Math.floor(number / 5)}`,
      `${result * 2}`
    ].filter(opt => opt !== correctAnswer && parseInt(opt) > 0);
  }

  if (sectionType === 'diagnostic') {
    return {
      questionDisplay: {
        text: 'Calculate:',
        math: question
      },
      correctAnswer,
      options: getUniqueOptions(correctAnswer, incorrectOptions),
      explanation
    };
  }

  return generateUnderstandingRoots({ ...options, sectionType: 'diagnostic' });
};

// Export all generators
export const indicesGenerators = {
  generateBasicIndexLaws,
  generateEvaluatingPowers,
  generateUnderstandingRoots
};

export default indicesGenerators;