// src/generators/algebra/indicesExamplesGenerator.js
// Examples generators for Negative and Fractional Indices lesson
// Following Pattern 2: Returns config objects, not React components

import _ from 'lodash';

/**
 * TAB 1: Pure Numeric Indices
 * Generates questions with just numbers (no algebra)
 * Types: negative powers, fractional powers, combined negative fractional
 */
export const generateNumericIndicesExample = (options = {}) => {
  const {
    subType = null, // 'negative', 'fractional', 'combined' or null for random
    difficulty = 'medium'
  } = options;

  const types = ['negative', 'fractional', 'combined'];
  const selectedType = subType || _.sample(types);

  if (selectedType === 'negative') {
    // Questions like 5^{-2}, 3^{-3}
    const bases = difficulty === 'easy' ? [2, 3, 4, 5] : [2, 3, 4, 5, 6, 10];
    const base = _.sample(bases);
    const power = _.random(2, 4);
    const result = Math.pow(base, power);

    return {
      title: 'Negative Powers',
      questionText: `Simplify: $${base}^{-${power}}$`,
      answer: `\\frac{1}{${result}}`,
      solution: [
        {
          explanation: 'Apply the negative power rule: a^{-n} = \\frac{1}{a^n}',
          formula: `${base}^{-${power}} = \\frac{1}{${base}^{${power}}}`
        },
        {
          explanation: `Calculate ${base}^{${power}}`,
          formula: `${base}^{${power}} = ${result}`
        },
        {
          explanation: 'Write the final answer',
          formula: `= \\frac{1}{${result}}`
        }
      ],
      metadata: { type: 'numeric', subType: 'negative' }
    };
  }

  else if (selectedType === 'fractional') {
    // Questions like 27^{1/3}, 16^{3/4}, 32^{2/5}
    const fractionalTypes = ['simple_root', 'root_with_power'];
    const fracType = _.sample(fractionalTypes);

    if (fracType === 'simple_root') {
      // Simple roots: 8^{1/3} = 2, 16^{1/4} = 2, 27^{1/3} = 3
      const rootOptions = [
        { base: 8, root: 3, result: 2 },
        { base: 27, root: 3, result: 3 },
        { base: 64, root: 3, result: 4 },
        { base: 125, root: 3, result: 5 },
        { base: 16, root: 4, result: 2 },
        { base: 81, root: 4, result: 3 },
        { base: 32, root: 5, result: 2 },
        { base: 4, root: 2, result: 2 },
        { base: 9, root: 2, result: 3 },
        { base: 25, root: 2, result: 5 },
        { base: 49, root: 2, result: 7 }
      ];
      const selected = _.sample(rootOptions);

      return {
        title: 'Fractional Powers (Roots)',
        questionText: `Simplify: $${selected.base}^{\\frac{1}{${selected.root}}}$`,
        answer: `${selected.result}`,
        solution: [
          {
            explanation: `Apply the fractional power rule: a^{\\frac{1}{n}} = \\sqrt[n]{a}`,
            formula: `${selected.base}^{\\frac{1}{${selected.root}}} = \\sqrt[${selected.root}]{${selected.base}}`
          },
          {
            explanation: `Find the ${selected.root === 2 ? 'square' : selected.root === 3 ? 'cube' : `${selected.root}th`} root of ${selected.base}`,
            formula: `= ${selected.result} \\quad \\text{(since } ${selected.result}^{${selected.root}} = ${selected.base}\\text{)}`
          }
        ],
        metadata: { type: 'numeric', subType: 'fractional-simple' }
      };
    } else {
      // Root with power: 8^{2/3} = 4, 27^{2/3} = 9, 16^{3/4} = 8
      const powerOptions = [
        { base: 8, num: 2, denom: 3, rootResult: 2, finalResult: 4 },
        { base: 27, num: 2, denom: 3, rootResult: 3, finalResult: 9 },
        { base: 64, num: 2, denom: 3, rootResult: 4, finalResult: 16 },
        { base: 16, num: 3, denom: 4, rootResult: 2, finalResult: 8 },
        { base: 81, num: 3, denom: 4, rootResult: 3, finalResult: 27 },
        { base: 32, num: 2, denom: 5, rootResult: 2, finalResult: 4 },
        { base: 32, num: 3, denom: 5, rootResult: 2, finalResult: 8 },
        { base: 4, num: 3, denom: 2, rootResult: 2, finalResult: 8 },
        { base: 9, num: 3, denom: 2, rootResult: 3, finalResult: 27 },
        { base: 25, num: 3, denom: 2, rootResult: 5, finalResult: 125 }
      ];
      const selected = _.sample(powerOptions);

      return {
        title: 'Fractional Powers',
        questionText: `Simplify: $${selected.base}^{\\frac{${selected.num}}{${selected.denom}}}$`,
        answer: `${selected.finalResult}`,
        solution: [
          {
            explanation: `Apply the rule: a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m`,
            formula: `${selected.base}^{\\frac{${selected.num}}{${selected.denom}}} = \\left(\\sqrt[${selected.denom}]{${selected.base}}\\right)^{${selected.num}}`
          },
          {
            explanation: `First find the ${selected.denom === 2 ? 'square' : selected.denom === 3 ? 'cube' : `${selected.denom}th`} root`,
            formula: `= (${selected.rootResult})^{${selected.num}}`
          },
          {
            explanation: `Then raise to the power of ${selected.num}`,
            formula: `= ${selected.finalResult}`
          }
        ],
        metadata: { type: 'numeric', subType: 'fractional-power' }
      };
    }
  }

  else { // combined - negative fractional
    // Questions like 8^{-2/3}, 16^{-3/4}, 27^{-1/3}
    const combinedOptions = [
      { base: 8, num: 2, denom: 3, rootResult: 2, powerResult: 4 },
      { base: 27, num: 2, denom: 3, rootResult: 3, powerResult: 9 },
      { base: 16, num: 1, denom: 2, rootResult: 4, powerResult: 4 },
      { base: 16, num: 3, denom: 4, rootResult: 2, powerResult: 8 },
      { base: 25, num: 1, denom: 2, rootResult: 5, powerResult: 5 },
      { base: 4, num: 3, denom: 2, rootResult: 2, powerResult: 8 },
      { base: 9, num: 1, denom: 2, rootResult: 3, powerResult: 3 },
      { base: 32, num: 2, denom: 5, rootResult: 2, powerResult: 4 }
    ];
    const selected = _.sample(combinedOptions);

    return {
      title: 'Negative Fractional Powers',
      questionText: `Simplify: $${selected.base}^{-\\frac{${selected.num}}{${selected.denom}}}$`,
      answer: `\\frac{1}{${selected.powerResult}}`,
      solution: [
        {
          explanation: 'First handle the negative sign: flip to make positive power',
          formula: `${selected.base}^{-\\frac{${selected.num}}{${selected.denom}}} = \\frac{1}{${selected.base}^{\\frac{${selected.num}}{${selected.denom}}}}`
        },
        {
          explanation: `Now evaluate ${selected.base}^{\\frac{${selected.num}}{${selected.denom}}} using (\\sqrt[n]{a})^m`,
          formula: `${selected.base}^{\\frac{${selected.num}}{${selected.denom}}} = \\left(\\sqrt[${selected.denom}]{${selected.base}}\\right)^{${selected.num}} = (${selected.rootResult})^{${selected.num}} = ${selected.powerResult}`
        },
        {
          explanation: 'Write the final answer',
          formula: `= \\frac{1}{${selected.powerResult}}`
        }
      ],
      metadata: { type: 'numeric', subType: 'combined' }
    };
  }
};

