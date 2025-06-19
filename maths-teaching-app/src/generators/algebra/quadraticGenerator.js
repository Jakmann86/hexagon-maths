// src/generators/algebra/quadraticGenerator.js - Phase 3 New Generator
import _ from 'lodash';

/**
 * Generate quadratic equations solvable by factoring
 * Covers Week 4 (Algebra III) and Week 5 (Algebra IV)
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateQuadraticFactoring = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // UNIFIED MATH LOGIC - Work backwards from factors for clean solutions
  let p, q, a = 1;

  if (difficulty === 'easy') {
    // Simple integer solutions, positive
    p = _.random(1, 6);
    q = _.random(1, 6);
    // Ensure they're different for variety
    while (q === p) {
      q = _.random(1, 6);
    }
  } else if (difficulty === 'medium') {
    // Include some negative solutions
    p = _.random(-3, 6);
    q = _.random(-3, 6);
    while (q === p) {
      q = _.random(-3, 6);
    }
  } else {
    // Harder with coefficient of x²
    a = _.random(1, 3);
    p = _.random(-4, 4);
    q = _.random(-4, 4);
    while (q === p || p === 0 || q === 0) {
      q = _.random(-4, 4);
    }
  }

  // Calculate quadratic coefficients: a(x - p)(x - q) = ax² - a(p+q)x + apq
  const b = -a * (p + q);
  const c = a * p * q;

  // Build equation
  const buildQuadratic = (a, b, c) => {
    let terms = [];
    
    // x² term
    if (a === 1) {
      terms.push('x^2');
    } else if (a === -1) {
      terms.push('-x^2');
    } else {
      terms.push(`${a}x^2`);
    }
    
    // x term
    if (b > 0) {
      terms.push(b === 1 ? '+ x' : `+ ${b}x`);
    } else if (b < 0) {
      terms.push(Math.abs(b) === 1 ? '- x' : `- ${Math.abs(b)}x`);
    }
    
    // constant term
    if (c > 0) {
      terms.push(`+ ${c}`);
    } else if (c < 0) {
      terms.push(`- ${Math.abs(c)}`);
    }
    
    return terms.join(' ').replace(/^\+ /, '') + ' = 0';
  };

  const equation = buildQuadratic(a, b, c);
  
  // Build factored form
  const buildFactor = (coeff, root) => {
    if (coeff === 1) {
      return root >= 0 ? `(x - ${root})` : `(x + ${Math.abs(root)})`;
    } else {
      const inner = root >= 0 ? `${coeff}x - ${coeff * root}` : `${coeff}x + ${Math.abs(coeff * root)}`;
      return `(${inner})`;
    }
  };

  const factored = a === 1 ? 
    `(x ${p >= 0 ? '-' : '+'} ${Math.abs(p)})(x ${q >= 0 ? '-' : '+'} ${Math.abs(q)}) = 0` :
    `${a}(x ${p >= 0 ? '-' : '+'} ${Math.abs(p)})(x ${q >= 0 ? '-' : '+'} ${Math.abs(q)}) = 0`;

  const solutions = [p, q].sort((a, b) => a - b);

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Solve by factoring: ${equation}`,
      answer: `${factored}\\\\
               \\text{Solutions: } x = ${solutions[0]} \\text{ or } x = ${solutions[1]}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    const incorrectOptions = [
      `x = ${-solutions[0]}, x = ${-solutions[1]}`, // Wrong signs
      `x = ${solutions[0] + solutions[1]}, x = ${solutions[0] * solutions[1]}`, // Used sum and product instead
      `x = ${Math.abs(solutions[0])}, x = ${Math.abs(solutions[1])}`, // Took absolute values
      `x = ${solutions[0] + 1}, x = ${solutions[1] + 1}` // Off by one errors
    ];

    return {
      questionDisplay: {
        text: 'Solve by factoring:',
        math: equation
      },
      correctAnswer: `x = ${solutions[0]}, x = ${solutions[1]}`,
      options: [`x = ${solutions[0]}, x = ${solutions[1]}`, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `Factor to get ${factored}, so x = ${solutions[0]} or x = ${solutions[1]}`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "Start with the quadratic equation in standard form",
        formula: equation
      },
      {
        explanation: "Look for two numbers that multiply to give the constant term and add to give the coefficient of x",
        formula: `\\text{Need: two numbers that multiply to ${c} and add to ${b}}`
      },
      {
        explanation: "Factor the quadratic",
        formula: factored
      },
      {
        explanation: "Use the zero product property: if AB = 0, then A = 0 or B = 0",
        formula: `x ${p >= 0 ? '-' : '+'} ${Math.abs(p)} = 0 \\text{ or } x ${q >= 0 ? '-' : '+'} ${Math.abs(q)} = 0`
      },
      {
        explanation: "Solve each factor for x",
        formula: `x = ${p} \\text{ or } x = ${q}`
      }
    ];

    return {
      title: "Solving Quadratics by Factoring",
      questionText: `Solve ${equation}`,
      solution
    };
  }

  return generateQuadraticFactoring({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate quadratic equations using the quadratic formula
 * For when factoring is difficult or impossible with integers
 */
