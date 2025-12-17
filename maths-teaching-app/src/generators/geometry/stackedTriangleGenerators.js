// src/generators/geometry/stackedTriangleGenerators.js
// Stacked/Composite Triangle Problem Generator - V1.0
//
// Generates multi-step problems combining:
// - Pythagoras + Pythagoras
// - Pythagoras + Trigonometry
// - Trigonometry + Trigonometry
//
// Use cases:
// - SOHCAHTOA Challenge sections
// - 3D Trig diagnostics
// - Advanced Pythagoras problems

import _ from 'lodash';

// ============================================================
// CONSTANTS
// ============================================================

const COMMON_ANGLES = [25, 30, 35, 40, 45, 50, 55, 60];
const ARRANGEMENTS = ['back-to-back', 'hypotenuse-to-height'];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const roundTo = (num, places = 1) => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

const toRadians = (degrees) => degrees * Math.PI / 180;

const getTrigValue = (func, angle) => {
  const rad = toRadians(angle);
  switch (func) {
    case 'sin': return Math.sin(rad);
    case 'cos': return Math.cos(rad);
    case 'tan': return Math.tan(rad);
    default: return 0;
  }
};

// ============================================================
// PROBLEM TYPE GENERATORS
// ============================================================

/**
 * Generate a Trig + Pythag problem (reverse of Pythag-then-Trig)
 * Step 1: Use Trig to find shared side
 * Step 2: Use Pythagoras to find final answer
 */
