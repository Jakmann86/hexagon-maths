// src/generators/geometry/angleFactsGenerator.js
// Generators for basic angle facts - used in Geometry starters
// Following Pattern 2: Returns config objects, not React components

import _ from 'lodash';

/**
 * Angles on a straight line (sum to 180°)
 * Can be numeric or algebraic
 */
export const generateAnglesOnLine = (options = {}) => {
  const { useAlgebra = false, difficulty = 'easy' } = options;

  if (useAlgebra) {
    // Algebraic: e.g., angles are 2x + 30 and 3x - 10
    const algebraOptions = [
      { angle1: '2x + 30', angle2: '3x - 10', equation: '2x + 30 + 3x - 10 = 180', x: 32, angles: [94, 86] },
      { angle1: '4x + 10', angle2: '2x + 20', equation: '4x + 10 + 2x + 20 = 180', x: 25, angles: [110, 70] },
      { angle1: '3x', angle2: 'x + 40', equation: '3x + x + 40 = 180', x: 35, angles: [105, 75] },
      { angle1: '5x - 20', angle2: '2x + 60', equation: '5x - 20 + 2x + 60 = 180', x: 20, angles: [80, 100] },
      { angle1: '2x + 15', angle2: '4x - 15', equation: '2x + 15 + 4x - 15 = 180', x: 30, angles: [75, 105] }
    ];
    const selected = _.sample(algebraOptions);
    
    return {
      question: `Two angles on a straight line are $(${selected.angle1})°$ and $(${selected.angle2})°$. Find $x$.`,
      answer: `x = ${selected.x}°\\text{ (angles are }${selected.angles[0]}°\\text{ and }${selected.angles[1]}°\\text{)}`,
      workingOut: `${selected.equation}\\\\5x + 20 = 180\\\\x = ${selected.x}`,
      type: 'angles-on-line-algebra',
      difficulty: 'algebra'
    };
  }

  // Numeric version
  const knownAngle = _.random(30, 150);
  const unknownAngle = 180 - knownAngle;

  return {
    question: `Two angles on a straight line. One angle is ${knownAngle}°. Find the other angle.`,
    answer: `${unknownAngle}°`,
    workingOut: `180° - ${knownAngle}° = ${unknownAngle}°`,
    type: 'angles-on-line',
    difficulty: 'easy'
  };
};

/**
 * Angles around a point (sum to 360°)
 * Can be numeric or algebraic
 */
export const generateAnglesAroundPoint = (options = {}) => {
  const { useAlgebra = false } = options;

  if (useAlgebra) {
    const algebraOptions = [
      { angles: ['2x', '3x', '4x', '90'], equation: '2x + 3x + 4x + 90 = 360', x: 30 },
      { angles: ['x + 20', '2x', '3x - 10', '110'], equation: 'x + 20 + 2x + 3x - 10 + 110 = 360', x: 40 },
      { angles: ['4x', '3x', '2x', 'x'], equation: '4x + 3x + 2x + x = 360', x: 36 }
    ];
    const selected = _.sample(algebraOptions);
    
    return {
      question: `Angles around a point are ${selected.angles.map(a => `$(${a})°$`).join(', ')}. Find $x$.`,
      answer: `x = ${selected.x}°`,
      workingOut: selected.equation,
      type: 'angles-around-point-algebra',
      difficulty: 'algebra'
    };
  }

  // Numeric: three known angles, find the fourth
  const angle1 = _.random(60, 120);
  const angle2 = _.random(50, 100);
  const angle3 = _.random(40, 90);
  const unknownAngle = 360 - angle1 - angle2 - angle3;

  return {
    question: `Angles around a point are ${angle1}°, ${angle2}°, ${angle3}° and $x$. Find $x$.`,
    answer: `${unknownAngle}°`,
    workingOut: `360° - ${angle1}° - ${angle2}° - ${angle3}° = ${unknownAngle}°`,
    type: 'angles-around-point',
    difficulty: 'easy'
  };
};

/**
 * Vertically opposite angles
 */
