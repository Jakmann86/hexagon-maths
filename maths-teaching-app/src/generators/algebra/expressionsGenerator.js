// src/generators/algebra/expressionsGenerator.js - Enhanced with Phase 2 additions
import _ from 'lodash';

/**
 * Unified expanding single brackets generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateExpandingSingleBrackets = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'starter',
    units = ''
  } = options;

  // UNIFIED MATH LOGIC
  const outsideFactor = difficulty === 'easy' ? _.random(2, 4) : _.random(2, 6);
  const firstTerm = difficulty === 'easy' ? _.random(1, 5) : _.random(1, 8);
  const secondTerm = difficulty === 'easy' ? _.random(1, 5) : _.random(1, 8);

  // Occasionally use negative terms for variety (but not in easy mode)
  const useNegative = difficulty !== 'easy' && Math.random() > 0.7;
  const actualSecondTerm = useNegative ? -secondTerm : secondTerm;

  const expandedFirst = outsideFactor * firstTerm;
  const expandedSecond = outsideFactor * actualSecondTerm;

  // Build expression strings
  const expression = actualSecondTerm >= 0
    ? `${outsideFactor}(${firstTerm}x + ${actualSecondTerm})`
    : `${outsideFactor}(${firstTerm}x - ${Math.abs(actualSecondTerm)})`;

  const answer = expandedSecond >= 0
    ? `${expandedFirst}x + ${expandedSecond}`
    : `${expandedFirst}x - ${Math.abs(expandedSecond)}`;

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    const workingOut = actualSecondTerm >= 0
      ? `${expression} = ${outsideFactor} \\times ${firstTerm}x + ${outsideFactor} \\times ${actualSecondTerm} = ${answer}`
      : `${expression} = ${outsideFactor} \\times ${firstTerm}x + ${outsideFactor} \\times (${actualSecondTerm}) = ${answer}`;

    return {
      question: `Expand ${expression}`,
      answer: workingOut,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect answers with common mistakes
    const incorrectAnswers = [
      // Mistake 1: Only multiplying first term
      actualSecondTerm >= 0
        ? `${expandedFirst}x + ${actualSecondTerm}`
        : `${expandedFirst}x - ${Math.abs(actualSecondTerm)}`,

      // Mistake 2: Adding instead of multiplying
      `${outsideFactor + firstTerm}x + ${outsideFactor + actualSecondTerm}`,

      // Mistake 3: Calculation error
      expandedSecond >= 0
        ? `${expandedFirst + 1}x + ${expandedSecond - 1}`
        : `${expandedFirst - 1}x - ${Math.abs(expandedSecond) + 1}`
    ];

    return {
      questionDisplay: {
        text: 'Expand:',
        math: expression
      },
      correctAnswer: answer,
      options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
      explanation: `To expand, multiply the term outside the brackets by each term inside: ${outsideFactor} × ${firstTerm}x + ${outsideFactor} × ${actualSecondTerm} = ${answer}`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "To expand brackets, multiply the term outside by each term inside the brackets",
        formula: `${outsideFactor}(${firstTerm}x + ${actualSecondTerm})`
      },
      {
        explanation: "Multiply the outside term by the first term inside",
        formula: `${outsideFactor} \\times ${firstTerm}x = ${expandedFirst}x`
      },
      {
        explanation: "Multiply the outside term by the second term inside",
        formula: `${outsideFactor} \\times ${actualSecondTerm >= 0 ? actualSecondTerm : `(${actualSecondTerm})`} = ${expandedSecond}`
      },
      {
        explanation: "Combine both results to get the final answer",
        formula: `${answer}`
      }
    ];

    return {
      title: "Expanding Single Brackets",
      questionText: `Expand ${expression}`,
      solution
    };
  }

  // Fallback to starter format
  return generateExpandingSingleBrackets({ ...options, sectionType: 'starter' });
};

/**
 * Unified simplifying expressions generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateSimplifyingExpression = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // UNIFIED MATH LOGIC
  const operationType = _.sample(['collect', 'multiply', 'divide']);

  if (operationType === 'collect') {
    // Generate collecting like terms question
    const useOneVariable = difficulty === 'easy' || Math.random() > 0.5;

    // Generate coefficients with some negative values
    const xCoefficients = [
      _.random(0, 3) === 0 ? -_.random(1, 6) : _.random(1, 6),
      _.random(0, 3) === 0 ? -_.random(1, 6) : _.random(1, 6)
    ];

    const yCoefficients = useOneVariable ? [0, 0] : [
      _.random(0, 3) === 0 ? -_.random(1, 6) : _.random(1, 6),
      _.random(0, 3) === 0 ? -_.random(1, 6) : _.random(1, 6)
    ];

    const constants = [
      _.random(0, 3) === 0 ? -_.random(1, 6) : _.random(1, 6),
      _.random(0, 3) === 0 ? -_.random(1, 6) : _.random(1, 6)
    ];

    // Calculate simplified results
    const simplifiedX = xCoefficients[0] + xCoefficients[1];
    const simplifiedY = yCoefficients[0] + yCoefficients[1];
    const simplifiedConstant = constants[0] + constants[1];

    // Helper function to format terms
    const formatTerm = (coefficient, variable = '') => {
      if (coefficient === 0) return '';
      if (coefficient === 1 && variable) return `+${variable}`;
      if (coefficient === -1 && variable) return `-${variable}`;
      return coefficient > 0 ? `+${coefficient}${variable}` : `${coefficient}${variable}`;
    };

    // Create expression string
    const firstX = formatTerm(xCoefficients[0], 'x').replace(/^\+/, '');
    const firstY = useOneVariable ? '' : formatTerm(yCoefficients[0], 'y');
    const firstConstant = formatTerm(constants[0]);
    const secondX = formatTerm(xCoefficients[1], 'x');
    const secondY = useOneVariable ? '' : formatTerm(yCoefficients[1], 'y');
    const secondConstant = formatTerm(constants[1]);

    const expression = `${firstX}${firstY}${firstConstant}${secondX}${secondY}${secondConstant}`;

    // Create answer string
    let answerTerms = [];
    if (simplifiedX !== 0) {
      answerTerms.push(simplifiedX === 1 ? 'x' : simplifiedX === -1 ? '-x' : `${simplifiedX}x`);
    }
    if (!useOneVariable && simplifiedY !== 0) {
      answerTerms.push(simplifiedY === 1 ? 'y' : simplifiedY === -1 ? '-y' : `${simplifiedY}y`);
    }
    if (simplifiedConstant !== 0) {
      answerTerms.push(`${simplifiedConstant}`);
    }

    let answer = '';
    answerTerms.forEach((term, index) => {
      if (index === 0) {
        answer += term;
      } else {
        if (!term.startsWith('-')) {
          answer += '+' + term;
        } else {
          answer += term;
        }
      }
    });

    if (answer === '') answer = '0';

    // SECTION-AWARE OUTPUT FORMATTING
    if (sectionType === 'starter') {
      return {
        question: `Simplify by collecting like terms: ${expression}`,
        answer: `${expression} = ${answer}`,
        difficulty: 'algebra'
      };
    }

    else if (sectionType === 'diagnostic') {
      // Generate distinct incorrect answers
      const incorrectAnswers = [
        `${Math.abs(xCoefficients[0] + xCoefficients[1] + yCoefficients[0] + yCoefficients[1] + constants[0] + constants[1])}`,
        // Add more thoughtful incorrect options based on common mistakes
        `${Math.abs(xCoefficients[0] + xCoefficients[1])}x + ${Math.abs(constants[0] + constants[1])}`, // Ignoring signs
        `${xCoefficients[0]}x + ${xCoefficients[1]}x + ${constants[0]} + ${constants[1]}` // Not collecting
      ];

      // Ensure uniqueness
      const allOptions = [answer, ...incorrectAnswers].filter((option, index, arr) =>
        option && option !== '' && arr.indexOf(option) === index
      );

      while (allOptions.length < 4) {
        allOptions.push(`${_.random(1, 20)}x + ${_.random(1, 10)}`);
      }

      return {
        questionDisplay: {
          text: 'Simplify by collecting like terms:',
          math: expression
        },
        correctAnswer: answer,
        options: allOptions.slice(0, 4).sort(() => Math.random() - 0.5),
        explanation: `Collect like terms: x terms give ${simplifiedX}x, constants give ${simplifiedConstant}`
      };
    }

    else if (sectionType === 'examples') {
      const solution = [
        {
          explanation: "Identify the like terms in the expression",
          formula: `${expression}`
        },
        {
          explanation: "Collect the x terms together",
          formula: `${xCoefficients[0]}x + ${xCoefficients[1]}x = ${simplifiedX}x`
        },
        {
          explanation: "Collect the constant terms together",
          formula: `${constants[0]} + ${constants[1]} = ${simplifiedConstant}`
        },
        {
          explanation: "Write the final simplified expression",
          formula: `${answer}`
        }
      ];

      return {
        title: "Collecting Like Terms",
        questionText: `Simplify ${expression}`,
        solution
      };
    }
  }

  else if (operationType === 'multiply') {
    // Generate multiplication question
    const firstCoeff = _.random(2, 6);
    const secondCoeff = _.random(2, 6);
    const result = firstCoeff * secondCoeff;
    const answer = result === 1 ? "x" : `${result}x`;

    // SECTION-AWARE OUTPUT
    if (sectionType === 'starter') {
      return {
        question: `Calculate: ${firstCoeff} × ${secondCoeff}x`,
        answer: `${firstCoeff} \\times ${secondCoeff}x = ${answer}`,
        difficulty: 'algebra'
      };
    }

    else if (sectionType === 'diagnostic') {
      const incorrectAnswers = [
        `${firstCoeff + secondCoeff}x`,  // Adding instead
        `${result}`,                     // Forgetting variable
        `${result + 1}x`                // Calculation error
      ];

      return {
        questionDisplay: {
          text: 'Calculate:',
          math: `${firstCoeff} \\times ${secondCoeff}x`
        },
        correctAnswer: answer,
        options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
        explanation: `Multiply coefficients: ${firstCoeff} × ${secondCoeff} = ${result}, so answer is ${answer}`
      };
    }
  }

  else { // Division
    const resultCoeff = _.random(2, 6);
    const divisor = _.random(2, 4);
    const dividendCoeff = resultCoeff * divisor;
    const answer = resultCoeff === 1 ? "x" : `${resultCoeff}x`;

    // SECTION-AWARE OUTPUT
    if (sectionType === 'starter') {
      return {
        question: `Calculate: ${dividendCoeff}x ÷ ${divisor}`,
        answer: `${dividendCoeff}x \\div ${divisor} = ${answer}`,
        difficulty: 'algebra'
      };
    }

    else if (sectionType === 'diagnostic') {
      const incorrectAnswers = [
        `${resultCoeff}`,           // Forgetting variable
        `${resultCoeff + 1}x`,      // Calculation error
        `${Math.floor(dividendCoeff / divisor) + 1}x` // Different error
      ];

      return {
        questionDisplay: {
          text: 'Calculate:',
          math: `${dividendCoeff}x \\div ${divisor}`
        },
        correctAnswer: answer,
        options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
        explanation: `Divide coefficients: ${dividendCoeff} ÷ ${divisor} = ${resultCoeff}, so answer is ${answer}`
      };
    }
  }

  // Fallback to diagnostic format
  return generateSimplifyingExpression({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate collecting like terms with signs for simultaneous equations diagnostic
 * Tests operations like (-9y) + (-12y) and (-18x) - (-8x)
 */
