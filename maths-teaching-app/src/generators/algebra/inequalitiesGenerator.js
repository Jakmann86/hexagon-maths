// src/generators/algebra/inequalitiesGenerator.js - Phase 3 New Generator
import _ from 'lodash';

/**
 * Generate basic linear inequalities
 * Week 19 (Algebra VI) - Basic Inequalities and the number line
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateBasicInequalities = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Generate inequality components
  const inequalityTypes = ['>', '<', '\\geq', '\\leq'];
  const operation = _.sample(inequalityTypes);
  
  let coefficient, constant, solution, inequalityExpression;

  if (difficulty === 'easy') {
    // Simple cases like x + 3 > 7, 2x < 10
    const operationType = _.sample(['addition', 'multiplication']);
    
    if (operationType === 'addition') {
      // x + a > b
      constant = _.random(1, 8);
      const result = _.random(constant + 2, 15);
      solution = result - constant;
      inequalityExpression = `x + ${constant} ${operation} ${result}`;
    } else {
      // ax > b  
      coefficient = _.random(2, 6);
      const result = _.random(coefficient + 1, 20);
      // Ensure clean division
      const cleanResult = Math.ceil(result / coefficient) * coefficient;
      solution = cleanResult / coefficient;
      inequalityExpression = `${coefficient}x ${operation} ${cleanResult}`;
    }
  } 
  else {
    // More complex: ax + b > c
    coefficient = _.random(2, 6);
    constant = _.random(1, 10);
    const rightSide = _.random(constant + coefficient, 25);
    
    // Calculate solution: (rightSide - constant) / coefficient
    const rawSolution = (rightSide - constant) / coefficient;
    solution = Math.round(rawSolution * 10) / 10; // Round to 1dp if needed
    
    inequalityExpression = `${coefficient}x + ${constant} ${operation} ${rightSide}`;
  }

  // Generate solution inequality
  const solutionInequality = `x ${operation} ${solution}`;

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Solve the inequality: ${inequalityExpression}`,
      answer: `${inequalityExpression} \\Rightarrow ${solutionInequality}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect solutions based on common mistakes
    const incorrectOptions = [];
    
    // Mistake 1: Wrong direction of inequality
    const flippedOperation = {
      '>': '<', '<': '>', '\\geq': '\\leq', '\\leq': '\\geq'
    };
    incorrectOptions.push(`x ${flippedOperation[operation]} ${solution}`);
    
    // Mistake 2: Arithmetic error
    const wrongSolution = operation.includes('>') ? solution - 1 : solution + 1;
    incorrectOptions.push(`x ${operation} ${wrongSolution}`);
    
    // Mistake 3: Forgetting to apply operation to both sides
    if (inequalityExpression.includes('+')) {
      const partialSolution = solution + parseInt(inequalityExpression.match(/\+ (\d+)/)?.[1] || 0);
      incorrectOptions.push(`x ${operation} ${partialSolution}`);
    }

    return {
      questionDisplay: {
        text: 'Solve the inequality:',
        math: inequalityExpression
      },
      correctAnswer: solutionInequality,
      options: [solutionInequality, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `Solve like an equation, keeping the inequality direction: ${solutionInequality}`
    };
  }

  else if (sectionType === 'examples') {
    const steps = generateInequalitySteps(inequalityExpression, solutionInequality, operation);
    
    return {
      title: "Solving Linear Inequalities",
      questionText: `Solve ${inequalityExpression}`,
      solution: steps
    };
  }

  return generateBasicInequalities({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate number line representation problems
 * Shows inequalities on a number line with proper notation
 */
