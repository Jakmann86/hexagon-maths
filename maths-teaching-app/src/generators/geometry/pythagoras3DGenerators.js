// src/generators/geometry/pythagoras3DGenerators.js
// Generators for 3D Pythagoras questions (cuboid diagonals)
// Following Pattern 2: Returns config objects, not React components

import { cuboidCalculations } from '../../factories/shapes/cuboidFactory';

/**
 * Generate a 3D Pythagoras question - find base diagonal or space diagonal
 * Returns visualization config for Cuboid3D component
 */
export const generateFind3DDiagonal = (options = {}) => {
  const {
    sectionType = 'starter',
    difficulty = 'easy',
    diagonalType = null, // 'base', 'space', or null for random
    showTriangleHint = true // Set to false for harder questions without visual hint
  } = options;

  // Generate nice dimensions based on difficulty
  const dimensionRanges = {
    easy: { min: 3, max: 6 },
    medium: { min: 4, max: 8 },
    hard: { min: 5, max: 12 }
  };
  
  const range = dimensionRanges[difficulty] || dimensionRanges.easy;
  
  const width = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const depth = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const height = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  // Decide which diagonal to find
  const findBase = diagonalType === 'base' || (diagonalType === null && Math.random() > 0.5);
  
  // Calculate answers
  const baseDiagonal = cuboidCalculations.baseDiagonal(width, depth);
  const spaceDiagonal = cuboidCalculations.spaceDiagonal(width, depth, height);

  if (findBase) {
    // Find base diagonal (simpler - just width and depth)
    return {
      type: '3d-pythagoras-base',
      questionText: `Find the length of diagonal AC across the base of this cuboid.`,
      question: `Find the length of diagonal AC across the base of this cuboid.`,
      answer: `${Math.round(baseDiagonal * 100) / 100} cm`,
      answerValue: Math.round(baseDiagonal * 100) / 100,
      workingOut: [
        `Using Pythagoras on the base rectangle:`,
        `AC² = ${width}² + ${depth}²`,
        `AC² = ${width * width} + ${depth * depth}`,
        `AC² = ${width * width + depth * depth}`,
        `AC = √${width * width + depth * depth}`,
        `AC = ${Math.round(baseDiagonal * 100) / 100} cm`
      ],
      visualization: {
        width,
        depth,
        height,
        units: 'cm',
        showTriangles: {
          baseDiagonal: showTriangleHint,
          spaceDiagonal: false  // Only show base triangle
        },
        showLabels: {
          dimensions: true,
          baseDiagonal: false, // Don't show answer!
          spaceDiagonal: false,
          vertices: true,
          faces: false
        },
        vertexLabels: {
          show: true,
          labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        },
        highlightEdges: {},
        highlightFaces: {}
      },
      metadata: {
        topic: '3d-pythagoras',
        skill: 'base-diagonal',
        difficulty,
        dimensions: { width, depth, height }
      }
    };
  } else {
    // Find space diagonal (harder - needs two steps or direct formula)
    return {
      type: '3d-pythagoras-space',
      questionText: `Find the length of the space diagonal AG in this cuboid.`,
      question: `Find the length of the space diagonal AG in this cuboid.`,
      answer: `${Math.round(spaceDiagonal * 100) / 100} cm`,
      answerValue: Math.round(spaceDiagonal * 100) / 100,
      workingOut: [
        `Step 1: Find base diagonal AC`,
        `AC² = ${width}² + ${depth}² = ${width * width + depth * depth}`,
        `AC = √${width * width + depth * depth} = ${Math.round(baseDiagonal * 100) / 100} cm`,
        ``,
        `Step 2: Find space diagonal AG`,
        `AG² = AC² + ${height}²`,
        `AG² = ${Math.round(baseDiagonal * baseDiagonal * 100) / 100} + ${height * height}`,
        `AG² = ${Math.round((baseDiagonal * baseDiagonal + height * height) * 100) / 100}`,
        `AG = √${Math.round((baseDiagonal * baseDiagonal + height * height) * 100) / 100}`,
        `AG = ${Math.round(spaceDiagonal * 100) / 100} cm`,
        ``,
        `Or directly: AG = √(${width}² + ${depth}² + ${height}²) = √${width*width + depth*depth + height*height} = ${Math.round(spaceDiagonal * 100) / 100} cm`
      ],
      visualization: {
        width,
        depth,
        height,
        units: 'cm',
        showTriangles: {
          baseDiagonal: false,  // Only show space diagonal triangle
          spaceDiagonal: showTriangleHint
        },
        showLabels: {
          dimensions: true,
          baseDiagonal: false, // Don't show answer!
          spaceDiagonal: false, // Don't show answer!
          vertices: true,
          faces: false
        },
        vertexLabels: {
          show: true,
          labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        },
        highlightEdges: {},
        highlightFaces: {}
      },
      metadata: {
        topic: '3d-pythagoras',
        skill: 'space-diagonal',
        difficulty,
        dimensions: { width, depth, height }
      }
    };
  }
};

