// src/generators/algebra/expressionsGenerator.js
import _ from 'lodash';

/**
 * Generate an expanding single brackets question
 * Used for starter questions reviewing basic expansion
 */
export const generateExpandingSingleBrackets = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'starter'
  } = options;

  // Generate a simple expression with single brackets
  const outsideFactor = _.random(2, 9);
  const firstTerm = _.random(1, 10);
  const secondTerm = _.random(1, 10);
  
  // Calculate the expanded form
  const expandedFirst = outsideFactor * firstTerm;
  const expandedSecond = outsideFactor * secondTerm;
  
  // For diagnostic sections, return multiple choice format
  if (sectionType === 'diagnostic') {
    const expression = `${outsideFactor}(${firstTerm}x + ${secondTerm})`;
    const answer = `${expandedFirst}x + ${expandedSecond}`;
    
    // Generate incorrect answers with common mistakes
    const incorrectAnswers = [
      `${expandedFirst}x + ${secondTerm}`,                           // Only multiplying first term
      `${outsideFactor + firstTerm}x + ${outsideFactor + secondTerm}`, // Adding instead of multiplying
      `${expandedFirst + 1}x + ${expandedSecond - 1}`                // Miscalculation
    ];
    
    return {
      questionDisplay: {
        text: 'Expand:',
        math: expression
      },
      correctAnswer: answer,
      options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
      explanation: `To expand, multiply the term outside the brackets by each term inside: ${outsideFactor} × ${firstTerm}x + ${outsideFactor} × ${secondTerm} = ${answer}`
    };
  }
  
  // For starter sections, return the original format
  return {
    question: `Expand ${outsideFactor}(${firstTerm}x + ${secondTerm})`,
    answer: `${outsideFactor}(${firstTerm}x + ${secondTerm}) = ${outsideFactor} \\times ${firstTerm}x + ${outsideFactor} \\times ${secondTerm} = ${expandedFirst}x + ${expandedSecond}`,
    difficulty: 'algebra'
  };
};

export const generateSimplifyingExpression = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Determine the operation type randomly
  const operationType = _.sample(['collect', 'multiply', 'divide']);
  
  if (operationType === 'collect') {
    // Randomly decide if we want one or two variable types
    const useOneVariable = Math.random() > 0.5;
    
    // Generate random coefficients for different terms with some negative values
    const xCoefficients = [
      _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9),
      _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9)
    ];
    
    const yCoefficients = useOneVariable ? [0, 0] : [
      _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9),
      _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9)
    ];
    
    const constants = [
      _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9),
      _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9)
    ];
    
    // Calculate the correct answers
    const simplifiedX = xCoefficients[0] + xCoefficients[1];
    const simplifiedY = yCoefficients[0] + yCoefficients[1];
    const simplifiedConstant = constants[0] + constants[1];
    
    // Helper function to format terms correctly
    const formatTerm = (coefficient, variable = '') => {
      if (coefficient === 0) return '';
      if (coefficient === 1 && variable) return `+${variable}`;
      if (coefficient === -1 && variable) return `-${variable}`;
      return coefficient > 0 ? `+${coefficient}${variable}` : `${coefficient}${variable}`;
    };
    
    // Create the expression string
    const firstX = formatTerm(xCoefficients[0], 'x').replace(/^\+/, '');
    const firstY = useOneVariable ? '' : formatTerm(yCoefficients[0], 'y');
    const firstConstant = formatTerm(constants[0]);
    const secondX = formatTerm(xCoefficients[1], 'x');
    const secondY = useOneVariable ? '' : formatTerm(yCoefficients[1], 'y');
    const secondConstant = formatTerm(constants[1]);
    
    const expression = `${firstX}${firstY}${firstConstant}${secondX}${secondY}${secondConstant}`;
    
    // Create the answer string
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
    
    // Format the final answer
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
    
    // Generate 3 DISTINCT incorrect answers
    const incorrectAnswers = [
      // Mistake 1: Adding everything together
      `${Math.abs(xCoefficients[0] + xCoefficients[1] + yCoefficients[0] + yCoefficients[1] + constants[0] + constants[1])}`,
      
      // Mistake 2: Only combining x terms, not others
      (() => {
        let terms = [];
        if (simplifiedX !== 0) {
          terms.push(simplifiedX === 1 ? 'x' : simplifiedX === -1 ? '-x' : `${simplifiedX}x`);
        }
        if (!useOneVariable && yCoefficients[0] !== 0) {
          terms.push(yCoefficients[0] === 1 ? '+y' : yCoefficients[0] === -1 ? '-y' : `+${yCoefficients[0]}y`);
        }
        if (!useOneVariable && yCoefficients[1] !== 0) {
          terms.push(yCoefficients[1] === 1 ? '+y' : yCoefficients[1] === -1 ? '-y' : `+${yCoefficients[1]}y`);
        }
        if (simplifiedConstant !== 0) {
          terms.push(simplifiedConstant > 0 ? `+${simplifiedConstant}` : `${simplifiedConstant}`);
        }
        let result = terms.join('').replace(/^\+/, '');
        return result || '0';
      })(),
      
      // Mistake 3: Adding x and y coefficients together
      (() => {
        if (useOneVariable) {
          return `${Math.abs(simplifiedX + simplifiedConstant)}`;
        } else {
          const wrongCoeff = simplifiedX + simplifiedY;
          return wrongCoeff === 0 ? `${simplifiedConstant}` : 
                 wrongCoeff === 1 ? `x+${simplifiedConstant}` :
                 wrongCoeff === -1 ? `-x+${simplifiedConstant}` :
                 `${wrongCoeff}x+${simplifiedConstant}`;
        }
      })()
    ];
    
    // Ensure all answers are different and not empty
    const allOptions = [answer, ...incorrectAnswers].filter((option, index, arr) => 
      option && option !== '' && arr.indexOf(option) === index
    );
    
    // If we don't have 4 unique options, add more
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
      explanation: `To simplify, we collect the like terms (terms with the same variable)`
    };
  }
  
  else if (operationType === 'multiply') {
    // Generate multiplication of terms
    const firstCoefficient = _.random(2, 6);
    const secondCoefficient = _.random(2, 6);
    
    // Multiply coefficient by variable term (e.g., 3 × 4x)
    const expression = `${firstCoefficient} \\times ${secondCoefficient}x`;
    const result = firstCoefficient * secondCoefficient;
    const answer = result === 1 ? "x" : `${result}x`;
    
    const incorrectAnswers = [
      `${firstCoefficient + secondCoefficient}x`,  // Adding instead
      `${result}`,                                 // Forgetting variable
      `${result + 1}x`                            // Calculation error
    ];
    
    return {
      questionDisplay: {
        text: 'Calculate:',
        math: expression
      },
      correctAnswer: answer,
      options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
      explanation: `Multiply the coefficients: ${firstCoefficient} × ${secondCoefficient} = ${result}, so the answer is ${answer}`
    };
  }
  
  else { // Division
    const resultCoefficient = _.random(2, 6);
    const divisor = _.random(2, 4);
    const dividendCoefficient = resultCoefficient * divisor;
    
    const expression = `${dividendCoefficient}x \\div ${divisor}`;
    const answer = resultCoefficient === 1 ? "x" : `${resultCoefficient}x`;
    
    const incorrectAnswers = [
      `${resultCoefficient}`,      // Forgetting variable
      `${resultCoefficient + 1}x`, // Calculation error
      `${Math.floor(dividendCoefficient / divisor) + 1}x` // Different calculation error
    ];
    
    return {
      questionDisplay: {
        text: 'Calculate:',
        math: expression
      },
      correctAnswer: answer,
      options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
      explanation: `Divide the coefficients: ${dividendCoefficient} ÷ ${divisor} = ${resultCoefficient}, so the answer is ${answer}`
    };
  }
};

