// src/generators/geometry/pythagorasGenerators.js
// Pythagoras' Theorem Question Generator - V2.1
// All fixes applied: varied letters for hypotenuse, decimal support, coordinate bounds

import _ from 'lodash';

// ============================================================
// CONSTANTS
// ============================================================

const PYTHAGOREAN_TRIPLES = [
  [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25],
  [9, 12, 15], [12, 16, 20], [9, 40, 41], [20, 21, 29], [11, 60, 61]
];

const getScaledTriple = (triple, scale) => triple.map(x => x * scale);

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

// ============================================================
// GENERATORS: FIND HYPOTENUSE
// ============================================================

const generateFindHypotenuse = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    usePythagoreanTriple = null,
    allowDecimals = false
  } = options;
  
  let a, b, c, isExact;
  
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
    a = _.random(3, 8);
    b = _.random(3, 8);
    while (isPerfectSquare(a*a + b*b)) {
      b = _.random(3, 8);
    }
    c = roundTo(Math.sqrt(a*a + b*b), 2);
    isExact = false;
  }
  
  const cSquared = a*a + b*b;
  
  return {
    instruction: 'Find the length of the hypotenuse',
    questionText: `Find the hypotenuse of a right-angled triangle with sides ${a} ${units} and ${b} ${units}.`,
    answer: formatAnswer(c, units),
    solution: [
      { explanation: "Write Pythagoras' theorem", formula: 'a^2 + b^2 = c^2' },
      { explanation: 'Substitute the known values', formula: `${a}^2 + ${b}^2 = c^2` },
      { explanation: 'Calculate the squares', formula: `${a*a} + ${b*b} = c^2` },
      { explanation: 'Add', formula: `${cSquared} = c^2` },
      { explanation: 'Take the square root', formula: `c = \\sqrt{${cSquared}} = ${c}\\text{ ${units}}` }
    ],
    visualization: {
      type: 'right-triangle',
      base: a,
      height: b,
      hypotenuse: c,
      unknownSide: 'hypotenuse',
      showRightAngle: true,
      labels: { base: `${a} ${units}`, height: `${b} ${units}`, hypotenuse: '?' },
      units
    },
    title: 'Finding the Hypotenuse',
    metadata: { isExact, values: { a, b, c } }
  };
};

// ============================================================
// GENERATORS: FIND MISSING SIDE
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
    const unknownLeg = roundTo(Math.sqrt(c*c - knownLeg*knownLeg), 2);
    if (findingBase) { a = unknownLeg; b = knownLeg; }
    else { a = knownLeg; b = unknownLeg; }
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
    visualization: {
      type: 'right-triangle',
      base: a,
      height: b,
      hypotenuse: c,
      unknownSide,
      showRightAngle: true,
      labels: {
        base: findingBase ? '?' : `${a} ${units}`,
        height: findingBase ? `${b} ${units}` : '?',
        hypotenuse: `${c} ${units}`
      },
      units
    },
    title: 'Finding a Shorter Side',
    metadata: { values: { a, b, c, unknownSide } }
  };
};

// ============================================================
// GENERATORS: ISOSCELES TRIANGLE AREA
// ============================================================

const generateIsoscelesArea = (options = {}) => {
  const { difficulty = 'medium', units = 'cm' } = options;
  
  const niceTriangles = [
    { base: 6, equalSide: 5 },   // height = 4
    { base: 8, equalSide: 5 },   // height = 3
    { base: 10, equalSide: 13 }, // height = 12
    { base: 16, equalSide: 10 }, // height = 6
    { base: 12, equalSide: 10 }, // height = 8
  ];
  
  const selected = difficulty === 'easy' 
    ? _.sample(niceTriangles.slice(0, 2)) 
    : _.sample(niceTriangles);
  
  const base = selected.base;
  const equalSide = selected.equalSide;
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
    visualization: {
      type: 'isosceles-triangle',
      base,
      equalSide,
      height,
      showHeight: false,
      showRightAngle: true,
      labels: {
        base: `${base} ${units}`,
        leftSide: `${equalSide} ${units}`,
        rightSide: `${equalSide} ${units}`,
        height: '?'
      },
      units
    },
    title: 'Isosceles Triangle Area',
    metadata: { values: { base, equalSide, height, area } }
  };
};

// ============================================================
// GENERATORS: IDENTIFY HYPOTENUSE (Diagnostic) - VARIED LETTERS
// ============================================================

const identifyHypotenuse = (options = {}) => {
  const { units = 'cm' } = options;
  
  const [a, b, c] = _.sample(PYTHAGOREAN_TRIPLES.slice(0, 5));
  
  // Use varied letter sets - NOT always a,b,c
  const letterSets = [
    ['p', 'q', 'r'], ['x', 'y', 'z'], ['m', 'n', 'k'],
    ['d', 'e', 'f'], ['j', 'k', 'l'], ['s', 't', 'u']
  ];
  
  const letters = _.sample(letterSets);
  const shuffledLetters = _.shuffle([...letters]);
  const [baseLetter, heightLetter, hypLetter] = shuffledLetters;
  
  const orientations = ['default', 'rotate90', 'rotate180', 'rotate270', 'flip'];
  const orientation = _.sample(orientations);
  
  return {
    questionDisplay: { text: 'Which side is the hypotenuse?', math: '' },
    correctAnswer: hypLetter,
    options: _.shuffle([baseLetter, heightLetter, hypLetter, 'None']),
    explanation: `The hypotenuse is the longest side, opposite the right angle. Here it's "${hypLetter}" = ${c} ${units}.`,
    visualization: {
      base: a, height: b, hypotenuse: c,
      showRightAngle: true,
      orientation,
      labels: { base: baseLetter, height: heightLetter, hypotenuse: hypLetter },
      units
    }
  };
};

