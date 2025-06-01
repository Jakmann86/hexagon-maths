// src/generators/geometry/pythagorasGenerators.js
import _ from 'lodash';
import { PYTHAGOREAN_TRIPLES, createPythagoreanTriangle, createIsoscelesTriangle } from '../../factories/triangleFactory';

/**
 * Generate a question asking for the hypotenuse
 */
const findHypotenuse = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose appropriate triples based on difficulty
  let triples = [...PYTHAGOREAN_TRIPLES];
  if (difficulty === 'easy') {
    triples = triples.slice(0, 2); // Easier triples (3,4,5 and 5,12,13)
  } else if (difficulty === 'hard') {
    triples = triples.slice(3); // Harder triples
  }

  // Deterministically select triple based on seed
  const tripleIndex = Math.floor((seed % 100) / 12.5) % triples.length;
  const triple = triples[tripleIndex];
  const [a, b, c] = triple;

  // Generate orientation variety for all sections EXCEPT starter
  let orientationConfig = {};
  if (sectionType !== 'starter') {
    const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
    const orientationIndex = Math.floor((seed % 1000) / 250) % orientations.length;
    orientationConfig.orientation = orientations[orientationIndex];
  }
  // For starter section, don't set orientation (will use default)

  // Create solution steps
  const solution = [
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
  ];

  return {
    title: "Finding the Hypotenuse",
    questionText: `Find the length of the hypotenuse in this right-angled triangle with base ${a} cm and height ${b} cm.`,
    visualization: createPythagoreanTriangle({
      base: a,
      height: b,
      unknownSide: 'hypotenuse',
      ...orientationConfig, // Only includes orientation for non-starter sections
      units: 'cm',
      sectionType
    }),
    solution
  };
};

/**
 * Generate a question asking for a missing side (leg)
 */
const findMissingSide = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose appropriate triples based on difficulty
  let triples = [...PYTHAGOREAN_TRIPLES];
  if (difficulty === 'easy') {
    triples = triples.slice(0, 2); // Easier triples (3,4,5 and 5,12,13)
  } else if (difficulty === 'hard') {
    triples = triples.slice(3); // Harder triples
  }

  // Deterministically select triple based on seed
  const tripleIndex = Math.floor((seed % 100) / 12.5) % triples.length;
  const triple = triples[tripleIndex];
  const [a, b, c] = triple;

  // Generate orientation variety for all sections EXCEPT starter
  let orientationConfig = {};
  if (sectionType !== 'starter') {
    const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
    const orientationIndex = Math.floor((seed % 1000) / 250) % orientations.length;
    orientationConfig.orientation = orientations[orientationIndex];
  }
  // For starter section, don't set orientation (will use default)

  // Deterministically choose which leg to find based on the seed
  const legToFind = (seed % 2 === 0) ? 'base' : 'height';
  const missingValue = legToFind;

  // Create solution steps for finding a leg
  const solution = [
    {
      explanation: "Use Pythagoras' theorem: a² + b² = c²",
      formula: "a^2 + b^2 = c^2"
    },
    {
      explanation: "Rearrange to find the missing side",
      formula: legToFind === 'base'
        ? `a^2 = c^2 - b^2`
        : `b^2 = c^2 - a^2`
    },
    {
      explanation: "Substitute the known values",
      formula: legToFind === 'base'
        ? `a^2 = ${c}^2 - ${b}^2`
        : `b^2 = ${c}^2 - ${a}^2`
    },
    {
      explanation: "Calculate the squares",
      formula: legToFind === 'base'
        ? `a^2 = ${c * c} - ${b * b}`
        : `b^2 = ${c * c} - ${a * a}`
    },
    {
      explanation: "Subtract the values",
      formula: legToFind === 'base'
        ? `a^2 = ${c * c - b * b}`
        : `b^2 = ${c * c - a * a}`
    },
    {
      explanation: "Take the square root of both sides",
      formula: legToFind === 'base'
        ? `a = \\sqrt{${c * c - b * b}} = ${a}`
        : `b = \\sqrt{${c * c - a * a}} = ${b}`
    }
  ];

  // Create question text with known side values
  const questionText = legToFind === 'base'
    ? `Find the length of the base in this right-angled triangle with hypotenuse ${c} cm and height ${b} cm.`
    : `Find the length of the height in this right-angled triangle with hypotenuse ${c} cm and base ${a} cm.`;

  return {
    title: `Finding the ${legToFind === 'base' ? 'Base' : 'Height'}`,
    questionText,
    visualization: createPythagoreanTriangle({
      base: a,
      height: b,
      unknownSide: missingValue,
      ...orientationConfig, // Only includes orientation for non-starter sections
      units: 'cm',
      sectionType
    }),
    solution
  };
};

/**
 * Generate a question about finding the area of an isosceles triangle
 * using Pythagoras' theorem to find the height first
 */