const generateTrigThenPythag = (options = {}) => {
  const { units = 'cm', difficulty = 'medium' } = options;
  
  // Triangle 1: SOHCAHTOA (find the shared side using trig)
  const t1Angle = _.sample(COMMON_ANGLES);
  const t1Ratio = _.sample(['sin', 'cos', 'tan']);
  const t1GivenSide = _.random(6, 12);
  
  // Calculate T1 dimensions based on which ratio we're using
  let t1Base, t1Height, t1Hyp, t1SharedSide;
  
  if (t1Ratio === 'sin') {
    // sin = O/H, given H, find O (which becomes shared side)
    t1Hyp = t1GivenSide;
    t1Height = roundTo(t1Hyp * getTrigValue('sin', t1Angle), 1); // This is the shared side
    t1Base = roundTo(Math.sqrt(t1Hyp * t1Hyp - t1Height * t1Height), 1);
    t1SharedSide = t1Height;
  } else if (t1Ratio === 'cos') {
    // cos = A/H, given H, find A (which becomes shared side)
    t1Hyp = t1GivenSide;
    t1Base = roundTo(t1Hyp * getTrigValue('cos', t1Angle), 1); // This is shared side
    t1Height = roundTo(Math.sqrt(t1Hyp * t1Hyp - t1Base * t1Base), 1);
    t1SharedSide = t1Base;
  } else {
    // tan = O/A, given A, find O (which becomes shared side)
    t1Base = t1GivenSide;
    t1Height = roundTo(t1Base * getTrigValue('tan', t1Angle), 1); // This is shared side
    t1Hyp = roundTo(Math.sqrt(t1Base * t1Base + t1Height * t1Height), 1);
    t1SharedSide = t1Height;
  }
  
  // Triangle 2: Pythagoras (use shared side + one other side to find hypotenuse)
  // Use a base that gives nice numbers
  const t2Base = _.sample([3, 4, 5, 6]) * _.sample([1, 2]);
  const t2Height = t1SharedSide; // The shared side
  const t2Hyp = roundTo(Math.sqrt(t2Base * t2Base + t2Height * t2Height), 1);
  
  const finalAnswer = t2Hyp;
  
  return {
    problemType: 'trig-then-pythag',
    questionText: `Find the length marked x. Give your answer to 1 decimal place.`,
    
    answer: `${finalAnswer} ${units}`,
    finalAnswer,
    
    solution: [
      {
        step: 1,
        title: `Find the shared side using ${t1Ratio.toUpperCase()}`,
        explanation: `In the first triangle, use ${t1Ratio}(${t1Angle}°) with the ${t1Ratio === 'tan' ? 'adjacent' : 'hypotenuse'}`,
        formula: `${t1Ratio}(${t1Angle}°) = \\frac{?}{${t1GivenSide}}`,
        working: `? = ${t1GivenSide} \\times ${t1Ratio}(${t1Angle}°) = ${t1SharedSide}`,
        result: `${t1SharedSide} ${units}`
      },
      {
        step: 2,
        title: 'Find x using Pythagoras',
        explanation: `Now use Pythagoras with the shared side (${t1SharedSide}) and the base (${t2Base})`,
        formula: `a^2 + b^2 = c^2`,
        working: `${t2Base}^2 + ${t1SharedSide}^2 = x^2 \\\\ x = \\sqrt{${t2Base * t2Base} + ${roundTo(t1SharedSide * t1SharedSide, 1)}} = ${finalAnswer}`,
        result: `${finalAnswer} ${units}`
      }
    ],
    
    // Visualization config
    // T1: Show angle and one side (for trig), shared side is ?
    // T2: Show only base and x (they get shared side from step 1)
    visualization: {
      arrangement: 'back-to-back',
      triangle1: {
        base: t1Base,
        height: t1Height,
        hypotenuse: t1Hyp,
        angle: t1Angle,
        showAngle: true,
        labels: {
          base: t1Ratio === 'tan' || t1Ratio === 'cos' ? `${t1Ratio === 'tan' ? t1Base : null}` : null,
          height: null, // Shared side - shown via sharedSide label
          hypotenuse: t1Ratio === 'sin' || t1Ratio === 'cos' ? `${t1Hyp} ${units}` : null
        },
        color: '#3498db'
      },
      triangle2: {
        base: t2Base,
        height: t2Height,
        hypotenuse: t2Hyp,
        angle: null,
        showAngle: false,
        labels: {
          base: `${t2Base} ${units}`, // Need this for Pythagoras
          height: null, // Shared side
          hypotenuse: 'x' // What they're finding
        },
        color: '#e74c3c'
      },
      sharedSide: {
        value: t1SharedSide,
        label: '?',
        showLabel: true,
        color: '#9b59b6',
        highlight: true
      },
      units
    },
    
    metadata: {
      type: 'stacked-triangles',
      subType: 'trig-then-pythag',
      difficulty,
      methods: [t1Ratio, 'pythagoras'],
      sharedSide: t1SharedSide,
      finalAnswer
    }
  };
};

/**
 * Generate a Pythagoras + Trig problem
 * Step 1: Use Pythagoras to find shared side
 * Step 2: Use Trig to find final answer
 */
