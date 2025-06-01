// src/generators/geometry/pythagorasGenerators.js - Unified Architecture
import _ from 'lodash';
import { PYTHAGOREAN_TRIPLES, createPythagoreanTriangle, createIsoscelesTriangle } from '../../factories/triangleFactory';

/**
 * Ensure all options are unique and randomize order
 */
const generateUniqueOptions = (optionsArray) => {
  const uniqueOptions = [];
  const seen = new Set();

  for (const option of optionsArray) {
    if (!seen.has(option)) {
      seen.add(option);
      uniqueOptions.push(option);
    }
  }

  // Add fallback options if needed
  while (uniqueOptions.length < 4) {
    const fallback = `${_.random(10, 20)}\\text{ cm}`;
    if (!seen.has(fallback)) {
      seen.add(fallback);
      uniqueOptions.push(fallback);
    }
  }

  return uniqueOptions.sort(() => Math.random() - 0.5);
};

/**
 * Unified hypotenuse question generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 * Examples section includes non-Pythagorean triangles with decimal answers
 */
export const generateFindHypotenuse = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples',
    seed = Date.now(),
    units = 'cm'
  } = options;

  let a, b, c, isExact, answerType;

  // UNIFIED MATH LOGIC - different approaches for different sections
  if (sectionType === 'examples') {
    // 50% Pythagorean triples, 50% non-Pythagorean for variety
    const usePythagoreanTriple = Math.random() > 0.5;
    
    if (usePythagoreanTriple) {
      // Use Pythagorean triple for exact answers
      const triples = difficulty === 'easy' 
        ? PYTHAGOREAN_TRIPLES.slice(0, 2) 
        : PYTHAGOREAN_TRIPLES.slice(0, 5);
      const triple = seed ? triples[seed % triples.length] : _.sample(triples);
      [a, b, c] = triple;
      isExact = true;
      answerType = 'integer';
    } else {
      // Use non-Pythagorean for decimal answers
      a = _.random(3, 8);
      b = _.random(3, 8);
      const exactC = Math.sqrt(a * a + b * b);
      c = Math.round(exactC * 100) / 100; // Round to 2 decimal places
      isExact = false;
      answerType = 'decimal';
    }
  } else {
    // Starter and diagnostic: always use Pythagorean triples for clean answers
    const triples = difficulty === 'easy' 
      ? PYTHAGOREAN_TRIPLES.slice(0, 2) 
      : PYTHAGOREAN_TRIPLES.slice(0, 4);
    const triple = seed ? triples[seed % triples.length] : _.sample(triples);
    [a, b, c] = triple;
    isExact = true;
    answerType = 'integer';
  }

  // Generate orientation variety for all sections EXCEPT starter
  let orientationConfig = {};
  if (sectionType !== 'starter') {
    const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
    const orientationIndex = Math.floor((seed % 1000) / 250) % orientations.length;
    orientationConfig.orientation = orientations[orientationIndex];
  }

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Find the length of the hypotenuse in this right-angled triangle with base ${a} ${units} and height ${b} ${units}.`,
      answer: `\\text{Using Pythagoras' theorem: } ${a}^2 + ${b}^2 = c^2\\\\
               ${a * a} + ${b * b} = c^2\\\\
               ${a * a + b * b} = c^2\\\\
               c = \\sqrt{${a * a + b * b}} = ${c}\\text{ ${units}}`,
      visualization: createPythagoreanTriangle({
        base: a,
        height: b,
        unknownSide: 'hypotenuse',
        units,
        sectionType: 'starter'
      })
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate appropriate distractors
    const distractors = [
      a + b, // Common mistake: adding instead of using Pythagoras
      Math.round(Math.sqrt(Math.abs(a * a - b * b))), // Subtracting instead of adding
      c + _.random(1, 2) // Close but wrong
    ];

    return {
      questionDisplay: {
        text: `Find the hypotenuse of this right triangle with base ${a} ${units} and height ${b} ${units}.`
      },
      correctAnswer: `${c}\\text{ ${units}}`,
      options: generateUniqueOptions([
        `${c}\\text{ ${units}}`,
        ...distractors.map(d => `${d}\\text{ ${units}}`)
      ]),
      explanation: `Use Pythagoras' theorem: c² = ${a}² + ${b}² = ${a * a + b * b}, so c = ${c} ${units}`,
      visualization: createPythagoreanTriangle({
        base: a,
        height: b,
        unknownSide: 'hypotenuse',
        ...orientationConfig,
        units,
        sectionType: 'diagnostic'
      })
    };
  }

  else if (sectionType === 'examples') {
    // Create solution steps based on answer type
    const solution = isExact ? [
      {
        explanation: "Use Pythagoras' theorem: a² + b² = c²",
        formula: "a^2 + b^2 = c^2"
      },
      {
        explanation: "Substitute the known values",
        formula: `${a}^2 + ${b}^2 = c^2`
      },
      {
        explanation: "Calculate the squares",
        formula: `${a * a} + ${b * b} = c^2`
      },
      {
        explanation: "Add the values",
        formula: `${a * a + b * b} = c^2`
      },
      {
        explanation: "Take the square root of both sides",
        formula: `c = \\sqrt{${a * a + b * b}} = ${c}`
      }
    ] : [
      {
        explanation: "Use Pythagoras' theorem: a² + b² = c²",
        formula: "a^2 + b^2 = c^2"
      },
      {
        explanation: "Substitute the known values",
        formula: `${a}^2 + ${b}^2 = c^2`
      },
      {
        explanation: "Calculate the squares",
        formula: `${a * a} + ${b * b} = c^2`
      },
      {
        explanation: "Add the values",
        formula: `${a * a + b * b} = c^2`
      },
      {
        explanation: "Take the square root using a calculator",
        formula: `c = \\sqrt{${a * a + b * b}} = ${c}\\text{ ${units}}`
      }
    ];

    return {
      title: "Finding the Hypotenuse",
      questionText: `Find the length of the hypotenuse in this right-angled triangle with base ${a} ${units} and height ${b} ${units}.`,
      visualization: createPythagoreanTriangle({
        base: a,
        height: b,
        unknownSide: 'hypotenuse',
        ...orientationConfig,
        units,
        sectionType: 'examples'
      }),
      solution
    };
  }

  // Fallback to diagnostic format
  return generateFindHypotenuse({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified missing side (leg) question generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 * Examples section includes non-Pythagorean triangles with decimal answers
 */
export const generateFindMissingSide = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples',
    seed = Date.now(),
    units = 'cm'
  } = options;

  let a, b, c, legToFind, isExact, answerType;

  // UNIFIED MATH LOGIC
  if (sectionType === 'examples') {
    // 50% Pythagorean triples, 50% non-Pythagorean for variety
    const usePythagoreanTriple = Math.random() > 0.5;
    
    if (usePythagoreanTriple) {
      // Use Pythagorean triple for exact answers
      const triples = difficulty === 'easy' 
        ? PYTHAGOREAN_TRIPLES.slice(0, 2) 
        : PYTHAGOREAN_TRIPLES.slice(0, 5);
      const triple = seed ? triples[seed % triples.length] : _.sample(triples);
      [a, b, c] = triple;
      isExact = true;
      answerType = 'integer';
    } else {
      // Use non-Pythagorean: start with hypotenuse and one side, calculate other
      c = _.random(8, 15);
      const knownSide = _.random(3, Math.floor(c * 0.8)); // Ensure valid triangle
      legToFind = (seed % 2 === 0) ? 'base' : 'height';
      
      if (legToFind === 'base') {
        b = knownSide;
        const exactA = Math.sqrt(c * c - b * b);
        a = Math.round(exactA * 100) / 100;
      } else {
        a = knownSide;
        const exactB = Math.sqrt(c * c - a * a);
        b = Math.round(exactB * 100) / 100;
      }
      isExact = false;
      answerType = 'decimal';
    }
  } else {
    // Starter and diagnostic: always use Pythagorean triples
    const triples = difficulty === 'easy' 
      ? PYTHAGOREAN_TRIPLES.slice(0, 2) 
      : PYTHAGOREAN_TRIPLES.slice(0, 4);
    const triple = seed ? triples[seed % triples.length] : _.sample(triples);
    [a, b, c] = triple;
    isExact = true;
    answerType = 'integer';
  }

  // Determine which leg to find if not already set
  if (!legToFind) {
    legToFind = (seed % 2 === 0) ? 'base' : 'height';
  }
  const missingValue = legToFind;
  const correctAnswer = legToFind === 'base' ? a : b;

  // Generate orientation variety for all sections EXCEPT starter
  let orientationConfig = {};
  if (sectionType !== 'starter') {
    const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
    const orientationIndex = Math.floor((seed % 1000) / 250) % orientations.length;
    orientationConfig.orientation = orientations[orientationIndex];
  }

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    const questionText = legToFind === 'base'
      ? `Find the length of the base in this right-angled triangle with hypotenuse ${c} ${units} and height ${b} ${units}.`
      : `Find the length of the height in this right-angled triangle with hypotenuse ${c} ${units} and base ${a} ${units}.`;

    const answerFormula = legToFind === 'base'
      ? `\\text{Using Pythagoras' theorem: } a^2 + ${b}^2 = ${c}^2\\\\
         a^2 = ${c}^2 - ${b}^2 = ${c * c} - ${b * b} = ${c * c - b * b}\\\\
         a = \\sqrt{${c * c - b * b}} = ${a}\\text{ ${units}}`
      : `\\text{Using Pythagoras' theorem: } ${a}^2 + b^2 = ${c}^2\\\\
         b^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${c * c - a * a}\\\\
         b = \\sqrt{${c * c - a * a}} = ${b}\\text{ ${units}}`;

    return {
      question: questionText,
      answer: answerFormula,
      visualization: createPythagoreanTriangle({
        base: a,
        height: b,
        unknownSide: missingValue,
        units,
        sectionType: 'starter'
      })
    };
  }

  else if (sectionType === 'diagnostic') {
    const questionText = legToFind === 'base'
      ? `Find the base of this right triangle with hypotenuse ${c} ${units} and height ${b} ${units}.`
      : `Find the height of this right triangle with hypotenuse ${c} ${units} and base ${a} ${units}.`;

    // Generate distractors
    const distractors = [
      Math.round(Math.sqrt(c * c + (legToFind === 'base' ? b * b : a * a))), // Adding instead of subtracting
      correctAnswer + _.random(1, 2), // Close but wrong
      Math.round((c + (legToFind === 'base' ? b : a)) / 2) // Averaging instead of Pythagoras
    ];

    return {
      questionDisplay: { text: questionText },
      correctAnswer: `${correctAnswer}\\text{ ${units}}`,
      options: generateUniqueOptions([
        `${correctAnswer}\\text{ ${units}}`,
        ...distractors.map(d => `${d}\\text{ ${units}}`)
      ]),
      explanation: `Use Pythagoras' theorem: ${legToFind} = √(${c}² - ${legToFind === 'base' ? b : a}²) = ${correctAnswer} ${units}`,
      visualization: createPythagoreanTriangle({
        base: a,
        height: b,
        unknownSide: missingValue,
        ...orientationConfig,
        units,
        sectionType: 'diagnostic'
      })
    };
  }

  else if (sectionType === 'examples') {
    const questionText = legToFind === 'base'
      ? `Find the length of the base in this right-angled triangle with hypotenuse ${c} ${units} and height ${b} ${units}.`
      : `Find the length of the height in this right-angled triangle with hypotenuse ${c} ${units} and base ${a} ${units}.`;

    // Create solution steps
    const solution = legToFind === 'base' ? [
      {
        explanation: "Use Pythagoras' theorem: a² + b² = c²",
        formula: "a^2 + b^2 = c^2"
      },
      {
        explanation: "Rearrange to find the missing side",
        formula: `a^2 = c^2 - b^2`
      },
      {
        explanation: "Substitute the known values",
        formula: `a^2 = ${c}^2 - ${b}^2`
      },
      {
        explanation: "Calculate the squares",
        formula: `a^2 = ${c * c} - ${b * b}`
      },
      {
        explanation: "Subtract the values",
        formula: `a^2 = ${c * c - b * b}`
      },
      {
        explanation: isExact ? "Take the square root of both sides" : "Take the square root using a calculator",
        formula: `a = \\sqrt{${c * c - b * b}} = ${a}`
      }
    ] : [
      {
        explanation: "Use Pythagoras' theorem: a² + b² = c²",
        formula: "a^2 + b^2 = c^2"
      },
      {
        explanation: "Rearrange to find the missing side",
        formula: `b^2 = c^2 - a^2`
      },
      {
        explanation: "Substitute the known values",
        formula: `b^2 = ${c}^2 - ${a}^2`
      },
      {
        explanation: "Calculate the squares",
        formula: `b^2 = ${c * c} - ${a * a}`
      },
      {
        explanation: "Subtract the values",
        formula: `b^2 = ${c * c - a * a}`
      },
      {
        explanation: isExact ? "Take the square root of both sides" : "Take the square root using a calculator",
        formula: `b = \\sqrt{${c * c - a * a}} = ${b}`
      }
    ];

    return {
      title: `Finding the ${legToFind === 'base' ? 'Base' : 'Height'}`,
      questionText,
      visualization: createPythagoreanTriangle({
        base: a,
        height: b,
        unknownSide: missingValue,
        ...orientationConfig,
        units,
        sectionType: 'examples'
      }),
      solution
    };
  }

  // Fallback to diagnostic format
  return generateFindMissingSide({ ...options, sectionType: 'diagnostic' });
};

