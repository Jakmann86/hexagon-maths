// src/generators/geometry/pythagorasGenerators.js
// Pythagoras' Theorem Question Generator
// Following Generator Output Specification v2.0
//
// Question Types:
// 1. Find hypotenuse: Given two legs, find c
// 2. Find missing side: Given hypotenuse and one leg, find the other
// 3. Isosceles triangle area: Use Pythagoras to find height, then area
// 4. 3D diagonal: Space diagonal in cuboid (challenge)

import _ from 'lodash';

// ============================================================
// CONSTANTS
// ============================================================

// Pythagorean triples for clean integer answers
const PYTHAGOREAN_TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [12, 16, 20],
  [9, 40, 41],
  [20, 21, 29],
  [11, 60, 61]
];

// Scaled triples for variety
const getScaledTriple = (triple, scale) => triple.map(x => x * scale);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Round to specified decimal places
 */
const roundTo = (num, places = 2) => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

/**
 * Check if a number is a perfect square
 */
const isPerfectSquare = (n) => {
  const sqrt = Math.sqrt(n);
  return sqrt === Math.floor(sqrt);
};

/**
 * Format answer with optional units
 */
const formatAnswer = (value, units, places = 2) => {
  const rounded = typeof value === 'number' ? roundTo(value, places) : value;
  return units ? `${rounded} \\text{ ${units}}` : `${rounded}`;
};

// ============================================================
// GENERATORS: FIND HYPOTENUSE
// ============================================================

/**
 * Find the hypotenuse given two legs
 * a² + b² = c² → c = √(a² + b²)
 */
const generateFindHypotenuse = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    usePythagoreanTriple = null // null = auto-decide based on difficulty
  } = options;
  
  let a, b, c, isExact;
  
  // Decide whether to use Pythagorean triple
  const useTriple = usePythagoreanTriple !== null 
    ? usePythagoreanTriple 
    : (difficulty === 'easy' || Math.random() > 0.4);
  
  if (useTriple) {
    // Use Pythagorean triple for exact integer answer
    const triples = difficulty === 'easy' 
      ? PYTHAGOREAN_TRIPLES.slice(0, 3)
      : difficulty === 'hard'
      ? PYTHAGOREAN_TRIPLES.slice(3, 8)
      : PYTHAGOREAN_TRIPLES.slice(0, 6);
    
    const triple = _.sample(triples);
    
    // Optionally scale for variety
    const scale = difficulty === 'hard' && Math.random() > 0.5 ? 2 : 1;
    [a, b, c] = getScaledTriple(triple, scale);
    isExact = true;
  } else {
    // Non-Pythagorean for decimal answer
    a = _.random(3, 8);
    b = _.random(3, 8);
    // Avoid accidentally creating a Pythagorean triple
    while (isPerfectSquare(a*a + b*b)) {
      b = _.random(3, 8);
    }
    c = roundTo(Math.sqrt(a*a + b*b), 2);
    isExact = false;
  }
  
  const cSquared = a*a + b*b;
  
  return {
    instruction: 'Find the length of the hypotenuse',
    questionMath: `a = ${a}, \\quad b = ${b}`,
    questionText: `Find the hypotenuse of a right-angled triangle with sides ${a} ${units} and ${b} ${units}.`,
    
    answer: formatAnswer(c, units),
    answerUnits: units,
    
    workingOut: `a^2 + b^2 = c^2 \\\\ ${a}^2 + ${b}^2 = c^2 \\\\ ${a*a} + ${b*b} = c^2 \\\\ c = \\sqrt{${cSquared}} = ${c}`,
    
    solution: [
      {
        explanation: "Write Pythagoras' theorem",
        formula: 'a^2 + b^2 = c^2'
      },
      {
        explanation: 'Substitute the known values',
        formula: `${a}^2 + ${b}^2 = c^2`
      },
      {
        explanation: 'Calculate the squares',
        formula: `${a*a} + ${b*b} = c^2`
      },
      {
        explanation: 'Add',
        formula: `${cSquared} = c^2`
      },
      {
        explanation: 'Take the square root',
        formula: `c = \\sqrt{${cSquared}} = ${c} \\text{ ${units}}`
      }
    ],
    
    // Visualization config (Pattern 2 - NOT a React component)
    visualization: {
      type: 'right-triangle',
      base: a,
      height: b,
      hypotenuse: c,
      unknownSide: 'hypotenuse',
      showRightAngle: true,
      labels: {
        base: `${a} ${units}`,
        height: `${b} ${units}`,
        hypotenuse: '?'
      },
      units
    },
    visualizationType: 'right-triangle',
    visualizationHeight: '120px',
    
    metadata: {
      type: 'pythagoras',
      subType: 'find-hypotenuse',
      difficulty,
      topic: 'pythagoras',
      isExact,
      tags: ['geometry', 'gcse', 'foundation'],
      values: { a, b, c }
    },
    
    title: 'Finding the Hypotenuse',
    keyRule: 'a^2 + b^2 = c^2'
  };
};

