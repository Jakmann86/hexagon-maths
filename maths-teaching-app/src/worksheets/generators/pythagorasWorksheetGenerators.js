// src/worksheets/generators/pythagorasWorksheetGenerators.js
// V1.0 - Worksheet-specific generators for Pythagoras
// 
// Simpler output format than app generators:
// { questionText, answer, visualization, hint? }
//
// Question types:
// - Basic: find hypotenuse, find shorter side
// - Isosceles: find height, find area
// - Context: TV screen, ladder, ship, football pitch
// - Challenge: coordinate distance

import _ from 'lodash';

// ============================================================
// CONSTANTS - Clean values for worksheets (no calculators needed for basic)
// ============================================================

const PYTHAGOREAN_TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [12, 16, 20],
];

// Isosceles triangles with integer heights
const ISOSCELES_CONFIGS = [
  { base: 6, equalSide: 5, height: 4 },     // half of 3-4-5
  { base: 10, equalSide: 13, height: 12 },  // half of 5-12-13
  { base: 16, equalSide: 10, height: 6 },   // half of 8-6-10
  { base: 12, equalSide: 10, height: 8 },   // half of 6-8-10
  { base: 8, equalSide: 5, height: 3 },     // half of 4-3-5
];

// Coordinate pairs with clean integer distances
const COORDINATE_PAIRS_POSITIVE = [
  { p1: [2, 1], p2: [8, 9], distance: 10 },    // 6² + 8² = 100
  { p1: [1, 2], p2: [4, 6], distance: 5 },     // 3² + 4² = 25
  { p1: [0, 0], p2: [5, 12], distance: 13 },   // 5² + 12² = 169
  { p1: [3, 1], p2: [15, 6], distance: 13 },   // 12² + 5² = 169
  { p1: [2, 3], p2: [6, 6], distance: 5 },     // 4² + 3² = 25
];

const COORDINATE_PAIRS_NEGATIVE = [
  { p1: [-3, 4], p2: [5, -2], distance: 10 },  // 8² + 6² = 100
  { p1: [-2, -1], p2: [1, 3], distance: 5 },   // 3² + 4² = 25
  { p1: [-4, 3], p2: [8, -2], distance: 13 },  // 12² + 5² = 169
  { p1: [2, -3], p2: [-1, 1], distance: 5 },   // 3² + 4² = 25
];

// Context problem configs
const TV_CONFIGS = [
  { width: 80, height: 60, diagonal: 100 },    // 80² + 60² = 10000
  { width: 48, height: 36, diagonal: 60 },     // scaled 3-4-5
  { width: 32, height: 24, diagonal: 40 },     // scaled 3-4-5
  { width: 120, height: 90, diagonal: 150 },   // scaled 3-4-5
];

const LADDER_CONFIGS = [
  { ladder: 5, distance: 3, height: 4 },       // 3-4-5
  { ladder: 13, distance: 5, height: 12 },     // 5-12-13
  { ladder: 10, distance: 6, height: 8 },      // 6-8-10
  { ladder: 5, distance: 1.5, height: 4.8 },   // decimal answer
  { ladder: 6, distance: 2, height: 5.7 },     // decimal answer
];

const SHIP_CONFIGS = [
  { east: 24, north: 10, distance: 26 },       // scaled 12-5-13
  { east: 30, north: 40, distance: 50 },       // scaled 3-4-5
  { east: 8, north: 6, distance: 10 },         // scaled 3-4-5
  { east: 9, north: 12, distance: 15 },        // scaled 3-4-5
];

const PITCH_CONFIGS = [
  { length: 100, width: 75, diagonal: 125 },   // scaled 3-4-5
  { length: 120, width: 90, diagonal: 150 },   // scaled 3-4-5
  { length: 100, width: 70, diagonal: 122.1 }, // decimal
  { length: 105, width: 68, diagonal: 125.1 }, // decimal (FIFA standard-ish)
];

// ============================================================
// BASIC TRIANGLE GENERATORS
// ============================================================

/**
 * Generate a "find the hypotenuse" question
 */