export const generateCollectingLikeTermsWithSigns = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // Generate coefficients
    const coeff1 = _.random(5, 18);
    const coeff2 = _.random(3, 15);
    const variable = _.sample(['x', 'y', 'a', 'b']);

    // Create sign scenarios that commonly appear in simultaneous equations
    const scenarios = [
        { first: -coeff1, second: -coeff2, op: '+' },  // (-9y) + (-12y)
        { first: -coeff1, second: coeff2, op: '-' },   // (-18x) - (-8x)  
        { first: coeff1, second: -coeff2, op: '+' },   // (7a) + (-3a)
        { first: -coeff1, second: -coeff2, op: '-' }   // (-5b) - (-11b)
    ];
    
    const scenario = _.sample(scenarios);
    const result = scenario.op === '+' ? 
        scenario.first + scenario.second : 
        scenario.first - scenario.second;

    // Format question and answer
    const firstTerm = scenario.first < 0 ? `(${scenario.first})${variable}` : `${scenario.first}${variable}`;
    const secondTerm = scenario.second < 0 ? `(${scenario.second})${variable}` : `${scenario.second}${variable}`;
    const questionText = `${firstTerm} ${scenario.op} ${secondTerm}`;
    
    const correctAnswer = result === 0 ? '0' : 
                         result === 1 ? variable :
                         result === -1 ? `-${variable}` :
                         `${result}${variable}`;

    // Generate strategic distractors
    const incorrectOptions = [
        `${Math.abs(scenario.first) + Math.abs(scenario.second)}${variable}`, // Ignore signs
        `${-result}${variable}`,                                              // Wrong sign
        `${scenario.op === '+' ? scenario.first - scenario.second : scenario.first + scenario.second}${variable}` // Wrong operation
    ].filter(opt => opt !== correctAnswer);

    return {
        questionDisplay: {
            text: 'Simplify by collecting like terms:',
            math: questionText.replace(/\(/g, '').replace(/\)/g, '')
        },
        correctAnswer,
        options: [correctAnswer, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
        explanation: `Combine like terms: ${scenario.first} ${scenario.op} ${scenario.second} = ${result}, so answer is ${correctAnswer}`
    };
};