export const generateVerticallyOpposite = (options = {}) => {
  const { useAlgebra = false } = options;

  if (useAlgebra) {
    const algebraOptions = [
      { angle1: '3x + 10', angle2: '5x - 20', equation: '3x + 10 = 5x - 20', x: 15, finalAngle: 55 },
      { angle1: '2x + 25', angle2: '4x - 15', equation: '2x + 25 = 4x - 15', x: 20, finalAngle: 65 },
      { angle1: '5x', angle2: '3x + 30', equation: '5x = 3x + 30', x: 15, finalAngle: 75 }
    ];
    const selected = _.sample(algebraOptions);
    
    return {
      question: `Two vertically opposite angles are $(${selected.angle1})°$ and $(${selected.angle2})°$. Find $x$.`,
      answer: `x = ${selected.x}° \\text{ (angle = }${selected.finalAngle}°\\text{)}`,
      workingOut: `${selected.equation}\\\\x = ${selected.x}`,
      type: 'vertically-opposite-algebra',
      difficulty: 'algebra'
    };
  }

  const angle = _.random(20, 160);
  return {
    question: `Two lines intersect. One angle is ${angle}°. Find the vertically opposite angle.`,
    answer: `${angle}°`,
    workingOut: `Vertically opposite angles are equal = ${angle}°`,
    type: 'vertically-opposite',
    difficulty: 'easy'
  };
};

/**
 * Angles in a triangle (sum to 180°)
 */
export const generateTriangleAngles = (options = {}) => {
  const { useAlgebra = false, triangleType = null } = options;

  if (useAlgebra) {
    const algebraOptions = [
      { angles: ['x', '2x', '3x'], equation: 'x + 2x + 3x = 180', x: 30, finalAngles: [30, 60, 90] },
      { angles: ['x + 10', '2x', 'x + 30'], equation: 'x + 10 + 2x + x + 30 = 180', x: 35, finalAngles: [45, 70, 65] },
      { angles: ['3x - 10', '2x + 20', 'x'], equation: '3x - 10 + 2x + 20 + x = 180', x: 28.33, finalAngles: [75, 77, 28] }
    ];
    const selected = _.sample(algebraOptions);
    
    return {
      question: `Triangle angles are $(${selected.angles[0]})°$, $(${selected.angles[1]})°$ and $(${selected.angles[2]})°$. Find $x$.`,
      answer: `x = ${selected.x}°`,
      workingOut: selected.equation,
      type: 'triangle-angles-algebra',
      difficulty: 'algebra'
    };
  }

  // Numeric
  const angle1 = _.random(30, 80);
  const angle2 = _.random(30, 80);
  const unknownAngle = 180 - angle1 - angle2;

  return {
    question: `A triangle has angles ${angle1}° and ${angle2}°. Find the third angle.`,
    answer: `${unknownAngle}°`,
    workingOut: `180° - ${angle1}° - ${angle2}° = ${unknownAngle}°`,
    type: 'triangle-angles',
    difficulty: 'easy'
  };
};

/**
 * Isosceles triangle angles
 */
export const generateIsoscelesAngles = (options = {}) => {
  const { useAlgebra = false } = options;

  if (useAlgebra) {
    const algebraOptions = [
      { baseAngles: '2x + 10', apex: 'x - 20', equation: '2(2x + 10) + (x - 20) = 180', x: 36, finalAngles: [82, 82, 16] },
      { baseAngles: '3x', apex: '60', equation: '2(3x) + 60 = 180', x: 20, finalAngles: [60, 60, 60] },
      { baseAngles: 'x + 15', apex: '2x', equation: '2(x + 15) + 2x = 180', x: 37.5, finalAngles: [52.5, 52.5, 75] }
    ];
    const selected = _.sample(algebraOptions);
    
    return {
      question: `An isosceles triangle has two equal base angles of $(${selected.baseAngles})°$ and an apex angle of $(${selected.apex})°$. Find $x$.`,
      answer: `x = ${selected.x}°`,
      workingOut: selected.equation,
      type: 'isosceles-algebra',
      difficulty: 'algebra'
    };
  }

  // Given apex, find base angles
  const apex = _.random(20, 100);
  const baseAngle = (180 - apex) / 2;

  return {
    question: `An isosceles triangle has an apex angle of ${apex}°. Find each base angle.`,
    answer: `${baseAngle}°`,
    workingOut: `(180° - ${apex}°) ÷ 2 = ${baseAngle}°`,
    type: 'isosceles',
    difficulty: 'easy'
  };
};