const generatePythagThenTrig = (options = {}) => {
  const { units = 'cm', difficulty = 'medium' } = options;
  
  // Triangle 1: Pythagoras (find the shared side - will be height of T1)
  // Use a Pythagorean triple for nice numbers
  const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]];
  const [a, b, c] = _.sample(triples);
  const multiplier = _.sample([1, 2]);
  
  const t1Base = a * multiplier;
  const t1Height = b * multiplier; // This is the shared side
  const t1Hyp = c * multiplier;
  
  // Triangle 2: Trig (use the shared side to find final answer)
  const t2Angle = _.sample(COMMON_ANGLES);
  const t2Ratio = _.sample(['sin', 'cos', 'tan']);
  
  // The shared side becomes one of T2's sides
  // Randomly decide which side the shared becomes
  let t2KnownSide, t2UnknownSide, t2KnownName, t2UnknownName;
  let t2Base, t2Height, t2Hyp;
  
  if (t2Ratio === 'tan') {
    // tan = O/A - shared side could be O or A
    if (Math.random() > 0.5) {
      // Shared is adjacent, find opposite
      t2Base = t1Height; // adjacent
      t2Height = roundTo(t2Base * getTrigValue('tan', t2Angle), 1); // opposite
      t2Hyp = roundTo(Math.sqrt(t2Base * t2Base + t2Height * t2Height), 1);
      t2KnownName = 'adjacent';
      t2UnknownName = 'opposite';
      t2KnownSide = t2Base;
      t2UnknownSide = t2Height;
    } else {
      // Shared is opposite, find adjacent
      t2Height = t1Height; // opposite
      t2Base = roundTo(t2Height / getTrigValue('tan', t2Angle), 1); // adjacent
      t2Hyp = roundTo(Math.sqrt(t2Base * t2Base + t2Height * t2Height), 1);
      t2KnownName = 'opposite';
      t2UnknownName = 'adjacent';
      t2KnownSide = t2Height;
      t2UnknownSide = t2Base;
    }
  } else if (t2Ratio === 'sin') {
    // sin = O/H - shared becomes hypotenuse or opposite
    if (Math.random() > 0.5) {
      // Shared is hypotenuse, find opposite
      t2Hyp = t1Height;
      t2Height = roundTo(t2Hyp * getTrigValue('sin', t2Angle), 1);
      t2Base = roundTo(Math.sqrt(t2Hyp * t2Hyp - t2Height * t2Height), 1);
      t2KnownName = 'hypotenuse';
      t2UnknownName = 'opposite';
      t2KnownSide = t2Hyp;
      t2UnknownSide = t2Height;
    } else {
      // Shared is opposite, find hypotenuse
      t2Height = t1Height;
      t2Hyp = roundTo(t2Height / getTrigValue('sin', t2Angle), 1);
      t2Base = roundTo(Math.sqrt(t2Hyp * t2Hyp - t2Height * t2Height), 1);
      t2KnownName = 'opposite';
      t2UnknownName = 'hypotenuse';
      t2KnownSide = t2Height;
      t2UnknownSide = t2Hyp;
    }
  } else {
    // cos = A/H - shared becomes hypotenuse or adjacent
    if (Math.random() > 0.5) {
      // Shared is hypotenuse, find adjacent
      t2Hyp = t1Height;
      t2Base = roundTo(t2Hyp * getTrigValue('cos', t2Angle), 1);
      t2Height = roundTo(Math.sqrt(t2Hyp * t2Hyp - t2Base * t2Base), 1);
      t2KnownName = 'hypotenuse';
      t2UnknownName = 'adjacent';
      t2KnownSide = t2Hyp;
      t2UnknownSide = t2Base;
    } else {
      // Shared is adjacent, find hypotenuse
      t2Base = t1Height;
      t2Hyp = roundTo(t2Base / getTrigValue('cos', t2Angle), 1);
      t2Height = roundTo(Math.sqrt(t2Hyp * t2Hyp - t2Base * t2Base), 1);
      t2KnownName = 'adjacent';
      t2UnknownName = 'hypotenuse';
      t2KnownSide = t2Base;
      t2UnknownSide = t2Hyp;
    }
  }
  
  const finalAnswer = t2UnknownSide;
  
  return {
    problemType: 'pythag-then-trig',
    questionText: `Find the length marked x. Give your answer to 1 decimal place.`,
    
    answer: `${finalAnswer} ${units}`,
    finalAnswer,
    
    // Step-by-step solution
    solution: [
      {
        step: 1,
        title: 'Find the shared side using Pythagoras',
        explanation: `In the first triangle, we know two sides: ${t1Base} ${units} and ${t1Hyp} ${units}`,
        formula: `a^2 + b^2 = c^2`,
        working: `${t1Base}^2 + h^2 = ${t1Hyp}^2 \\\\ h^2 = ${t1Hyp}^2 - ${t1Base}^2 = ${t1Hyp * t1Hyp} - ${t1Base * t1Base} = ${t1Height * t1Height} \\\\ h = ${t1Height}`,
        result: `${t1Height} ${units}`
      },
      {
        step: 2,
        title: `Find x using ${t2Ratio.toUpperCase()}`,
        explanation: `In the second triangle, we now know the ${t2KnownName} (${t2KnownSide} ${units}) and the angle (${t2Angle}°)`,
        formula: `${t2Ratio}(${t2Angle}°) = \\frac{\\text{${t2Ratio === 'tan' ? 'opposite' : t2Ratio === 'sin' ? 'opposite' : 'adjacent'}}}{\\text{${t2Ratio === 'tan' ? 'adjacent' : 'hypotenuse'}}}`,
        working: `x = ${t2KnownSide} ${t2UnknownName === 'opposite' || t2UnknownName === 'adjacent' ? '×' : '÷'} ${t2Ratio}(${t2Angle}°) = ${finalAnswer}`,
        result: `${finalAnswer} ${units}`
      }
    ],
    
    // Visualization config
    // For Pythag-then-Trig:
    // T1: Show base and hyp (known), height is ? (find with Pythag)
    // T2: Only show angle and x (the answer) - NO lengths labelled
    //     They get the length from the Pythagoras step (shared side)
    visualization: {
      arrangement: 'back-to-back',
      triangle1: {
        base: t1Base,
        height: t1Height,
        hypotenuse: t1Hyp,
        angle: null,
        showAngle: false,
        labels: {
          base: `${t1Base} ${units}`,
          height: null, // Shared side - found in step 1
          hypotenuse: `${t1Hyp} ${units}`
        },
        color: '#3498db'
      },
      triangle2: {
        base: t2Base,
        height: t1Height,
        hypotenuse: t2Hyp,
        angle: t2Angle,
        showAngle: true,
        labels: {
          base: null, // No length shown
          height: null, // No length shown (this is the shared side)
          hypotenuse: 'x' // Only show what they're finding
        },
        color: '#e74c3c'
      },
      sharedSide: {
        value: t1Height,
        label: '?', // Unknown until step 1 complete
        showLabel: true,
        color: '#9b59b6',
        highlight: true
      },
      units
    },
    
    metadata: {
      type: 'stacked-triangles',
      subType: 'pythag-then-trig',
      difficulty,
      methods: ['pythagoras', t2Ratio],
      sharedSide: t1Height,
      finalAnswer
    }
  };
};