/**
 * Unified expanding double brackets generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateExpandingDoubleBrackets = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'starter',
    units = ''
  } = options;

  // UNIFIED MATH LOGIC
  let a, b, c, d;

  if (difficulty === 'easy') {
    // Easy: Simple coefficients, mostly positive
    a = _.random(1, 2);
    b = _.random(1, 5);
    c = _.random(1, 2);
    d = _.random(1, 5);
  } else if (difficulty === 'medium') {
    // Medium: Some negative values, coefficients up to 3
    a = _.random(1, 3);
    b = Math.random() > 0.7 ? -_.random(1, 4) : _.random(1, 4);
    c = _.random(1, 3);
    d = Math.random() > 0.7 ? -_.random(1, 4) : _.random(1, 4);
  } else {
    // Hard: More complex coefficients and negatives
    a = _.random(1, 4);
    b = Math.random() > 0.5 ? -_.random(1, 6) : _.random(1, 6);
    c = _.random(1, 4);
    d = Math.random() > 0.5 ? -_.random(1, 6) : _.random(1, 6);
  }

  // Calculate expanded form using FOIL
  const firstTerm = a * c; // x^2 coefficient
  const outerTerm = a * d; // outer x term
  const innerTerm = b * c; // inner x term
  const lastTerm = b * d;  // constant term
  const middleTerm = outerTerm + innerTerm; // combined x coefficient

  // Build bracket expressions
  const bracket1 = a === 1 ?
    (b >= 0 ? `(x + ${b})` : `(x - ${Math.abs(b)})`) :
    (b >= 0 ? `(${a}x + ${b})` : `(${a}x - ${Math.abs(b)})`);

  const bracket2 = c === 1 ?
    (d >= 0 ? `(x + ${d})` : `(x - ${Math.abs(d)})`) :
    (d >= 0 ? `(${c}x + ${d})` : `(${c}x - ${Math.abs(d)})`);

  const expression = `${bracket1}${bracket2}`;

  // Build answer
  let answerTerms = [];

  // x^2 term
  if (firstTerm === 1) {
    answerTerms.push('x^2');
  } else {
    answerTerms.push(`${firstTerm}x^2`);
  }

  // x term
  if (middleTerm > 0) {
    answerTerms.push(middleTerm === 1 ? '+ x' : `+ ${middleTerm}x`);
  } else if (middleTerm < 0) {
    answerTerms.push(Math.abs(middleTerm) === 1 ? '- x' : `- ${Math.abs(middleTerm)}x`);
  }

  // constant term
  if (lastTerm > 0) {
    answerTerms.push(`+ ${lastTerm}`);
  } else if (lastTerm < 0) {
    answerTerms.push(`- ${Math.abs(lastTerm)}`);
  }

  const answer = answerTerms.join(' ').replace(/^\+ /, '');

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    const workingOut = `${expression}\\\\
      \\text{First: } ${a === 1 ? '' : a}x \\times ${c === 1 ? '' : c}x = ${firstTerm}x^2\\\\
      \\text{Outer: } ${a === 1 ? '' : a}x \\times ${d} = ${outerTerm}x\\\\
      \\text{Inner: } ${b} \\times ${c === 1 ? '' : c}x = ${innerTerm}x\\\\
      \\text{Last: } ${b} \\times ${d} = ${lastTerm}\\\\
      \\text{Combine: } ${answer}`;

    return {
      question: `Expand ${expression}`,
      answer: workingOut,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect answers with common mistakes
    const incorrectAnswers = [
      // Mistake 1: Only multiply first and last terms
      `${firstTerm}x^2 + ${lastTerm}`,

      // Mistake 2: Wrong middle term (forget one of outer/inner)
      middleTerm >= 0 ?
        `${firstTerm}x^2 + ${outerTerm}x + ${lastTerm}` :
        `${firstTerm}x^2 - ${Math.abs(outerTerm)}x + ${lastTerm}`,

      // Mistake 3: Add instead of multiply
      `${a + c}x^2 + ${b + d}x + ${Math.abs(b * d)}`
    ];

    return {
      questionDisplay: {
        text: 'Expand:',
        math: expression
      },
      correctAnswer: answer,
      options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
      explanation: `Use FOIL: First (${firstTerm}x²), Outer (${outerTerm}x), Inner (${innerTerm}x), Last (${lastTerm}), then combine like terms.`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "We use the FOIL method to expand the expression",
        formula: expression
      },
      {
        explanation: "First: Multiply the first terms in each bracket",
        formula: `\\text{First: } ${a === 1 ? '' : a}x \\times ${c === 1 ? '' : c}x = ${firstTerm}x^2`
      },
      {
        explanation: "Outer: Multiply the outside terms",
        formula: `\\text{Outer: } ${a === 1 ? '' : a}x \\times ${d} = ${outerTerm}x`
      },
      {
        explanation: "Inner: Multiply the inside terms",
        formula: `\\text{Inner: } ${b} \\times ${c === 1 ? '' : c}x = ${innerTerm}x`
      },
      {
        explanation: "Last: Multiply the last terms in each bracket",
        formula: `\\text{Last: } ${b} \\times ${d} = ${lastTerm}`
      },
      {
        explanation: "Combine all terms",
        formula: `${firstTerm}x^2 + ${outerTerm}x + ${innerTerm}x + ${lastTerm}`
      },
      {
        explanation: "Simplify by collecting like terms",
        formula: answer
      }
    ];

    return {
      title: "Expanding Double Brackets",
      questionText: `Expand ${expression}`,
      solution
    };
  }

  // Fallback to starter format
  return generateExpandingDoubleBrackets({ ...options, sectionType: 'starter' });
};

/**
 * Generate triple bracket expansion with FULL computation
 * Handles expressions like (x+1)(x+2)(x+3)
 * Now calculates the complete cubic expansion
 */