/**
 * Parallel lines - corresponding angles
 */
export const generateCorrespondingAngles = (options = {}) => {
  const { useAlgebra = false } = options;

  if (useAlgebra) {
    const algebraOptions = [
      { angle1: '3x + 15', angle2: '5x - 25', equation: '3x + 15 = 5x - 25', x: 20, finalAngle: 75 },
      { angle1: '2x + 30', angle2: '4x - 10', equation: '2x + 30 = 4x - 10', x: 20, finalAngle: 70 },
      { angle1: '4x', angle2: '2x + 50', equation: '4x = 2x + 50', x: 25, finalAngle: 100 }
    ];
    const selected = _.sample(algebraOptions);
    
    return {
      question: `Corresponding angles on parallel lines are $(${selected.angle1})°$ and $(${selected.angle2})°$. Find $x$.`,
      answer: `x = ${selected.x}° \\text{ (angle = }${selected.finalAngle}°\\text{)}`,
      workingOut: `\\text{Corresponding angles are equal}\\\\${selected.equation}`,
      type: 'corresponding-algebra',
      difficulty: 'algebra'
    };
  }

  const angle = _.random(30, 150);
  return {
    question: `A transversal crosses two parallel lines. One angle is ${angle}°. Find the corresponding angle.`,
    answer: `${angle}°`,
    workingOut: `Corresponding angles are equal = ${angle}°`,
    type: 'corresponding',
    difficulty: 'easy'
  };
};

/**
 * Parallel lines - alternate angles
 */
export const generateAlternateAngles = (options = {}) => {
  const { useAlgebra = false } = options;

  if (useAlgebra) {
    const algebraOptions = [
      { angle1: '2x + 20', angle2: '3x - 15', equation: '2x + 20 = 3x - 15', x: 35, finalAngle: 90 },
      { angle1: '5x - 10', angle2: '3x + 30', equation: '5x - 10 = 3x + 30', x: 20, finalAngle: 90 }
    ];
    const selected = _.sample(algebraOptions);
    
    return {
      question: `Alternate angles on parallel lines are $(${selected.angle1})°$ and $(${selected.angle2})°$. Find $x$.`,
      answer: `x = ${selected.x}° \\text{ (angle = }${selected.finalAngle}°\\text{)}`,
      workingOut: `\\text{Alternate angles are equal}\\\\${selected.equation}`,
      type: 'alternate-algebra',
      difficulty: 'algebra'
    };
  }

  const angle = _.random(30, 150);
  return {
    question: `A transversal crosses two parallel lines. One angle is ${angle}°. Find the alternate angle.`,
    answer: `${angle}°`,
    workingOut: `Alternate angles are equal = ${angle}°`,
    type: 'alternate',
    difficulty: 'easy'
  };
};

/**
 * Parallel lines - co-interior angles (sum to 180°)
 */
export const generateCoInteriorAngles = (options = {}) => {
  const { useAlgebra = false } = options;

  if (useAlgebra) {
    const algebraOptions = [
      { angle1: '2x + 10', angle2: '3x + 20', equation: '2x + 10 + 3x + 20 = 180', x: 30, finalAngles: [70, 110] },
      { angle1: '4x', angle2: '2x + 60', equation: '4x + 2x + 60 = 180', x: 20, finalAngles: [80, 100] }
    ];
    const selected = _.sample(algebraOptions);
    
    return {
      question: `Co-interior angles on parallel lines are $(${selected.angle1})°$ and $(${selected.angle2})°$. Find $x$.`,
      answer: `x = ${selected.x}°`,
      workingOut: `\\text{Co-interior angles sum to 180°}\\\\${selected.equation}`,
      type: 'co-interior-algebra',
      difficulty: 'algebra'
    };
  }

  const angle = _.random(30, 150);
  const coInterior = 180 - angle;
  return {
    question: `Co-interior angles on parallel lines. One angle is ${angle}°. Find the other.`,
    answer: `${coInterior}°`,
    workingOut: `Co-interior angles sum to 180°: 180° - ${angle}° = ${coInterior}°`,
    type: 'co-interior',
    difficulty: 'easy'
  };
};