// ============================================================
// GENERATORS: COORDINATE DISTANCE (Challenge) - WITH VARIETY
// ============================================================

const generateCoordinateChallenge = (options = {}) => {
  // Variety of point pairs with:
  // - Negative gradients (B lower than A)
  // - Different line lengths (short to long)
  // - All points within -5 to 5 bounds
  const nicePairs = [
    // SHORT distances (around 3-4 units) - positive gradient
    { p1: [1, 1], p2: [4, 5] },           // d=5
    { p1: [0, 0], p2: [3, 4] },           // d=5
    { p1: [-1, 2], p2: [2, 6] },          // d=5
    
    // SHORT distances - negative gradient (B lower than A)
    { p1: [1, 5], p2: [4, 1] },           // d=5, going DOWN
    { p1: [-2, 4], p2: [1, 0] },          // d=5, going DOWN
    { p1: [0, 3], p2: [4, 0] },           // d=5, going DOWN
    
    // MEDIUM distances (around 5-7 units) - positive gradient
    { p1: [-3, -2], p2: [2, 3] },         // d≈7.07
    { p1: [-2, -1], p2: [4, 4] },         // d≈7.81
    { p1: [-4, 0], p2: [2, 5] },          // d≈7.81
    
    // MEDIUM distances - negative gradient
    { p1: [-3, 4], p2: [3, -1] },         // d≈7.81, going DOWN
    { p1: [-2, 5], p2: [4, 0] },          // d≈7.81, going DOWN
    { p1: [0, 4], p2: [5, -1] },          // d≈7.07, going DOWN
    
    // LONGER distances (around 8-10 units) - positive gradient
    { p1: [-4, -3], p2: [2, 5] },         // d=10
    { p1: [-3, -4], p2: [5, 2] },         // d=10
    { p1: [-5, 0], p2: [3, 6] },          // d=10, near edge
    
    // LONGER distances - negative gradient
    { p1: [-4, 5], p2: [4, -1] },         // d=10, going DOWN
    { p1: [-3, 4], p2: [5, -2] },         // d=10, going DOWN
    { p1: [-5, 3], p2: [4, -3] },         // d≈10.8, going DOWN
    
    // HORIZONTAL and VERTICAL (edge cases)
    { p1: [-4, 2], p2: [4, 2] },          // d=8, horizontal
    { p1: [2, -4], p2: [2, 4] },          // d=8, vertical
    
    // VERY SHORT distances
    { p1: [0, 0], p2: [2, 2] },           // d≈2.83
    { p1: [-1, 3], p2: [1, 1] },          // d≈2.83, going DOWN
  ];
  
  const { p1: point1, p2: point2 } = _.sample(nicePairs);
  
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  const distanceSquared = dx * dx + dy * dy;
  const distance = roundTo(Math.sqrt(distanceSquared), 2);
  
  // Determine if line goes up or down for teaching notes
  const gradient = dy >= 0 ? 'positive' : 'negative';
  
  return {
    title: 'Coordinate Geometry Challenge',
    questionText: `Find the distance between A(${point1[0]}, ${point1[1]}) and B(${point2[0]}, ${point2[1]}).`,
    answer: `d = ${distance}\\text{ units}`,
    solution: [
      { explanation: 'Use the distance formula (Pythagoras)', formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}' },
      { explanation: 'Substitute the coordinates', formula: `d = \\sqrt{(${point2[0]} - ${point1[0]})^2 + (${point2[1]} - ${point1[1]})^2}` },
      { explanation: 'Calculate the differences', formula: `d = \\sqrt{(${dx})^2 + (${dy})^2}` },
      { explanation: 'Square and add', formula: `d = \\sqrt{${dx*dx} + ${dy*dy}} = \\sqrt{${distanceSquared}}` },
      { explanation: 'Find the distance', formula: `d = ${distance}\\text{ units}` }
    ],
    visualization: {
      type: 'coordinate-grid',
      point1, point2,
      point1Label: 'A', point2Label: 'B',
      gridSize: 6,
      showLine: true,
      distance, dx, dy
    },
    point1, point2, dx, dy, distance, gradient
  };
};

// ============================================================
// GENERATORS FOR EXAMPLES TAB - WITH DECIMAL SUPPORT
// ============================================================

const generateForExamplesTab = (tabIndex, options = {}) => {
  const allowDecimals = Math.random() > 0.5;
  
  switch (tabIndex) {
    case 1: return generateFindHypotenuse({ difficulty: 'medium', allowDecimals, ...options });
    case 2: return generateFindMissingSide({ difficulty: 'medium', allowDecimals, ...options });
    case 3: return generateIsoscelesArea({ difficulty: 'medium', ...options });
    default: return generateFindHypotenuse({ difficulty: 'medium', ...options });
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const pythagorasGenerators = {
  generateFindHypotenuse,
  generateFindMissingSide,
  generateIsoscelesArea,
  generateCoordinateChallenge,
  identifyHypotenuse,
  generateForExamplesTab
};

export default pythagorasGenerators;