export const generateFindHypotenuse = (options = {}) => {
  const { difficulty = 'easy', usedTriples = [] } = options;
  
  // Pick a triple we haven't used yet
  const available = PYTHAGOREAN_TRIPLES.filter(t => 
    !usedTriples.some(used => used[0] === t[0] && used[1] === t[1])
  );
  const triple = available.length > 0 ? _.sample(available) : _.sample(PYTHAGOREAN_TRIPLES);
  const [a, b, c] = triple;
  
  // Sometimes swap a and b for variety
  const [base, height] = Math.random() > 0.5 ? [a, b] : [b, a];
  
  return {
    questionText: 'Find x.',
    answer: `x = ${c} cm`,
    answerValue: c,
    visualization: {
      type: 'right-triangle',
      base,
      height,
      unknownSide: 'hypotenuse',
      labels: {
        base: `${base} cm`,
        height: `${height} cm`,
        hypotenuse: 'x'
      },
      units: 'cm'
    },
    triple // Return so we can track used triples
  };
};

/**
 * Generate a "find the shorter side" question
 */
export const generateFindShorterSide = (options = {}) => {
  const { difficulty = 'easy', findBase = null, usedTriples = [] } = options;
  
  const available = PYTHAGOREAN_TRIPLES.filter(t => 
    !usedTriples.some(used => used[0] === t[0] && used[1] === t[1])
  );
  const triple = available.length > 0 ? _.sample(available) : _.sample(PYTHAGOREAN_TRIPLES);
  const [a, b, c] = triple;
  
  // Decide which side to find
  const findingBase = findBase !== null ? findBase : Math.random() > 0.5;
  const unknownValue = findingBase ? a : b;
  const knownLeg = findingBase ? b : a;
  const unknownSide = findingBase ? 'base' : 'height';
  
  // Use letter labels for variety
  const letterSets = [['x'], ['AC'], ['PQ'], ['y']];
  const unknownLabel = _.sample(letterSets)[0];
  
  return {
    questionText: `Find ${unknownLabel}.`,
    answer: `${unknownLabel} = ${unknownValue} cm`,
    answerValue: unknownValue,
    visualization: {
      type: 'right-triangle',
      base: a,
      height: b,
      hypotenuse: c,
      unknownSide,
      labels: {
        base: findingBase ? unknownLabel : `${a} cm`,
        height: findingBase ? `${b} cm` : unknownLabel,
        hypotenuse: `${c} cm`
      },
      units: 'cm'
    },
    triple
  };
};

/**
 * Generate a decimal answer question (harder)
 */
export const generateDecimalHypotenuse = (options = {}) => {
  // Use non-triple values that give clean-ish decimals
  const configs = [
    { a: 7, b: 9, c: 11.4 },   // √130 ≈ 11.4
    { a: 5, b: 8, c: 9.4 },    // √89 ≈ 9.4
    { a: 6, b: 7, c: 9.2 },    // √85 ≈ 9.2
    { a: 4, b: 9, c: 9.8 },    // √97 ≈ 9.8
  ];
  
  const config = _.sample(configs);
  
  return {
    questionText: 'Find x. Give your answer to 1 d.p.',
    answer: `x = ${config.c} cm`,
    answerValue: config.c,
    visualization: {
      type: 'right-triangle',
      base: config.a,
      height: config.b,
      unknownSide: 'hypotenuse',
      labels: {
        base: `${config.a} cm`,
        height: `${config.b} cm`,
        hypotenuse: 'x'
      },
      units: 'cm'
    }
  };
};

// ============================================================
// ISOSCELES TRIANGLE GENERATORS
// ============================================================

/**
 * Generate "find the height of isosceles triangle" question
 */
export const generateIsoscelesHeight = (options = {}) => {
  const { usedConfigs = [] } = options;
  
  const available = ISOSCELES_CONFIGS.filter(c => 
    !usedConfigs.some(used => used.base === c.base)
  );
  const config = available.length > 0 ? _.sample(available) : _.sample(ISOSCELES_CONFIGS);
  
  return {
    questionText: 'Find the height of this isosceles triangle.',
    answer: `h = ${config.height} cm`,
    answerValue: config.height,
    visualization: {
      type: 'isosceles',
      base: config.base,
      equalSide: config.equalSide,
      height: config.height,
      showHeight: true,
      labels: {
        base: `${config.base} cm`,
        equalSide: `${config.equalSide} cm`,
        height: 'h = ?'
      },
      units: 'cm'
    },
    config
  };
};

/**
 * Generate "find the area of isosceles triangle" question
 */