export const generateExpandingTripleBrackets = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  // Generate simpler coefficients for triple brackets (complexity increases quickly)
  const a = _.random(1, 2);
  const b = _.random(1, 3);
  const c = _.random(1, 2);
  const d = _.random(1, 3);
  const e = _.random(1, 2);
  const f = _.random(1, 3);

  // Keep mostly positive for manageability
  const actualB = difficulty === 'hard' && Math.random() > 0.7 ? -b : b;
  const actualD = difficulty === 'hard' && Math.random() > 0.7 ? -d : d;
  const actualF = difficulty === 'hard' && Math.random() > 0.7 ? -f : f;

  // Build bracket expressions
  const bracket1 = a === 1 ?
    (actualB >= 0 ? `(x + ${actualB})` : `(x - ${Math.abs(actualB)})`) :
    (actualB >= 0 ? `(${a}x + ${actualB})` : `(${a}x - ${Math.abs(actualB)})`);

  const bracket2 = c === 1 ?
    (actualD >= 0 ? `(x + ${actualD})` : `(x - ${Math.abs(actualD)})`) :
    (actualD >= 0 ? `(${c}x + ${actualD})` : `(${c}x - ${Math.abs(actualD)})`);

  const bracket3 = e === 1 ?
    (actualF >= 0 ? `(x + ${actualF})` : `(x - ${Math.abs(actualF)})`) :
    (actualF >= 0 ? `(${e}x + ${actualF})` : `(${e}x - ${Math.abs(actualF)})`);

  const expression = `${bracket1}${bracket2}${bracket3}`;

  // STEP 1: Expand first two brackets using FOIL
  const first12 = a * c; // x^2 coefficient
  const outer12 = a * actualD; // outer x term
  const inner12 = actualB * c; // inner x term
  const last12 = actualB * actualD; // constant term
  const middle12 = outer12 + inner12; // combined x coefficient

  // Build the intermediate quadratic expression
  let quadTerms = [];
  if (first12 === 1) {
    quadTerms.push('x^2');
  } else {
    quadTerms.push(`${first12}x^2`);
  }
  
  if (middle12 > 0) {
    quadTerms.push(middle12 === 1 ? '+ x' : `+ ${middle12}x`);
  } else if (middle12 < 0) {
    quadTerms.push(Math.abs(middle12) === 1 ? '- x' : `- ${Math.abs(middle12)}x`);
  }
  
  if (last12 > 0) {
    quadTerms.push(`+ ${last12}`);
  } else if (last12 < 0) {
    quadTerms.push(`- ${Math.abs(last12)}`);
  }
  
  const intermediateQuadratic = quadTerms.join(' ').replace(/^\+ /, '');

  // STEP 2: Multiply the quadratic by the third bracket
  // (ax^2 + bx + c)(ex + f)
  const x3_coeff = first12 * e; // x^3 term
  const x2_coeff = first12 * actualF + middle12 * e; // x^2 term
  const x1_coeff = middle12 * actualF + last12 * e; // x term
  const x0_coeff = last12 * actualF; // constant term

  // Build the final cubic expression
  let finalTerms = [];
  
  // x^3 term
  if (x3_coeff === 1) {
    finalTerms.push('x^3');
  } else if (x3_coeff === -1) {
    finalTerms.push('-x^3');
  } else {
    finalTerms.push(`${x3_coeff}x^3`);
  }
  
  // x^2 term
  if (x2_coeff > 0) {
    finalTerms.push(x2_coeff === 1 ? '+ x^2' : `+ ${x2_coeff}x^2`);
  } else if (x2_coeff < 0) {
    finalTerms.push(Math.abs(x2_coeff) === 1 ? '- x^2' : `- ${Math.abs(x2_coeff)}x^2`);
  }
  
  // x term
  if (x1_coeff > 0) {
    finalTerms.push(x1_coeff === 1 ? '+ x' : `+ ${x1_coeff}x`);
  } else if (x1_coeff < 0) {
    finalTerms.push(Math.abs(x1_coeff) === 1 ? '- x' : `- ${Math.abs(x1_coeff)}x`);
  }
  
  // constant term
  if (x0_coeff > 0) {
    finalTerms.push(`+ ${x0_coeff}`);
  } else if (x0_coeff < 0) {
    finalTerms.push(`- ${Math.abs(x0_coeff)}`);
  }
  
  const finalAnswer = finalTerms.join(' ').replace(/^\+ /, '');

  // SECTION-AWARE OUTPUT
  if (sectionType === 'starter') {
    return {
      question: `Expand ${expression}`,
      answer: `${expression}\\\\
        \\text{Step 1: } ${bracket1}${bracket2} = ${intermediateQuadratic}\\\\
        \\text{Step 2: } (${intermediateQuadratic})${bracket3}\\\\
        \\text{Answer: } ${finalAnswer}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "When expanding three brackets, expand two brackets first",
        formula: `${expression} = [${bracket1}${bracket2}] \\times ${bracket3}`
      },
      {
        explanation: `First expand ${bracket1}${bracket2} using FOIL`,
        formula: `${bracket1}${bracket2} = ${intermediateQuadratic}`
      },
      {
        explanation: "Now multiply each term in the quadratic by each term in the third bracket",
        formula: `(${intermediateQuadratic})${bracket3}`
      },
      {
        explanation: `Multiply each term: ${first12 === 1 ? '' : first12}x^2 \\times ${e === 1 ? '' : e}x = ${x3_coeff === 1 ? '' : x3_coeff}x^3`,
        formula: `${x3_coeff === 1 ? '' : x3_coeff}x^3 ${x2_coeff >= 0 ? '+' : ''} ${x2_coeff === 0 ? '' : Math.abs(x2_coeff) === 1 ? (x2_coeff > 0 ? '' : '-') + 'x^2' : x2_coeff + 'x^2'} ${x1_coeff >= 0 ? '+' : ''} ${x1_coeff === 0 ? '' : Math.abs(x1_coeff) === 1 ? (x1_coeff > 0 ? '' : '-') + 'x' : x1_coeff + 'x'} ${x0_coeff >= 0 ? '+' : ''} ${x0_coeff === 0 ? '' : x0_coeff}`
      },
      {
        explanation: "Collect like terms to get the final cubic expression",
        formula: finalAnswer
      }
    ];

    return {
      title: "Expanding Triple Brackets",
      questionText: `Expand ${expression}`,
      solution
    };
  }

  return generateExpandingTripleBrackets({ ...options, sectionType: 'examples' });
};

/**
 * NEW: Generate basic powers and indices operations
 * Handles simple index laws like x² × x³ = x⁵
 */
export const generateBasicIndices = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const operationTypes = ['multiply', 'divide', 'power_of_power', 'evaluate'];
  const operationType = difficulty === 'easy' ?
    _.sample(['multiply', 'evaluate']) :
    _.sample(operationTypes);

  let question, answer, workingSteps;

  if (operationType === 'multiply') {
    // x^a × x^b = x^(a+b)
    const a = _.random(2, 6);
    const b = _.random(2, 6);
    const result = a + b;

    question = `x^${a} \\times x^${b}`;
    answer = `x^${result}`;
    workingSteps = [`x^${a} \\times x^${b} = x^{${a}+${b}} = x^${result}`];
  }

  else if (operationType === 'divide') {
    // x^a ÷ x^b = x^(a-b)
    const a = _.random(5, 10);
    const b = _.random(2, a - 1);
    const result = a - b;

    question = `x^${a} \\div x^${b}`;
    answer = `x^${result}`;
    workingSteps = [`x^${a} \\div x^${b} = x^{${a}-${b}} = x^${result}`];
  }

  else if (operationType === 'power_of_power') {
    // (x^a)^b = x^(ab)
    const a = _.random(2, 4);
    const b = _.random(2, 4);
    const result = a * b;

    question = `(x^${a})^${b}`;
    answer = `x^${result}`;
    workingSteps = [`(x^${a})^${b} = x^{${a} \\times ${b}} = x^${result}`];
  }

  else { // evaluate
    // Simple number powers like 2³ = 8
    const base = _.random(2, 5);
    const power = _.random(2, 4);
    const result = Math.pow(base, power);

    question = `${base}^${power}`;
    answer = `${result}`;
    workingSteps = [`${base}^${power} = ${base} \\times ${base}${power > 2 ? ` \\times ${base}` : ''}${power > 3 ? ` \\times ${base}` : ''} = ${result}`];
  }

  // Section-aware output
  if (sectionType === 'starter') {
    return {
      question: `Calculate: ${question}`,
      answer: workingSteps[0],
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    const incorrectOptions = [];

    if (operationType === 'multiply') {
      const a = parseInt(question.match(/x\^(\d+)/)[1]);
      const b = parseInt(question.match(/x\^(\d+).*x\^(\d+)/)[2]);
      incorrectOptions.push(`x^${a * b}`); // Multiplied powers instead of adding
      incorrectOptions.push(`x^${a}x^${b}`); // Didn't simplify
      incorrectOptions.push(`x^${Math.abs(a - b)}`); // Subtracted instead of added
    } else if (operationType === 'evaluate') {
      const base = parseInt(question.match(/(\d+)\^/)[1]);
      const power = parseInt(question.match(/\^(\d+)/)[1]);
      incorrectOptions.push(`${base * power}`); // Multiplied instead of power
      incorrectOptions.push(`${base + power}`); // Added instead of power
      incorrectOptions.push(`${Math.pow(base, power) + 1}`); // Calculation error
    }

    // Fill remaining slots
    while (incorrectOptions.length < 3) {
      const randomValue = operationType === 'evaluate' ? _.random(10, 50) : `x^${_.random(2, 15)}`;
      if (!incorrectOptions.includes(randomValue) && randomValue !== answer) {
        incorrectOptions.push(randomValue);
      }
    }

    return {
      questionDisplay: {
        text: 'Calculate:',
        math: question
      },
      correctAnswer: answer,
      options: [answer, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: workingSteps[0]
    };
  }

  else if (sectionType === 'examples') {
    const ruleExplanations = {
      'multiply': "When multiplying powers with the same base, add the indices",
      'divide': "When dividing powers with the same base, subtract the indices",
      'power_of_power': "When raising a power to a power, multiply the indices",
      'evaluate': "Calculate the value by repeated multiplication"
    };

    return {
      title: "Powers and Indices",
      questionText: `Calculate ${question}`,
      solution: [
        {
          explanation: "Start with the given expression",
          formula: question
        },
        {
          explanation: ruleExplanations[operationType],
          formula: workingSteps[0]
        }
      ]
    };
  }

  return generateBasicIndices({ ...options, sectionType: 'diagnostic' });
};

/**
 * NEW: Generate expression classification questions
 * Identifies whether expressions are linear, quadratic, or cubic
 */
export const generateExpressionClassification = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Generate different types of expressions
  const expressionTypes = ['linear', 'quadratic', 'cubic'];
  const targetType = _.sample(expressionTypes);

  let expression, correctAnswer;

  if (targetType === 'linear') {
    // Generate linear expression: ax + b
    const a = _.random(1, 8);
    const b = _.random(1, 10);
    const useNegative = Math.random() > 0.5;

    expression = useNegative ?
      `${a}x - ${b}` :
      `${a}x + ${b}`;
    correctAnswer = 'Linear';
  }

  else if (targetType === 'quadratic') {
    // Generate quadratic expression: ax² + bx + c
    const a = _.random(1, 5);
    const b = _.random(1, 8);
    const c = _.random(1, 10);

    // Sometimes omit the linear term
    const includeLinear = difficulty !== 'easy' || Math.random() > 0.3;

    if (includeLinear) {
      expression = `${a}x^2 + ${b}x + ${c}`;
    } else {
      expression = `${a}x^2 + ${c}`;
    }
    correctAnswer = 'Quadratic';
  }

  else { // cubic
    // Generate cubic expression: ax³ + bx² + cx + d
    const a = _.random(1, 3);
    const b = _.random(1, 5);
    const c = _.random(1, 6);
    const d = _.random(1, 8);

    // For simplicity, sometimes omit middle terms
    const complexity = difficulty === 'easy' ? 'simple' : _.sample(['simple', 'complex']);

    if (complexity === 'simple') {
      expression = `${a}x^3 + ${d}`;
    } else {
      expression = `${a}x^3 + ${b}x^2 + ${c}x + ${d}`;
    }
    correctAnswer = 'Cubic';
  }

  // Section-aware output
  if (sectionType === 'starter') {
    return {
      question: `What type of expression is ${expression}?`,
      answer: `${expression} is a ${correctAnswer.toLowerCase()} expression because the highest power of x is ${targetType === 'linear' ? '1' : targetType === 'quadratic' ? '2' : '3'}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    const allTypes = ['Linear', 'Quadratic', 'Cubic'];
    const incorrectOptions = allTypes.filter(type => type !== correctAnswer);

    // Add a "None of these" option occasionally
    if (difficulty === 'hard' && Math.random() > 0.7) {
      incorrectOptions.push('None of these');
    }

    return {
      questionDisplay: {
        text: 'What type of expression is:',
        math: expression
      },
      correctAnswer,
      options: [correctAnswer, ...incorrectOptions].sort(() => Math.random() - 0.5),
      explanation: `This is ${correctAnswer.toLowerCase()} because the highest power of x is ${targetType === 'linear' ? '1' : targetType === 'quadratic' ? '2' : '3'}`
    };
  }

  else if (sectionType === 'examples') {
    const powerExplanations = {
      'linear': "The highest power of x is 1",
      'quadratic': "The highest power of x is 2 (x²)",
      'cubic': "The highest power of x is 3 (x³)"
    };

    return {
      title: "Recognising Expression Types",
      questionText: `Classify the expression ${expression}`,
      solution: [
        {
          explanation: "Look for the highest power of the variable x",
          formula: expression
        },
        {
          explanation: powerExplanations[targetType],
          formula: `\\text{This is a ${correctAnswer.toLowerCase()} expression}`
        },
        {
          explanation: `${correctAnswer} expressions have the general form: ${targetType === 'linear' ? 'ax + b' :
              targetType === 'quadratic' ? 'ax² + bx + c' :
                'ax³ + bx² + cx + d'
            }`,
          formula: `\\text{where a, b, c, d are constants}`
        }
      ]
    };
  }

  return generateExpressionClassification({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified distributive law question generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 * Creates questions about which calculation represents a distributive law expansion
 * FIXED: Ensures distractors are not valid alternative splits
 */
export const generateDistributiveLaw = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // UNIFIED MATH LOGIC
  let mainNum1, mainNum2, splitNum, remainderNum, isPositive;

  if (difficulty === 'easy') {
    // Easier numbers for simple distributive law
    mainNum1 = _.random(10, 20);
    mainNum2 = _.random(10, 20);

    // Split one of the numbers into tens + units
    if (mainNum1 >= 10) {
      const tens = Math.floor(mainNum1 / 10) * 10;
      const units = mainNum1 % 10;
      splitNum = tens;
      remainderNum = units;
      isPositive = true;
    } else {
      splitNum = 10;
      remainderNum = mainNum1 - 10;
      isPositive = remainderNum >= 0;
    }
  } else {
    // More complex numbers
    mainNum1 = _.random(12, 30);
    mainNum2 = _.random(15, 30);

    // Sometimes split near a round number (like 19 = 20 - 1)
    const useRoundNumber = Math.random() > 0.5;

    if (useRoundNumber) {
      // Split to a round number
      const roundNumbers = [10, 20, 25, 30];
      const validRoundNumbers = roundNumbers.filter(n => Math.abs(n - mainNum1) <= 5 && n !== mainNum1);
      if (validRoundNumbers.length > 0) {
        const roundNum = _.sample(validRoundNumbers);
        splitNum = roundNum;
        remainderNum = mainNum1 - roundNum;
        isPositive = remainderNum >= 0;
      } else {
        // Fallback to simple split
        const splitPoint = _.random(1, mainNum1 - 1);
        splitNum = splitPoint;
        remainderNum = mainNum1 - splitPoint;
        isPositive = true;
      }
    } else {
      // Split into two reasonable parts
      const splitPoint = _.random(1, mainNum1 - 1);
      splitNum = splitPoint;
      remainderNum = mainNum1 - splitPoint;
      isPositive = true;
    }
  }

  // Calculate the correct expansion
  const result1 = splitNum * mainNum2;
  const result2 = Math.abs(remainderNum) * mainNum2;
  const finalAnswer = mainNum1 * mainNum2;

  // Build the expression
  const originalExpression = `${mainNum1} \\times ${mainNum2}`;
  const correctDistributive = isPositive
    ? `${splitNum} \\times ${mainNum2} + ${remainderNum} \\times ${mainNum2}`
    : `${splitNum} \\times ${mainNum2} - ${Math.abs(remainderNum)} \\times ${mainNum2}`;

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Which calculation shows the distributive law for ${originalExpression}?`,
      answer: `${originalExpression} = ${correctDistributive}\\\\
               \\text{This uses: } a \\times (b + c) = a \\times b + a \\times c`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect answers that are NOT valid distributive splits
    const incorrectAnswers = [];

    // Mistake 1: Adding the numbers instead of using distributive law
    incorrectAnswers.push(`${mainNum1 + mainNum2} \\times 2`);

    // Mistake 2: Wrong operation in the split
    if (isPositive) {
      incorrectAnswers.push(`${splitNum} \\times ${mainNum2} - ${remainderNum} \\times ${mainNum2}`);
    } else {
      incorrectAnswers.push(`${splitNum} \\times ${mainNum2} + ${Math.abs(remainderNum)} \\times ${mainNum2}`);
    }

    // Mistake 3: Multiplying the split numbers instead of using distributive law
    incorrectAnswers.push(`${splitNum * Math.abs(remainderNum)} \\times ${mainNum2}`);

    // Mistake 4: Using the wrong total (off by 1)
    const wrongTotal = mainNum1 + 1;
    const wrongSplit = Math.floor(wrongTotal / 2);
    const wrongRemainder = wrongTotal - wrongSplit;
    incorrectAnswers.push(`${wrongSplit} \\times ${mainNum2} + ${wrongRemainder} \\times ${mainNum2}`);

    // Mistake 5: Doubling one of the numbers
    incorrectAnswers.push(`${mainNum1} \\times ${mainNum2 * 2}`);

    // Function to check if an answer is a valid distributive split
    const isValidSplit = (answer) => {
      // Extract numbers from expressions like "15 × 20 + 3 × 20"
      const addPattern = /(\d+) \\times (\d+) \+ (\d+) \\times (\d+)/;
      const subPattern = /(\d+) \\times (\d+) - (\d+) \\times (\d+)/;

      let matches = answer.match(addPattern);
      if (matches) {
        const [, num1, mult1, num2, mult2] = matches;
        // Check if multipliers are the same and split adds up to mainNum1
        return parseInt(mult1) === mainNum2 && parseInt(mult2) === mainNum2 &&
          (parseInt(num1) + parseInt(num2)) === mainNum1;
      }

      matches = answer.match(subPattern);
      if (matches) {
        const [, num1, mult1, num2, mult2] = matches;
        // Check if multipliers are the same and split subtracts to mainNum1
        return parseInt(mult1) === mainNum2 && parseInt(mult2) === mainNum2 &&
          (parseInt(num1) - parseInt(num2)) === mainNum1;
      }

      return false;
    };

    // Filter out any accidentally valid splits
    const filteredIncorrect = incorrectAnswers.filter(answer => !isValidSplit(answer));

    // Take first 3 filtered incorrect answers
    const finalIncorrect = filteredIncorrect.slice(0, 3);

    // If we don't have enough, add some clearly wrong ones
    while (finalIncorrect.length < 3) {
      const wrongAnswer = `${_.random(5, 30)} \\times ${_.random(10, 40)} + ${_.random(5, 30)} \\times ${_.random(10, 40)}`;
      if (!isValidSplit(wrongAnswer) && !finalIncorrect.includes(wrongAnswer)) {
        finalIncorrect.push(wrongAnswer);
      }
    }

    const uniqueOptions = [correctDistributive, ...finalIncorrect];

    return {
      questionDisplay: {
        text: 'Which calculation shows the distributive law for:',
        math: originalExpression
      },
      correctAnswer: correctDistributive,
      options: uniqueOptions.sort(() => Math.random() - 0.5),
      explanation: `The distributive law allows us to split ${mainNum1} into ${splitNum} ${isPositive ? '+' : '-'} ${Math.abs(remainderNum)}, giving us ${correctDistributive}`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "The distributive law states that a × (b + c) = a × b + a × c",
        formula: "a \\times (b + c) = a \\times b + a \\times c"
      },
      {
        explanation: `We can split ${mainNum1} into ${splitNum} ${isPositive ? '+' : '-'} ${Math.abs(remainderNum)}`,
        formula: `${mainNum1} = ${splitNum} ${isPositive ? '+' : '-'} ${Math.abs(remainderNum)}`
      },
      {
        explanation: "Apply the distributive law",
        formula: `${originalExpression} = (${splitNum} ${isPositive ? '+' : '-'} ${Math.abs(remainderNum)}) \\times ${mainNum2}`
      },
      {
        explanation: "Distribute the multiplication",
        formula: correctDistributive
      },
      {
        explanation: "Calculate to verify",
        formula: `${result1} ${isPositive ? '+' : '-'} ${result2} = ${finalAnswer}`
      }
    ];

    return {
      title: "Understanding the Distributive Law",
      questionText: `Show how the distributive law can be used to calculate ${originalExpression}`,
      solution
    };
  }

  // Fallback to diagnostic format
  return generateDistributiveLaw({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified substitution generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateSubstitution = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // UNIFIED MATH LOGIC
  const a = difficulty === 'easy' ? _.random(1, 3) : _.random(2, 5);
  const b = difficulty === 'easy' ? _.random(1, 3) : _.random(1, 5);
  const c = difficulty === 'easy' ? _.random(1, 3) : _.random(1, 5);

  const xValue = _.random(1, 5);
  const yValue = _.random(1, 5);

  const result = a * xValue + b * yValue + c;
  const expression = `${a}x + ${b}y + ${c}`;

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Substitute x = ${xValue} and y = ${yValue} into the expression ${expression}`,
      answer: `${expression} = ${a}(${xValue}) + ${b}(${yValue}) + ${c} = ${a * xValue} + ${b * yValue} + ${c} = ${result}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    const incorrectAnswers = [
      a * xValue + b + c,        // Substituting x but not y
      a + b * yValue + c,        // Substituting y but not x
      a + xValue + b + yValue + c // Adding instead of multiplying
    ];

    return {
      questionDisplay: {
        text: `Substitute x = ${xValue} and y = ${yValue} into:`,
        math: expression
      },
      correctAnswer: `${result}`,
      options: [`${result}`, ...incorrectAnswers.map(val => `${val}`)].sort(() => Math.random() - 0.5),
      explanation: `Substitute: ${a}(${xValue}) + ${b}(${yValue}) + ${c} = ${result}`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "Replace each variable with its given value",
        formula: `${expression} \\text{ where } x = ${xValue}, y = ${yValue}`
      },
      {
        explanation: "Substitute the values",
        formula: `${a}(${xValue}) + ${b}(${yValue}) + ${c}`
      },
      {
        explanation: "Calculate each term",
        formula: `${a * xValue} + ${b * yValue} + ${c}`
      },
      {
        explanation: "Add to get the final result",
        formula: `${result}`
      }
    ];

    return {
      title: "Substitution into Expressions",
      questionText: `Substitute x = ${xValue} and y = ${yValue} into ${expression}`,
      solution
    };
  }

  // Fallback to diagnostic format
  return generateSubstitution({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified factorising expression generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateFactorisingExpression = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  // UNIFIED MATH LOGIC - Start with factors for clean results
  const a = difficulty === 'easy' ? 1 : _.random(1, 3);
  const b = _.random(1, 6);
  const c = difficulty === 'easy' ? 1 : _.random(1, 3);
  const d = _.random(1, 6);

  // Sometimes use negative values (but not in easy mode)
  const bSign = difficulty !== 'easy' && Math.random() > 0.5 ? -1 : 1;
  const dSign = difficulty !== 'easy' && Math.random() > 0.5 ? -1 : 1;
  const actualB = b * bSign;
  const actualD = d * dSign;

  // Calculate expanded form
  const xSquaredCoeff = a * c;
  const xCoeff = (a * actualD) + (actualB * c);
  const constant = actualB * actualD;

  // Build expression to factorize
  let expressionTerms = [];

  if (xSquaredCoeff === 1) {
    expressionTerms.push('x^2');
  } else {
    expressionTerms.push(`${xSquaredCoeff}x^2`);
  }

  if (xCoeff > 0) {
    expressionTerms.push(`+ ${xCoeff === 1 ? '' : xCoeff}x`);
  } else if (xCoeff < 0) {
    expressionTerms.push(`- ${Math.abs(xCoeff) === 1 ? '' : Math.abs(xCoeff)}x`);
  }

  if (constant > 0) {
    expressionTerms.push(`+ ${constant}`);
  } else if (constant < 0) {
    expressionTerms.push(`- ${Math.abs(constant)}`);
  }

  const expression = expressionTerms.join(' ').replace(/^\+ /, '');

  // Build factored form
  const factorA = `${a === 1 ? '' : a}x${actualB >= 0 ? ' + ' + actualB : ' - ' + Math.abs(actualB)}`;
  const factorB = `${c === 1 ? '' : c}x${actualD >= 0 ? ' + ' + actualD : ' - ' + Math.abs(actualD)}`;
  const factorized = `(${factorA})(${factorB})`;

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Factorise ${expression}`,
      answer: factorized,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "Look for two numbers that multiply to give the constant term and add to give the coefficient of x",
        formula: expression
      },
      {
        explanation: "Set up the factorized form with unknown values",
        formula: "(ax + b)(cx + d)"
      },
      {
        explanation: "Find the correct values by trial or systematic approach",
        formula: factorized
      },
      {
        explanation: "Check by expanding back to the original expression",
        formula: `${factorized} = ${expression}`
      }
    ];

    return {
      title: "Factorising Quadratic Expressions",
      questionText: `Factorise ${expression}`,
      solution
    };
  }

  // Fallback format
  return {
    question: `Factorise ${expression}`,
    answer: factorized,
    difficulty: 'algebra'
  };
};

// Export unified generators
export const expressionsGenerators = {
  // Existing unified functions
  generateExpandingSingleBrackets,
  generateExpandingDoubleBrackets,
  generateSimplifyingExpression,
  generateSubstitution,
  generateFactorisingExpression,
  generateDistributiveLaw,

  // NEW Phase 2 additions:
  generateExpandingTripleBrackets,
  generateBasicIndices,
  generateExpressionClassification,
  generateCollectingLikeTermsWithSigns,

  // Legacy aliases for backward compatibility (temporary)
  expandingSingleBrackets: (options) => generateExpandingSingleBrackets(options),
  expandingDoubleBrackets: (options) => generateExpandingDoubleBrackets(options),
  simplifyingExpression: (options) => generateSimplifyingExpression(options),
  substitution: (options) => generateSubstitution(options),
  factorisingExpression: (options) => generateFactorisingExpression(options),
  distributiveLaw: (options) => generateDistributiveLaw(options)
};

export default expressionsGenerators;