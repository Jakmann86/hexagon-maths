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
        // More incorrect options...
      ];
      
      // Ensure uniqueness
      const allOptions = [answer, ...incorrectAnswers].filter((option, index, arr) => 
        option && option !== '' && arr.indexOf(option) === index
      );
      
      while (allOptions.length < 4) {
        allOptions.push(`${_.random(1, 20)}`);
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
  generateSimplifyingExpression,
  generateSubstitution,
  generateFactorisingExpression,

  // Legacy aliases for backward compatibility (temporary)
  expandingSingleBrackets: (options) => generateExpandingSingleBrackets(options),
  simplifyingExpression: (options) => generateSimplifyingExpression(options),
  substitution: (options) => generateSubstitution(options),
  factorisingExpression: (options) => generateFactorisingExpression(options)
};

export default expressionsGenerators;