/**
 * Generate a Trig + Trig problem
 * Step 1: Use one trig ratio to find shared side
 * Step 2: Use another trig ratio to find final answer
 */
const generateTrigThenTrig = (options = {}) => {
  const { units = 'cm', difficulty = 'medium' } = options;
  
  // Triangle 1: Find the shared side using trig
  const t1Angle = _.sample(COMMON_ANGLES);
  const t1Ratio = _.sample(['sin', 'cos', 'tan']);
  const t1GivenSide = _.random(6, 12);
  
  // Calculate T1 dimensions
  let t1Base, t1Height, t1Hyp, t1SharedSide;
  
  if (t1Ratio === 'tan') {
    t1Base = t1GivenSide; // adjacent
    t1Height = roundTo(t1Base * getTrigValue('tan', t1Angle), 1); // opposite
    t1Hyp = roundTo(Math.sqrt(t1Base * t1Base + t1Height * t1Height), 1);
    t1SharedSide = t1Height; // The calculated side becomes shared
  } else if (t1Ratio === 'sin') {
    t1Hyp = t1GivenSide;
    t1Height = roundTo(t1Hyp * getTrigValue('sin', t1Angle), 1);
    t1Base = roundTo(Math.sqrt(t1Hyp * t1Hyp - t1Height * t1Height), 1);
    t1SharedSide = t1Height;
  } else {
    t1Hyp = t1GivenSide;
    t1Base = roundTo(t1Hyp * getTrigValue('cos', t1Angle), 1);
    t1Height = roundTo(Math.sqrt(t1Hyp * t1Hyp - t1Base * t1Base), 1);
    t1SharedSide = t1Base;
  }
  
  // Triangle 2: Use shared side to find final answer
  const t2Angle = _.sample(COMMON_ANGLES.filter(a => a !== t1Angle)); // Different angle
  const t2Ratio = _.sample(['sin', 'cos', 'tan']);
  
  let t2Base, t2Height, t2Hyp, finalAnswer;
  
  if (t2Ratio === 'tan') {
    t2Base = t1SharedSide;
    t2Height = roundTo(t2Base * getTrigValue('tan', t2Angle), 1);
    t2Hyp = roundTo(Math.sqrt(t2Base * t2Base + t2Height * t2Height), 1);
    finalAnswer = t2Height;
  } else if (t2Ratio === 'sin') {
    t2Hyp = t1SharedSide * 1.5; // Make hypotenuse larger than shared
    t2Height = roundTo(t2Hyp * getTrigValue('sin', t2Angle), 1);
    t2Base = roundTo(Math.sqrt(t2Hyp * t2Hyp - t2Height * t2Height), 1);
    finalAnswer = t2Height;
  } else {
    t2Hyp = t1SharedSide * 1.5;
    t2Base = roundTo(t2Hyp * getTrigValue('cos', t2Angle), 1);
    t2Height = roundTo(Math.sqrt(t2Hyp * t2Hyp - t2Base * t2Base), 1);
    finalAnswer = t2Base;
  }
  
  return {
    problemType: 'trig-then-trig',
    questionText: `Find the length marked x. Give your answer to 1 decimal place.`,
    
    answer: `${finalAnswer} ${units}`,
    finalAnswer,
    
    solution: [
      {
        step: 1,
        title: `Find the shared side using ${t1Ratio.toUpperCase()}`,
        explanation: `Use ${t1Ratio}(${t1Angle}°) with the given side`,
        formula: `${t1Ratio}(${t1Angle}°) = ...`,
        result: `${t1SharedSide} ${units}`
      },
      {
        step: 2,
        title: `Find x using ${t2Ratio.toUpperCase()}`,
        explanation: `Now use ${t2Ratio}(${t2Angle}°) with the shared side`,
        formula: `${t2Ratio}(${t2Angle}°) = ...`,
        result: `${finalAnswer} ${units}`
      }
    ],
    
    visualization: {
      arrangement: 'back-to-back',
      triangle1: {
        base: t1Base,
        height: t1Height,
        hypotenuse: t1Hyp,
        angle: t1Angle,
        showAngle: true,
        labels: {
          base: `${t1Base} ${units}`,
          height: null, // Shared side
          hypotenuse: `${t1Hyp} ${units}`
        },
        color: '#3498db'
      },
      triangle2: {
        base: t2Base,
        height: t1SharedSide,
        hypotenuse: t2Hyp,
        angle: t2Angle,
        showAngle: true,
        labels: {
          base: null, // No lengths on T2
          height: null, // No lengths on T2
          hypotenuse: 'x' // Only show what they're finding
        },
        color: '#e74c3c'
      },
      sharedSide: {
        value: t1SharedSide,
        label: '?',
        showLabel: true,
        color: '#9b59b6',
        highlight: true
      },
      units
    },
    
    metadata: {
      type: 'stacked-triangles',
      subType: 'trig-then-trig',
      difficulty,
      methods: [t1Ratio, t2Ratio],
      sharedSide: t1SharedSide,
      finalAnswer
    }
  };
};