export const generateQuadraticFormula = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  let a, b, c;

  if (difficulty === 'easy') {
    // Perfect square discriminants for clean answers
    const discriminants = [1, 4, 9, 16, 25];
    const disc = _.sample(discriminants);
    
    a = 1;
    b = _.random(2, 8);
    c = (b * b - disc) / (4 * a); // Ensure discriminant = disc
    
    // Ensure c is integer
    if (c !== Math.floor(c)) {
      b = 6;
      c = (36 - disc) / 4;
    }
  } else {
    // Non-perfect squares, may need surds
    a = _.random(1, 3);
    b = _.random(1, 8);
    c = _.random(1, 10);
  }

  const discriminant = b * b - 4 * a * c;
  const equation = `${a === 1 ? '' : a}x^2 ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0`;

  // Calculate solutions
  let solutionText;
  if (discriminant >= 0) {
    const sqrtDisc = Math.sqrt(discriminant);
    if (sqrtDisc === Math.floor(sqrtDisc)) {
      // Perfect square - clean answers
      const x1 = (-b + sqrtDisc) / (2 * a);
      const x2 = (-b - sqrtDisc) / (2 * a);
      solutionText = `x = ${x1} \\text{ or } x = ${x2}`;
    } else {
      // Irrational solutions
      solutionText = `x = \\frac{${-b} \\pm \\sqrt{${discriminant}}}{${2 * a}}`;
    }
  } else {
    solutionText = "\\text{No real solutions (discriminant < 0)}";
  }

  if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "Identify the coefficients a, b, and c",
        formula: `a = ${a}, b = ${b}, c = ${c}`
      },
      {
        explanation: "Use the quadratic formula",
        formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
      },
      {
        explanation: "Calculate the discriminant",
        formula: `b^2 - 4ac = ${b}^2 - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${discriminant}`
      },
      {
        explanation: discriminant >= 0 ? "Substitute into the formula" : "Since discriminant < 0, there are no real solutions",
        formula: discriminant >= 0 ? `x = \\frac{${-b} \\pm \\sqrt{${discriminant}}}{${2 * a}}` : "\\text{No real solutions}"
      }
    ];

    if (discriminant >= 0) {
      solution.push({
        explanation: "Simplify to get the final answer",
        formula: solutionText
      });
    }

    return {
      title: "Using the Quadratic Formula",
      questionText: `Solve ${equation}`,
      solution
    };
  }

  return generateQuadraticFormula({ ...options, sectionType: 'examples' });
};

/**
 * Generate completing the square problems
 * Week 29 (Algebra VII) - Advanced technique
 */
