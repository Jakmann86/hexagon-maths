// maths-teaching-app/src/generators/core/baseGenerators.js

import _ from 'lodash';

/**
 * Standard question object structure that all generators should follow
 * This ensures consistency across different question types
 */
export const createBaseQuestion = ({
  id = generateQuestionId(),
  type = '',
  difficulty = 'medium',
  conceptKey = '',
  questionText = '',
  correctAnswer = '',
  options = [],
  visualization = null,
  solution = [],
  explanation = '',
  tags = [],
  curriculum = {},
  ...additionalProps
} = {}) => {
  // Return a standardized question object
  return {
    id,
    type,
    difficulty,
    conceptKey,
    questionText,
    correctAnswer,
    options,
    visualization,
    solution,
    explanation,
    tags,
    curriculum,
    ...additionalProps
  };
};

/**
 * Generate a unique ID for tracking questions
 */
export const generateQuestionId = () => {
  return `q_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Random number generation utilities optimized for educational use
 */
export const randomUtils = {
  // Generate integer within range (inclusive)
  integer: (min, max) => {
    return _.random(min, max);
  },

  // Generate a "nice" decimal number (avoids awkward decimals)
  decimal: (min, max, precision = 1) => {
    const value = _.random(min, max, true);
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  },

  // Select a random item from an array
  choice: (items) => {
    return _.sample(items);
  },

  // Select multiple random items from an array
  choices: (items, count) => {
    return _.sampleSize(items, count);
  },

  // Generate a random angle (in degrees)
  angle: (min = 0, max = 90) => {
    // Prefer common angles for educational clarity
    const commonAngles = [30, 45, 60, 90];
    if (Math.random() < 0.7) {
      // 70% chance to use a common angle if it's in range
      const validAngles = commonAngles.filter(a => a >= min && a <= max);
      if (validAngles.length > 0) {
        return _.sample(validAngles);
      }
    }
    // Otherwise use a random integer angle
    return _.random(min, max);
  }
};

/**
 * Math operation utilities for consistent calculations
 */
export const mathUtils = {
  // Round to specified decimal places
  round: (value, decimals = 2) => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  // Calculate distance between two points
  distance: (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  // Calculate area of triangle using base and height
  triangleArea: (base, height) => {
    return (base * height) / 2;
  },

  // Calculate area of triangle using three sides (Heron's formula)
  triangleAreaHeron: (a, b, c) => {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  },

  // Check if a value is a perfect square
  isPerfectSquare: (num) => {
    const sqrt = Math.sqrt(num);
    return sqrt === Math.floor(sqrt);
  }
};

/**
 * Solution step generators for creating consistent step-by-step solutions
 */
export const solutionUtils = {
  // Create a standard solution step
  createStep: (explanation, formula = null) => {
    return { explanation, formula };
  },

  // Generate a complete solution path from steps
  createSolution: (steps) => {
    return steps.map(step => {
      if (typeof step === 'string') {
        return { explanation: step };
      }
      return step;
    });
  }
};

/**
 * Standard difficulty configuration for different levels
 */
export const difficultyConfig = {
  easy: {
    numberRange: { min: 2, max: 10 },
    decimalPlaces: 0,
    includeHints: true,
    preferCleanValues: true
  },
  medium: {
    numberRange: { min: 3, max: 15 },
    decimalPlaces: 1,
    includeHints: false,
    preferCleanValues: true
  },
  hard: {
    numberRange: { min: 5, max: 25 },
    decimalPlaces: 2,
    includeHints: false,
    preferCleanValues: false
  }
};

/**
 * Base Generator object that provides core functionality
 * for all question generators
 */
export const BaseGenerator = {
  // Create a standard question with appropriate structure
  createQuestion: createBaseQuestion,

  // Access to randomization utilities
  random: randomUtils,

  // Access to math operation utilities
  math: mathUtils,

  // Access to solution step generators
  solution: solutionUtils,

  // Difficulty configuration
  difficulty: difficultyConfig,

  // Generate appropriate distractors (wrong answers) for multiple choice
  generateDistractors: (correctAnswer, count = 3, options = {}) => {
    // Default implementation that can be overridden by specific generators
    const distractors = new Set();
    
    // Add slightly modified values
    if (typeof correctAnswer === 'number') {
      distractors.add(correctAnswer + 1);
      distractors.add(correctAnswer - 1);
      distractors.add(correctAnswer * 2);
      distractors.add(Math.round(correctAnswer / 2));
    }
    
    // Convert to array and take required count
    return Array.from(distractors).slice(0, count);
  }
};

export default BaseGenerator;