/**
 * Generate a question to find a missing dimension given diagonal
 * More challenging - working backwards
 */
export const generateFindMissingDimension = (options = {}) => {
  const {
    sectionType = 'examples',
    difficulty = 'medium'
  } = options;

  // Start with known dimensions and calculate diagonal
  const width = Math.floor(Math.random() * 4) + 3; // 3-6
  const depth = Math.floor(Math.random() * 4) + 3; // 3-6
  const height = Math.floor(Math.random() * 4) + 4; // 4-7

  // Decide which dimension to hide
  const hiddenDim = ['width', 'depth', 'height'][Math.floor(Math.random() * 3)];
  
  const baseDiagonal = cuboidCalculations.baseDiagonal(width, depth);
  const spaceDiagonal = cuboidCalculations.spaceDiagonal(width, depth, height);

  // Create dimension labels with one hidden
  const dimLabels = {
    width: hiddenDim === 'width' ? 'x' : `${width}`,
    depth: hiddenDim === 'depth' ? 'x' : `${depth}`,
    height: hiddenDim === 'height' ? 'x' : `${height}`
  };

  const hiddenValue = { width, depth, height }[hiddenDim];

  return {
    type: '3d-pythagoras-reverse',
    questionText: `The space diagonal AG = ${Math.round(spaceDiagonal * 100) / 100} cm. Find the value of x.`,
    question: `The space diagonal AG = ${Math.round(spaceDiagonal * 100) / 100} cm. Find x.`,
    answer: `x = ${hiddenValue} cm`,
    answerValue: hiddenValue,
    visualization: {
      width,
      depth,
      height,
      units: 'cm',
      showTriangles: {
        baseDiagonal: false,
        spaceDiagonal: true
      },
      showLabels: {
        dimensions: true,
        baseDiagonal: false,
        spaceDiagonal: true, // Show the diagonal value (it's given)
        vertices: true,
        faces: false
      },
      edgeLabels: {
        width: `${dimLabels.width} cm`,
        depth: `${dimLabels.depth} cm`,
        height: `${dimLabels.height} cm`
      },
      vertexLabels: {
        show: true,
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }
    },
    metadata: {
      topic: '3d-pythagoras',
      skill: 'reverse-diagonal',
      difficulty,
      hiddenDimension: hiddenDim,
      dimensions: { width, depth, height }
    }
  };
};

/**
 * Generate a simple cuboid identification question for diagnostics
 * Identify edges, faces, or vertices
 */
export const generateCuboidIdentification = (options = {}) => {
  const {
    sectionType = 'diagnostic',
    questionType = null // 'edge', 'face', 'vertex', or null for random
  } = options;

  const width = 4;
  const depth = 3;
  const height = 5;

  const qType = questionType || ['edge', 'face', 'vertex'][Math.floor(Math.random() * 3)];

  const questions = {
    edge: [
      { q: 'Which edge is parallel to AB?', a: 'DC, EF, or HG' },
      { q: 'Which edge is parallel to AE?', a: 'BF, CG, or DH' },
      { q: 'How many edges does a cuboid have?', a: '12' },
      { q: 'Name an edge perpendicular to AB.', a: 'AE, BF, AD, or BC' }
    ],
    face: [
      { q: 'Which face is parallel to ABFE?', a: 'DCGH' },
      { q: 'Which face is parallel to ABCD?', a: 'EFGH' },
      { q: 'How many faces does a cuboid have?', a: '6' },
      { q: 'Name the face opposite to ADHE.', a: 'BCGF' }
    ],
    vertex: [
      { q: 'Which vertex is diagonally opposite to A?', a: 'G' },
      { q: 'Which vertex is diagonally opposite to B?', a: 'H' },
      { q: 'How many vertices does a cuboid have?', a: '8' },
      { q: 'Which vertex is directly above C?', a: 'G' }
    ]
  };

  const selected = questions[qType][Math.floor(Math.random() * questions[qType].length)];

  return {
    type: 'cuboid-identification',
    questionText: selected.q,
    question: selected.q,
    answer: selected.a,
    visualization: {
      width,
      depth,
      height,
      units: 'cm',
      showTriangles: {
        baseDiagonal: false,
        spaceDiagonal: false
      },
      showLabels: {
        dimensions: false,
        vertices: true,
        faces: false
      },
      vertexLabels: {
        show: true,
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }
    },
    metadata: {
      topic: '3d-shapes',
      skill: `identify-${qType}`,
      questionType: qType
    }
  };
};

// Export all generators
export const pythagoras3DGenerators = {
  generateFind3DDiagonal,
  generateFindMissingDimension,
  generateCuboidIdentification
};

export default pythagoras3DGenerators;