/**
 * Hypotenuse identification question (diagnostic only)
 */
export const generateIdentifyHypotenuse = (options = {}) => {
  const { units = 'cm' } = options;
  
  // Choose a simple Pythagorean triple
  const triple = _.sample(PYTHAGOREAN_TRIPLES.slice(0, 3));
  const [a, b, c] = triple;

  // Randomly decide between numeric or algebraic labels
  const useAlgebraic = Math.random() > 0.5;

  if (useAlgebraic) {
    return {
      questionDisplay: 'Which side is the hypotenuse in this right-angled triangle?',
      correctAnswer: 'c',
      options: ['a', 'b', 'c', 'None of these'].sort(() => Math.random() - 0.5),
      explanation: 'The hypotenuse is the longest side in a right-angled triangle, opposite to the right angle.',
      visualization: createPythagoreanTriangle({
        base: a,
        height: b,
        showRightAngle: true,
        labelStyle: 'algebraic',
        units,
        sectionType: 'diagnostic',
        style: {
          fillColor: '#9b59b6',
          fillOpacity: 0.2
        }
      })
    };
  }

  return {
    questionDisplay: 'Which side is the hypotenuse in this right-angled triangle?',
    correctAnswer: `${c}\\text{ ${units}}`,
    options: [
      `${a}\\text{ ${units}}`,
      `${b}\\text{ ${units}}`,
      `${c}\\text{ ${units}}`,
      'None of these'
    ].sort(() => Math.random() - 0.5),
    explanation: 'The hypotenuse is the longest side in a right-angled triangle, opposite to the right angle.',
    visualization: createPythagoreanTriangle({
      base: a,
      height: b,
      showRightAngle: true,
      labelStyle: 'custom',
      labels: [`${a} ${units}`, `${b} ${units}`, `${c} ${units}`],
      units,
      sectionType: 'diagnostic',
      style: {
        fillColor: '#9b59b6',
        fillOpacity: 0.2
      }
    })
  };
};

