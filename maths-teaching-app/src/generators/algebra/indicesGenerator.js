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
 * Generate negative powers examples and questions
 * Tests: x^(-n), (ax^b)^(-c), complex negative powers
 */
export const generateNegativePowers = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const powerTypes = ['simple_negative', 'algebraic_negative', 'complex_negative'];
  const powerType = _.sample(powerTypes);

  let question, correctAnswer, explanation, solution;

  if (powerType === 'simple_negative') {
    // Simple negative powers like 5^(-2)
    const base = _.sample([2, 3, 4, 5, 6]);
    const power = _.random(2, 4);
    const result = Math.pow(base, -power);
    const denominatorResult = Math.pow(base, power);

    question = `${base}^{-${power}}`;
    correctAnswer = `\\frac{1}{${denominatorResult}}`;
    explanation = `Apply negative power rule: a^{-n} = \\frac{1}{a^n}`;

    solution = [
      {
        explanation: 'Apply the negative power rule: a^{-n} = \\frac{1}{a^n}',
        formula: `${base}^{-${power}} = \\frac{1}{${base}^${power}}`
      },
      {
        explanation: 'Calculate the positive power',
        formula: `= \\frac{1}{${denominatorResult}}`
      }
    ];

    const incorrectOptions = [
      `-${denominatorResult}`,
      `${denominatorResult}`,
      `\\frac{${base}}{${power}}`,
      `-\\frac{1}{${denominatorResult}}`
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
    } else if (sectionType === 'examples') {
      return {
        title: 'Simple Negative Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (powerType === 'algebraic_negative') {
    // Algebraic negative powers like (3x^2)^(-2)
    const coeff = _.sample([2, 3, 4, 5]);
    const innerPower = _.random(2, 4);
    const outerPower = _.random(2, 3);
    
    const resultCoeff = Math.pow(coeff, outerPower);
    const resultPower = innerPower * outerPower;

    question = `(${coeff}x^{${innerPower}})^{-${outerPower}}`;
    correctAnswer = `\\frac{1}{${resultCoeff}x^{${resultPower}}}`;

    solution = [
      {
        explanation: 'Apply negative power rule: (ab)^{-n} = \\frac{1}{(ab)^n}',
        formula: `(${coeff}x^{${innerPower}})^{-${outerPower}} = \\frac{1}{(${coeff}x^{${innerPower}})^${outerPower}}`
      },
      {
        explanation: 'Apply power to each factor: (ab)^n = a^n b^n',
        formula: `= \\frac{1}{${coeff}^${outerPower} \\times (x^{${innerPower}})^${outerPower}}`
      },
      {
        explanation: 'Simplify using power rule: (x^m)^n = x^{mn}',
        formula: `= \\frac{1}{${resultCoeff}x^{${resultPower}}}`
      }
    ];

    const incorrectOptions = [
      `${resultCoeff}x^{${resultPower}}`,
      `\\frac{1}{${coeff}x^{${innerPower}}}`,
      `-${resultCoeff}x^{${resultPower}}`,
      `\\frac{1}{${coeff * outerPower}x^{${innerPower + outerPower}}}`
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
    } else if (sectionType === 'examples') {
      return {
        title: 'Expression with Negative Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // complex_negative
    // Complex negative powers with multiple variables
    const coeff = _.sample([2, 3, 5]);
    const aPower = _.random(2, 4);
    const bPower = -_.random(1, 3); // Make b negative

    question = `(${coeff}a^{${aPower}}b^{${bPower}})^{-1}`;
    correctAnswer = `\\frac{b^{${Math.abs(bPower)}}}{${coeff}a^{${aPower}}}`;

    solution = [
      {
        explanation: 'Apply negative power rule',
        formula: `(${coeff}a^{${aPower}}b^{${bPower}})^{-1} = \\frac{1}{${coeff}a^{${aPower}}b^{${bPower}}}`
      },
      {
        explanation: `Handle b^{${bPower}} in denominator: \\frac{1}{b^{${bPower}}} = b^{${Math.abs(bPower)}}`,
        formula: `= \\frac{1}{${coeff}a^{${aPower}}} \\times b^{${Math.abs(bPower)}}`
      },
      {
        explanation: 'Combine',
        formula: `= \\frac{b^{${Math.abs(bPower)}}}{${coeff}a^{${aPower}}}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Multiple Variables with Negative Powers',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateNegativePowers({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate fractional powers examples and questions
 * Tests: a^(1/n), a^(m/n), algebraic fractional powers
 */
export const generateFractionalPowers = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const fractionTypes = ['square_root', 'cube_root_power', 'algebraic_fractional', 'higher_root'];
  const fractionType = _.sample(fractionTypes);

  let question, correctAnswer, explanation, solution;

  if (fractionType === 'square_root') {
    // Square root powers like 25^(1/2)
    const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
    const number = _.sample(perfectSquares);
    const result = Math.sqrt(number);

    question = `${number}^{\\frac{1}{2}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Convert fractional power to root form: a^{\\frac{1}{n}} = \\sqrt[n]{a}',
        formula: `${number}^{\\frac{1}{2}} = \\sqrt{${number}}`
      },
      {
        explanation: 'Calculate the square root',
        formula: `= ${result}`
      }
    ];

    const incorrectOptions = [
      `${number / 2}`,
      `${result + 1}`,
      `${result - 1}`,
      `\\frac{${number}}{2}`
    ];

    if (sectionType === 'diagnostic') {
      return {
        questionDisplay: {
          text: 'Simplify:',
          math: question
        },
        correctAnswer,
        options: getUniqueOptions(correctAnswer, incorrectOptions),
        explanation: 'Convert to root form and calculate'
      };
    } else if (sectionType === 'examples') {
      return {
        title: 'Square Root Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (fractionType === 'cube_root_power') {
    // Cube root with power like 8^(2/3)
    const perfectCubes = [8, 27, 64, 125];
    const number = _.sample(perfectCubes);
    const cubeRoot = Math.round(Math.pow(number, 1/3));
    const power = 2;
    const result = Math.pow(cubeRoot, power);

    question = `${number}^{\\frac{${power}}{3}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Use the rule: a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m',
        formula: `${number}^{\\frac{${power}}{3}} = (\\sqrt[3]{${number}})^${power}`
      },
      {
        explanation: `Find the cube root: \\sqrt[3]{${number}} = ${cubeRoot}`,
        formula: `= (${cubeRoot})^${power}`
      },
      {
        explanation: 'Calculate the final power',
        formula: `= ${result}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Cube Root with Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (fractionType === 'algebraic_fractional') {
    // Algebraic fractional powers like (9x^4)^(1/2)
    const perfectSquares = [4, 9, 16, 25];
    const coeff = _.sample(perfectSquares);
    const coeffRoot = Math.sqrt(coeff);
    const innerPower = _.random(2, 6);
    const outerPower = 2; // For 1/2 power
    const resultPower = innerPower / outerPower;

    question = `(${coeff}x^{${innerPower}})^{\\frac{1}{${outerPower}}}`;
    correctAnswer = `${coeffRoot}x^{${resultPower}}`;

    solution = [
      {
        explanation: 'Apply power to each factor: (ab)^n = a^n b^n',
        formula: `(${coeff}x^{${innerPower}})^{\\frac{1}{${outerPower}}} = ${coeff}^{\\frac{1}{${outerPower}}} \\times (x^{${innerPower}})^{\\frac{1}{${outerPower}}}`
      },
      {
        explanation: 'Convert to square roots',
        formula: `= \\sqrt{${coeff}} \\times x^{${innerPower} \\times \\frac{1}{${outerPower}}}`
      },
      {
        explanation: 'Simplify',
        formula: `= ${coeffRoot}x^{${resultPower}}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Algebraic Expression',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // higher_root
    // Higher root powers like 32^(3/5)
    const number = 32; // 2^5
    const rootBase = 2;
    const power = 3;
    const root = 5;
    const result = Math.pow(rootBase, power);

    question = `${number}^{\\frac{${power}}{${root}}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Use the rule: a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m',
        formula: `${number}^{\\frac{${power}}{${root}}} = (\\sqrt[${root}]{${number}})^${power}`
      },
      {
        explanation: `Find the ${root}th root: \\sqrt[${root}]{${number}} = ${rootBase} (since ${rootBase}^${root} = ${number})`,
        formula: `= (${rootBase})^${power}`
      },
      {
        explanation: 'Calculate the final power',
        formula: `= ${result}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Fifth Root Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateFractionalPowers({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate complex mixed problems
 * Tests: Complex fractions with negative fractional powers
 */
export const generateComplexMixed = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const complexTypes = ['complex_fraction', 'mixed_powers_fraction', 'ultimate_challenge', 'master_level'];
  const complexType = _.sample(complexTypes);

  let question, solution;

  if (complexType === 'complex_fraction') {
    // Complex fraction like (8x³y⁶)/(27x⁹y³) raised to negative fractional power
    question = '\\left(\\frac{8x^3y^6}{27x^9y^3}\\right)^{-\\frac{2}{3}}';
    
    solution = [
      {
        explanation: 'First simplify the fraction using index laws',
        formula: '\\frac{8x^3y^6}{27x^9y^3} = \\frac{8y^3}{27x^6}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{8y^3}{27x^6}\\right)^{-\\frac{2}{3}} = \\left(\\frac{27x^6}{8y^3}\\right)^{\\frac{2}{3}}'
      },
      {
        explanation: 'Apply fractional power to numerator and denominator',
        formula: '= \\frac{(27x^6)^{\\frac{2}{3}}}{(8y^3)^{\\frac{2}{3}}}'
      },
      {
        explanation: 'Calculate: 27^{\\frac{2}{3}} = (\\sqrt[3]{27})^2 = 3^2 = 9, and 8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2 = 2^2 = 4',
        formula: '= \\frac{9x^4}{4y^2}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Complex Fraction',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (complexType === 'mixed_powers_fraction') {
    question = '\\left(\\frac{25a^4b^2}{16a^8b^6}\\right)^{-\\frac{1}{2}}';
    
    solution = [
      {
        explanation: 'Simplify using index laws: \\frac{a^m}{a^n} = a^{m-n}',
        formula: '\\frac{25a^4b^2}{16a^8b^6} = \\frac{25}{16a^4b^4}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{25}{16a^4b^4}\\right)^{-\\frac{1}{2}} = \\left(\\frac{16a^4b^4}{25}\\right)^{\\frac{1}{2}}'
      },
      {
        explanation: 'Apply square root to each part',
        formula: '= \\frac{\\sqrt{16a^4b^4}}{\\sqrt{25}} = \\frac{4a^2b^2}{5}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Mixed Powers Fraction',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (complexType === 'ultimate_challenge') {
    question = '\\left(\\frac{4p^2q^8}{9p^6q^2}\\right)^{-\\frac{3}{2}}';
    
    solution = [
      {
        explanation: 'Simplify the fraction',
        formula: '\\frac{4p^2q^8}{9p^6q^2} = \\frac{4q^6}{9p^4}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{4q^6}{9p^4}\\right)^{-\\frac{3}{2}} = \\left(\\frac{9p^4}{4q^6}\\right)^{\\frac{3}{2}}'
      },
      {
        explanation: 'Apply fractional power',
        formula: '= \\frac{(9p^4)^{\\frac{3}{2}}}{(4q^6)^{\\frac{3}{2}}}'
      },
      {
        explanation: 'Calculate: 9^{\\frac{3}{2}} = (\\sqrt{9})^3 = 3^3 = 27, and 4^{\\frac{3}{2}} = (\\sqrt{4})^3 = 2^3 = 8',
        formula: '= \\frac{27p^6}{8q^9}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Ultimate Challenge',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // master_level
    question = '\\left(\\frac{64m^3n^6}{125m^9n^3}\\right)^{-\\frac{2}{3}}';
    
    solution = [
      {
        explanation: 'Simplify the fraction using index laws',
        formula: '\\frac{64m^3n^6}{125m^9n^3} = \\frac{64n^3}{125m^6}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{64n^3}{125m^6}\\right)^{-\\frac{2}{3}} = \\left(\\frac{125m^6}{64n^3}\\right)^{\\frac{2}{3}}'
      },
      {
        explanation: 'Apply fractional power: \\frac{2}{3} means cube root then square',
        formula: '= \\frac{(125m^6)^{\\frac{2}{3}}}{(64n^3)^{\\frac{2}{3}}}'
      },
      {
        explanation: 'Calculate: 125^{\\frac{2}{3}} = (\\sqrt[3]{125})^2 = 5^2 = 25, and 64^{\\frac{2}{3}} = (\\sqrt[3]{64})^2 = 4^2 = 16',
        formula: '= \\frac{25m^4}{16n^2}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Master Level Challenge',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateComplexMixed({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate basic index laws questions - Updated to support examples
 * Tests: x^a × x^b, x^a ÷ x^b, (x^a)^b
 */
export const generateBasicIndexLaws = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const lawTypes = ['multiply', 'divide', 'power_of_power'];
  const lawType = _.sample(lawTypes);

  let question, correctAnswer, explanation, solution;

  if (lawType === 'multiply') {
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

      solution = [
        {
          explanation: 'When multiplying powers with the same base, multiply coefficients and add indices',
          formula: `${coeff1}x^{${a}} \\times ${coeff2}x^{${b}} = (${coeff1} \\times ${coeff2})x^{${a}+${b}}`
        },
        {
          explanation: 'Calculate coefficients and indices',
          formula: `= ${resultCoeff}x^{${resultPower}}`
        }
      ];

      const incorrectOptions = [
        `${resultCoeff}x^{${a * b}}`,
        `${coeff1 * coeff2}x^{${a}}x^{${b}}`,
        `${coeff1 + coeff2}x^{${resultPower}}`,
        `${resultCoeff}x^{${Math.abs(a - b)}}`
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
      } else if (sectionType === 'examples') {
        return {
          title: 'Multiplying Powers with Coefficients',
          questionText: `Simplify: $${question}$`,
          solution
        };
      }
    } else {
      const a = _.random(2, 4);
      const b = _.random(2, 4);
      const result = a + b;

      question = `x^{${a}} \\times x^{${b}}`;
      correctAnswer = `x^{${result}}`;
      explanation = `When multiplying powers with the same base, add the indices: ${a} + ${b} = ${result}`;

      solution = [
        {
          explanation: 'When multiplying powers with the same base, add the indices',
          formula: `x^{${a}} \\times x^{${b}} = x^{${a}+${b}}`
        },
        {
          explanation: 'Calculate the sum',
          formula: `= x^{${result}}`
        }
      ];

      if (sectionType === 'examples') {
        return {
          title: 'Basic Multiplication of Powers',
          questionText: `Simplify: $${question}$`,
          solution
        };
      }
    }
  }

  // Continue with existing logic for diagnostic...
  return generateBasicIndexLaws({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate evaluating powers questions - FIXED VERSION
 * Includes: (4x^2)^3, expressions with zero power, etc.
 */
export const generateEvaluatingPowers = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const questionTypes = ['bracket_power', 'zero_power', 'simple_evaluation'];
  const questionType = _.sample(questionTypes);

  let question, correctAnswer, explanation, solution;

  if (questionType === 'bracket_power') {
    const coefficient = _.sample([2, 3, 4, 5]);
    const innerPower = _.random(2, 4);
    const outerPower = _.sample([2, 3]);

    const resultCoeff = Math.pow(coefficient, outerPower);
    const resultPower = innerPower * outerPower;

    question = `(${coefficient}x^{${innerPower}})^{${outerPower}}`;
    correctAnswer = `${resultCoeff}x^{${resultPower}}`;
    explanation = `Raise both the coefficient and the power: ${coefficient}^${outerPower} = ${resultCoeff}, and ${innerPower} × ${outerPower} = ${resultPower}`;

    solution = [
      {
        explanation: 'Apply power to both coefficient and variable',
        formula: `(${coefficient}x^{${innerPower}})^{${outerPower}} = ${coefficient}^{${outerPower}} \\times (x^{${innerPower}})^{${outerPower}}`
      },
      {
        explanation: 'Calculate coefficient and multiply indices',
        formula: `= ${resultCoeff}x^{${resultPower}}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Evaluating Bracket Powers',
        questionText: `Simplify: ${question}// src/generators/algebra/indicesGenerator.js
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
 * Generate negative powers examples and questions
 * Tests: x^(-n), (ax^b)^(-c), complex negative powers
 */
export const generateNegativePowers = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const powerTypes = ['simple_negative', 'algebraic_negative', 'complex_negative'];
  const powerType = _.sample(powerTypes);

  let question, correctAnswer, explanation, solution;

  if (powerType === 'simple_negative') {
    // Simple negative powers like 5^(-2)
    const base = _.sample([2, 3, 4, 5, 6]);
    const power = _.random(2, 4);
    const result = Math.pow(base, -power);
    const denominatorResult = Math.pow(base, power);

    question = `${base}^{-${power}}`;
    correctAnswer = `\\frac{1}{${denominatorResult}}`;
    explanation = `Apply negative power rule: a^{-n} = \\frac{1}{a^n}`;

    solution = [
      {
        explanation: 'Apply the negative power rule: a^{-n} = \\frac{1}{a^n}',
        formula: `${base}^{-${power}} = \\frac{1}{${base}^${power}}`
      },
      {
        explanation: 'Calculate the positive power',
        formula: `= \\frac{1}{${denominatorResult}}`
      }
    ];

    const incorrectOptions = [
      `-${denominatorResult}`,
      `${denominatorResult}`,
      `\\frac{${base}}{${power}}`,
      `-\\frac{1}{${denominatorResult}}`
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
    } else if (sectionType === 'examples') {
      return {
        title: 'Simple Negative Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (powerType === 'algebraic_negative') {
    // Algebraic negative powers like (3x^2)^(-2)
    const coeff = _.sample([2, 3, 4, 5]);
    const innerPower = _.random(2, 4);
    const outerPower = _.random(2, 3);
    
    const resultCoeff = Math.pow(coeff, outerPower);
    const resultPower = innerPower * outerPower;

    question = `(${coeff}x^{${innerPower}})^{-${outerPower}}`;
    correctAnswer = `\\frac{1}{${resultCoeff}x^{${resultPower}}}`;

    solution = [
      {
        explanation: 'Apply negative power rule: (ab)^{-n} = \\frac{1}{(ab)^n}',
        formula: `(${coeff}x^{${innerPower}})^{-${outerPower}} = \\frac{1}{(${coeff}x^{${innerPower}})^${outerPower}}`
      },
      {
        explanation: 'Apply power to each factor: (ab)^n = a^n b^n',
        formula: `= \\frac{1}{${coeff}^${outerPower} \\times (x^{${innerPower}})^${outerPower}}`
      },
      {
        explanation: 'Simplify using power rule: (x^m)^n = x^{mn}',
        formula: `= \\frac{1}{${resultCoeff}x^{${resultPower}}}`
      }
    ];

    const incorrectOptions = [
      `${resultCoeff}x^{${resultPower}}`,
      `\\frac{1}{${coeff}x^{${innerPower}}}`,
      `-${resultCoeff}x^{${resultPower}}`,
      `\\frac{1}{${coeff * outerPower}x^{${innerPower + outerPower}}}`
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
    } else if (sectionType === 'examples') {
      return {
        title: 'Expression with Negative Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // complex_negative
    // Complex negative powers with multiple variables
    const coeff = _.sample([2, 3, 5]);
    const aPower = _.random(2, 4);
    const bPower = -_.random(1, 3); // Make b negative

    question = `(${coeff}a^{${aPower}}b^{${bPower}})^{-1}`;
    correctAnswer = `\\frac{b^{${Math.abs(bPower)}}}{${coeff}a^{${aPower}}}`;

    solution = [
      {
        explanation: 'Apply negative power rule',
        formula: `(${coeff}a^{${aPower}}b^{${bPower}})^{-1} = \\frac{1}{${coeff}a^{${aPower}}b^{${bPower}}}`
      },
      {
        explanation: `Handle b^{${bPower}} in denominator: \\frac{1}{b^{${bPower}}} = b^{${Math.abs(bPower)}}`,
        formula: `= \\frac{1}{${coeff}a^{${aPower}}} \\times b^{${Math.abs(bPower)}}`
      },
      {
        explanation: 'Combine',
        formula: `= \\frac{b^{${Math.abs(bPower)}}}{${coeff}a^{${aPower}}}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Multiple Variables with Negative Powers',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateNegativePowers({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate fractional powers examples and questions
 * Tests: a^(1/n), a^(m/n), algebraic fractional powers
 */
export const generateFractionalPowers = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const fractionTypes = ['square_root', 'cube_root_power', 'algebraic_fractional', 'higher_root'];
  const fractionType = _.sample(fractionTypes);

  let question, correctAnswer, explanation, solution;

  if (fractionType === 'square_root') {
    // Square root powers like 25^(1/2)
    const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
    const number = _.sample(perfectSquares);
    const result = Math.sqrt(number);

    question = `${number}^{\\frac{1}{2}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Convert fractional power to root form: a^{\\frac{1}{n}} = \\sqrt[n]{a}',
        formula: `${number}^{\\frac{1}{2}} = \\sqrt{${number}}`
      },
      {
        explanation: 'Calculate the square root',
        formula: `= ${result}`
      }
    ];

    const incorrectOptions = [
      `${number / 2}`,
      `${result + 1}`,
      `${result - 1}`,
      `\\frac{${number}}{2}`
    ];

    if (sectionType === 'diagnostic') {
      return {
        questionDisplay: {
          text: 'Simplify:',
          math: question
        },
        correctAnswer,
        options: getUniqueOptions(correctAnswer, incorrectOptions),
        explanation: 'Convert to root form and calculate'
      };
    } else if (sectionType === 'examples') {
      return {
        title: 'Square Root Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (fractionType === 'cube_root_power') {
    // Cube root with power like 8^(2/3)
    const perfectCubes = [8, 27, 64, 125];
    const number = _.sample(perfectCubes);
    const cubeRoot = Math.round(Math.pow(number, 1/3));
    const power = 2;
    const result = Math.pow(cubeRoot, power);

    question = `${number}^{\\frac{${power}}{3}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Use the rule: a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m',
        formula: `${number}^{\\frac{${power}}{3}} = (\\sqrt[3]{${number}})^${power}`
      },
      {
        explanation: `Find the cube root: \\sqrt[3]{${number}} = ${cubeRoot}`,
        formula: `= (${cubeRoot})^${power}`
      },
      {
        explanation: 'Calculate the final power',
        formula: `= ${result}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Cube Root with Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (fractionType === 'algebraic_fractional') {
    // Algebraic fractional powers like (9x^4)^(1/2)
    const perfectSquares = [4, 9, 16, 25];
    const coeff = _.sample(perfectSquares);
    const coeffRoot = Math.sqrt(coeff);
    const innerPower = _.random(2, 6);
    const outerPower = 2; // For 1/2 power
    const resultPower = innerPower / outerPower;

    question = `(${coeff}x^{${innerPower}})^{\\frac{1}{${outerPower}}}`;
    correctAnswer = `${coeffRoot}x^{${resultPower}}`;

    solution = [
      {
        explanation: 'Apply power to each factor: (ab)^n = a^n b^n',
        formula: `(${coeff}x^{${innerPower}})^{\\frac{1}{${outerPower}}} = ${coeff}^{\\frac{1}{${outerPower}}} \\times (x^{${innerPower}})^{\\frac{1}{${outerPower}}}`
      },
      {
        explanation: 'Convert to square roots',
        formula: `= \\sqrt{${coeff}} \\times x^{${innerPower} \\times \\frac{1}{${outerPower}}}`
      },
      {
        explanation: 'Simplify',
        formula: `= ${coeffRoot}x^{${resultPower}}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Algebraic Expression',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // higher_root
    // Higher root powers like 32^(3/5)
    const number = 32; // 2^5
    const rootBase = 2;
    const power = 3;
    const root = 5;
    const result = Math.pow(rootBase, power);

    question = `${number}^{\\frac{${power}}{${root}}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Use the rule: a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m',
        formula: `${number}^{\\frac{${power}}{${root}}} = (\\sqrt[${root}]{${number}})^${power}`
      },
      {
        explanation: `Find the ${root}th root: \\sqrt[${root}]{${number}} = ${rootBase} (since ${rootBase}^${root} = ${number})`,
        formula: `= (${rootBase})^${power}`
      },
      {
        explanation: 'Calculate the final power',
        formula: `= ${result}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Fifth Root Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateFractionalPowers({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate complex mixed problems
 * Tests: Complex fractions with negative fractional powers
 */
export const generateComplexMixed = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const complexTypes = ['complex_fraction', 'mixed_powers_fraction', 'ultimate_challenge', 'master_level'];
  const complexType = _.sample(complexTypes);

  let question, solution;

  if (complexType === 'complex_fraction') {
    // Complex fraction like (8x³y⁶)/(27x⁹y³) raised to negative fractional power
    question = '\\left(\\frac{8x^3y^6}{27x^9y^3}\\right)^{-\\frac{2}{3}}';
    
    solution = [
      {
        explanation: 'First simplify the fraction using index laws',
        formula: '\\frac{8x^3y^6}{27x^9y^3} = \\frac{8y^3}{27x^6}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{8y^3}{27x^6}\\right)^{-\\frac{2}{3}} = \\left(\\frac{27x^6}{8y^3}\\right)^{\\frac{2}{3}}'
      },
      {
        explanation: 'Apply fractional power to numerator and denominator',
        formula: '= \\frac{(27x^6)^{\\frac{2}{3}}}{(8y^3)^{\\frac{2}{3}}}'
      },
      {
        explanation: 'Calculate: 27^{\\frac{2}{3}} = (\\sqrt[3]{27})^2 = 3^2 = 9, and 8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2 = 2^2 = 4',
        formula: '= \\frac{9x^4}{4y^2}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Complex Fraction',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (complexType === 'mixed_powers_fraction') {
    question = '\\left(\\frac{25a^4b^2}{16a^8b^6}\\right)^{-\\frac{1}{2}}';
    
    solution = [
      {
        explanation: 'Simplify using index laws: \\frac{a^m}{a^n} = a^{m-n}',
        formula: '\\frac{25a^4b^2}{16a^8b^6} = \\frac{25}{16a^4b^4}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{25}{16a^4b^4}\\right)^{-\\frac{1}{2}} = \\left(\\frac{16a^4b^4}{25}\\right)^{\\frac{1}{2}}'
      },
      {
        explanation: 'Apply square root to each part',
        formula: '= \\frac{\\sqrt{16a^4b^4}}{\\sqrt{25}} = \\frac{4a^2b^2}{5}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Mixed Powers Fraction',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (complexType === 'ultimate_challenge') {
    question = '\\left(\\frac{4p^2q^8}{9p^6q^2}\\right)^{-\\frac{3}{2}}';
    
    solution = [
      {
        explanation: 'Simplify the fraction',
        formula: '\\frac{4p^2q^8}{9p^6q^2} = \\frac{4q^6}{9p^4}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{4q^6}{9p^4}\\right)^{-\\frac{3}{2}} = \\left(\\frac{9p^4}{4q^6}\\right)^{\\frac{3}{2}}'
      },
      {
        explanation: 'Apply fractional power',
        formula: '= \\frac{(9p^4)^{\\frac{3}{2}}}{(4q^6)^{\\frac{3}{2}}}'
      },
      {
        explanation: 'Calculate: 9^{\\frac{3}{2}} = (\\sqrt{9})^3 = 3^3 = 27, and 4^{\\frac{3}{2}} = (\\sqrt{4})^3 = 2^3 = 8',
        formula: '= \\frac{27p^6}{8q^9}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Ultimate Challenge',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // master_level
    question = '\\left(\\frac{64m^3n^6}{125m^9n^3}\\right)^{-\\frac{2}{3}}';
    
    solution = [
      {
        explanation: 'Simplify the fraction using index laws',
        formula: '\\frac{64m^3n^6}{125m^9n^3} = \\frac{64n^3}{125m^6}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{64n^3}{125m^6}\\right)^{-\\frac{2}{3}} = \\left(\\frac{125m^6}{64n^3}\\right)^{\\frac{2}{3}}'
      },
      {
        explanation: 'Apply fractional power: \\frac{2}{3} means cube root then square',
        formula: '= \\frac{(125m^6)^{\\frac{2}{3}}}{(64n^3)^{\\frac{2}{3}}}'
      },
      {
        explanation: 'Calculate: 125^{\\frac{2}{3}} = (\\sqrt[3]{125})^2 = 5^2 = 25, and 64^{\\frac{2}{3}} = (\\sqrt[3]{64})^2 = 4^2 = 16',
        formula: '= \\frac{25m^4}{16n^2}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Master Level Challenge',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateComplexMixed({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate basic index laws questions - Updated to support examples
 * Tests: x^a × x^b, x^a ÷ x^b, (x^a)^b
 */
export const generateBasicIndexLaws = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const lawTypes = ['multiply', 'divide', 'power_of_power'];
  const lawType = _.sample(lawTypes);

  let question, correctAnswer, explanation, solution;

  if (lawType === 'multiply') {
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

      solution = [
        {
          explanation: 'When multiplying powers with the same base, multiply coefficients and add indices',
          formula: `${coeff1}x^{${a}} \\times ${coeff2}x^{${b}} = (${coeff1} \\times ${coeff2})x^{${a}+${b}}`
        },
        {
          explanation: 'Calculate coefficients and indices',
          formula: `= ${resultCoeff}x^{${resultPower}}`
        }
      ];

      const incorrectOptions = [
        `${resultCoeff}x^{${a * b}}`,
        `${coeff1 * coeff2}x^{${a}}x^{${b}}`,
        `${coeff1 + coeff2}x^{${resultPower}}`,
        `${resultCoeff}x^{${Math.abs(a - b)}}`
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
      } else if (sectionType === 'examples') {
        return {
          title: 'Multiplying Powers with Coefficients',
          questionText: `Simplify: $${question}$`,
          solution
        };
      }
    } else {
      const a = _.random(2, 4);
      const b = _.random(2, 4);
      const result = a + b;

      question = `x^{${a}} \\times x^{${b}}`;
      correctAnswer = `x^{${result}}`;
      explanation = `When multiplying powers with the same base, add the indices: ${a} + ${b} = ${result}`;

      solution = [
        {
          explanation: 'When multiplying powers with the same base, add the indices',
          formula: `x^{${a}} \\times x^{${b}} = x^{${a}+${b}}`
        },
        {
          explanation: 'Calculate the sum',
          formula: `= x^{${result}}`
        }
      ];

      if (sectionType === 'examples') {
        return {
          title: 'Basic Multiplication of Powers',
          questionText: `Simplify: $${question}$`,
          solution
        };
      }
    }
  }

  // Continue with existing logic for diagnostic...
  return generateBasicIndexLaws({ ...options, sectionType: 'diagnostic' });
};

,
        solution
      };
    }

    const incorrectOptions = [
      `${coefficient * outerPower}x^{${resultPower}}`,
      `${resultCoeff}x^{${innerPower + outerPower}}`,
      `${coefficient}x^{${resultPower}}`,
      `${resultCoeff}x^{${innerPower}}`
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

  return generateEvaluatingPowers({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate understanding roots questions - FIXED VERSION
 * Tests: square roots, cube roots, 4th roots, 5th roots
 */
export const generateUnderstandingRoots = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const rootTypes = ['square', 'cube', 'fourth', 'fifth'];
  const rootType = _.sample(rootTypes);

  let question, correctAnswer, explanation, solution, incorrectOptions;

  if (rootType === 'square') {
    const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
    const number = _.sample(perfectSquares);
    const result = Math.sqrt(number);

    question = `\\sqrt{${number}}`;
    correctAnswer = `${result}`;
    explanation = `${result} × ${result} = ${number}`;

    solution = [
      {
        explanation: 'Find the number that when multiplied by itself gives the value under the root',
        formula: `\\sqrt{${number}} = ${result}`
      },
      {
        explanation: 'Verify the answer',
        formula: `${result} \\times ${result} = ${number}`
      }
    ];

    incorrectOptions = [
      `${result + 1}`,
      `${result - 1}`,
      `${number / 2}`,
      `${Math.floor(number / result)}`
    ].filter(opt => opt !== correctAnswer && parseInt(opt) > 0);

    if (sectionType === 'examples') {
      return {
        title: 'Understanding Square Roots',
        questionText: `Calculate: ${question}// src/generators/algebra/indicesGenerator.js
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
 * Generate negative powers examples and questions
 * Tests: x^(-n), (ax^b)^(-c), complex negative powers
 */
export const generateNegativePowers = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const powerTypes = ['simple_negative', 'algebraic_negative', 'complex_negative'];
  const powerType = _.sample(powerTypes);

  let question, correctAnswer, explanation, solution;

  if (powerType === 'simple_negative') {
    // Simple negative powers like 5^(-2)
    const base = _.sample([2, 3, 4, 5, 6]);
    const power = _.random(2, 4);
    const result = Math.pow(base, -power);
    const denominatorResult = Math.pow(base, power);

    question = `${base}^{-${power}}`;
    correctAnswer = `\\frac{1}{${denominatorResult}}`;
    explanation = `Apply negative power rule: a^{-n} = \\frac{1}{a^n}`;

    solution = [
      {
        explanation: 'Apply the negative power rule: a^{-n} = \\frac{1}{a^n}',
        formula: `${base}^{-${power}} = \\frac{1}{${base}^${power}}`
      },
      {
        explanation: 'Calculate the positive power',
        formula: `= \\frac{1}{${denominatorResult}}`
      }
    ];

    const incorrectOptions = [
      `-${denominatorResult}`,
      `${denominatorResult}`,
      `\\frac{${base}}{${power}}`,
      `-\\frac{1}{${denominatorResult}}`
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
    } else if (sectionType === 'examples') {
      return {
        title: 'Simple Negative Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (powerType === 'algebraic_negative') {
    // Algebraic negative powers like (3x^2)^(-2)
    const coeff = _.sample([2, 3, 4, 5]);
    const innerPower = _.random(2, 4);
    const outerPower = _.random(2, 3);
    
    const resultCoeff = Math.pow(coeff, outerPower);
    const resultPower = innerPower * outerPower;

    question = `(${coeff}x^{${innerPower}})^{-${outerPower}}`;
    correctAnswer = `\\frac{1}{${resultCoeff}x^{${resultPower}}}`;

    solution = [
      {
        explanation: 'Apply negative power rule: (ab)^{-n} = \\frac{1}{(ab)^n}',
        formula: `(${coeff}x^{${innerPower}})^{-${outerPower}} = \\frac{1}{(${coeff}x^{${innerPower}})^${outerPower}}`
      },
      {
        explanation: 'Apply power to each factor: (ab)^n = a^n b^n',
        formula: `= \\frac{1}{${coeff}^${outerPower} \\times (x^{${innerPower}})^${outerPower}}`
      },
      {
        explanation: 'Simplify using power rule: (x^m)^n = x^{mn}',
        formula: `= \\frac{1}{${resultCoeff}x^{${resultPower}}}`
      }
    ];

    const incorrectOptions = [
      `${resultCoeff}x^{${resultPower}}`,
      `\\frac{1}{${coeff}x^{${innerPower}}}`,
      `-${resultCoeff}x^{${resultPower}}`,
      `\\frac{1}{${coeff * outerPower}x^{${innerPower + outerPower}}}`
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
    } else if (sectionType === 'examples') {
      return {
        title: 'Expression with Negative Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // complex_negative
    // Complex negative powers with multiple variables
    const coeff = _.sample([2, 3, 5]);
    const aPower = _.random(2, 4);
    const bPower = -_.random(1, 3); // Make b negative

    question = `(${coeff}a^{${aPower}}b^{${bPower}})^{-1}`;
    correctAnswer = `\\frac{b^{${Math.abs(bPower)}}}{${coeff}a^{${aPower}}}`;

    solution = [
      {
        explanation: 'Apply negative power rule',
        formula: `(${coeff}a^{${aPower}}b^{${bPower}})^{-1} = \\frac{1}{${coeff}a^{${aPower}}b^{${bPower}}}`
      },
      {
        explanation: `Handle b^{${bPower}} in denominator: \\frac{1}{b^{${bPower}}} = b^{${Math.abs(bPower)}}`,
        formula: `= \\frac{1}{${coeff}a^{${aPower}}} \\times b^{${Math.abs(bPower)}}`
      },
      {
        explanation: 'Combine',
        formula: `= \\frac{b^{${Math.abs(bPower)}}}{${coeff}a^{${aPower}}}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Multiple Variables with Negative Powers',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateNegativePowers({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate fractional powers examples and questions
 * Tests: a^(1/n), a^(m/n), algebraic fractional powers
 */
export const generateFractionalPowers = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const fractionTypes = ['square_root', 'cube_root_power', 'algebraic_fractional', 'higher_root'];
  const fractionType = _.sample(fractionTypes);

  let question, correctAnswer, explanation, solution;

  if (fractionType === 'square_root') {
    // Square root powers like 25^(1/2)
    const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
    const number = _.sample(perfectSquares);
    const result = Math.sqrt(number);

    question = `${number}^{\\frac{1}{2}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Convert fractional power to root form: a^{\\frac{1}{n}} = \\sqrt[n]{a}',
        formula: `${number}^{\\frac{1}{2}} = \\sqrt{${number}}`
      },
      {
        explanation: 'Calculate the square root',
        formula: `= ${result}`
      }
    ];

    const incorrectOptions = [
      `${number / 2}`,
      `${result + 1}`,
      `${result - 1}`,
      `\\frac{${number}}{2}`
    ];

    if (sectionType === 'diagnostic') {
      return {
        questionDisplay: {
          text: 'Simplify:',
          math: question
        },
        correctAnswer,
        options: getUniqueOptions(correctAnswer, incorrectOptions),
        explanation: 'Convert to root form and calculate'
      };
    } else if (sectionType === 'examples') {
      return {
        title: 'Square Root Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (fractionType === 'cube_root_power') {
    // Cube root with power like 8^(2/3)
    const perfectCubes = [8, 27, 64, 125];
    const number = _.sample(perfectCubes);
    const cubeRoot = Math.round(Math.pow(number, 1/3));
    const power = 2;
    const result = Math.pow(cubeRoot, power);

    question = `${number}^{\\frac{${power}}{3}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Use the rule: a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m',
        formula: `${number}^{\\frac{${power}}{3}} = (\\sqrt[3]{${number}})^${power}`
      },
      {
        explanation: `Find the cube root: \\sqrt[3]{${number}} = ${cubeRoot}`,
        formula: `= (${cubeRoot})^${power}`
      },
      {
        explanation: 'Calculate the final power',
        formula: `= ${result}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Cube Root with Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (fractionType === 'algebraic_fractional') {
    // Algebraic fractional powers like (9x^4)^(1/2)
    const perfectSquares = [4, 9, 16, 25];
    const coeff = _.sample(perfectSquares);
    const coeffRoot = Math.sqrt(coeff);
    const innerPower = _.random(2, 6);
    const outerPower = 2; // For 1/2 power
    const resultPower = innerPower / outerPower;

    question = `(${coeff}x^{${innerPower}})^{\\frac{1}{${outerPower}}}`;
    correctAnswer = `${coeffRoot}x^{${resultPower}}`;

    solution = [
      {
        explanation: 'Apply power to each factor: (ab)^n = a^n b^n',
        formula: `(${coeff}x^{${innerPower}})^{\\frac{1}{${outerPower}}} = ${coeff}^{\\frac{1}{${outerPower}}} \\times (x^{${innerPower}})^{\\frac{1}{${outerPower}}}`
      },
      {
        explanation: 'Convert to square roots',
        formula: `= \\sqrt{${coeff}} \\times x^{${innerPower} \\times \\frac{1}{${outerPower}}}`
      },
      {
        explanation: 'Simplify',
        formula: `= ${coeffRoot}x^{${resultPower}}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Algebraic Expression',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // higher_root
    // Higher root powers like 32^(3/5)
    const number = 32; // 2^5
    const rootBase = 2;
    const power = 3;
    const root = 5;
    const result = Math.pow(rootBase, power);

    question = `${number}^{\\frac{${power}}{${root}}}`;
    correctAnswer = `${result}`;

    solution = [
      {
        explanation: 'Use the rule: a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m',
        formula: `${number}^{\\frac{${power}}{${root}}} = (\\sqrt[${root}]{${number}})^${power}`
      },
      {
        explanation: `Find the ${root}th root: \\sqrt[${root}]{${number}} = ${rootBase} (since ${rootBase}^${root} = ${number})`,
        formula: `= (${rootBase})^${power}`
      },
      {
        explanation: 'Calculate the final power',
        formula: `= ${result}`
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Fifth Root Power',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateFractionalPowers({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate complex mixed problems
 * Tests: Complex fractions with negative fractional powers
 */
export const generateComplexMixed = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const complexTypes = ['complex_fraction', 'mixed_powers_fraction', 'ultimate_challenge', 'master_level'];
  const complexType = _.sample(complexTypes);

  let question, solution;

  if (complexType === 'complex_fraction') {
    // Complex fraction like (8x³y⁶)/(27x⁹y³) raised to negative fractional power
    question = '\\left(\\frac{8x^3y^6}{27x^9y^3}\\right)^{-\\frac{2}{3}}';
    
    solution = [
      {
        explanation: 'First simplify the fraction using index laws',
        formula: '\\frac{8x^3y^6}{27x^9y^3} = \\frac{8y^3}{27x^6}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{8y^3}{27x^6}\\right)^{-\\frac{2}{3}} = \\left(\\frac{27x^6}{8y^3}\\right)^{\\frac{2}{3}}'
      },
      {
        explanation: 'Apply fractional power to numerator and denominator',
        formula: '= \\frac{(27x^6)^{\\frac{2}{3}}}{(8y^3)^{\\frac{2}{3}}}'
      },
      {
        explanation: 'Calculate: 27^{\\frac{2}{3}} = (\\sqrt[3]{27})^2 = 3^2 = 9, and 8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2 = 2^2 = 4',
        formula: '= \\frac{9x^4}{4y^2}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Complex Fraction',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (complexType === 'mixed_powers_fraction') {
    question = '\\left(\\frac{25a^4b^2}{16a^8b^6}\\right)^{-\\frac{1}{2}}';
    
    solution = [
      {
        explanation: 'Simplify using index laws: \\frac{a^m}{a^n} = a^{m-n}',
        formula: '\\frac{25a^4b^2}{16a^8b^6} = \\frac{25}{16a^4b^4}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{25}{16a^4b^4}\\right)^{-\\frac{1}{2}} = \\left(\\frac{16a^4b^4}{25}\\right)^{\\frac{1}{2}}'
      },
      {
        explanation: 'Apply square root to each part',
        formula: '= \\frac{\\sqrt{16a^4b^4}}{\\sqrt{25}} = \\frac{4a^2b^2}{5}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Mixed Powers Fraction',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else if (complexType === 'ultimate_challenge') {
    question = '\\left(\\frac{4p^2q^8}{9p^6q^2}\\right)^{-\\frac{3}{2}}';
    
    solution = [
      {
        explanation: 'Simplify the fraction',
        formula: '\\frac{4p^2q^8}{9p^6q^2} = \\frac{4q^6}{9p^4}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{4q^6}{9p^4}\\right)^{-\\frac{3}{2}} = \\left(\\frac{9p^4}{4q^6}\\right)^{\\frac{3}{2}}'
      },
      {
        explanation: 'Apply fractional power',
        formula: '= \\frac{(9p^4)^{\\frac{3}{2}}}{(4q^6)^{\\frac{3}{2}}}'
      },
      {
        explanation: 'Calculate: 9^{\\frac{3}{2}} = (\\sqrt{9})^3 = 3^3 = 27, and 4^{\\frac{3}{2}} = (\\sqrt{4})^3 = 2^3 = 8',
        formula: '= \\frac{27p^6}{8q^9}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Ultimate Challenge',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  else { // master_level
    question = '\\left(\\frac{64m^3n^6}{125m^9n^3}\\right)^{-\\frac{2}{3}}';
    
    solution = [
      {
        explanation: 'Simplify the fraction using index laws',
        formula: '\\frac{64m^3n^6}{125m^9n^3} = \\frac{64n^3}{125m^6}'
      },
      {
        explanation: 'Apply negative power rule (flip fraction)',
        formula: '\\left(\\frac{64n^3}{125m^6}\\right)^{-\\frac{2}{3}} = \\left(\\frac{125m^6}{64n^3}\\right)^{\\frac{2}{3}}'
      },
      {
        explanation: 'Apply fractional power: \\frac{2}{3} means cube root then square',
        formula: '= \\frac{(125m^6)^{\\frac{2}{3}}}{(64n^3)^{\\frac{2}{3}}}'
      },
      {
        explanation: 'Calculate: 125^{\\frac{2}{3}} = (\\sqrt[3]{125})^2 = 5^2 = 25, and 64^{\\frac{2}{3}} = (\\sqrt[3]{64})^2 = 4^2 = 16',
        formula: '= \\frac{25m^4}{16n^2}'
      }
    ];

    if (sectionType === 'examples') {
      return {
        title: 'Master Level Challenge',
        questionText: `Simplify: $${question}$`,
        solution
      };
    }
  }

  return generateComplexMixed({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate basic index laws questions - Updated to support examples
 * Tests: x^a × x^b, x^a ÷ x^b, (x^a)^b
 */
export const generateBasicIndexLaws = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const lawTypes = ['multiply', 'divide', 'power_of_power'];
  const lawType = _.sample(lawTypes);

  let question, correctAnswer, explanation, solution;

  if (lawType === 'multiply') {
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

      solution = [
        {
          explanation: 'When multiplying powers with the same base, multiply coefficients and add indices',
          formula: `${coeff1}x^{${a}} \\times ${coeff2}x^{${b}} = (${coeff1} \\times ${coeff2})x^{${a}+${b}}`
        },
        {
          explanation: 'Calculate coefficients and indices',
          formula: `= ${resultCoeff}x^{${resultPower}}`
        }
      ];

      const incorrectOptions = [
        `${resultCoeff}x^{${a * b}}`,
        `${coeff1 * coeff2}x^{${a}}x^{${b}}`,
        `${coeff1 + coeff2}x^{${resultPower}}`,
        `${resultCoeff}x^{${Math.abs(a - b)}}`
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
      } else if (sectionType === 'examples') {
        return {
          title: 'Multiplying Powers with Coefficients',
          questionText: `Simplify: $${question}$`,
          solution
        };
      }
    } else {
      const a = _.random(2, 4);
      const b = _.random(2, 4);
      const result = a + b;

      question = `x^{${a}} \\times x^{${b}}`;
      correctAnswer = `x^{${result}}`;
      explanation = `When multiplying powers with the same base, add the indices: ${a} + ${b} = ${result}`;

      solution = [
        {
          explanation: 'When multiplying powers with the same base, add the indices',
          formula: `x^{${a}} \\times x^{${b}} = x^{${a}+${b}}`
        },
        {
          explanation: 'Calculate the sum',
          formula: `= x^{${result}}`
        }
      ];

      if (sectionType === 'examples') {
        return {
          title: 'Basic Multiplication of Powers',
          questionText: `Simplify: $${question}$`,
          solution
        };
      }
    }
  }

  // Continue with existing logic for diagnostic...
  return generateBasicIndexLaws({ ...options, sectionType: 'diagnostic' });
};

,
        solution
      };
    }
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
  generateNegativePowers,
  generateFractionalPowers,
  generateComplexMixed,
  generateEvaluatingPowers,
  generateUnderstandingRoots
};

export default indicesGenerators;