/**
 * Interior angles of polygon
 */
export const generateInteriorAngleSum = (options = {}) => {
  const { sides = null } = options;

  const n = sides || _.sample([5, 6, 7, 8, 9, 10]);
  const sum = (n - 2) * 180;
  const polygonNames = {
    5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 
    8: 'octagon', 9: 'nonagon', 10: 'decagon'
  };

  return {
    question: `Find the sum of interior angles in a ${polygonNames[n]} (${n} sides).`,
    answer: `${sum}°`,
    workingOut: `(n - 2) × 180° = (${n} - 2) × 180° = ${n - 2} × 180° = ${sum}°`,
    type: 'interior-sum',
    difficulty: 'easy'
  };
};

/**
 * One interior angle of regular polygon
 */
export const generateRegularPolygonAngle = (options = {}) => {
  const { sides = null } = options;

  const n = sides || _.sample([5, 6, 8, 9, 10, 12]);
  const sum = (n - 2) * 180;
  const oneAngle = sum / n;
  const polygonNames = {
    5: 'pentagon', 6: 'hexagon', 8: 'octagon', 
    9: 'nonagon', 10: 'decagon', 12: 'dodecagon'
  };

  return {
    question: `Find one interior angle of a regular ${polygonNames[n]}.`,
    answer: `${oneAngle}°`,
    workingOut: `\\frac{(${n} - 2) × 180°}{${n}} = \\frac{${sum}°}{${n}} = ${oneAngle}°`,
    type: 'regular-polygon-angle',
    difficulty: 'medium'
  };
};

/**
 * Mixed angle facts generator - randomly selects from basic facts
 * Good for "Last Year" starter questions
 */
export const generateMixedAngleFact = (options = {}) => {
  const { includeAlgebra = false, includeParallelLines = false, includePolygons = false } = options;

  const basicGenerators = [
    () => generateAnglesOnLine({ useAlgebra: includeAlgebra && Math.random() > 0.5 }),
    () => generateAnglesAroundPoint({ useAlgebra: includeAlgebra && Math.random() > 0.5 }),
    () => generateVerticallyOpposite({ useAlgebra: includeAlgebra && Math.random() > 0.5 }),
    () => generateTriangleAngles({ useAlgebra: includeAlgebra && Math.random() > 0.5 }),
    () => generateIsoscelesAngles({ useAlgebra: includeAlgebra && Math.random() > 0.5 })
  ];

  if (includeParallelLines) {
    basicGenerators.push(
      () => generateCorrespondingAngles({ useAlgebra: includeAlgebra && Math.random() > 0.5 }),
      () => generateAlternateAngles({ useAlgebra: includeAlgebra && Math.random() > 0.5 }),
      () => generateCoInteriorAngles({ useAlgebra: includeAlgebra && Math.random() > 0.5 })
    );
  }

  if (includePolygons) {
    basicGenerators.push(
      () => generateInteriorAngleSum(),
      () => generateRegularPolygonAngle()
    );
  }

  const selectedGenerator = _.sample(basicGenerators);
  return selectedGenerator();
};

// Export all generators
export const angleFactsGenerators = {
  generateAnglesOnLine,
  generateAnglesAroundPoint,
  generateVerticallyOpposite,
  generateTriangleAngles,
  generateIsoscelesAngles,
  generateCorrespondingAngles,
  generateAlternateAngles,
  generateCoInteriorAngles,
  generateInteriorAngleSum,
  generateRegularPolygonAngle,
  generateMixedAngleFact
};

export default angleFactsGenerators;