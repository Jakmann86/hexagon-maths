// src/generators/puzzles/magicSquareGenerator.js
// Magic Square Puzzle Generator
// Following Generator Output Specification v1.0

import _ from 'lodash';

// ============================================================
// BASE MAGIC SQUARES
// ============================================================

// 3x3 magic squares (all sum to 15)
const baseSquares3x3 = [
  [[8, 1, 6], [3, 5, 7], [4, 9, 2]],
  [[6, 1, 8], [7, 5, 3], [2, 9, 4]],
  [[2, 7, 6], [9, 5, 1], [4, 3, 8]],
  [[4, 9, 2], [3, 5, 7], [8, 1, 6]],
  [[2, 9, 4], [7, 5, 3], [6, 1, 8]],
  [[6, 7, 2], [1, 5, 9], [8, 3, 4]]
];

// 4x4 magic squares (all sum to 34)
const baseSquares4x4 = [
  [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]],
  [[1, 14, 15, 4], [12, 7, 6, 9], [8, 11, 10, 5], [13, 2, 3, 16]]
];

// Pre-made squares with negative numbers (clean sums)
const negativeSquares3x3 = [
  { grid: [[3, -4, 1], [-2, 0, 2], [-1, 4, -3]], sum: 0 },
  { grid: [[4, -3, 2], [-1, 1, 3], [0, 5, -2]], sum: 3 },
  { grid: [[2, -5, 0], [-3, -1, 1], [-2, 3, -4]], sum: -3 },
  { grid: [[5, -2, 3], [0, 2, 4], [1, 6, -1]], sum: 6 },
  { grid: [[1, -6, -1], [-4, -2, 0], [-3, 2, -5]], sum: -6 },
  { grid: [[6, -7, 1], [-3, 0, 3], [-3, 7, -4]], sum: 0 }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all positions in a grid
 */
const getAllPositions = (size) => {
  const positions = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.push([i, j]);
    }
  }
  return positions;
};

/**
 * Create display grid with hidden cells set to null
 */
const createDisplayGrid = (fullGrid, hiddenPositions) => {
  return fullGrid.map((row, i) =>
    row.map((val, j) => {
      const isHidden = hiddenPositions.some(([hi, hj]) => hi === i && hj === j);
      return isHidden ? null : val;
    })
  );
};

/**
 * Strategic hidden patterns (more interesting than random)
 */
const hiddenPatterns3x3 = [
  [[0, 0], [1, 1], [2, 2]],   // Main diagonal
  [[0, 2], [1, 1], [2, 0]],   // Anti-diagonal
  [[0, 1], [1, 2], [2, 0]],   // Scattered
  [[0, 0], [1, 2], [2, 1]],   // L-shape
  [[0, 1], [1, 0], [2, 2]]    // Another pattern
];

const hiddenPatterns4x4 = [
  [[0, 0], [1, 1], [2, 2], [3, 3]],   // Main diagonal
  [[0, 3], [1, 2], [2, 1], [3, 0]],   // Anti-diagonal
  [[0, 0], [0, 3], [3, 0], [3, 3]]    // Corners
];

// ============================================================
// GENERATORS
// ============================================================

/**
 * Generate a basic 3x3 magic square
 */