export const generateNumberLineInequalities = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Generate simple inequality for number line representation
  const boundary = _.random(-5, 10);
  const inequalityTypes = [
    { symbol: '>', description: 'greater than', circle: 'open', direction: 'right' },
    { symbol: '<', description: 'less than', circle: 'open', direction: 'left' },
    { symbol: '\\geq', description: 'greater than or equal to', circle: 'closed', direction: 'right' },
    { symbol: '\\leq', description: 'less than or equal to', circle: 'closed', direction: 'left' }
  ];

  const selectedType = _.sample(inequalityTypes);
  const inequality = `x ${selectedType.symbol} ${boundary}`;

  if (sectionType === 'starter') {
    return {
      question: `Describe how to show ${inequality} on a number line`,
      answer: `${selectedType.circle === 'open' ? 'Open' : 'Closed'} circle at ${boundary}, arrow pointing ${selectedType.direction}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate options for number line representation
    const correctDescription = `${selectedType.circle === 'open' ? 'Open' : 'Closed'} circle at ${boundary}, shaded ${selectedType.direction}`;
    
    const incorrectOptions = [
      `${selectedType.circle === 'open' ? 'Closed' : 'Open'} circle at ${boundary}, shaded ${selectedType.direction}`, // Wrong circle type
      `${selectedType.circle} circle at ${boundary}, shaded ${selectedType.direction === 'right' ? 'left' : 'right'}`, // Wrong direction
      `${selectedType.circle} circle at ${boundary + 1}, shaded ${selectedType.direction}` // Wrong boundary
    ];

    return {
      questionDisplay: {
        text: 'How should this inequality be shown on a number line?',
        math: inequality
      },
      correctAnswer: correctDescription,
      options: [correctDescription, ...incorrectOptions].sort(() => Math.random() - 0.5),
      explanation: `${selectedType.symbol} means ${selectedType.description}, so use ${selectedType.circle} circle and shade ${selectedType.direction}`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "Identify the boundary value and inequality type",
        formula: `${inequality} \\text{ has boundary at } x = ${boundary}`
      },
      {
        explanation: `Since the inequality is ${selectedType.description}, use a ${selectedType.circle} circle`,
        formula: `\\text{${selectedType.circle === 'open' ? 'Open circle: value not included' : 'Closed circle: value included'}}`
      },
      {
        explanation: `Shade ${selectedType.direction} from the boundary`,
        formula: `\\text{Arrow points ${selectedType.direction} to show } x ${selectedType.symbol} ${boundary}`
      }
    ];

    return {
      title: "Number Line Representation",
      questionText: `Show ${inequality} on a number line`,
      solution
    };
  }

  return generateNumberLineInequalities({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate integer solutions to inequalities
 * Week 19 - Integers and Inequality ranges
 */
export const generateIntegerSolutions = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Generate inequality with a clear integer range
  const lowerBound = _.random(-3, 5);
  const upperBound = lowerBound + _.random(3, 8);
  
  const inequalityTypes = [
    { lower: '>', upper: '<', lowerBoundary: 'exclusive', upperBoundary: 'exclusive' },
    { lower: '\\geq', upper: '\\leq', lowerBoundary: 'inclusive', upperBoundary: 'inclusive' },
    { lower: '>', upper: '\\leq', lowerBoundary: 'exclusive', upperBoundary: 'inclusive' },
    { lower: '\\geq', upper: '<', lowerBoundary: 'inclusive', upperBoundary: 'exclusive' }
  ];

  const selectedType = _.sample(inequalityTypes);
  const compoundInequality = `${lowerBound} ${selectedType.lower} x ${selectedType.upper} ${upperBound}`;

  // Calculate integer solutions
  const minValue = selectedType.lowerBoundary === 'inclusive' ? lowerBound : lowerBound + 1;
  const maxValue = selectedType.upperBoundary === 'inclusive' ? upperBound : upperBound - 1;
  
  const integerSolutions = [];
  for (let i = minValue; i <= maxValue; i++) {
    integerSolutions.push(i);
  }

  const solutionText = integerSolutions.length > 0 ? 
    integerSolutions.join(', ') : 
    'No integer solutions';

  if (sectionType === 'starter') {
    return {
      question: `Find all integer values of x that satisfy: ${compoundInequality}`,
      answer: `Integer solutions: ${solutionText}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect integer lists
    const incorrectOptions = [];
    
    // Include boundary values incorrectly
    if (selectedType.lowerBoundary === 'exclusive') {
      incorrectOptions.push([lowerBound, ...integerSolutions].join(', '));
    }
    if (selectedType.upperBoundary === 'exclusive') {
      incorrectOptions.push([...integerSolutions, upperBound].join(', '));
    }
    
    // Miss some values
    if (integerSolutions.length > 2) {
      incorrectOptions.push(integerSolutions.slice(1, -1).join(', '));
    }
    
    // Add extra values
    incorrectOptions.push([...integerSolutions, upperBound + 1].join(', '));

    // Remove duplicates and ensure unique options
    const uniqueOptions = [solutionText, ...incorrectOptions.filter(opt => opt !== solutionText)];

    return {
      questionDisplay: {
        text: 'Find all integer solutions:',
        math: compoundInequality
      },
      correctAnswer: solutionText,
      options: uniqueOptions.slice(0, 4).sort(() => Math.random() - 0.5),
      explanation: `Check each integer in the range, respecting ${selectedType.lowerBoundary}/${selectedType.upperBoundary} boundaries`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "Identify the range of x values",
        formula: compoundInequality
      },
      {
        explanation: "Determine which boundary values are included",
        formula: `\\text{Lower: } ${selectedType.lowerBoundary}, \\text{ Upper: } ${selectedType.upperBoundary}`
      },
      {
        explanation: "List all integers in the range",
        formula: `\\text{Integers: } ${integerSolutions.length > 0 ? integerSolutions.join(', ') : 'None'}`
      },
      {
        explanation: "Verify each solution satisfies the original inequality",
        formula: `\\text{Answer: } ${solutionText}`
      }
    ];

    return {
      title: "Finding Integer Solutions",
      questionText: `Find integer solutions to ${compoundInequality}`,
      solution
    };
  }

  return generateIntegerSolutions({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate quadratic inequality problems (simple cases)
 * Week 19 - including simple Quadratic Inequalities
 */
export const generateSimpleQuadraticInequalities = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  // Generate simple quadratic inequality with easily found roots
  const root1 = _.random(-3, 2);
  const root2 = root1 + _.random(2, 6); // Ensure root2 > root1
  
  // Create quadratic: (x - root1)(x - root2) compared to 0
  const a = 1;
  const b = -(root1 + root2);
  const c = root1 * root2;

  const quadratic = b >= 0 ? 
    `x^2 + ${b}x + ${c}` : 
    `x^2 ${b}x + ${c}`;

  const inequalityTypes = ['> 0', '< 0', '\\geq 0', '\\leq 0'];
  const inequality = _.sample(inequalityTypes);
  const quadraticInequality = `${quadratic} ${inequality}`;

  // Determine solution based on inequality type and parabola shape (opens upward)
  let solutionText;
  if (inequality.includes('>')) {
    solutionText = inequality.includes('=') ? 
      `x \\leq ${root1} \\text{ or } x \\geq ${root2}` :
      `x < ${root1} \\text{ or } x > ${root2}`;
  } else {
    solutionText = inequality.includes('=') ?
      `${root1} \\leq x \\leq ${root2}` :
      `${root1} < x < ${root2}`;
  }

  if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "Find the roots of the quadratic equation",
        formula: `${quadratic} = 0`
      },
      {
        explanation: "Factor the quadratic",
        formula: `(x - ${root1})(x - ${root2}) = 0`
      },
      {
        explanation: "The roots divide the number line into regions",
        formula: `\\text{Roots: } x = ${root1}, x = ${root2}`
      },
      {
        explanation: "Test the sign of the quadratic in each region",
        formula: `\\text{Since the parabola opens upward (a > 0):}`
      },
      {
        explanation: "Determine which regions satisfy the inequality",
        formula: solutionText
      }
    ];

    return {
      title: "Simple Quadratic Inequalities",
      questionText: `Solve ${quadraticInequality}`,
      solution
    };
  }

  else if (sectionType === 'starter') {
    return {
      question: `Solve: ${quadraticInequality}`,
      answer: `${solutionText}`,
      difficulty: 'algebra'
    };
  }

  return generateSimpleQuadraticInequalities({ ...options, sectionType: 'examples' });
};

