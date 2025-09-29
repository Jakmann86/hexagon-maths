// ============================================================================
// src/generators/puzzles/magicSquareGenerators.js
// ============================================================================

import _ from 'lodash';

/**
 * Generate a 3x3 magic square puzzle with missing numbers
 * A magic square has all rows, columns, and diagonals summing to the same number
 */
export const generateMagicSquarePuzzle = (options = {}) => {
  const {
    difficulty = 'medium'
  } = options;

  // Determine how many numbers to hide based on difficulty
  let numbersToHide;
  if (difficulty === 'easy') {
    numbersToHide = 2; // Hide 2 numbers
  } else if (difficulty === 'medium') {
    numbersToHide = 3; // Hide 3 numbers
  } else {
    numbersToHide = 4; // Hide 4 numbers
  }

  // Generate a valid 3x3 magic square
  // Using Lo Shu magic square as base template with random multiplier and offset
  const baseSquare = [
    [2, 7, 6],
    [9, 5, 1],
    [4, 3, 8]
  ];

  // Apply transformation: multiply by multiplier and add offset
  // Allow negative offsets to get negative numbers
  const multiplier = _.random(1, 3);
  const offset = _.random(-5, 5);

  const magicSquare = baseSquare.map(row => 
    row.map(val => val * multiplier + offset)
  );

  // Calculate the magic sum
  const magicSum = magicSquare[0].reduce((a, b) => a + b, 0);

  // Randomly select positions to hide
  const allPositions = [
    [0, 0], [0, 1], [0, 2],
    [1, 0], [1, 1], [1, 2],
    [2, 0], [2, 1], [2, 2]
  ];

  // Shuffle and select positions to hide
  const positionsToHide = _.sampleSize(allPositions, numbersToHide);

  // Create the puzzle grid (with null for hidden values)
  const puzzleGrid = magicSquare.map((row, i) =>
    row.map((val, j) => {
      const isHidden = positionsToHide.some(([r, c]) => r === i && c === j);
      return isHidden ? null : val;
    })
  );

  // Get the hidden values for the answer
  const hiddenValues = positionsToHide.map(([r, c]) => ({
    position: [r, c],
    value: magicSquare[r][c]
  }));

  // Format answer string
  const answerString = hiddenValues
    .map(({ position, value }) => {
      const row = position[0] + 1;
      const col = position[1] + 1;
      return `Row ${row}, Col ${col}: ${value}`;
    })
    .join(' | ');

  return {
    question: 'Fill in the missing numbers to complete the magic square:',
    puzzleGrid,
    magicSum,
    hiddenValues,
    fullSolution: magicSquare,
    answer: answerString,
    difficulty: 'puzzle',
    isMagicSquare: true
  };
};

export const magicSquareGenerators = {
  generateMagicSquarePuzzle
};