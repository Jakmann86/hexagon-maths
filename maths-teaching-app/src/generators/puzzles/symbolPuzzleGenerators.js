// src/generators/puzzles/symbolPuzzleGenerators.js

import _ from 'lodash';
import { 
  getCurrentTheme, 
  getWeeklyTheme, 
  selectRandomSymbols, 
  getThemeDisplayName 
} from './symbolThemes.js';

/**
 * Generate a Product-Sum puzzle (Type 1)
 * Format: 🍎 × 🍌 = 12, 🍎 + 🍌 = 7, solve for 🍎 and 🍌
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.theme - Theme name (auto-selects if not provided)
 * @param {number} options.weekNumber - Week number for theme selection
 * @param {string} options.difficulty - 'easy', 'medium', 'hard'
 * @param {boolean} options.allowNegatives - Allow negative solutions
 * @returns {Object} Puzzle configuration object
 */
export const generateProductSumPuzzle = (options = {}) => {
  const {
    theme = options.weekNumber ? getWeeklyTheme(options.weekNumber) : getCurrentTheme(),
    difficulty = 'medium',
    allowNegatives = difficulty === 'hard'
  } = options;

  // Select two symbols for the puzzle
  const [symbol1, symbol2] = selectRandomSymbols(theme, 2);

  // Generate integer solutions based on difficulty
  let a, b, product, sum;
  
  const findValidPair = () => {
    const maxTries = 100;
    let tries = 0;
    
    while (tries < maxTries) {
      if (difficulty === 'easy') {
        // Easy: Small positive integers (1-6)
        a = _.random(1, 6);
        b = _.random(1, 6);
      } else if (difficulty === 'medium') {
        // Medium: Moderate integers (1-10)
        a = _.random(1, 10);
        b = _.random(1, 10);
      } else {
        // Hard: Allow negatives and larger range
        if (allowNegatives && Math.random() > 0.7) {
          a = _.random(-8, 8);
          b = _.random(-8, 8);
          // Ensure at least one is non-zero
          if (a === 0) a = _.random(1, 5);
          if (b === 0) b = _.random(1, 5);
        } else {
          a = _.random(1, 15);
          b = _.random(1, 15);
        }
      }
      
      product = a * b;
      sum = a + b;
      
      // Ensure we have a valid, interesting puzzle
      if (Math.abs(product) >= 2 && Math.abs(sum) >= 1 && a !== b) {
        break;
      }
      
      tries++;
    }
    
    // Fallback to ensure valid puzzle
    if (tries >= maxTries) {
      a = 3;
      b = 4;
      product = 12;
      sum = 7;
    }
  };

  findValidPair();

  // Create equation strings
  const productEquation = `${symbol1} × ${symbol2} = ${product}`;
  const sumEquation = `${symbol1} + ${symbol2} = ${sum}`;

  // Generate solution steps
  const solutionSteps = [
    "We have two equations with two unknowns:",
    `Equation 1: ${productEquation}`,
    `Equation 2: ${sumEquation}`,
    "",
    "Think: What two numbers multiply to give " + product + " and add to give " + sum + "?",
    "",
    `Solution: ${symbol1} = ${a}, ${symbol2} = ${b}`,
    "",
    "Check:",
    `${a} × ${b} = ${product} ✓`,
    `${a} + ${b} = ${sum} ✓`
  ];

  return {
    question: "Solve for the symbol values:",
    answer: solutionSteps.join('\n'),
    puzzleDisplay: {
      type: 'productSum',
      equations: [productEquation, sumEquation],
      symbols: [symbol1, symbol2],
      theme: theme,
      themeDisplayName: getThemeDisplayName(theme),
      solutions: { [symbol1]: a, [symbol2]: b },
      difficulty: difficulty
    },
    difficulty: 'puzzle'
  };
};

/**
 * Generate a Sequential Chain Solving puzzle (Type 2)
 * Format: 🍎🍎🍎🍎🍎 = 25, 🍎 × 🍌 = 45, 🍊 ÷ 🍌 = 12, find 🍊
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.theme - Theme name (auto-selects if not provided)
 * @param {number} options.weekNumber - Week number for theme selection
 * @param {string} options.difficulty - 'easy', 'medium', 'hard'
 * @returns {Object} Puzzle configuration object
 */