/**
 * TAB 2: Algebraic Indices
 * Generates questions with algebraic expressions
 * Types: simple algebraic, expressions with coefficients, simplifying fractions
 */
export const generateAlgebraicIndicesExample = (options = {}) => {
  const {
    subType = null, // 'simple', 'coefficient', 'fraction' or null for random
    difficulty = 'medium'
  } = options;

  const types = ['simple', 'coefficient', 'fraction'];
  const selectedType = subType || _.sample(types);

  if (selectedType === 'simple') {
    // Questions like x^{-3}, a^{-2}, y^{1/2}
    const variable = _.sample(['x', 'a', 'y', 'm', 'n']);
    const isNegative = Math.random() > 0.5;
    
    if (isNegative) {
      const power = _.random(2, 5);
      return {
        title: 'Algebraic Negative Powers',
        questionText: `Simplify: $${variable}^{-${power}}$`,
        answer: `\\frac{1}{${variable}^{${power}}}`,
        solution: [
          {
            explanation: 'Apply the negative power rule: a^{-n} = \\frac{1}{a^n}',
            formula: `${variable}^{-${power}} = \\frac{1}{${variable}^{${power}}}`
          }
        ],
        metadata: { type: 'algebraic', subType: 'simple-negative' }
      };
    } else {
      const fractions = [
        { num: 1, denom: 2, rootName: 'square root' },
        { num: 1, denom: 3, rootName: 'cube root' },
        { num: 2, denom: 3, rootName: 'cube root squared' },
        { num: 3, denom: 2, rootName: 'square root cubed' }
      ];
      const frac = _.sample(fractions);
      
      return {
        title: 'Algebraic Fractional Powers',
        questionText: `Simplify: $${variable}^{\\frac{${frac.num}}{${frac.denom}}}$`,
        answer: frac.num === 1 
          ? `\\sqrt[${frac.denom}]{${variable}}`
          : `\\sqrt[${frac.denom}]{${variable}^{${frac.num}}}`,
        solution: [
          {
            explanation: `Apply the fractional power rule: a^{\\frac{m}{n}} = \\sqrt[n]{a^m}`,
            formula: frac.num === 1 
              ? `${variable}^{\\frac{1}{${frac.denom}}} = \\sqrt[${frac.denom}]{${variable}}`
              : `${variable}^{\\frac{${frac.num}}{${frac.denom}}} = \\sqrt[${frac.denom}]{${variable}^{${frac.num}}}`
          }
        ],
        metadata: { type: 'algebraic', subType: 'simple-fractional' }
      };
    }
  }

  else if (selectedType === 'coefficient') {
    // Questions like (2x)^{-3}, (3a^2)^{-2}, (4x^3)^{1/2}
    const coefficients = [2, 3, 4, 5];
    const coeff = _.sample(coefficients);
    const variable = _.sample(['x', 'a', 'y']);
    const innerPower = _.random(2, 4);
    
    const questionTypes = ['negative', 'fractional'];
    const qType = _.sample(questionTypes);
    
    if (qType === 'negative') {
      const outerPower = _.random(2, 3);
      const resultCoeff = Math.pow(coeff, outerPower);
      const resultPower = innerPower * outerPower;
      
      return {
        title: 'Expressions with Negative Powers',
        questionText: `Simplify: $(${coeff}${variable}^{${innerPower}})^{-${outerPower}}$`,
        answer: `\\frac{1}{${resultCoeff}${variable}^{${resultPower}}}`,
        solution: [
          {
            explanation: 'Apply negative power rule: (ab)^{-n} = \\frac{1}{(ab)^n}',
            formula: `(${coeff}${variable}^{${innerPower}})^{-${outerPower}} = \\frac{1}{(${coeff}${variable}^{${innerPower}})^{${outerPower}}}`
          },
          {
            explanation: 'Apply power to both coefficient and variable',
            formula: `= \\frac{1}{${coeff}^{${outerPower}} \\times ${variable}^{${innerPower} \\times ${outerPower}}}`
          },
          {
            explanation: 'Calculate',
            formula: `= \\frac{1}{${resultCoeff}${variable}^{${resultPower}}}`
          }
        ],
        metadata: { type: 'algebraic', subType: 'coefficient-negative' }
      };
    } else {
      // Fractional power with coefficient - need perfect powers
      const perfectSquares = [
        { coeff: 4, root: 2 },
        { coeff: 9, root: 3 },
        { coeff: 16, root: 4 },
        { coeff: 25, root: 5 }
      ];
      const selected = _.sample(perfectSquares);
      const power = _.sample([2, 4, 6]); // Even powers for clean square roots
      const resultPower = power / 2;
      
      return {
        title: 'Expressions with Fractional Powers',
        questionText: `Simplify: $(${selected.coeff}${variable}^{${power}})^{\\frac{1}{2}}$`,
        answer: `${selected.root}${variable}^{${resultPower}}`,
        solution: [
          {
            explanation: 'Apply fractional power to both coefficient and variable',
            formula: `(${selected.coeff}${variable}^{${power}})^{\\frac{1}{2}} = ${selected.coeff}^{\\frac{1}{2}} \\times (${variable}^{${power}})^{\\frac{1}{2}}`
          },
          {
            explanation: `Calculate \\sqrt{${selected.coeff}} and multiply powers`,
            formula: `= ${selected.root} \\times ${variable}^{${power} \\times \\frac{1}{2}}`
          },
          {
            explanation: 'Simplify',
            formula: `= ${selected.root}${variable}^{${resultPower}}`
          }
        ],
        metadata: { type: 'algebraic', subType: 'coefficient-fractional' }
      };
    }
  }

  else { // fraction - simplifying algebraic fractions
    // Questions like x^3 / x^{-2}, a^5 × a^{-3}, etc.
    const variable = _.sample(['x', 'a', 'y']);
    const fractionTypes = ['divide_negative', 'multiply_negative'];
    const fracType = _.sample(fractionTypes);
    
    if (fracType === 'divide_negative') {
      const topPower = _.random(3, 6);
      const bottomPower = -_.random(2, 4);
      const resultPower = topPower - bottomPower; // Subtracting negative = adding
      
      return {
        title: 'Simplifying with Negative Powers',
        questionText: `Simplify: $\\frac{${variable}^{${topPower}}}{${variable}^{${bottomPower}}}$`,
        answer: `${variable}^{${resultPower}}`,
        solution: [
          {
            explanation: 'Apply division rule: \\frac{a^m}{a^n} = a^{m-n}',
            formula: `\\frac{${variable}^{${topPower}}}{${variable}^{${bottomPower}}} = ${variable}^{${topPower} - (${bottomPower})}`
          },
          {
            explanation: 'Subtracting a negative is adding',
            formula: `= ${variable}^{${topPower} + ${Math.abs(bottomPower)}}`
          },
          {
            explanation: 'Calculate',
            formula: `= ${variable}^{${resultPower}}`
          }
        ],
        metadata: { type: 'algebraic', subType: 'fraction-divide' }
      };
    } else {
      const power1 = _.random(3, 6);
      const power2 = -_.random(2, 4);
      const resultPower = power1 + power2;
      
      return {
        title: 'Multiplying with Negative Powers',
        questionText: `Simplify: $${variable}^{${power1}} \\times ${variable}^{${power2}}$`,
        answer: resultPower > 0 ? `${variable}^{${resultPower}}` : `\\frac{1}{${variable}^{${Math.abs(resultPower)}}}`,
        solution: [
          {
            explanation: 'Apply multiplication rule: a^m × a^n = a^{m+n}',
            formula: `${variable}^{${power1}} \\times ${variable}^{${power2}} = ${variable}^{${power1} + (${power2})}`
          },
          {
            explanation: 'Calculate the sum',
            formula: `= ${variable}^{${resultPower}}`
          },
          ...(resultPower < 0 ? [{
            explanation: 'Convert negative power to fraction',
            formula: `= \\frac{1}{${variable}^{${Math.abs(resultPower)}}}`
          }] : [])
        ],
        metadata: { type: 'algebraic', subType: 'fraction-multiply' }
      };
    }
  }
};