export const generateCompletingSquare = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  let a, b, c;

  if (difficulty === 'easy') {
    // Simple cases where a = 1
    a = 1;
    b = _.random(2, 10, true) * 2; // Even numbers for cleaner completion
    c = _.random(1, 8);
  } else {
    // Include cases where a ≠ 1
    a = _.random(1, 3);
    b = _.random(1, 8);
    c = _.random(1, 10);
  }

  const equation = `${a === 1 ? '' : a}x^2 ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0`;

  // Complete the square: a(x + b/2a)² + (c - b²/4a) = 0
  const halfB = b / (2 * a);
  const completedConstant = c - (b * b) / (4 * a);

  if (sectionType === 'examples') {
    const solution = [];

    if (a !== 1) {
      solution.push({
        explanation: "Factor out the coefficient of x²",
        formula: `${a}(x^2 + ${b/a}x) + ${c} = 0`
      });
    }

    solution.push({
      explanation: "Complete the square inside the brackets",
      formula: `\\text{Half of } ${b/a} \\text{ is } ${halfB}, \\text{ and } (${halfB})^2 = ${halfB * halfB}`
    });

    solution.push({
      explanation: "Add and subtract the square inside the brackets",
      formula: a === 1 ? 
        `x^2 + ${b}x + ${halfB * halfB} - ${halfB * halfB} + ${c} = 0` :
        `${a}(x^2 + ${b/a}x + ${halfB * halfB} - ${halfB * halfB}) + ${c} = 0`
    });

    solution.push({
      explanation: "Factor the perfect square trinomial",
      formula: a === 1 ?
        `(x + ${halfB})^2 - ${halfB * halfB} + ${c} = 0` :
        `${a}((x + ${halfB})^2 - ${halfB * halfB}) + ${c} = 0`
    });

    solution.push({
      explanation: "Simplify",
      formula: `(x + ${halfB})^2 = ${halfB * halfB - c}`
    });

    const rhs = halfB * halfB - c;
    if (rhs >= 0) {
      solution.push({
        explanation: "Take the square root of both sides",
        formula: `x + ${halfB} = \\pm\\sqrt{${rhs}}`
      });

      solution.push({
        explanation: "Solve for x",
        formula: `x = ${-halfB} \\pm \\sqrt{${rhs}}`
      });
    } else {
      solution.push({
        explanation: "Since the right side is negative, there are no real solutions",
        formula: "\\text{No real solutions}"
      });
    }

    return {
      title: "Completing the Square",
      questionText: `Solve ${equation} by completing the square`,
      solution
    };
  }

  return generateCompletingSquare({ ...options, sectionType: 'examples' });
};

/**
 * Generate difference of two squares factoring
 * Week 4 (Algebra III) - Special case
 */
