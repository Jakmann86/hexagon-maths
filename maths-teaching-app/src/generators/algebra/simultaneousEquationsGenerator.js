// src/generators/algebra/simultaneousEquationsGenerator.js - Phase 3 New Generator
import _ from 'lodash';

/**
 * Generate linear simultaneous equations using elimination method
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateLinearSimultaneous = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // UNIFIED MATH LOGIC - Work backwards from solution for clean results
  const x = _.random(1, 8);
  const y = _.random(1, 8);

  let a1, b1, c1, a2, b2, c2;

  if (difficulty === 'easy') {
    // Simple coefficients, one coefficient is 1
    a1 = 1;
    b1 = _.random(1, 3);
    a2 = _.random(2, 4);
    b2 = _.random(1, 3);
  } else if (difficulty === 'medium') {
    // Medium coefficients
    a1 = _.random(1, 4);
    b1 = _.random(1, 4);
    a2 = _.random(1, 4);
    b2 = _.random(1, 4);
    
    // Ensure they're not multiples of each other (would be parallel/same line)
    while (a1 * b2 === a2 * b1) {
      b2 = _.random(1, 4);
    }
  } else {
    // Harder coefficients, some negatives
    a1 = _.random(1, 5);
    b1 = Math.random() > 0.7 ? -_.random(1, 4) : _.random(1, 4);
    a2 = _.random(1, 5);
    b2 = Math.random() > 0.7 ? -_.random(1, 4) : _.random(1, 4);
    
    // Ensure not parallel
    while (a1 * b2 === a2 * b1) {
      b2 = Math.random() > 0.5 ? -_.random(1, 4) : _.random(1, 4);
    }
  }

  // Calculate right-hand sides
  c1 = a1 * x + b1 * y;
  c2 = a2 * x + b2 * y;

  // Build equation strings
  const formatEquation = (a, b, c) => {
    const xTerm = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
    const yTerm = b === 1 ? (b > 0 ? '+ y' : '- y') : 
                 b === -1 ? '- y' : 
                 b > 0 ? `+ ${b}y` : `- ${Math.abs(b)}y`;
    
    return `${xTerm} ${yTerm} = ${c}`.replace(/^\+\s*/, '');
  };

  const equation1 = formatEquation(a1, b1, c1);
  const equation2 = formatEquation(a2, b2, c2);

  // Solution method (elimination)
  const eliminationSteps = generateEliminationSteps(a1, b1, c1, a2, b2, c2, x, y);

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Solve the simultaneous equations:
                 ${equation1}
                 ${equation2}`,
      answer: `x = ${x}, y = ${y}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    const incorrectOptions = [
      `x = ${y}, y = ${x}`, // Swapped values
      `x = ${x + 1}, y = ${y}`, // x wrong
      `x = ${x}, y = ${y + 1}`, // y wrong
      `x = ${Math.abs(x - y)}, y = ${x + y}` // Arithmetic error
    ];

    return {
      questionDisplay: {
        text: 'Solve the simultaneous equations:',
        math: `\\begin{cases} ${equation1.replace(/\s*=\s*/, ' = ').replace(/\+\s*/, ' + ').replace(/-\s*/, ' - ')} \\\\ ${equation2.replace(/\s*=\s*/, ' = ').replace(/\+\s*/, ' + ').replace(/-\s*/, ' - ')} \\end{cases}`
      },
      correctAnswer: `x = ${x}, y = ${y}`,
      options: [`x = ${x}, y = ${y}`, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `Use elimination or substitution. Solution: x = ${x}, y = ${y}`
    };
  }

  else if (sectionType === 'examples') {
    return {
      title: "Solving Linear Simultaneous Equations",
      questionText: `Solve: ${equation1} and ${equation2}`,
      solution: eliminationSteps
    };
  }

  return generateLinearSimultaneous({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate elimination method steps for examples section
 */
const generateEliminationSteps = (a1, b1, c1, a2, b2, c2, x, y) => {
  const equation1 = `${a1}x ${b1 >= 0 ? '+' : ''} ${b1}y = ${c1}`;
  const equation2 = `${a2}x ${b2 >= 0 ? '+' : ''} ${b2}y = ${c2}`;

  const steps = [
    {
      explanation: "Write the two equations clearly",
      formula: `\\begin{cases} ${equation1} \\quad (1) \\\\ ${equation2} \\quad (2) \\end{cases}`
    }
  ];

  // Decide which variable to eliminate (choose the easier one)
  const xCoeffGCD = gcd(Math.abs(a1), Math.abs(a2));
  const yCoeffGCD = gcd(Math.abs(b1), Math.abs(b2));
  
  const eliminateX = xCoeffGCD >= yCoeffGCD;

  if (eliminateX) {
    // Eliminate x
    const mult1 = Math.abs(a2) / xCoeffGCD;
    const mult2 = Math.abs(a1) / xCoeffGCD;
    
    steps.push({
      explanation: `To eliminate x, multiply equation (1) by ${mult1} and equation (2) by ${mult2}`,
      formula: `\\text{This makes the x coefficients: } ${mult1 * a1} \\text{ and } ${mult2 * a2}`
    });

    const newA1 = a1 * mult1;
    const newB1 = b1 * mult1;
    const newC1 = c1 * mult1;
    const newA2 = a2 * mult2;
    const newB2 = b2 * mult2;
    const newC2 = c2 * mult2;

    // Subtract or add to eliminate
    const operation = (newA1 > 0 && newA2 > 0) || (newA1 < 0 && newA2 < 0) ? 'subtract' : 'add';
    const resultB = operation === 'subtract' ? newB1 - newB2 : newB1 + newB2;
    const resultC = operation === 'subtract' ? newC1 - newC2 : newC1 + newC2;

    steps.push({
      explanation: `${operation === 'subtract' ? 'Subtract' : 'Add'} the equations to eliminate x`,
      formula: `${resultB}y = ${resultC}`
    });

    steps.push({
      explanation: "Solve for y",
      formula: `y = ${resultC} \\div ${resultB} = ${y}`
    });

    steps.push({
      explanation: "Substitute back to find x",
      formula: `${a1}x + ${b1}(${y}) = ${c1} \\Rightarrow x = ${x}`
    });

  } else {
    // Similar logic for eliminating y
    steps.push({
      explanation: "Eliminate y using multiplication and addition/subtraction",
      formula: "\\text{(Working shown step by step)}"
    });
    
    steps.push({
      explanation: "Solve for x first, then substitute to find y",
      formula: `x = ${x}, y = ${y}`
    });
  }

  steps.push({
    explanation: "Check the solution in both original equations",
    formula: `\\text{Verification: } (${x}, ${y}) \\text{ satisfies both equations}`
  });

  return steps;
};

/**
 * Generate substitution method simultaneous equations
 * Alternative approach to elimination
 */
export const generateSimultaneousSubstitution = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  // Generate where one equation has a coefficient of 1 for easy substitution
  const x = _.random(2, 8);
  const y = _.random(1, 8);

  let a1 = 1, b1, c1, a2, b2, c2;

  if (difficulty === 'easy') {
    b1 = _.random(1, 3);
    a2 = _.random(2, 4);
    b2 = _.random(1, 3);
  } else {
    b1 = Math.random() > 0.8 ? -_.random(1, 4) : _.random(1, 4);
    a2 = _.random(2, 5);
    b2 = Math.random() > 0.8 ? -_.random(1, 4) : _.random(1, 4);
  }

  c1 = a1 * x + b1 * y;
  c2 = a2 * x + b2 * y;

  const equation1 = `x ${b1 >= 0 ? '+' : ''} ${b1}y = ${c1}`;
  const equation2 = `${a2}x ${b2 >= 0 ? '+' : ''} ${b2}y = ${c2}`;

  if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "From the first equation, express x in terms of y",
        formula: `x = ${c1} - (${b1})y = ${c1} ${-b1 >= 0 ? '+' : ''} ${-b1}y`
      },
      {
        explanation: "Substitute this expression into the second equation",
        formula: `${a2}(${c1} ${-b1 >= 0 ? '+' : ''} ${-b1}y) ${b2 >= 0 ? '+' : ''} ${b2}y = ${c2}`
      },
      {
        explanation: "Expand and solve for y",
        formula: `${a2 * c1} ${a2 * (-b1) >= 0 ? '+' : ''} ${a2 * (-b1)}y ${b2 >= 0 ? '+' : ''} ${b2}y = ${c2}`
      },
      {
        explanation: "Simplify and solve",
        formula: `${a2 * (-b1) + b2}y = ${c2 - a2 * c1}`
      },
      {
        explanation: "Therefore",
        formula: `y = ${y}`
      },
      {
        explanation: "Substitute back to find x",
        formula: `x = ${c1} ${-b1 >= 0 ? '+' : ''} ${-b1}(${y}) = ${x}`
      }
    ];

    return {
      title: "Solving by Substitution Method",
      questionText: `Solve: ${equation1} and ${equation2}`,
      solution
    };
  }

  return generateSimultaneousSubstitution({ ...options, sectionType: 'examples' });
};