/**
 * TAB 3: Complex Combined (Ultimate Challenge)
 * Generates complex fractions with multiple variables and negative fractional powers
 * Format: (ax^m y^n / bx^p y^q)^{-r/s}
 */
export const generateComplexIndicesExample = (options = {}) => {
  const {
    subType = null, // 'standard', 'with_negatives', 'ultimate' or null for random
    difficulty = 'hard'
  } = options;

  const types = ['standard', 'with_negatives', 'ultimate'];
  const selectedType = subType || _.sample(types);

  if (selectedType === 'standard') {
    // Standard form: (ax^m / by^n)^{-1/2} or similar
    const options = [
      {
        numCoeff: 4, denomCoeff: 9,
        numVar: 'x', numPow: 2,
        denomVar: 'y', denomPow: 4,
        outerNum: 1, outerDenom: 2,
        // After simplification and power application
        resultNumCoeff: 3, resultDenomCoeff: 2,
        resultNumVar: 'y', resultNumPow: 2,
        resultDenomVar: 'x', resultDenomPow: 1
      },
      {
        numCoeff: 8, denomCoeff: 27,
        numVar: 'x', numPow: 6,
        denomVar: 'y', denomPow: 3,
        outerNum: 2, outerDenom: 3,
        resultNumCoeff: 9, resultDenomCoeff: 4,
        resultNumVar: 'y', resultNumPow: 2,
        resultDenomVar: 'x', resultDenomPow: 4
      },
      {
        numCoeff: 16, denomCoeff: 25,
        numVar: 'a', numPow: 4,
        denomVar: 'b', denomPow: 2,
        outerNum: 1, outerDenom: 2,
        resultNumCoeff: 5, resultDenomCoeff: 4,
        resultNumVar: 'b', resultNumPow: 1,
        resultDenomVar: 'a', resultDenomPow: 2
      }
    ];
    const q = _.sample(options);

    return {
      title: 'Complex Fraction with Negative Fractional Power',
      questionText: `Simplify: $\\left(\\frac{${q.numCoeff}${q.numVar}^{${q.numPow}}}{${q.denomCoeff}${q.denomVar}^{${q.denomPow}}}\\right)^{-\\frac{${q.outerNum}}{${q.outerDenom}}}$`,
      answer: `\\frac{${q.resultNumCoeff}${q.resultNumVar}^{${q.resultNumPow}}}{${q.resultDenomCoeff}${q.resultDenomVar}^{${q.resultDenomPow}}}`,
      solution: [
        {
          explanation: 'First, handle the negative power by flipping the fraction',
          formula: `\\left(\\frac{${q.numCoeff}${q.numVar}^{${q.numPow}}}{${q.denomCoeff}${q.denomVar}^{${q.denomPow}}}\\right)^{-\\frac{${q.outerNum}}{${q.outerDenom}}} = \\left(\\frac{${q.denomCoeff}${q.denomVar}^{${q.denomPow}}}{${q.numCoeff}${q.numVar}^{${q.numPow}}}\\right)^{\\frac{${q.outerNum}}{${q.outerDenom}}}`
        },
        {
          explanation: 'Apply the fractional power to numerator and denominator separately',
          formula: `= \\frac{(${q.denomCoeff}${q.denomVar}^{${q.denomPow}})^{\\frac{${q.outerNum}}{${q.outerDenom}}}}{(${q.numCoeff}${q.numVar}^{${q.numPow}})^{\\frac{${q.outerNum}}{${q.outerDenom}}}}`
        },
        {
          explanation: 'Apply power to coefficients and variables',
          formula: `= \\frac{${q.denomCoeff}^{\\frac{${q.outerNum}}{${q.outerDenom}}} \\times ${q.denomVar}^{${q.denomPow} \\times \\frac{${q.outerNum}}{${q.outerDenom}}}}{${q.numCoeff}^{\\frac{${q.outerNum}}{${q.outerDenom}}} \\times ${q.numVar}^{${q.numPow} \\times \\frac{${q.outerNum}}{${q.outerDenom}}}}`
        },
        {
          explanation: 'Calculate each part',
          formula: `= \\frac{${q.resultNumCoeff}${q.resultNumVar}^{${q.resultNumPow}}}{${q.resultDenomCoeff}${q.resultDenomVar}^{${q.resultDenomPow}}}`
        }
      ],
      metadata: { type: 'complex', subType: 'standard' }
    };
  }

  else if (selectedType === 'with_negatives') {
    // With negative powers in the original: (8x^3 y^{-6} / 27x^{-3} y^3)^{2/3}
    const options = [
      {
        question: '\\left(\\frac{8x^3 y^{-6}}{27x^{-3}y^3}\\right)^{\\frac{2}{3}}',
        steps: [
          {
            explanation: 'First simplify inside the bracket using index laws',
            formula: '\\frac{8x^3 y^{-6}}{27x^{-3}y^3} = \\frac{8}{27} \\times x^{3-(-3)} \\times y^{-6-3} = \\frac{8x^6}{27y^9}'
          },
          {
            explanation: 'Now apply the fractional power \\frac{2}{3}',
            formula: '\\left(\\frac{8x^6}{27y^9}\\right)^{\\frac{2}{3}} = \\frac{8^{\\frac{2}{3}} \\times x^{6 \\times \\frac{2}{3}}}{27^{\\frac{2}{3}} \\times y^{9 \\times \\frac{2}{3}}}'
          },
          {
            explanation: 'Calculate: 8^{2/3} = (\\sqrt[3]{8})^2 = 2^2 = 4 and 27^{2/3} = 3^2 = 9',
            formula: '= \\frac{4x^4}{9y^6}'
          }
        ],
        answer: '\\frac{4x^4}{9y^6}'
      },
      {
        question: '\\left(\\frac{16a^{-4}b^2}{81a^4 b^{-6}}\\right)^{-\\frac{1}{2}}',
        steps: [
          {
            explanation: 'First simplify inside using index laws',
            formula: '\\frac{16a^{-4}b^2}{81a^4 b^{-6}} = \\frac{16}{81} \\times a^{-4-4} \\times b^{2-(-6)} = \\frac{16b^8}{81a^8}'
          },
          {
            explanation: 'Apply negative fractional power (flip and root)',
            formula: '\\left(\\frac{16b^8}{81a^8}\\right)^{-\\frac{1}{2}} = \\left(\\frac{81a^8}{16b^8}\\right)^{\\frac{1}{2}}'
          },
          {
            explanation: 'Take the square root of each part',
            formula: '= \\frac{9a^4}{4b^4}'
          }
        ],
        answer: '\\frac{9a^4}{4b^4}'
      },
      {
        question: '\\left(\\frac{27p^{-3}q^6}{64p^6 q^{-3}}\\right)^{-\\frac{2}{3}}',
        steps: [
          {
            explanation: 'First simplify inside using index laws',
            formula: '\\frac{27p^{-3}q^6}{64p^6 q^{-3}} = \\frac{27}{64} \\times p^{-3-6} \\times q^{6-(-3)} = \\frac{27q^9}{64p^9}'
          },
          {
            explanation: 'Apply negative fractional power',
            formula: '\\left(\\frac{27q^9}{64p^9}\\right)^{-\\frac{2}{3}} = \\left(\\frac{64p^9}{27q^9}\\right)^{\\frac{2}{3}}'
          },
          {
            explanation: 'Calculate: 64^{2/3} = 4^2 = 16 and 27^{2/3} = 3^2 = 9',
            formula: '= \\frac{16p^6}{9q^6}'
          }
        ],
        answer: '\\frac{16p^6}{9q^6}'
      }
    ];
    const q = _.sample(options);

    return {
      title: 'Complex Expression with Negative Powers',
      questionText: `Simplify: $${q.question}$`,
      answer: q.answer,
      solution: q.steps,
      metadata: { type: 'complex', subType: 'with_negatives' }
    };
  }

  else { // ultimate - both x and y in numerator AND denominator
    // Format: (ax^m y^n / bx^p y^q)^{-r/s}
    const options = [
      {
        question: '\\left(\\frac{4x^2 y^6}{9x^8 y^2}\\right)^{-\\frac{1}{2}}',
        steps: [
          {
            explanation: 'First simplify inside the bracket',
            formula: '\\frac{4x^2 y^6}{9x^8 y^2} = \\frac{4}{9} \\times x^{2-8} \\times y^{6-2} = \\frac{4y^4}{9x^6}'
          },
          {
            explanation: 'Apply negative power (flip the fraction)',
            formula: '\\left(\\frac{4y^4}{9x^6}\\right)^{-\\frac{1}{2}} = \\left(\\frac{9x^6}{4y^4}\\right)^{\\frac{1}{2}}'
          },
          {
            explanation: 'Take square root of each part',
            formula: '= \\frac{\\sqrt{9} \\times \\sqrt{x^6}}{\\sqrt{4} \\times \\sqrt{y^4}} = \\frac{3x^3}{2y^2}'
          }
        ],
        answer: '\\frac{3x^3}{2y^2}'
      },
      {
        question: '\\left(\\frac{8x^3 y^9}{27x^{12} y^3}\\right)^{-\\frac{2}{3}}',
        steps: [
          {
            explanation: 'First simplify inside the bracket',
            formula: '\\frac{8x^3 y^9}{27x^{12} y^3} = \\frac{8}{27} \\times x^{3-12} \\times y^{9-3} = \\frac{8y^6}{27x^9}'
          },
          {
            explanation: 'Apply negative power (flip the fraction)',
            formula: '\\left(\\frac{8y^6}{27x^9}\\right)^{-\\frac{2}{3}} = \\left(\\frac{27x^9}{8y^6}\\right)^{\\frac{2}{3}}'
          },
          {
            explanation: 'Apply fractional power: 27^{2/3} = 9, 8^{2/3} = 4',
            formula: '= \\frac{9x^6}{4y^4}'
          }
        ],
        answer: '\\frac{9x^6}{4y^4}'
      },
      {
        question: '\\left(\\frac{16a^4 b^{-2}}{81a^{-4} b^6}\\right)^{-\\frac{1}{2}}',
        steps: [
          {
            explanation: 'First simplify inside using index laws',
            formula: '\\frac{16a^4 b^{-2}}{81a^{-4} b^6} = \\frac{16}{81} \\times a^{4-(-4)} \\times b^{-2-6} = \\frac{16a^8}{81b^8}'
          },
          {
            explanation: 'Apply negative power (flip and take square root)',
            formula: '\\left(\\frac{16a^8}{81b^8}\\right)^{-\\frac{1}{2}} = \\left(\\frac{81b^8}{16a^8}\\right)^{\\frac{1}{2}}'
          },
          {
            explanation: 'Take square root of each part',
            formula: '= \\frac{9b^4}{4a^4}'
          }
        ],
        answer: '\\frac{9b^4}{4a^4}'
      },
      {
        question: '\\left(\\frac{125x^6 y^{-9}}{8x^{-3} y^{12}}\\right)^{-\\frac{1}{3}}',
        steps: [
          {
            explanation: 'First simplify inside using index laws',
            formula: '\\frac{125x^6 y^{-9}}{8x^{-3} y^{12}} = \\frac{125}{8} \\times x^{6-(-3)} \\times y^{-9-12} = \\frac{125x^9}{8y^{21}}'
          },
          {
            explanation: 'Apply negative power (flip and take cube root)',
            formula: '\\left(\\frac{125x^9}{8y^{21}}\\right)^{-\\frac{1}{3}} = \\left(\\frac{8y^{21}}{125x^9}\\right)^{\\frac{1}{3}}'
          },
          {
            explanation: 'Take cube root of each part: \\sqrt[3]{8}=2, \\sqrt[3]{125}=5',
            formula: '= \\frac{2y^7}{5x^3}'
          }
        ],
        answer: '\\frac{2y^7}{5x^3}'
      }
    ];
    const q = _.sample(options);

    return {
      title: 'Ultimate Challenge: Complex Algebraic Fraction',
      questionText: `Simplify: $${q.question}$`,
      answer: q.answer,
      solution: q.steps,
      metadata: { type: 'complex', subType: 'ultimate' }
    };
  }
};

/**
 * Main export: Generate examples for all three tabs
 * Returns array of three examples, one from each category
 */
export const generateIndicesExamples = (options = {}) => {
  const { seed = Date.now() } = options;
  
  return [
    generateNumericIndicesExample({ ...options, seed }),
    generateAlgebraicIndicesExample({ ...options, seed: seed + 1000 }),
    generateComplexIndicesExample({ ...options, seed: seed + 2000 })
  ];
};

// Export individual generators for flexibility
export const indicesExamplesGenerators = {
  generateNumericIndicesExample,
  generateAlgebraicIndicesExample,
  generateComplexIndicesExample,
  generateIndicesExamples
};

export default indicesExamplesGenerators;