export const generateIsoscelesArea = (options = {}) => {
  const { usedConfigs = [] } = options;
  
  const available = ISOSCELES_CONFIGS.filter(c => 
    !usedConfigs.some(used => used.base === c.base)
  );
  const config = available.length > 0 ? _.sample(available) : _.sample(ISOSCELES_CONFIGS);
  
  const area = 0.5 * config.base * config.height;
  
  return {
    questionText: 'Find the area of this isosceles triangle.',
    answer: `${area} cm²`,
    answerValue: area,
    hint: 'First find the height using Pythagoras.',
    visualization: {
      type: 'isosceles',
      base: config.base,
      equalSide: config.equalSide,
      height: config.height,
      showHeight: false, // Don't show the height - they need to find it
      labels: {
        base: `${config.base} cm`,
        equalSide: `${config.equalSide} cm`
      },
      units: 'cm'
    },
    config
  };
};

// ============================================================
// CONTEXT/APPLICATION GENERATORS
// ============================================================

/**
 * Generate TV screen diagonal question
 */
export const generateTVScreen = (options = {}) => {
  const config = _.sample(TV_CONFIGS);
  
  return {
    questionText: `A TV screen is ${config.width} cm wide and ${config.height} cm tall. Find the diagonal length of the screen.`,
    answer: `${config.diagonal} cm`,
    answerValue: config.diagonal,
    visualization: {
      type: 'rectangle-diagonal',
      width: config.width,
      height: config.height,
      context: 'TV'
    }
  };
};

/**
 * Generate ladder against wall question
 */
export const generateLadder = (options = {}) => {
  const { requireDecimal = false } = options;
  
  const configs = requireDecimal 
    ? LADDER_CONFIGS.filter(c => c.height % 1 !== 0)
    : LADDER_CONFIGS;
  
  const config = _.sample(configs);
  const needsDP = config.height % 1 !== 0;
  
  return {
    questionText: `A ${config.ladder} m ladder leans against a wall. The bottom of the ladder is ${config.distance} m from the wall. How high up the wall does the ladder reach?${needsDP ? ' Give your answer to 1 d.p.' : ''}`,
    answer: `${config.height} m`,
    answerValue: config.height,
    visualization: {
      type: 'ladder',
      ladderLength: config.ladder,
      distanceFromWall: config.distance,
      wallHeight: config.height,
      context: 'ladder'
    }
  };
};

/**
 * Generate ship navigation question
 */
export const generateShipNavigation = (options = {}) => {
  const config = _.sample(SHIP_CONFIGS);
  
  return {
    questionText: `A ship sails ${config.east} km East then ${config.north} km North. How far is the ship from its starting point?`,
    answer: `${config.distance} km`,
    answerValue: config.distance,
    visualization: {
      type: 'navigation',
      eastDistance: config.east,
      northDistance: config.north,
      context: 'ship'
    }
  };
};

/**
 * Generate football pitch diagonal question
 */
export const generateFootballPitch = (options = {}) => {
  const config = _.sample(PITCH_CONFIGS);
  const needsDP = config.diagonal % 1 !== 0;
  
  return {
    questionText: `A rectangular football pitch is ${config.length} m long and ${config.width} m wide. Find the length of the diagonal.${needsDP ? ' Give your answer to 1 d.p.' : ''}`,
    answer: `${config.diagonal} m`,
    answerValue: config.diagonal,
    visualization: {
      type: 'rectangle-diagonal',
      width: config.length,
      height: config.width,
      context: 'pitch'
    }
  };
};

// ============================================================
// COORDINATE DISTANCE GENERATORS
// ============================================================

/**
 * Generate coordinate distance question (positive coordinates)
 */
export const generateCoordinateDistance = (options = {}) => {
  const { usedPairs = [] } = options;
  
  const available = COORDINATE_PAIRS_POSITIVE.filter(p => 
    !usedPairs.some(used => used.p1[0] === p.p1[0] && used.p1[1] === p.p1[1])
  );
  const pair = available.length > 0 ? _.sample(available) : _.sample(COORDINATE_PAIRS_POSITIVE);
  
  return {
    questionText: `Find the distance between A(${pair.p1[0]}, ${pair.p1[1]}) and B(${pair.p2[0]}, ${pair.p2[1]}).`,
    answer: `${pair.distance} units`,
    answerValue: pair.distance,
    hint: 'Draw a right-angled triangle using the horizontal and vertical distances.',
    visualization: {
      type: 'coordinates',
      pointA: pair.p1,
      pointB: pair.p2,
      labelA: 'A',
      labelB: 'B'
    },
    pair
  };
};

/**
 * Generate coordinate distance question (with negative coordinates)
 */