// ============================================================
// GENERATORS: FIND MISSING SIDE (LEG)
// ============================================================

/**
 * Find a missing leg given hypotenuse and one leg
 * a² + b² = c² → a = √(c² - b²)
 */
const generateFindMissingSide = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    findBase = null // null = random, true = find base, false = find height
  } = options;
  
  let a, b, c, isExact;
  const findingBase = findBase !== null ? findBase : Math.random() > 0.5;
  
  // Always use Pythagorean triples for this type (cleaner)
  const triples = difficulty === 'easy' 
    ? PYTHAGOREAN_TRIPLES.slice(0, 3)
    : difficulty === 'hard'
    ? PYTHAGOREAN_TRIPLES.slice(3, 8)
    : PYTHAGOREAN_TRIPLES.slice(0, 6);
  
  const triple = _.sample(triples);
  const scale = difficulty === 'hard' && Math.random() > 0.6 ? 2 : 1;
  [a, b, c] = getScaledTriple(triple, scale);
  isExact = true;
  
  // What we're finding
  const unknownSide = findingBase ? 'base' : 'height';
  const unknownValue = findingBase ? a : b;
  const knownLeg = findingBase ? b : a;
  const knownLegName = findingBase ? 'height' : 'base';
  
  const cSquared = c * c;
  const knownLegSquared = knownLeg * knownLeg;
  const unknownSquared = cSquared - knownLegSquared;
  
  return {
    instruction: `Find the ${unknownSide}`,
    questionMath: `c = ${c}, \\quad ${knownLegName} = ${knownLeg}`,
    questionText: `Find the ${unknownSide} of a right-angled triangle with hypotenuse ${c} ${units} and ${knownLegName} ${knownLeg} ${units}.`,
    
    answer: formatAnswer(unknownValue, units),
    answerUnits: units,
    
    workingOut: `a^2 + b^2 = c^2 \\\\ ${findingBase ? '?' : a}^2 + ${findingBase ? b : '?'}^2 = ${c}^2 \\\\ ${unknownSide}^2 = ${cSquared} - ${knownLegSquared} = ${unknownSquared} \\\\ ${unknownSide} = \\sqrt{${unknownSquared}} = ${unknownValue}`,
    
    solution: [
      {
        explanation: "Write Pythagoras' theorem",
        formula: 'a^2 + b^2 = c^2'
      },
      {
        explanation: 'Substitute known values',
        formula: findingBase 
          ? `a^2 + ${b}^2 = ${c}^2`
          : `${a}^2 + b^2 = ${c}^2`
      },
      {
        explanation: 'Rearrange to find the unknown',
        formula: `${unknownSide}^2 = ${c}^2 - ${knownLeg}^2`
      },
      {
        explanation: 'Calculate',
        formula: `${unknownSide}^2 = ${cSquared} - ${knownLegSquared} = ${unknownSquared}`
      },
      {
        explanation: 'Take the square root',
        formula: `${unknownSide} = \\sqrt{${unknownSquared}} = ${unknownValue} \\text{ ${units}}`
      }
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
    visualizationType: 'right-triangle',
    visualizationHeight: '120px',
    
    metadata: {
      type: 'pythagoras',
      subType: 'find-missing-side',
      difficulty,
      topic: 'pythagoras',
      isExact,
      tags: ['geometry', 'gcse', 'foundation'],
      values: { a, b, c, unknownSide }
    },
    
    title: `Finding a Missing Side`,
    keyRule: 'a^2 = c^2 - b^2'
  };
};

// ============================================================
// GENERATORS: ISOSCELES TRIANGLE AREA
// ============================================================

/**
 * Find area of isosceles triangle using Pythagoras
 * Split triangle in half, use Pythagoras to find height, then Area = ½bh
 */
