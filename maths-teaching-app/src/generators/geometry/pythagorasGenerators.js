// src/generators/geometry/pythagorasGenerators.js
// Pythagoras' Theorem Question Generator - V3.0 (Gold Standard)
// 
// ARCHITECTURE:
// - Generators create question data (text, answer, solution steps)
// - Factories create visualization configs (imported, not duplicated)
// - Single source of truth for PYTHAGOREAN_TRIPLES (from factory)
//
// Pattern: Generator → Factory → Config with type → VisualizationRenderer → SVG

import _ from 'lodash';
import { 
  createPythagoreanTriangle, 
  createIsoscelesTriangle,
  PYTHAGOREAN_TRIPLES 
} from '../../factories/triangleFactory';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const roundTo = (num, places = 2) => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

const isPerfectSquare = (n) => {
  const sqrt = Math.sqrt(n);
  return sqrt === Math.floor(sqrt);
};

const formatAnswer = (value, units, places = 2) => {
  const rounded = typeof value === 'number' ? roundTo(value, places) : value;
  return units ? `${rounded}\\text{ ${units}}` : `${rounded}`;
};

const getScaledTriple = (triple, scale) => triple.map(x => x * scale);

// ============================================================
// GENERATOR: FIND HYPOTENUSE
// ============================================================

const generateFindHypotenuse = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    usePythagoreanTriple = null,
    allowDecimals = false
  } = options;
  
  let a, b, c, isExact;
  
  // Decide whether to use a Pythagorean triple (clean answer) or allow decimals
  const useTriple = usePythagoreanTriple !== null 
    ? usePythagoreanTriple 
    : (difficulty === 'easy' || (!allowDecimals && Math.random() > 0.3));
  
  if (useTriple) {
    const triples = difficulty === 'easy' 
      ? PYTHAGOREAN_TRIPLES.slice(0, 3)
      : PYTHAGOREAN_TRIPLES.slice(0, 6);
    const triple = _.sample(triples);
    const scale = difficulty === 'hard' && Math.random() > 0.5 ? 2 : 1;
    [a, b, c] = getScaledTriple(triple, scale);
    isExact = true;
  } else {
    // Generate non-triple for decimal answer
    a = _.random(3, 8);
    b = _.random(3, 8);
    while (isPerfectSquare(a * a + b * b)) {
      b = _.random(3, 8);
    }
    c = roundTo(Math.sqrt(a * a + b * b), 2);
    isExact = false;
  }
  
  const cSquared = a * a + b * b;
  
  return {
    instruction: 'Find the length of the hypotenuse',
    questionText: `Find the hypotenuse of a right-angled triangle with sides ${a} ${units} and ${b} ${units}.`,
    answer: formatAnswer(c, units),
    solution: [
      { explanation: "Write Pythagoras' theorem", formula: 'a^2 + b^2 = c^2' },
      { explanation: 'Substitute the known values', formula: `${a}^2 + ${b}^2 = c^2` },
      { explanation: 'Calculate the squares', formula: `${a * a} + ${b * b} = c^2` },
      { explanation: 'Add', formula: `${cSquared} = c^2` },
      { explanation: 'Take the square root', formula: `c = \\sqrt{${cSquared}} = ${c}\\text{ ${units}}` }
    ],
    // USE FACTORY for visualization config
    visualization: createPythagoreanTriangle({
      base: a,
      height: b,
      unknownSide: 'hypotenuse',
      units,
      sectionType: 'examples'
    }),
    title: 'Finding the Hypotenuse',
    metadata: { isExact, values: { a, b, c } }
  };
};

// ============================================================
// GENERATOR: FIND MISSING SIDE (base or height)
// ============================================================