/**
 * Generate a substitution question
 * Used for diagnostic questions with multiple choice answers
 */
export const generateSubstitution = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Generate a simple expression
  const a = _.random(2, 5);
  const b = _.random(1, 5);
  const c = _.random(1, 5);
  
  // Generate values to substitute
  const xValue = _.random(1, 5);
  const yValue = _.random(1, 5);
  
  // Calculate the result of substitution
  const result = a * xValue + b * yValue + c;
  
  // Generate expression string
  const expression = `${a}x + ${b}y + ${c}`;
  
  // Generate incorrect answers with common mistakes
  const incorrectAnswers = [
    a * xValue + b + c,        // Substituting x but not y
    a + b * yValue + c,        // Substituting y but not x
    a + xValue + b + yValue + c // Multiplying incorrectly
  ];
  
  return {
    questionDisplay: {
      text: `Substitute x = ${xValue} and y = ${yValue} into the expression:`,
      math: expression
    },
    correctAnswer: `${result}`,
    options: [`${result}`, ...incorrectAnswers.map(val => `${val}`)].sort(() => Math.random() - 0.5),
    explanation: `Substitute the values: ${a}(${xValue}) + ${b}(${yValue}) + ${c} = ${result}`
  };
};

/**
 * Generate a factorising expression question (reverse of expansion)
 */
export const generateFactorisingExpression = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  // Start with factors and work backwards for clean results
  const a = _.random(1, 3);
  const b = _.random(1, 6);
  const c = _.random(1, 3);
  const d = _.random(1, 6);
  
  // Sometimes use negative values
  const bSign = Math.random() > 0.5 ? 1 : -1;
  const dSign = Math.random() > 0.5 ? 1 : -1;
  const actualB = b * bSign;
  const actualD = d * dSign;
  
  // Calculate the expanded form
  const xSquaredCoeff = a * c;
  const xCoeff = (a * actualD) + (actualB * c);
  const constant = actualB * actualD;
  
  // Build the expression to factorize
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
  
  // Build the factored form
  const factorA = `${a === 1 ? '' : a}x${actualB >= 0 ? ' + ' + actualB : ' - ' + Math.abs(actualB)}`;
  const factorB = `${c === 1 ? '' : c}x${actualD >= 0 ? ' + ' + actualD : ' - ' + Math.abs(actualD)}`;
  
  return {
    question: `Factorise ${expression}`,
    answer: `(${factorA})(${factorB})`,
    difficulty: 'algebra'
  };
};

// Export grouped generators
export const expressionsGenerators = {
  generateExpandingSingleBrackets,
  generateFactorisingExpression,
  generateSimplifyingExpression,
  generateSubstitution
};

export default expressionsGenerators;