/**
 * Generate inequality word problems
 * Real-world contexts requiring inequality setup and solving
 */
export const generateInequalityWordProblem = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'starter'
  } = options;

  const problems = [
    {
      context: "A taxi charges £3 base fare plus £2 per mile. Sarah has £15 to spend.",
      question: "How many miles can she travel?",
      inequality: "3 + 2x \\leq 15",
      solution: "x \\leq 6",
      interpretation: "Sarah can travel at most 6 miles"
    },
    {
      context: "A cinema ticket costs £8. Students get a £2 discount. Tom has £25.",
      question: "How many student tickets can he buy?",
      inequality: "6x \\leq 25",
      solution: "x \\leq 4.17",
      interpretation: "Tom can buy at most 4 tickets (whole tickets only)"
    },
    {
      context: "A phone plan costs £20 per month plus £0.10 per text. The budget is £35.",
      question: "How many texts can be sent?",
      inequality: "20 + 0.1x \\leq 35",
      solution: "x \\leq 150",
      interpretation: "At most 150 texts can be sent"
    },
    {
      context: "A builder needs at least 100 bricks. Small boxes have 15 bricks, large boxes have 25.",
      question: "If he buys 2 large boxes, how many small boxes does he need?",
      inequality: "2(25) + 15x \\geq 100",
      solution: "x \\geq 3.33",
      interpretation: "He needs at least 4 small boxes"
    }
  ];

  const problem = _.sample(problems);

  if (sectionType === 'starter') {
    return {
      question: `${problem.context} ${problem.question}`,
      answer: `Inequality: ${problem.inequality}
               Solution: ${problem.solution}
               Interpretation: ${problem.interpretation}`,
      difficulty: 'algebra'
    };
  }

  return generateInequalityWordProblem({ ...options, sectionType: 'starter' });
};

/**
 * Helper function to generate step-by-step inequality solutions
 */
const generateInequalitySteps = (inequality, solution, operation) => {
  const steps = [
    {
      explanation: "Start with the inequality",
      formula: inequality
    }
  ];

  // Determine the type of operations needed
  if (inequality.includes('+')) {
    const constant = inequality.match(/\+ (\d+)/)?.[1];
    steps.push({
      explanation: `Subtract ${constant} from both sides`,
      formula: "\\text{Apply inverse operations}"
    });
  }

  if (inequality.match(/^\d+x/)) {
    const coefficient = inequality.match(/^(\d+)x/)?.[1];
    steps.push({
      explanation: `Divide both sides by ${coefficient}`,
      formula: "\\text{Keep inequality direction the same}"
    });
  }

  steps.push({
    explanation: "Final solution",
    formula: solution
  });

  return steps;
};

// Export all inequality generators
export const inequalitiesGenerators = {
  generateBasicInequalities,
  generateNumberLineInequalities,
  generateIntegerSolutions,
  generateSimpleQuadraticInequalities,
  generateInequalityWordProblem
};

export default inequalitiesGenerators;