const generateBasic3x3 = (options = {}) => {
  const { seed = Date.now(), hiddenCount = 3 } = options;
  
  // Select a base square
  const fullGrid = _.cloneDeep(_.sample(baseSquares3x3));
  const magicSum = 15;
  
  // Select hidden pattern
  const hiddenPositions = _.sample(hiddenPatterns3x3);
  const displayGrid = createDisplayGrid(fullGrid, hiddenPositions);
  
  // Get hidden values for answer
  const hiddenValues = hiddenPositions.map(([i, j]) => fullGrid[i][j]);
  
  return {
    instruction: 'Complete the magic square',
    questionMath: '',
    questionText: 'Fill in the missing numbers',
    
    answer: hiddenValues.join(', '),
    answerUnits: '',
    
    workingOut: `\\text{Magic sum} = ${magicSum} \\\\ \\text{Each row, column, diagonal} = ${magicSum}`,
    
    solution: [
      { explanation: 'Each row, column, and diagonal sums to', formula: `${magicSum}` },
      { explanation: 'Use known values to find unknowns', formula: '\\text{e.g., } 8 + 1 + ? = 15' },
      { explanation: 'Hidden values are', formula: hiddenValues.join(', ') }
    ],
    
    // Visualization config (Pattern 2 - not React component)
    visualization: {
      type: 'magic-square',
      grid: displayGrid,
      fullGrid: fullGrid,
      size: 3,
      magicSum: magicSum,
      hiddenPositions: hiddenPositions
    },
    visualizationType: 'magic-square',
    visualizationHeight: '140px',
    
    metadata: {
      type: 'magic-square',
      subType: 'basic-3x3',
      difficulty: 'easy',
      topic: 'number-puzzles',
      tags: ['puzzle', 'arithmetic', 'logic'],
      values: { magicSum, hiddenValues, size: 3 }
    },
    
    title: 'Magic Square (3×3)',
    hint: `Each row, column, and diagonal adds to ${magicSum}`
  };
};

/**
 * Generate a 4x4 magic square (harder)
 */
const generateBasic4x4 = (options = {}) => {
  const { seed = Date.now() } = options;
  
  const fullGrid = _.cloneDeep(_.sample(baseSquares4x4));
  const magicSum = 34;
  
  const hiddenPositions = _.sample(hiddenPatterns4x4);
  const displayGrid = createDisplayGrid(fullGrid, hiddenPositions);
  
  const hiddenValues = hiddenPositions.map(([i, j]) => fullGrid[i][j]);
  
  return {
    instruction: 'Complete the magic square',
    questionMath: '',
    questionText: 'Fill in the missing numbers',
    
    answer: hiddenValues.join(', '),
    
    workingOut: `\\text{Magic sum} = ${magicSum}`,
    
    solution: [
      { explanation: 'Each row, column, and diagonal sums to', formula: `${magicSum}` },
      { explanation: 'Hidden values are', formula: hiddenValues.join(', ') }
    ],
    
    visualization: {
      type: 'magic-square',
      grid: displayGrid,
      fullGrid: fullGrid,
      size: 4,
      magicSum: magicSum,
      hiddenPositions: hiddenPositions
    },
    visualizationType: 'magic-square',
    visualizationHeight: '160px',
    
    metadata: {
      type: 'magic-square',
      subType: 'basic-4x4',
      difficulty: 'medium',
      topic: 'number-puzzles',
      tags: ['puzzle', 'arithmetic', 'logic'],
      values: { magicSum, hiddenValues, size: 4 }
    },
    
    title: 'Magic Square (4×4)',
    hint: `Each row, column, and diagonal adds to ${magicSum}`
  };
};

/**
 * Generate magic square with negative numbers
 * This is the harder version you requested
 */
const generateWithNegatives = (options = {}) => {
  const { seed = Date.now(), difficulty = 'medium' } = options;
  
  // Pick a pre-made negative square
  const selected = _.sample(negativeSquares3x3);
  const fullGrid = _.cloneDeep(selected.grid);
  const magicSum = selected.sum;
  
  // Use strategic hidden pattern
  const hiddenPositions = _.sample(hiddenPatterns3x3);
  const displayGrid = createDisplayGrid(fullGrid, hiddenPositions);
  
  const hiddenValues = hiddenPositions.map(([i, j]) => fullGrid[i][j]);
  
  // Check if hidden values include negatives
  const hasNegativeInHidden = hiddenValues.some(v => v < 0);
  
  return {
    instruction: 'Complete the magic square',
    questionMath: '',
    questionText: 'Fill in the missing numbers (negatives allowed)',
    
    answer: hiddenValues.join(', '),
    
    workingOut: `\\text{Magic sum} = ${magicSum} \\\\ \\text{Watch for negative numbers!}`,
    
    solution: [
      { explanation: 'Each row, column, and diagonal sums to', formula: `${magicSum}` },
      { explanation: 'Remember: sums can include negatives', formula: `\\text{e.g., } 3 + (-4) + 1 = 0` },
      { explanation: 'Hidden values are', formula: hiddenValues.join(', ') }
    ],
    
    visualization: {
      type: 'magic-square',
      grid: displayGrid,
      fullGrid: fullGrid,
      size: 3,
      magicSum: magicSum,
      hiddenPositions: hiddenPositions,
      includesNegatives: true
    },
    visualizationType: 'magic-square',
    visualizationHeight: '140px',
    
    metadata: {
      type: 'magic-square',
      subType: 'with-negatives',
      difficulty: hasNegativeInHidden ? 'hard' : 'medium',
      topic: 'number-puzzles',
      tags: ['puzzle', 'arithmetic', 'logic', 'negative-numbers'],
      values: { magicSum, hiddenValues, size: 3, hasNegatives: true }
    },
    
    title: 'Magic Square (with negatives)',
    hint: `Each row, column, and diagonal adds to ${magicSum}`
  };
};