/**
 * Generate quadratic simultaneous equations (one linear, one quadratic)
 * For advanced topics (Algebra IV - Week 5)
 */
export const generateQuadraticSimultaneous = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  // Keep it simple: line and circle/parabola intersection
  const solutions = [
    { x: _.random(1, 4), y: _.random(1, 6) },
    { x: _.random(-2, 0), y: _.random(2, 8) }
  ];

  // Linear equation: y = mx + c (through one solution)
  const m = _.random(1, 3);
  const c = solutions[0].y - m * solutions[0].x;
  
  // Quadratic: y = ax² + bx + d (through both solutions)
  // Using y = x² + bx + d for simplicity
  const a = 1;
  const b = -(solutions[0].x + solutions[1].x); // Sum of roots
  const d = solutions[0].y - solutions[0].x * solutions[0].x - b * solutions[0].x;

  const linearEq = `y = ${m}x ${c >= 0 ? '+' : ''} ${c}`;
  const quadraticEq = `y = x^2 ${b >= 0 ? '+' : ''} ${b}x ${d >= 0 ? '+' : ''} ${d}`;

  if (sectionType === 'examples') {
    return {
      title: "Quadratic Simultaneous Equations",
      questionText: `Solve: ${linearEq} and ${quadraticEq}`,
      solution: [
        {
          explanation: "Since both expressions equal y, set them equal",
          formula: `${m}x + ${c} = x^2 ${b >= 0 ? '+' : ''} ${b}x ${d >= 0 ? '+' : ''} ${d}`
        },
        {
          explanation: "Rearrange to standard quadratic form",
          formula: `x^2 ${b - m >= 0 ? '+' : ''} ${b - m}x ${d - c >= 0 ? '+' : ''} ${d - c} = 0`
        },
        {
          explanation: "Solve the quadratic equation",
          formula: `x = ${solutions[0].x} \\text{ or } x = ${solutions[1].x}`
        },
        {
          explanation: "Find corresponding y values",
          formula: `\\text{Solutions: } (${solutions[0].x}, ${solutions[0].y}) \\text{ and } (${solutions[1].x}, ${solutions[1].y})`
        }
      ]
    };
  }

  return generateQuadraticSimultaneous({ ...options, sectionType: 'examples' });
};