const generateFindMissingSide = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    findBase = null,
    allowDecimals = false
  } = options;
  
  let a, b, c;
  const findingBase = findBase !== null ? findBase : Math.random() > 0.5;
  
  if (!allowDecimals) {
    const triples = difficulty === 'easy' 
      ? PYTHAGOREAN_TRIPLES.slice(0, 3)
      : PYTHAGOREAN_TRIPLES.slice(0, 6);
    const triple = _.sample(triples);
    [a, b, c] = triple;
  } else {
    c = _.random(8, 15);
    const knownLeg = _.random(3, c - 2);
    const unknownLeg = roundTo(Math.sqrt(c * c - knownLeg * knownLeg), 2);
    if (findingBase) { 
      a = unknownLeg; 
      b = knownLeg; 
    } else { 
      a = knownLeg; 
      b = unknownLeg; 
    }
  }
  
  const unknownSide = findingBase ? 'base' : 'height';
  const unknownValue = findingBase ? a : b;
  const knownLeg = findingBase ? b : a;
  const knownLegName = findingBase ? 'height' : 'base';
  
  const cSquared = c * c;
  const knownLegSquared = knownLeg * knownLeg;
  const unknownSquared = cSquared - knownLegSquared;
  
  return {
    instruction: `Find the ${unknownSide}`,
    questionText: `Find the ${unknownSide} of a right-angled triangle with hypotenuse ${c} ${units} and ${knownLegName} ${knownLeg} ${units}.`,
    answer: formatAnswer(unknownValue, units),
    solution: [
      { explanation: "Write Pythagoras' theorem", formula: 'a^2 + b^2 = c^2' },
      { explanation: 'Rearrange to find the unknown', formula: `${unknownSide}^2 = c^2 - ${knownLegName}^2` },
      { explanation: 'Substitute known values', formula: `${unknownSide}^2 = ${c}^2 - ${knownLeg}^2` },
      { explanation: 'Calculate', formula: `${unknownSide}^2 = ${cSquared} - ${knownLegSquared} = ${unknownSquared}` },
      { explanation: 'Take the square root', formula: `${unknownSide} = \\sqrt{${unknownSquared}} = ${unknownValue}\\text{ ${units}}` }
    ],
    // USE FACTORY for visualization config
    visualization: createPythagoreanTriangle({
      base: a,
      height: b,
      unknownSide,
      units,
      sectionType: 'examples'
    }),
    title: 'Finding a Shorter Side',
    metadata: { values: { a, b, c, unknownSide } }
  };
};

// ============================================================
// GENERATOR: ISOSCELES TRIANGLE AREA
// ============================================================

// Nice isosceles triangles with integer heights (for clean working)
const NICE_ISOSCELES_TRIANGLES = [
  { base: 6, equalSide: 5 },   // height = 4
  { base: 8, equalSide: 5 },   // height = 3
  { base: 10, equalSide: 13 }, // height = 12
  { base: 16, equalSide: 10 }, // height = 6
  { base: 12, equalSide: 10 }, // height = 8
];

const generateIsoscelesArea = (options = {}) => {
  const { difficulty = 'medium', units = 'cm' } = options;
  
  const selected = difficulty === 'easy' 
    ? _.sample(NICE_ISOSCELES_TRIANGLES.slice(0, 2)) 
    : _.sample(NICE_ISOSCELES_TRIANGLES);
  
  const { base, equalSide } = selected;
  const halfBase = base / 2;
  const height = roundTo(Math.sqrt(equalSide * equalSide - halfBase * halfBase), 2);
  const area = roundTo(0.5 * base * height, 2);
  
  const heightSquared = equalSide * equalSide - halfBase * halfBase;
  
  return {
    instruction: 'Find the area',
    questionText: `Find the area of an isosceles triangle with base ${base} ${units} and equal sides ${equalSide} ${units}.`,
    answer: `${area}\\text{ ${units}}^2`,
    solution: [
      { explanation: 'Split the isosceles triangle in half', formula: `\\text{Half base} = \\frac{${base}}{2} = ${halfBase}\\text{ ${units}}` },
      { explanation: "Use Pythagoras to find the height", formula: `h^2 + ${halfBase}^2 = ${equalSide}^2` },
      { explanation: 'Solve for h²', formula: `h^2 = ${equalSide}^2 - ${halfBase}^2 = ${heightSquared}` },
      { explanation: 'Find height', formula: `h = \\sqrt{${heightSquared}} = ${height}\\text{ ${units}}` },
      { explanation: 'Calculate area', formula: `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height} = ${area}\\text{ ${units}}^2` }
    ],
    // USE FACTORY for visualization config
    visualization: createIsoscelesTriangle({
      base,
      legLength: equalSide,
      height,
      showHeight: false,
      labels: {
        base: `${base} ${units}`,
        leftSide: `${equalSide} ${units}`,
        rightSide: `${equalSide} ${units}`,
        height: '?'
      },
      units,
      sectionType: 'examples'
    }),
    title: 'Isosceles Triangle Area',
    metadata: { values: { base, equalSide, height, area } }
  };
};