export const generateCoordinateDistanceNegative = (options = {}) => {
  const { usedPairs = [] } = options;
  
  const available = COORDINATE_PAIRS_NEGATIVE.filter(p => 
    !usedPairs.some(used => used.p1[0] === p.p1[0] && used.p1[1] === p.p1[1])
  );
  const pair = available.length > 0 ? _.sample(available) : _.sample(COORDINATE_PAIRS_NEGATIVE);
  
  return {
    questionText: `Find the distance between P(${pair.p1[0]}, ${pair.p1[1]}) and Q(${pair.p2[0]}, ${pair.p2[1]}).`,
    answer: `${pair.distance} units`,
    answerValue: pair.distance,
    hint: 'Be careful with negative coordinates!',
    visualization: {
      type: 'coordinates',
      pointA: pair.p1,
      pointB: pair.p2,
      labelA: 'P',
      labelB: 'Q'
    },
    pair
  };
};

// ============================================================
// WORKSHEET GENERATOR - Creates full set of 12 questions
// ============================================================

/**
 * Generate a complete practice worksheet question set
 * Returns 12 questions with good variety and no duplicates
 */
export const generatePracticeWorksheet = () => {
  const questions = [];
  const usedTriples = [];
  const usedIsosceles = [];
  
  // Q1-2: Find hypotenuse (easy)
  for (let i = 0; i < 2; i++) {
    const q = generateFindHypotenuse({ usedTriples });
    questions.push({ ...q, questionNumber: questions.length + 1, difficulty: 'basic' });
    if (q.triple) usedTriples.push(q.triple);
  }
  
  // Q3: Find hypotenuse with decimal
  questions.push({ 
    ...generateDecimalHypotenuse(), 
    questionNumber: questions.length + 1, 
    difficulty: 'basic' 
  });
  
  // Q4: Find shorter side
  const q4 = generateFindShorterSide({ usedTriples });
  questions.push({ ...q4, questionNumber: questions.length + 1, difficulty: 'basic' });
  if (q4.triple) usedTriples.push(q4.triple);
  
  // Q5: Isosceles height
  const q5 = generateIsoscelesHeight({ usedConfigs: usedIsosceles });
  questions.push({ ...q5, questionNumber: questions.length + 1, difficulty: 'basic' });
  if (q5.config) usedIsosceles.push(q5.config);
  
  // Q6: Isosceles area
  const q6 = generateIsoscelesArea({ usedConfigs: usedIsosceles });
  questions.push({ ...q6, questionNumber: questions.length + 1, difficulty: 'basic' });
  
  // Q7: TV screen
  questions.push({ 
    ...generateTVScreen(), 
    questionNumber: questions.length + 1, 
    difficulty: 'application' 
  });
  
  // Q8: Ladder
  questions.push({ 
    ...generateLadder(), 
    questionNumber: questions.length + 1, 
    difficulty: 'application' 
  });
  
  // Q9: Football pitch
  questions.push({ 
    ...generateFootballPitch(), 
    questionNumber: questions.length + 1, 
    difficulty: 'application' 
  });
  
  // Q10: Ship navigation
  questions.push({ 
    ...generateShipNavigation(), 
    questionNumber: questions.length + 1, 
    difficulty: 'application' 
  });
  
  // Q11: Coordinate distance (positive)
  questions.push({ 
    ...generateCoordinateDistance(), 
    questionNumber: questions.length + 1, 
    difficulty: 'challenge' 
  });
  
  // Q12: Coordinate distance (negative)
  questions.push({ 
    ...generateCoordinateDistanceNegative(), 
    questionNumber: questions.length + 1, 
    difficulty: 'challenge' 
  });
  
  return questions;
};

// ============================================================
// EXPORTS
// ============================================================

export const pythagorasWorksheetGenerators = {
  // Basic triangles
  generateFindHypotenuse,
  generateFindShorterSide,
  generateDecimalHypotenuse,
  
  // Isosceles
  generateIsoscelesHeight,
  generateIsoscelesArea,
  
  // Context/Application
  generateTVScreen,
  generateLadder,
  generateShipNavigation,
  generateFootballPitch,
  
  // Coordinates
  generateCoordinateDistance,
  generateCoordinateDistanceNegative,
  
  // Full worksheet
  generatePracticeWorksheet,
  
  // Constants (for reference/testing)
  PYTHAGOREAN_TRIPLES,
  ISOSCELES_CONFIGS,
};

export default pythagorasWorksheetGenerators;