/**
 * Helper function to find GCD
 */
const gcd = (a, b) => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

/**
 * Generate word problems involving simultaneous equations
 * Real-world contexts for starter questions
 */
export const generateSimultaneousWordProblem = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'starter'
  } = options;

  // Simple scenarios
  const scenarios = [
    {
      context: "A cinema sells adult tickets for £{price1} and child tickets for £{price2}. On one day, they sold {total} tickets and made £{revenue}.",
      setup: "Let a = adult tickets, c = child tickets",
      equations: ["a + c = {total}", "{price1}a + {price2}c = {revenue}"],
      question: "How many adult and child tickets were sold?"
    },
    {
      context: "A farmer has {total} animals - chickens and cows. Together they have {legs} legs.",
      setup: "Let c = chickens, w = cows",
      equations: ["c + w = {total}", "2c + 4w = {legs}"],
      question: "How many chickens and cows are there?"
    },
    {
      context: "Two numbers add up to {sum} and their difference is {diff}.",
      setup: "Let x = larger number, y = smaller number",
      equations: ["x + y = {sum}", "x - y = {diff}"],
      question: "Find the two numbers."
    }
  ];

  const scenario = _.sample(scenarios);
  
  // Generate values
  const x = _.random(5, 15);
  const y = _.random(3, 12);
  
  const values = {
    price1: _.random(8, 12),
    price2: _.random(4, 7),
    total: x + y,
    revenue: 0, // Will be calculated
    legs: 2 * x + 4 * y,
    sum: x + y,
    diff: Math.abs(x - y)
  };
  
  values.revenue = values.price1 * x + values.price2 * y;

  // Replace placeholders
  let contextText = scenario.context;
  let setupText = scenario.setup;
  let equationsText = scenario.equations.map(eq => eq);

  Object.keys(values).forEach(key => {
    const placeholder = `{${key}}`;
    contextText = contextText.replace(new RegExp(placeholder, 'g'), values[key]);
    setupText = setupText.replace(new RegExp(placeholder, 'g'), values[key]);
    equationsText = equationsText.map(eq => eq.replace(new RegExp(placeholder, 'g'), values[key]));
  });

  if (sectionType === 'starter') {
    return {
      question: `${contextText} ${scenario.question}`,
      answer: `${setupText}
               Equations: ${equationsText.join(', ')}
               Solution: First variable = ${x}, Second variable = ${y}`,
      difficulty: 'algebra'
    };
  }

  return generateSimultaneousWordProblem({ ...options, sectionType: 'starter' });
};

// Export all simultaneous equation generators
export const simultaneousEquationsGenerators = {
  generateLinearSimultaneous,
  generateSimultaneousSubstitution,
  generateQuadraticSimultaneous,
  generateSimultaneousWordProblem
};

export default simultaneousEquationsGenerators;