// ============================================================
// GENERATOR: IDENTIFY HYPOTENUSE (Diagnostic)
// ============================================================

const LETTER_SETS = [
  ['p', 'q', 'r'], 
  ['x', 'y', 'z'], 
  ['m', 'n', 'k'],
  ['d', 'e', 'f'], 
  ['j', 'k', 'l'], 
  ['s', 't', 'u']
];

const ORIENTATIONS = ['default', 'rotate90', 'rotate180', 'rotate270', 'flip'];

const identifyHypotenuse = (options = {}) => {
  const { units = 'cm' } = options;
  
  const [a, b, c] = _.sample(PYTHAGOREAN_TRIPLES.slice(0, 5));
  
  // Use varied letter sets - NOT always a,b,c
  const letters = _.sample(LETTER_SETS);
  const shuffledLetters = _.shuffle([...letters]);
  const [baseLetter, heightLetter, hypLetter] = shuffledLetters;
  
  const orientation = _.sample(ORIENTATIONS);
  
  return {
    questionDisplay: { 
      text: 'Look at the right-angled triangle below. Which side is the hypotenuse (the longest side, opposite the right angle)?', 
      math: '' 
    },
    correctAnswer: hypLetter,
    options: _.shuffle([baseLetter, heightLetter, hypLetter, 'None']),
    explanation: `The hypotenuse is the longest side, opposite the right angle. Here it's "${hypLetter}" = ${c} ${units}.`,
    // USE FACTORY for visualization config
    visualization: createPythagoreanTriangle({
      base: a,
      height: b,
      labels: { base: baseLetter, height: heightLetter, hypotenuse: hypLetter },
      orientation,
      units,
      sectionType: 'diagnostic'
    })
  };
};

// ============================================================
// GENERATOR: COORDINATE DISTANCE (Challenge)
// ============================================================

