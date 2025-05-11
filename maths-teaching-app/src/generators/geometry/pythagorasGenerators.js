// src/generators/geometry/pythagorasGenerators.js
import React from 'react';
import _ from 'lodash';
import { 
  createPythagoreanTriangle, 
  createPythagoreanTripleTriangle, 
  createIsoscelesTriangle,  // Import directly
  PYTHAGOREAN_TRIPLES 
} from '../../factories/triangleFactories';

/**
 * PythagorasGenerators - Specialized question generators for Pythagoras' theorem
 * Provides different types of questions with appropriate visualizations and solutions
 */
export const PythagorasGenerators = {
  /**
   * Generate a question asking for the hypotenuse
   * 
   * @param {Object} options - Configuration options
   * @returns {Object} Question object with visualization and solution
   */
  findHypotenuse: (options = {}) => {
    const {
      difficulty = 'medium',
      sectionType = 'examples',
      seed = Date.now()
    } = options;

    console.log(`Generating findHypotenuse example with seed: ${seed}`);

    // Choose appropriate triples based on difficulty
    let triples = [...PYTHAGOREAN_TRIPLES];
    if (difficulty === 'easy') {
      triples = triples.slice(0, 2); // Easier triples (3,4,5 and 5,12,13)
    } else if (difficulty === 'hard') {
      triples = triples.slice(3); // Harder triples
    }

    // Use the seed to deterministically select a triple
    const tripleIndex = Math.floor((seed % 100) / 12.5) % triples.length;
    console.log(`Selected triple index ${tripleIndex}`);
    const triple = triples[tripleIndex];
    const [a, b, c] = triple;

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

    // Select a deterministic orientation
    const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
    const orientationIndex = Math.floor((seed % 1000) / 250) % orientations.length;
    const orientation = orientations[orientationIndex];

    return {
      title: "Finding the Hypotenuse",
      questionText: `Find the length of the hypotenuse in this right-angled triangle with base ${a} cm and height ${b} cm.`,
      visualization: createPythagoreanTripleTriangle({
        triple,
        unknownSide: 'hypotenuse',
        orientation,
        units: 'cm',
        sectionType
      }),
      solution
    };
  },

  /**
   * Generate a question asking for a missing side (leg)
   * 
   * @param {Object} options - Configuration options
   * @returns {Object} Question object with visualization and solution
   */
  findMissingSide: (options = {}) => {
    const {
      difficulty = 'medium',
      sectionType = 'examples',
      seed = Date.now()
    } = options;

    console.log(`Generating findMissingSide example with seed: ${seed}`);

    // Choose appropriate triples based on difficulty
    let triples = [...PYTHAGOREAN_TRIPLES];
    if (difficulty === 'easy') {
      triples = triples.slice(0, 2); // Easier triples (3,4,5 and 5,12,13)
    } else if (difficulty === 'hard') {
      triples = triples.slice(3); // Harder triples
    }

    // Use a deterministic approach to select the triple
    const tripleIndex = Math.floor((seed % 100) / 12.5) % triples.length;
    console.log(`Selected triple index ${tripleIndex}`);
    const triple = triples[tripleIndex];
    const [a, b, c] = triple;

    // Deterministically choose which leg to find based on the seed
    const legToFind = (seed % 2 === 0) ? 'base' : 'height';
    const missingValue = legToFind;
    const correctAnswer = legToFind === 'base' ? a : b;

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
    let questionText;
    if (legToFind === 'base') {
      questionText = `Find the length of the base in this right-angled triangle with hypotenuse ${c} cm and height ${b} cm.`;
    } else {
      questionText = `Find the length of the height in this right-angled triangle with hypotenuse ${c} cm and base ${a} cm.`;
    }

    // Select a deterministic orientation
    const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
    const orientationIndex = Math.floor((seed % 1000) / 250) % orientations.length;
    const orientation = orientations[orientationIndex];

    return {
      title: `Finding the ${legToFind === 'base' ? 'Base' : 'Height'}`,
      questionText: questionText,
      visualization: createPythagoreanTripleTriangle({
        triple,
        unknownSide: missingValue,
        orientation,
        units: 'cm',
        sectionType
      }),
      solution
    };
  },

  /**
   * Generate a question about finding the area of an isosceles triangle
   * 
   * @param {Object} options - Configuration options
   * @returns {Object} Question object with visualization and solution
   */
  isoscelesArea: (options = {}) => {
    const {
      difficulty = 'medium',
      sectionType = 'examples',
      seed = Date.now()
    } = options;

    console.log(`Generating isosceles triangle area example with seed: ${seed}`);

    // Generate dimensions based on difficulty and seed
    let base, height;
    if (difficulty === 'easy') {
      base = 4 + (seed % 4); // 4-7
      height = 3 + (seed % 3); // 3-5
    } else if (difficulty === 'medium') {
      base = 6 + (seed % 4); // 6-9
      height = 5 + (seed % 3); // 5-7
    } else {
      base = 8 + (seed % 6); // 8-13
      height = 6 + (seed % 6); // 6-11
    }

    // Calculate area
    const area = (base * height) / 2;

    // Create solution steps
    const solution = [
      {
        explanation: "Use the formula for the area of a triangle",
        formula: "\\text{Area} = \\frac{1}{2} × \\text{base} × \\text{height}"
      },
      {
        explanation: "Substitute the known values",
        formula: `\\text{Area} = \\frac{1}{2} × ${base} × ${height}`
      },
      {
        explanation: "Calculate the result",
        formula: `\\text{Area} = \\frac{${base * height}}{2} = ${area}\\text{ cm}^2`
      }
    ];

    // Calculate the equal legs of the isosceles triangle
    const halfBase = base / 2;
    const legLength = Math.sqrt(halfBase * halfBase + height * height);
    const roundedLegLength = Math.round(legLength * 100) / 100;

    // Create an isosceles triangle with proper dimensions
    // Note: We're using both createIsoscelesTriangle and createPythagoreanTriangle based on availability
    let triangleVisualization;
    
    try {
      // First, try to use createIsoscelesTriangle if it exists
      triangleVisualization = createIsoscelesTriangle({
        base,
        height,
        showArea: false,
        showHeight: true,
        showEqualSides: true,
        units: 'cm',
        sectionType,
        // Custom labels with proper measurements
        labelStyle: "custom",
        labels: [`${base} cm`, `${roundedLegLength} cm`, `${roundedLegLength} cm`]
      });
      console.log("Created isosceles triangle visualization");
    } catch (error) {
      console.warn("Could not create isosceles triangle, falling back to right triangle:", error);
      // Fallback to regular triangle without right angle marking
      triangleVisualization = createPythagoreanTriangle({
        base,
        height,
        showRightAngle: false, // Don't show right angle
        labelStyle: "custom",
        labels: [`${base} cm`, `${height} cm`, null],
        units: 'cm',
        sectionType
      });
    }

    return {
      title: "Finding the Area of an Isosceles Triangle",
      questionText: `Find the area of this isosceles triangle with base ${base} cm and height ${height} cm.`,
      visualization: triangleVisualization,
      solution
    };
  }
};

export default PythagorasGenerators;