const generateIsoscelesArea = (options = {}) => {
  const { difficulty = 'medium', units = 'cm' } = options;
  
  // Generate isosceles triangle with nice numbers
  // The equal sides and base should give integer height
  let base, equalSide, halfBase, height, area;
  
  // Pre-computed nice isosceles triangles
  const niceTriangles = [
    { base: 6, equalSide: 5 },   // height = 4, area = 12
    { base: 8, equalSide: 5 },   // height = 3, area = 12
    { base: 10, equalSide: 13 }, // height = 12, area = 60
    { base: 16, equalSide: 10 }, // height = 6, area = 48
    { base: 14, equalSide: 25 }, // height = 24, area = 168
    { base: 6, equalSide: 10 },  // height = √91 ≈ 9.54 (decimal)
    { base: 12, equalSide: 10 }, // height = 8, area = 48
    { base: 8, equalSide: 10 },  // height = √84 ≈ 9.17 (decimal)
  ];
  
  // Filter based on difficulty
  const easyTriangles = niceTriangles.filter(t => {
    const h = Math.sqrt(t.equalSide * t.equalSide - (t.base/2) * (t.base/2));
    return Number.isInteger(h) && t.base <= 10;
  });
  
  const selected = difficulty === 'easy' 
    ? _.sample(easyTriangles)
    : _.sample(niceTriangles);
  
  base = selected.base;
  equalSide = selected.equalSide;
  halfBase = base / 2;
  height = roundTo(Math.sqrt(equalSide * equalSide - halfBase * halfBase), 2);
  area = roundTo(0.5 * base * height, 2);
  
  const equalSideSquared = equalSide * equalSide;
  const halfBaseSquared = halfBase * halfBase;
  const heightSquared = equalSideSquared - halfBaseSquared;
  
  return {
    instruction: 'Find the area',
    questionMath: `\\text{Base} = ${base}, \\quad \\text{Equal sides} = ${equalSide}`,
    questionText: `Find the area of an isosceles triangle with base ${base} ${units} and equal sides ${equalSide} ${units}.`,
    
    answer: formatAnswer(area, `${units}²`),
    answerUnits: `${units}²`,
    
    workingOut: `\\text{Split in half: } \\frac{${base}}{2} = ${halfBase} \\\\ h^2 + ${halfBase}^2 = ${equalSide}^2 \\\\ h^2 = ${equalSideSquared} - ${halfBaseSquared} = ${heightSquared} \\\\ h = ${height} \\\\ \\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height} = ${area}`,
    
    solution: [
      {
        explanation: 'Split the isosceles triangle in half to create a right-angled triangle',
        formula: `\\text{Half of base} = \\frac{${base}}{2} = ${halfBase} \\text{ ${units}}`
      },
      {
        explanation: "Use Pythagoras to find the height",
        formula: `h^2 + ${halfBase}^2 = ${equalSide}^2`
      },
      {
        explanation: 'Rearrange for h²',
        formula: `h^2 = ${equalSide}^2 - ${halfBase}^2 = ${equalSideSquared} - ${halfBaseSquared} = ${heightSquared}`
      },
      {
        explanation: 'Find height',
        formula: `h = \\sqrt{${heightSquared}} = ${height} \\text{ ${units}}`
      },
      {
        explanation: 'Calculate area using Area = ½ × base × height',
        formula: `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height} = ${area} \\text{ ${units}}^2`
      }
    ],
    
    visualization: {
      type: 'isosceles-triangle',
      base,
      equalSide,
      height,
      showHeight: false, // Teacher reveals this
      labels: {
        base: `${base} ${units}`,
        leftSide: `${equalSide} ${units}`,
        rightSide: `${equalSide} ${units}`,
        height: '?'
      },
      units
    },
    visualizationType: 'isosceles-triangle',
    visualizationHeight: '140px',
    
    metadata: {
      type: 'pythagoras',
      subType: 'isosceles-area',
      difficulty,
      topic: 'pythagoras',
      tags: ['geometry', 'gcse', 'higher', 'problem-solving'],
      values: { base, equalSide, height, area }
    },
    
    title: 'Isosceles Triangle Area',
    keyRule: '\\text{Split isosceles in half, use Pythagoras for height, then Area} = \\frac{1}{2}bh'
  };
};

// ============================================================
// GENERATORS: 3D DIAGONAL (Challenge)
// ============================================================

/**
 * Find space diagonal of a cuboid using Pythagoras twice
 * First find base diagonal, then use that with height
 */