/**
 * Generate a Pythagoras + Pythagoras problem
 * Both steps use Pythagoras theorem
 */
const generatePythagThenPythag = (options = {}) => {
  const { units = 'cm', difficulty = 'easy' } = options;
  
  // Use Pythagorean triples for nice numbers
  const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
  const [a1, b1, c1] = _.sample(triples);
  const [a2, b2, c2] = _.sample(triples.filter(t => t !== [a1, b1, c1]));
  
  const m1 = _.sample([1, 2]);
  const m2 = _.sample([1, 2]);
  
  const t1Base = a1 * m1;
  const t1Height = b1 * m1;
  const t1Hyp = c1 * m1;
  
  // Triangle 2 shares the height of triangle 1
  const sharedSide = t1Height;
  const t2Base = a2 * m2;
  const t2Height = sharedSide; // Reuse for connected feel
  const t2Hyp = roundTo(Math.sqrt(t2Base * t2Base + t2Height * t2Height), 1);
  
  return {
    problemType: 'pythag-then-pythag',
    questionText: `Find the length marked x.`,
    
    answer: `${t2Hyp} ${units}`,
    finalAnswer: t2Hyp,
    
    solution: [
      {
        step: 1,
        title: 'Find the shared side using Pythagoras',
        explanation: `First triangle: ${t1Base}² + h² = ${t1Hyp}²`,
        result: `h = ${t1Height} ${units}`
      },
      {
        step: 2,
        title: 'Find x using Pythagoras',
        explanation: `Second triangle: ${t2Base}² + ${t2Height}² = x²`,
        result: `x = ${t2Hyp} ${units}`
      }
    ],
    
    visualization: {
      arrangement: 'back-to-back',
      triangle1: {
        base: t1Base,
        height: t1Height,
        hypotenuse: t1Hyp,
        showAngle: false,
        labels: {
          base: `${t1Base} ${units}`,
          height: null, // Shared side
          hypotenuse: `${t1Hyp} ${units}`
        },
        color: '#3498db'
      },
      triangle2: {
        base: t2Base,
        height: sharedSide,
        hypotenuse: t2Hyp,
        showAngle: false,
        labels: {
          base: `${t2Base} ${units}`, // Pythag needs two sides, so show base
          height: null, // Shared side (they'll get this from step 1)
          hypotenuse: 'x' // What they're finding
        },
        color: '#e74c3c'
      },
      sharedSide: {
        value: sharedSide,
        label: '?',
        showLabel: true,
        color: '#9b59b6',
        highlight: true
      },
      units
    },
    
    metadata: {
      type: 'stacked-triangles',
      subType: 'pythag-then-pythag',
      difficulty,
      methods: ['pythagoras', 'pythagoras'],
      sharedSide,
      finalAnswer: t2Hyp
    }
  };
};