const isoscelesArea = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Pre-calculated triangles with integer-valued legs for clean results
  const triangleConfigs = [
    { base: 8, legLength: 5 },    // 8-base with 5-unit legs
    { base: 6, legLength: 5 },    // 6-base with 5-unit legs
    { base: 10, legLength: 6 },   // 10-base with 6-unit legs
    { base: 12, legLength: 8 }    // 12-base with 8-unit legs
  ];

  // Select variation based on seed or randomly
  const variationIndex = seed ? Math.floor((seed % 100) / 25) % triangleConfigs.length : _.random(0, triangleConfigs.length - 1);
  const config = triangleConfigs[variationIndex];

  // Extract values
  const { base, legLength } = config;

  // Calculate height using Pythagoras' theorem
  const halfBase = base / 2;
  const height = Math.sqrt(legLength * legLength - halfBase * halfBase);
  const roundedHeight = Math.round(height * 100) / 100;

  // Calculate area
  const area = (base * roundedHeight) / 2;
  const roundedArea = Math.round(area * 100) / 100;

  // Create the solution steps
  const solution = [
    {
      explanation: "In an isosceles triangle, the height to the base creates a right-angled triangle",
      formula: "\\text{We have an isosceles triangle with base } = " + base + "\\text{ cm and equal sides } = " + legLength + "\\text{ cm}"
    },
    {
      explanation: "To find the height, we can use Pythagoras' theorem on the right-angled triangle formed",
      formula: "\\text{leg}^2 = \\text{height}^2 + (\\frac{\\text{base}}{2})^2",
      toggleHeight: true
    },
    {
      explanation: "Substitute the known values",
      formula: `${legLength}^2 = \\text{height}^2 + (\\frac{${base}}{2})^2`
    },
    {
      explanation: "Calculate the squared terms",
      formula: `${legLength * legLength} = \\text{height}^2 + ${(halfBase * halfBase)}`
    },
    {
      explanation: "Rearrange to find height²",
      formula: `\\text{height}^2 = ${legLength * legLength} - ${halfBase * halfBase} = ${height * height}`
    },
    {
      explanation: "Calculate height",
      formula: `\\text{height} = \\sqrt{${height * height}} = ${roundedHeight}\\text{ cm}`
    },
    {
      explanation: "Now we can find the area using the formula",
      formula: "\\text{Area} = \\frac{1}{2} × \\text{base} × \\text{height}"
    },
    {
      explanation: "Substitute the values",
      formula: `\\text{Area} = \\frac{1}{2} × ${base} × ${roundedHeight}`
    },
    {
      explanation: "Calculate the result",
      formula: `\\text{Area} = \\frac{${base * roundedHeight}}{2} = ${roundedArea}\\text{ cm}^2`
    }
  ];

  // Create custom labels for the sides
  const customLabels = [`${base} cm`, `${legLength} cm`, `${legLength} cm`];

  // Return the complete question object
  return {
    title: "Finding the Area of an Isosceles Triangle",
    questionText: `Find the area of this isosceles triangle with base ${base} cm and equal sides of length ${legLength} cm. (First find the height using Pythagoras' theorem, then calculate the area.)`,
    visualization: {
      base,
      height: roundedHeight,
      labelStyle: "custom",
      labels: customLabels,
      showEqualSides: true,
      showHeight: false,
      units: 'cm',
      sectionType
      // Note: isosceles triangles don't use orientation in the same way
    },
    solution
  };
};

/**
 * Generate a coordinate distance problem for the challenge section
 */
const generateCoordinateChallenge = () => {
  // Generate points until we get a non-horizontal, non-vertical line
  let point1, point2, dx, dy;

  do {
    point1 = [_.random(-4, 4), _.random(-4, 4)];
    point2 = [_.random(-4, 4), _.random(-4, 4)];

    // Calculate differences
    dx = point2[0] - point1[0];
    dy = point2[1] - point1[1];

    // Repeat if points create a horizontal or vertical line (dx or dy is 0)
  } while (dx === 0 || dy === 0);

  // Calculate the distance
  const exactDistance = Math.sqrt(dx * dx + dy * dy);
  const distance = Math.round(exactDistance * 100) / 100;

  // Create the visualization config
  const visualizationConfig = {
    points: [point1, point2],
    pointLabels: ['A', 'B'],
    segments: [[0, 1]],
    style: {
      pointColors: ['#e74c3c', '#3498db'], // Red for A, Blue for B
      segmentColors: ['#9b59b6'],          // Purple for line
    }
  };

  // Create solution steps
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
};

// Export all functions as part of the PythagorasGenerators object
const PythagorasGenerators = {
  findHypotenuse,
  findMissingSide,
  isoscelesArea,
  generateCoordinateChallenge,

  // ADD THIS NEW FUNCTION HERE:
  identifyHypotenuse: ({ units = 'cm' } = {}) => {
    // Choose a simple Pythagorean triple
    const triple = _.sample(PYTHAGOREAN_TRIPLES.slice(0, 3));
    const [a, b, c] = triple;

    // Randomly decide between numeric or algebraic labels
    const useAlgebraic = Math.random() > 0.5;

    if (useAlgebraic) {
      return {
        questionDisplay: 'Which side is the hypotenuse in this right-angled triangle?',
        correctAnswer: 'c',
        options: [
          'a',     // Side A
          'b',     // Side B  
          'c',     // Side C (correct - hypotenuse)
          { content: 'None of these', type: 'text' }
        ].sort(() => Math.random() - 0.5),
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
      // FIXED: Use LaTeX formatting for unit answers
      correctAnswer: `${c}\\text{ ${units}}`,
      options: [
        `${a}\\text{ ${units}}`,  // FIXED: Proper LaTeX formatting
        `${b}\\text{ ${units}}`,  // FIXED: Proper LaTeX formatting
        `${c}\\text{ ${units}}`,  // FIXED: Proper LaTeX formatting
        { content: 'None of these', type: 'text' }           // This stays as plain text
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
  },

  generateChallengeQuestions: () => {
    return [
      generateCoordinateChallenge(),
      // You could add more challenge types here in the future
    ];
  },

  // Generate example questions for the examples section
  generateExampleQuestions: () => {
    // This is a helper method that creates all three example types
    const seed = Date.now();

    return [
      findHypotenuse({ seed }),
      findMissingSide({ seed: seed + 1000 }),
      isoscelesArea({ seed: seed + 2000 })
    ];
  }
};

export default PythagorasGenerators;