export const generateDifferenceOfSquares = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Generate a² - b² = (a+b)(a-b)
  let a, b;

  if (difficulty === 'easy') {
    a = _.random(2, 8);
    b = _.random(1, 6);
    // Ensure a > b for positive leading coefficient
    if (b >= a) {
      [a, b] = [b + 1, a];
    }
  } else {
    a = _.random(3, 10);
    b = _.random(2, 8);
    if (b >= a) {
      [a, b] = [b + 1, a];
    }
  }

  const aSquared = a * a;
  const bSquared = b * b;
  const expression = `${aSquared}x^2 - ${bSquared}`;
  const factored = `(${a}x + ${b})(${a}x - ${b})`;

  if (sectionType === 'starter') {
    return {
      question: `Factorise: ${expression}`,
      answer: `${expression} = ${factored}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    const incorrectOptions = [
      `(${a}x + ${b})^2`, // Squared instead of difference
      `(${a}x - ${b})^2`, // Squared with wrong sign
      `(${aSquared}x + ${bSquared})(x - 1)`, // Wrong factorization
      `${a}x(${a}x - ${bSquared})` // Partial factorization
    ];

    return {
      questionDisplay: {
        text: 'Factorise:',
        math: expression
      },
      correctAnswer: factored,
      options: [factored, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `This is a difference of squares: ${aSquared}x^2 - ${bSquared} = (${a}x)^2 - ${b}^2 = ${factored}`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "Recognize this as a difference of two squares",
        formula: `${expression} = (${a}x)^2 - ${b}^2`
      },
      {
        explanation: "Use the difference of squares formula: a² - b² = (a + b)(a - b)",
        formula: "a^2 - b^2 = (a + b)(a - b)"
      },
      {
        explanation: "Apply the formula with a = ${a}x and b = ${b}",
        formula: `(${a}x)^2 - ${b}^2 = (${a}x + ${b})(${a}x - ${b})`
      },
      {
        explanation: "Therefore",
        formula: `${expression} = ${factored}`
      }
    ];

    return {
      title: "Difference of Two Squares",
      questionText: `Factorise ${expression}`,
      solution
    };
  }

  return generateDifferenceOfSquares({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate quadratic inequalities
 * Week 19 (Algebra VI) - Advanced application
 */
export const generateQuadraticInequality = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  // Simple quadratic with easily found roots
  const p = _.random(1, 5);
  const q = _.random(p + 1, 8); // Ensure q > p

  // Generate (x - p)(x - q) compared to 0
  const inequalityTypes = ['>', '<', '≥', '≤'];
  const inequality = _.sample(inequalityTypes);

  const a = 1; // Keep coefficient simple
  const b = -(p + q);
  const c = p * q;

  const quadratic = `x^2 ${b >= 0 ? '+' : ''} ${b}x + ${c}`;
  const inequalityExpression = `${quadratic} ${inequality} 0`;

  // Determine solution based on inequality type
  let solutionText;
  if (inequality === '>' || inequality === '≥') {
    solutionText = `x ${inequality === '≥' ? '≤' : '<'} ${p} \\text{ or } x ${inequality === '≥' ? '≥' : '>'} ${q}`;
  } else {
    solutionText = `${p} ${inequality} x ${inequality} ${q}`;
  }

  if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "First, solve the quadratic equation x² + bx + c = 0",
        formula: `${quadratic} = 0`
      },
      {
        explanation: "Factor the quadratic",
        formula: `(x - ${p})(x - ${q}) = 0`
      },
      {
        explanation: "Find the roots",
        formula: `x = ${p} \\text{ or } x = ${q}`
      },
      {
        explanation: "These roots divide the number line into regions. Test each region:",
        formula: `\\text{Test } x < ${p}, ${p} < x < ${q}, \\text{ and } x > ${q}`
      },
      {
        explanation: "Determine which regions satisfy the inequality",
        formula: solutionText
      }
    ];

    return {
      title: "Solving Quadratic Inequalities",
      questionText: `Solve ${inequalityExpression}`,
      solution
    };
  }

  return generateQuadraticInequality({ ...options, sectionType: 'examples' });
};

/**
 * Generate quadratic word problems
 * Real-world applications for starter questions
 */
export const generateQuadraticWordProblem = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'starter'
  } = options;

  const scenarios = [
    {
      context: "A ball is thrown upward. Its height h (in meters) after t seconds is given by h = -5t² + 20t + 1.",
      question: "When does the ball hit the ground?",
      equation: "-5t² + 20t + 1 = 0",
      setup: "When the ball hits the ground, h = 0"
    },
    {
      context: "A rectangular garden has length (x + 3) meters and width x meters. Its area is 40 square meters.",
      question: "Find the dimensions of the garden.",
      equation: "x(x + 3) = 40",
      setup: "Area = length × width"
    },
    {
      context: "The profit P (in pounds) from selling x items is P = -2x² + 80x - 200.",
      question: "How many items should be sold to break even (profit = 0)?",
      equation: "-2x² + 80x - 200 = 0",
      setup: "Break even when P = 0"
    }
  ];

  const scenario = _.sample(scenarios);

  if (sectionType === 'starter') {
    return {
      question: `${scenario.context} ${scenario.question}`,
      answer: `${scenario.setup}
               Equation: ${scenario.equation}
               Solve using factoring or quadratic formula`,
      difficulty: 'algebra'
    };
  }

  return generateQuadraticWordProblem({ ...options, sectionType: 'starter' });
};

// Export all quadratic generators
export const quadraticGenerators = {
  generateQuadraticFactoring,
  generateQuadraticFormula,
  generateCompletingSquare,
  generateDifferenceOfSquares,
  generateQuadraticInequality,
  generateQuadraticWordProblem
};

export default quadraticGenerators;