export const generateChainSolvingPuzzle = (options = {}) => {
  const {
    theme = options.weekNumber ? getWeeklyTheme(options.weekNumber) : getCurrentTheme(),
    difficulty = 'medium'
  } = options;

  // Select three symbols for the puzzle
  const [symbol1, symbol2, symbol3] = selectRandomSymbols(theme, 3);

  // Start with the first symbol value
  let value1, coefficient1, value2, value3;
  
  if (difficulty === 'easy') {
    value1 = _.random(2, 5);
    coefficient1 = _.random(3, 5);
  } else if (difficulty === 'medium') {
    value1 = _.random(3, 8);
    coefficient1 = _.random(3, 6);
  } else {
    value1 = _.random(2, 10);
    coefficient1 = _.random(4, 7);
  }

  // First equation: coefficient1 × symbol1 = total
  const total1 = coefficient1 * value1;
  
  // Second equation: symbol1 × symbol2 = product
  // Choose value2 that gives a reasonable product
  const productOptions = [6, 8, 10, 12, 15, 18, 20, 24, 30, 36, 42, 48];
  const validProducts = productOptions.filter(p => p % value1 === 0 && p / value1 <= 12);
  const product = _.sample(validProducts) || (value1 * _.random(3, 8));
  value2 = product / value1;

  // Third equation: symbol3 ÷ symbol2 = quotient
  const quotient = _.random(6, 15);
  value3 = quotient * value2;

  // Create the symbol repetition for coefficient representation
  const symbolRepeat = symbol1.repeat(coefficient1);

  // Create equation strings
  const equation1 = `${symbolRepeat} = ${total1}`;
  const equation2 = `${symbol1} × ${symbol2} = ${product}`;
  const equation3 = `${symbol3} ÷ ${symbol2} = ${quotient}`;

  // Generate solution steps
  const solutionSteps = [
    "Solve step by step:",
    "",
    `Step 1: From ${equation1}`,
    `${coefficient1}${symbol1} = ${total1}`,
    `${symbol1} = ${total1} ÷ ${coefficient1} = ${value1}`,
    "",
    `Step 2: From ${equation2}`,
    `${value1} × ${symbol2} = ${product}`,
    `${symbol2} = ${product} ÷ ${value1} = ${value2}`,
    "",
    `Step 3: From ${equation3}`,
    `${symbol3} ÷ ${value2} = ${quotient}`,
    `${symbol3} = ${quotient} × ${value2} = ${value3}`,
    "",
    `Final Answer: ${symbol3} = ${value3}`
  ];

  return {
    question: "Follow the chain to find the final symbol value:",
    answer: solutionSteps.join('\n'),
    puzzleDisplay: {
      type: 'chainSolving',
      equations: [equation1, equation2, equation3],
      symbols: [symbol1, symbol2, symbol3],
      theme: theme,
      themeDisplayName: getThemeDisplayName(theme),
      solutions: { 
        [symbol1]: value1, 
        [symbol2]: value2, 
        [symbol3]: value3 
      },
      targetSymbol: symbol3,
      difficulty: difficulty
    },
    difficulty: 'puzzle'
  };
};

/**
 * Generate a Simultaneous Equations puzzle (Type 3)
 * Format: 🍎🍎🍎 + 🍌🍌🍌🍌 = 29, 🍎🍎🍎 + 🍌🍌🍌🍌🍌🍌 = 39
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.theme - Theme name (auto-selects if not provided)
 * @param {number} options.weekNumber - Week number for theme selection
 * @param {string} options.difficulty - 'easy', 'medium', 'hard'
 * @returns {Object} Puzzle configuration object
 */
export const generateSimultaneousPuzzle = (options = {}) => {
  const {
    theme = options.weekNumber ? getWeeklyTheme(options.weekNumber) : getCurrentTheme(),
    difficulty = 'medium'
  } = options;

  // Select two symbols for the puzzle
  const [symbol1, symbol2] = selectRandomSymbols(theme, 2);

  // Generate coefficients and values based on difficulty
  let coeff1a, coeff1b, coeff2a, coeff2b, value1, value2;
  
  if (difficulty === 'easy') {
    // Easy: Small coefficients (2-4)
    coeff1a = _.random(2, 4);
    coeff1b = _.random(2, 4);
    coeff2a = coeff1a; // Same coefficient for first symbol
    coeff2b = coeff1b + _.random(1, 2); // Different for second symbol
    
    value1 = _.random(2, 6);
    value2 = _.random(2, 6);
  } else if (difficulty === 'medium') {
    // Medium: Moderate coefficients (2-5)
    coeff1a = _.random(2, 5);
    coeff1b = _.random(3, 6);
    coeff2a = coeff1a;
    coeff2b = coeff1b + _.random(1, 3);
    
    value1 = _.random(3, 8);
    value2 = _.random(2, 7);
  } else {
    // Hard: Larger coefficients (3-7)
    coeff1a = _.random(3, 7);
    coeff1b = _.random(3, 7);
    coeff2a = coeff1a;
    coeff2b = coeff1b + _.random(2, 4);
    
    value1 = _.random(2, 9);
    value2 = _.random(2, 8);
  }

  // Calculate the sums
  const sum1 = coeff1a * value1 + coeff1b * value2;
  const sum2 = coeff2a * value1 + coeff2b * value2;

  // Create symbol repetitions for coefficients
  const symbol1Repeat1 = symbol1.repeat(coeff1a);
  const symbol2Repeat1 = symbol2.repeat(coeff1b);
  const symbol1Repeat2 = symbol1.repeat(coeff2a);
  const symbol2Repeat2 = symbol2.repeat(coeff2b);

  // Create equation strings
  const equation1 = `${symbol1Repeat1} + ${symbol2Repeat1} = ${sum1}`;
  const equation2 = `${symbol1Repeat2} + ${symbol2Repeat2} = ${sum2}`;

  // Generate solution steps
  const solutionSteps = [
    "Solve the simultaneous equations:",
    "",
    `Equation 1: ${equation1}`,
    `Equation 2: ${equation2}`,
    "",
    "Rewrite using coefficients:",
    `${coeff1a}${symbol1} + ${coeff1b}${symbol2} = ${sum1}`,
    `${coeff2a}${symbol1} + ${coeff2b}${symbol2} = ${sum2}`,
    "",
    "Subtract equation 1 from equation 2:",
    `${coeff2b - coeff1b}${symbol2} = ${sum2 - sum1}`,
    `${symbol2} = ${sum2 - sum1} ÷ ${coeff2b - coeff1b} = ${value2}`,
    "",
    "Substitute back into equation 1:",
    `${coeff1a}${symbol1} + ${coeff1b} × ${value2} = ${sum1}`,
    `${coeff1a}${symbol1} + ${coeff1b * value2} = ${sum1}`,
    `${coeff1a}${symbol1} = ${sum1 - coeff1b * value2}`,
    `${symbol1} = ${value1}`,
    "",
    `Solution: ${symbol1} = ${value1}, ${symbol2} = ${value2}`
  ];

  return {
    question: "Solve the simultaneous symbol equations:",
    answer: solutionSteps.join('\n'),
    puzzleDisplay: {
      type: 'simultaneous',
      equations: [equation1, equation2],
      symbols: [symbol1, symbol2],
      theme: theme,
      themeDisplayName: getThemeDisplayName(theme),
      solutions: { [symbol1]: value1, [symbol2]: value2 },
      coefficients: {
        equation1: [coeff1a, coeff1b],
        equation2: [coeff2a, coeff2b]
      },
      difficulty: difficulty
    },
    difficulty: 'puzzle'
  };
};

