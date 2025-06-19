// src/generators/algebra/expressionsGenerator.js - Updated with Unified Architecture
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
 * Unified distributive law question generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 * Creates questions about which calculation represents a distributive law expansion
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
      const roundNum = _.sample(roundNumbers.filter(n => Math.abs(n - mainNum1) <= 5));
      splitNum = roundNum;
      remainderNum = mainNum1 - roundNum;
      isPositive = remainderNum >= 0;
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
    // Generate incorrect answers with common mistakes
    const incorrectAnswers = [];

    // Mistake 1: Wrong split
    const wrongSplit1 = Math.floor(mainNum1 / 2);
    const wrongSplit2 = mainNum1 - wrongSplit1;
    incorrectAnswers.push(`${wrongSplit1} \\times ${mainNum2} + ${wrongSplit2} \\times ${mainNum2}`);

    // Mistake 2: Adding the numbers instead of using distributive law
    incorrectAnswers.push(`${mainNum1 + mainNum2} \\times 2`);

    // Mistake 3: Wrong operation in the split
    if (isPositive) {
      incorrectAnswers.push(`${splitNum} \\times ${mainNum2} - ${remainderNum} \\times ${mainNum2}`);
    } else {
      incorrectAnswers.push(`${splitNum} \\times ${mainNum2} + ${Math.abs(remainderNum)} \\times ${mainNum2}`);
    }

    // Ensure uniqueness
    const uniqueOptions = [correctDistributive];
    for (const option of incorrectAnswers) {
      if (!uniqueOptions.includes(option) && uniqueOptions.length < 4) {
        uniqueOptions.push(option);
      }
    }

    // Fill with additional wrong options if needed
    while (uniqueOptions.length < 4) {
      const randomSplit = _.random(5, 15);
      const randomRemainder = mainNum1 - randomSplit;
      if (randomRemainder > 0) {
        const newOption = `${randomSplit} \\times ${mainNum2} + ${randomRemainder} \\times ${mainNum2}`;
        if (!uniqueOptions.includes(newOption)) {
          uniqueOptions.push(newOption);
        }
      }
    }

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
  // New unified functions
  generateExpandingSingleBrackets,
  generateExpandingDoubleBrackets,
  generateSimplifyingExpression,
  generateSubstitution,
  generateFactorisingExpression,
  generateDistributiveLaw,

  // Legacy aliases for backward compatibility (temporary)
  expandingSingleBrackets: (options) => generateExpandingSingleBrackets(options),
  simplifyingExpression: (options) => generateSimplifyingExpression(options),
  substitution: (options) => generateSubstitution(options),
  factorisingExpression: (options) => generateFactorisingExpression(options),
  distributiveLaw: (options) => generateDistributiveLaw(options)
};

export default expressionsGenerators;