// ============================================================
// MAIN GENERATORS
// ============================================================

/**
 * Generate a random stacked triangle problem
 */
const generateStackedTriangleProblem = (options = {}) => {
  const { type = null, difficulty = 'medium' } = options;
  
  const problemType = type || _.sample([
    'pythag-then-trig', 
    'trig-then-pythag',
    'trig-then-trig', 
    'pythag-then-pythag'
  ]);
  
  switch (problemType) {
    case 'pythag-then-trig':
      return generatePythagThenTrig(options);
    case 'trig-then-pythag':
      return generateTrigThenPythag(options);
    case 'trig-then-trig':
      return generateTrigThenTrig(options);
    case 'pythag-then-pythag':
      return generatePythagThenPythag(options);
    default:
      return generatePythagThenTrig(options);
  }
};

/**
 * Generate for SOHCAHTOA1 Challenge (Pythag + Trig mix, either direction)
 */
const generateForSohcahtoaChallenge = (options = {}) => {
  // Randomly choose direction: Pythag→Trig or Trig→Pythag
  const type = Math.random() > 0.5 ? 'pythag-then-trig' : 'trig-then-pythag';
  return generateStackedTriangleProblem({ ...options, type, difficulty: 'medium' });
};

/**
 * Generate for 3D Trig (all types)
 */
const generateFor3DTrig = (options = {}) => {
  return generateStackedTriangleProblem({ ...options, difficulty: 'hard' });
};

// ============================================================
// EXPORTS
// ============================================================

export const stackedTriangleGenerators = {
  // Individual generators
  generatePythagThenTrig,
  generateTrigThenPythag,
  generateTrigThenTrig,
  generatePythagThenPythag,
  
  // Main generator
  generateStackedTriangleProblem,
  
  // Context-specific generators
  generateForSohcahtoaChallenge,
  generateFor3DTrig
};

export default stackedTriangleGenerators;