const generate3DDiagonal = (options = {}) => {
  const { difficulty = 'hard', units = 'cm' } = options;
  
  // Generate dimensions that give nice answers
  // d² = l² + w² + h²
  let length, width, height, baseDiagonal, spaceDiagonal;
  
  if (difficulty === 'easy') {
    // Cube - simpler
    const side = _.sample([3, 4, 5, 6]);
    length = width = height = side;
  } else {
    // Cuboid with nice numbers
    const niceCuboids = [
      { l: 3, w: 4, h: 12 },  // space diagonal = 13
      { l: 2, w: 6, h: 9 },   // space diagonal = 11
      { l: 1, w: 4, h: 8 },   // space diagonal = 9
      { l: 4, w: 4, h: 7 },   // space diagonal = 9
      { l: 3, w: 6, h: 6 },   // space diagonal = 9
      { l: 2, w: 3, h: 6 },   // space diagonal = 7
    ];
    const selected = _.sample(niceCuboids);
    length = selected.l;
    width = selected.w;
    height = selected.h;
  }
  
  baseDiagonal = roundTo(Math.sqrt(length*length + width*width), 2);
  spaceDiagonal = roundTo(Math.sqrt(length*length + width*width + height*height), 2);
  
  const baseDiagSquared = length*length + width*width;
  const spaceDiagSquared = baseDiagSquared + height*height;
  
  return {
    instruction: 'Find the space diagonal',
    questionMath: `l = ${length}, \\quad w = ${width}, \\quad h = ${height}`,
    questionText: `Find the space diagonal of a cuboid with dimensions ${length} ${units} × ${width} ${units} × ${height} ${units}.`,
    
    answer: formatAnswer(spaceDiagonal, units),
    answerUnits: units,
    
    workingOut: `\\text{Base diagonal: } d_1^2 = ${length}^2 + ${width}^2 = ${baseDiagSquared} \\\\ d_1 = ${baseDiagonal} \\\\ \\text{Space diagonal: } d^2 = d_1^2 + ${height}^2 = ${baseDiagSquared} + ${height*height} = ${spaceDiagSquared} \\\\ d = ${spaceDiagonal}`,
    
    solution: [
      {
        explanation: 'First find the diagonal across the base',
        formula: `d_1^2 = ${length}^2 + ${width}^2 = ${length*length} + ${width*width} = ${baseDiagSquared}`
      },
      {
        explanation: 'Find base diagonal',
        formula: `d_1 = \\sqrt{${baseDiagSquared}} = ${baseDiagonal} \\text{ ${units}}`
      },
      {
        explanation: 'Now use base diagonal and height to find space diagonal',
        formula: `d^2 = d_1^2 + h^2 = ${baseDiagSquared} + ${height}^2`
      },
      {
        explanation: 'Calculate',
        formula: `d^2 = ${baseDiagSquared} + ${height*height} = ${spaceDiagSquared}`
      },
      {
        explanation: 'Find space diagonal',
        formula: `d = \\sqrt{${spaceDiagSquared}} = ${spaceDiagonal} \\text{ ${units}}`
      }
    ],
    
    visualization: {
      type: 'cuboid-3d',
      length,
      width,
      height,
      showBaseDiagonal: false,
      showSpaceDiagonal: false,
      labels: {
        length: `${length} ${units}`,
        width: `${width} ${units}`,
        height: `${height} ${units}`
      },
      units
    },
    visualizationType: 'cuboid-3d',
    visualizationHeight: '160px',
    
    metadata: {
      type: 'pythagoras',
      subType: '3d-diagonal',
      difficulty,
      topic: 'pythagoras-3d',
      tags: ['geometry', 'gcse', 'higher', 'challenge'],
      values: { length, width, height, baseDiagonal, spaceDiagonal }
    },
    
    title: '3D Pythagoras - Space Diagonal',
    keyRule: 'd^2 = l^2 + w^2 + h^2'
  };
};

// ============================================================
// RANDOM/MIXED GENERATORS
// ============================================================

/**
 * Generate random Pythagoras question based on difficulty
 */
const generateRandom = (options = {}) => {
  const { difficulty = 'medium', types = null } = options;
  
  const allTypes = types || (difficulty === 'easy'
    ? ['hypotenuse', 'missing-side']
    : difficulty === 'hard'
    ? ['hypotenuse', 'missing-side', 'isosceles', '3d-diagonal']
    : ['hypotenuse', 'missing-side', 'isosceles']
  );
  
  const type = _.sample(allTypes);
  
  switch (type) {
    case 'hypotenuse':
      return generateFindHypotenuse({ difficulty });
    case 'missing-side':
      return generateFindMissingSide({ difficulty });
    case 'isosceles':
      return generateIsoscelesArea({ difficulty });
    case '3d-diagonal':
      return generate3DDiagonal({ difficulty });
    default:
      return generateFindHypotenuse({ difficulty });
  }
};

/**
 * Generate for specific Examples tab
 */
const generateForExamplesTab = (tabIndex, options = {}) => {
  switch (tabIndex) {
    case 1: // Tab 1: Find Hypotenuse
      return generateFindHypotenuse({ difficulty: 'medium', ...options });
    case 2: // Tab 2: Find Missing Side
      return generateFindMissingSide({ difficulty: 'medium', ...options });
    case 3: // Tab 3: Isosceles Area
      return generateIsoscelesArea({ difficulty: 'medium', ...options });
    default:
      return generateRandom(options);
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const pythagorasGenerators = {
  // Individual generators
  generateFindHypotenuse,
  generateFindMissingSide,
  generateIsoscelesArea,
  generate3DDiagonal,
  
  // Utility generators
  generateRandom,
  generateForExamplesTab
};

export default pythagorasGenerators;