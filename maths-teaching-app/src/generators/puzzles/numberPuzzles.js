// src/generators/puzzles/numberPuzzles.js
import _ from 'lodash';

/**
 * Generate a number puzzle for starter questions
 * Creates a puzzle where students need to reach a target by using operations on given numbers
 */
export const numberPuzzle1 = () => {
  // Variables to store the generated puzzle
  let target, numbers, operations, steps;

  // Generate a valid puzzle by working backward from the solution
  const generateValidPuzzle = () => {
    // Pick 4 single-digit numbers
    numbers = [_.random(2, 9), _.random(2, 9), _.random(2, 9), _.random(2, 9)];

    // Start with the first two numbers and apply an operation
    let result1 = numbers[0] * numbers[1]; // Use multiplication as first step

    // Second step - addition
    let result2 = result1 + numbers[2];

    // Final step - use the last number to get a nice target
    // Subtraction usually gives a clean result
    target = result2 - numbers[3];

    // Check if target is in a good range (20-100)
    if (target < 20 || target > 100) {
      return false;
    }

    // Define the operations used
    operations = ['×', '+', '-'];

    // Define the solution steps
    steps = [
      `Step 1: ${numbers[0]} × ${numbers[1]} = ${result1}`,
      `Step 2: ${result1} + ${numbers[2]} = ${result2}`,
      `Step 3: ${result2} - ${numbers[3]} = ${target}`
    ];

    return true;
  };

  // Keep trying until we get a valid puzzle
  while (!generateValidPuzzle()) {
    // Try again until success
  }

  return {
    question: `Using the numbers ${numbers.join(', ')} and the operations +, -, ×, ÷, find a way to make ${target}. You can use each number only once.`,
    answer: steps.join('\n'),
    difficulty: 'puzzle'
  };
};

/**
 * Generate a more advanced number puzzle
 * Allows customization of the number of operations and target range
 */
export const numberPuzzle2 = ({ numOperations = 3, targetMin = 20, targetMax = 100 } = {}) => {
  // Target number and operands
  let target, numbers, operations, steps;
  
  // Generate a valid puzzle
  const generateValidPuzzle = () => {
    // Generate numbers based on the required operations
    numbers = Array(numOperations + 1).fill().map(() => _.random(2, 9));
    
    // Choose operations from available options
    const availableOps = ['+', '-', '×', '÷'];
    operations = [];
    steps = [];
    
    // Start with the first number
    let currentResult = numbers[0];
    
    // Apply operations one by one
    for (let i = 1; i < numbers.length; i++) {
      // Pick a random operation
      const op = availableOps[_.random(0, 3)];
      operations.push(op);
      
      // Calculate the result based on the operation
      let newResult;
      switch (op) {
        case '+':
          newResult = currentResult + numbers[i];
          break;
        case '-':
          newResult = currentResult - numbers[i];
          break;
        case '×':
          newResult = currentResult * numbers[i];
          break;
        case '÷':
          // Ensure division results in a whole number
          if (currentResult % numbers[i] !== 0) {
            return false;
          }
          newResult = currentResult / numbers[i];
          break;
      }
      
      // Record the step
      steps.push(`Step ${i}: ${currentResult} ${op} ${numbers[i]} = ${newResult}`);
      
      // Update the current result
      currentResult = newResult;
    }
    
    // Check if the final result is in the desired range
    target = currentResult;
    return target >= targetMin && target <= targetMax && target === Math.round(target);
  };
  
  // Keep trying until we get a valid puzzle
  while (!generateValidPuzzle()) {
    // Try again until success
  }
  
  return {
    question: `Using the numbers ${numbers.join(', ')} and the operations +, -, ×, ÷, find a way to make ${target}. You can use each number only once.`,
    answer: steps.join('\n'),
    difficulty: 'puzzle'
  };
};

// Export a grouped set of number puzzle generators
export const numberPuzzleGenerators = {
  numberPuzzle1,
  numberPuzzle2
};

export default numberPuzzleGenerators;