// Export unified generators
export const pythagorasGenerators = {
  // New unified functions
  generateFindHypotenuse,
  generateFindMissingSide,
  generateIdentifyHypotenuse,

  // Legacy aliases for backward compatibility (temporary)
  findHypotenuse: (options) => generateFindHypotenuse(options),
  findMissingSide: (options) => generateFindMissingSide(options),
  identifyHypotenuse: (options) => generateIdentifyHypotenuse(options),

  // Coordinate challenge for challenge section
  generateCoordinateChallenge: () => {
    // Generate points until we get a non-horizontal, non-vertical line
    let point1, point2, dx, dy;

    do {
      point1 = [_.random(-4, 4), _.random(-4, 4)];
      point2 = [_.random(-4, 4), _.random(-4, 4)];
      dx = point2[0] - point1[0];
      dy = point2[1] - point1[1];
    } while (dx === 0 || dy === 0);

    const exactDistance = Math.sqrt(dx * dx + dy * dy);
    const distance = Math.round(exactDistance * 100) / 100;

    const visualizationConfig = {
      points: [point1, point2],
      pointLabels: ['A', 'B'],
      segments: [[0, 1]],
      style: {
        pointColors: ['#e74c3c', '#3498db'],
        segmentColors: ['#9b59b6'],
      }
    };

    const solution = [
      {
        explanation: "To find the distance between two points, we use the distance formula, which is derived from the Pythagorean theorem.",
        formula: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}"
      },
      {
        explanation: "Substitute the coordinates of points A and B:",
        formula: `d = \\sqrt{(${point2[0]} - ${point1[0]})^2 + (${point2[1]} - ${point1[1]})^2}`
      },
      {
        explanation: "Calculate the differences:",
        formula: `d = \\sqrt{(${dx})^2 + (${dy})^2}`
      },
      {
        explanation: "Square the differences:",
        formula: `d = \\sqrt{${dx * dx} + ${dy * dy}}`
      },
      {
        explanation: "Add the squares:",
        formula: `d = \\sqrt{${dx * dx + dy * dy}}`
      },
      {
        explanation: "Take the square root to find the distance:",
        formula: `d = ${distance}`
      }
    ];

    return {
      title: "Finding Distance in the Coordinate Plane",
      questionText: `Find the distance between the points A(${point1[0]}, ${point1[1]}) and B(${point2[0]}, ${point2[1]}) on the coordinate plane.`,
      visualizationConfig,
      solution,
      dx,
      dy,
      distance
    };
  }
};

export default pythagorasGenerators;