// Variety of point pairs with different gradients and distances
// NO horizontal or vertical lines - those don't require Pythagoras!
const COORDINATE_PAIRS = [
  // SHORT distances - positive gradient
  { p1: [1, 1], p2: [4, 5] },           // d=5
  { p1: [0, 0], p2: [3, 4] },           // d=5
  { p1: [-1, 2], p2: [2, 6] },          // d=5
  
  // SHORT distances - negative gradient (B lower than A)
  { p1: [1, 5], p2: [4, 1] },           // d=5, going DOWN
  { p1: [-2, 4], p2: [1, 0] },          // d=5, going DOWN
  { p1: [0, 3], p2: [4, 0] },           // d=5, going DOWN
  
  // MEDIUM distances - positive gradient
  { p1: [-3, -2], p2: [2, 3] },         // d≈7.07
  { p1: [-2, -1], p2: [4, 4] },         // d≈7.81
  { p1: [-4, 0], p2: [2, 5] },          // d≈7.81
  
  // MEDIUM distances - negative gradient
  { p1: [-3, 4], p2: [3, -1] },         // d≈7.81, going DOWN
  { p1: [-2, 5], p2: [4, 0] },          // d≈7.81, going DOWN
  { p1: [0, 4], p2: [5, -1] },          // d≈7.07, going DOWN
  
  // LONGER distances - positive gradient
  { p1: [-4, -3], p2: [2, 5] },         // d=10
  { p1: [-3, -4], p2: [5, 2] },         // d=10
  { p1: [-5, 0], p2: [3, 6] },          // d=10
  
  // LONGER distances - negative gradient
  { p1: [-4, 5], p2: [4, -1] },         // d=10, going DOWN
  { p1: [-3, 4], p2: [5, -2] },         // d=10, going DOWN
  { p1: [-5, 3], p2: [4, -3] },         // d≈10.8, going DOWN
  
  // VERY SHORT distances (still diagonal - need Pythagoras)
  { p1: [0, 0], p2: [2, 2] },           // d≈2.83
  { p1: [-1, 3], p2: [1, 1] },          // d≈2.83, going DOWN
  { p1: [1, 0], p2: [4, 3] },           // d≈4.24
  { p1: [-2, -2], p2: [1, 2] },         // d=5
];

const generateCoordinateChallenge = (options = {}) => {
  const { p1: point1, p2: point2 } = _.sample(COORDINATE_PAIRS);
  
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  const distanceSquared = dx * dx + dy * dy;
  const distance = roundTo(Math.sqrt(distanceSquared), 2);
  
  const gradient = dy >= 0 ? 'positive' : 'negative';
  
  return {
    title: 'Coordinate Geometry Challenge',
    questionText: `Find the distance between A(${point1[0]}, ${point1[1]}) and B(${point2[0]}, ${point2[1]}).`,
    answer: `d = ${distance}\\text{ units}`,
    solution: [
      { explanation: 'Use the distance formula (Pythagoras)', formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}' },
      { explanation: 'Substitute the coordinates', formula: `d = \\sqrt{(${point2[0]} - ${point1[0]})^2 + (${point2[1]} - ${point1[1]})^2}` },
      { explanation: 'Calculate the differences', formula: `d = \\sqrt{(${dx})^2 + (${dy})^2}` },
      { explanation: 'Square and add', formula: `d = \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${distanceSquared}}` },
      { explanation: 'Find the distance', formula: `d = ${distance}\\text{ units}` }
    ],
    // Coordinate grid doesn't use a factory (yet) - inline config is fine here
    visualization: {
      type: 'coordinate-grid',
      point1,
      point2,
      point1Label: 'A',
      point2Label: 'B',
      gridSize: 6,
      showLine: true,
      distance,
      dx,
      dy
    },
    point1,
    point2,
    dx,
    dy,
    distance,
    gradient
  };
};

// ============================================================
// GENERATOR: EXAMPLES TAB DISPATCHER
// ============================================================

const generateForExamplesTab = (tabIndex, options = {}) => {
  const allowDecimals = Math.random() > 0.5;
  
  switch (tabIndex) {
    case 1: 
      return generateFindHypotenuse({ difficulty: 'medium', allowDecimals, ...options });
    case 2: 
      return generateFindMissingSide({ difficulty: 'medium', allowDecimals, ...options });
    case 3: 
      return generateIsoscelesArea({ difficulty: 'medium', ...options });
    default: 
      return generateFindHypotenuse({ difficulty: 'medium', ...options });
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const pythagorasGenerators = {
  // Main generators
  generateFindHypotenuse,
  generateFindMissingSide,
  generateIsoscelesArea,
  generateCoordinateChallenge,
  identifyHypotenuse,
  generateForExamplesTab,
  
  // Re-export constants for convenience (single source of truth)
  PYTHAGOREAN_TRIPLES,
  NICE_ISOSCELES_TRIANGLES,
  COORDINATE_PAIRS,
  LETTER_SETS,
  ORIENTATIONS
};

export default pythagorasGenerators;