/**
 * Generate a random symbol puzzle (selects from all three types)
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.theme - Theme name (auto-selects if not provided)
 * @param {number} options.weekNumber - Week number for theme selection
 * @param {string} options.difficulty - 'easy', 'medium', 'hard'
 * @param {string[]} options.excludeTypes - Puzzle types to exclude
 * @returns {Object} Puzzle configuration object
 */
export const generateSymbolPuzzle = (options = {}) => {
  const {
    excludeTypes = [],
    difficulty = 'medium'
  } = options;

  // Available puzzle types
  const allTypes = ['productSum', 'chainSolving', 'simultaneous'];
  const availableTypes = allTypes.filter(type => !excludeTypes.includes(type));
  
  if (availableTypes.length === 0) {
    throw new Error('No puzzle types available. Check excludeTypes parameter.');
  }

  // Select random type
  const selectedType = _.sample(availableTypes);

  // Generate the appropriate puzzle type
  switch (selectedType) {
    case 'productSum':
      return generateProductSumPuzzle(options);
    case 'chainSolving':
      return generateChainSolvingPuzzle(options);
    case 'simultaneous':
      return generateSimultaneousPuzzle(options);
    default:
      // Fallback to product-sum
      return generateProductSumPuzzle(options);
  }
};

/**
 * Generate a sequence of symbol puzzles with increasing difficulty
 * Useful for creating a full set of starter questions
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.count - Number of puzzles to generate (default: 4)
 * @param {string} options.theme - Theme name (auto-selects if not provided)
 * @param {number} options.weekNumber - Week number for theme selection
 * @returns {Object[]} Array of puzzle configuration objects
 */
export const generateSymbolPuzzleSequence = (options = {}) => {
  const {
    count = 4,
    theme = options.weekNumber ? getWeeklyTheme(options.weekNumber) : getCurrentTheme(),
    weekNumber
  } = options;

  const puzzles = [];
  const difficulties = ['easy', 'medium', 'hard'];
  const types = ['productSum', 'chainSolving', 'simultaneous'];

  for (let i = 0; i < count; i++) {
    const difficulty = difficulties[i % difficulties.length];
    const type = types[i % types.length];
    
    let puzzle;
    switch (type) {
      case 'productSum':
        puzzle = generateProductSumPuzzle({ theme, weekNumber, difficulty });
        break;
      case 'chainSolving':
        puzzle = generateChainSolvingPuzzle({ theme, weekNumber, difficulty });
        break;
      case 'simultaneous':
        puzzle = generateSimultaneousPuzzle({ theme, weekNumber, difficulty });
        break;
      default:
        puzzle = generateProductSumPuzzle({ theme, weekNumber, difficulty });
    }
    
    puzzles.push(puzzle);
  }

  return puzzles;
};

// Export all generators
export const symbolPuzzleGenerators = {
  generateProductSumPuzzle,
  generateChainSolvingPuzzle,
  generateSimultaneousPuzzle,
  generateSymbolPuzzle,
  generateSymbolPuzzleSequence
};

export default symbolPuzzleGenerators;