/**
 * Generate transformed magic square (add/subtract from all values)
 * Creates variety without pre-storing lots of squares
 */
const generateTransformed = (options = {}) => {
  const { seed = Date.now(), offset = null } = options;
  
  // Start with base square
  let fullGrid = _.cloneDeep(_.sample(baseSquares3x3));
  
  // Apply offset (random if not specified)
  const actualOffset = offset !== null ? offset : _.random(-10, 10);
  fullGrid = fullGrid.map(row => row.map(val => val + actualOffset));
  
  const magicSum = 15 + (actualOffset * 3); // Original sum + offset per cell
  
  const hiddenPositions = _.sample(hiddenPatterns3x3);
  const displayGrid = createDisplayGrid(fullGrid, hiddenPositions);
  const hiddenValues = hiddenPositions.map(([i, j]) => fullGrid[i][j]);
  
  const hasNegatives = fullGrid.some(row => row.some(val => val < 0));
  
  return {
    instruction: 'Complete the magic square',
    questionMath: '',
    questionText: hasNegatives ? 'Fill in the missing numbers (negatives allowed)' : 'Fill in the missing numbers',
    
    answer: hiddenValues.join(', '),
    
    workingOut: `\\text{Magic sum} = ${magicSum}`,
    
    solution: [
      { explanation: 'Each row, column, and diagonal sums to', formula: `${magicSum}` },
      { explanation: 'Hidden values are', formula: hiddenValues.join(', ') }
    ],
    
    visualization: {
      type: 'magic-square',
      grid: displayGrid,
      fullGrid: fullGrid,
      size: 3,
      magicSum: magicSum,
      hiddenPositions: hiddenPositions,
      includesNegatives: hasNegatives
    },
    visualizationType: 'magic-square',
    visualizationHeight: '140px',
    
    metadata: {
      type: 'magic-square',
      subType: 'transformed',
      difficulty: hasNegatives ? 'hard' : 'medium',
      topic: 'number-puzzles',
      tags: ['puzzle', 'arithmetic', 'logic'],
      values: { magicSum, hiddenValues, size: 3, offset: actualOffset, hasNegatives }
    },
    
    title: hasNegatives ? 'Magic Square (with negatives)' : 'Magic Square',
    hint: `Each row, column, and diagonal adds to ${magicSum}`
  };
};

/**
 * Generate a random magic square question
 */
const generateRandom = (options = {}) => {
  const { 
    seed = Date.now(), 
    includeNegatives = false, 
    forceNegatives = false,
    size = 3,
    difficulty = 'medium'
  } = options;
  
  // If forcing negatives, use negative generator
  if (forceNegatives) {
    return generateWithNegatives({ seed });
  }
  
  // If 4x4 requested
  if (size === 4) {
    return generateBasic4x4({ seed });
  }
  
  // For medium/hard, might include negatives
  if (includeNegatives || difficulty === 'hard') {
    return _.sample([generateWithNegatives, generateTransformed])({ seed });
  }
  
  // Default: basic 3x3
  return generateBasic3x3({ seed });
};

// ============================================================
// EXPORTS
// ============================================================

export const magicSquareGenerators = {
  generateBasic3x3,
  generateBasic4x4,
  generateWithNegatives,
  generateTransformed,
  generateRandom
};

export default magicSquareGenerators;