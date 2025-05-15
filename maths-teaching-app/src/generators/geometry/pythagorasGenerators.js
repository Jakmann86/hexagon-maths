// src/generators/geometry/pythagorasGenerators.js
import React from 'react';
import _ from 'lodash';
import {
  createPythagoreanTriangle,
  createPythagoreanTripleTriangle,
  createIsoscelesTriangle,
  PYTHAGOREAN_TRIPLES
} from '../../factories/triangleFactories';
import { STANDARD_SHAPES } from '../../config/standardShapes';

/**
 * PythagorasGenerators - Specialized question generators for Pythagoras' theorem
 * Updated to provide consistent sizing and accurate labels
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

    // Pre-calculated triangles with integer-valued legs
    const triangleConfigs = [
      { base: 8, height: 6, leg: 10 },    // 8-6-10 triangle 
      { base: 6, height: 8, leg: 10 },    // 6-8-10 triangle
      { base: 12, height: 5, leg: 13 },   // 12-5-13 triangle
      { base: 10, height: 12, leg: 16 },  // 10-12-16 triangle
    ];

    // Select variation based on seed
    const variationIndex = Math.floor((seed % 100) / 25) % triangleConfigs.length;
    const config = triangleConfigs[variationIndex];

    // Use the pre-calculated values instead of computing them
    const base = config.base;
    const height = config.height;
    const integerLegLength = config.leg;  // Using a different variable name

    console.log(`Selected integer triangle: base=${base}, height=${height}, leg=${integerLegLength}`);

    // Calculate area
    const area = (base * height) / 2;
    const roundedArea = Math.round(area * 100) / 100;

    // Create solution steps with steps to find height using Pythagoras
    const solution = [
      {
        explanation: "For an isosceles triangle, we need to find the height using Pythagoras' theorem",
        formula: "\\text{leg}^2 = \\text{height}^2 + (\\frac{\\text{base}}{2})^2",
        toggleHeight: true
      },
      {
        explanation: "Substitute the known values",
        formula: `${integerLegLength}^2 = \\text{height}^2 + (\\frac{${base}}{2})^2`
      },
      {
        explanation: "Calculate the squared terms",
        formula: `${integerLegLength * integerLegLength} = \\text{height}^2 + ${(base / 2) * (base / 2)}`
      },
      {
        explanation: "Rearrange to find height²",
        formula: `\\text{height}^2 = ${integerLegLength * integerLegLength} - ${(base / 2) * (base / 2)} = ${height * height}`
      },
      {
        explanation: "Calculate height",
        formula: `\\text{height} = \\sqrt{${height * height}} = ${height}\\text{ cm}`
      },
      {
        explanation: "Now we can find the area using the formula",
        formula: "\\text{Area} = \\frac{1}{2} × \\text{base} × \\text{height}"
      },
      {
        explanation: "Substitute the values",
        formula: `\\text{Area} = \\frac{1}{2} × ${base} × ${height}`
      },
      {
        explanation: "Calculate the result",
        formula: `\\text{Area} = \\frac{${base * height}}{2} = ${roundedArea}\\text{ cm}^2`
      }
    ];

    // Create custom labels with exact integer leg length
    const customLabels = [`${base} cm`, `${integerLegLength} cm`, `${integerLegLength} cm`];

    // Create isosceles triangle with the integer-sided configuration
    const triangleVisualization = createIsoscelesTriangle({
      base: base,
      height: height,
      showArea: false,
      showHeight: false,
      showEqualSides: true,
      orientation: 'default',
      units: 'cm',
      sectionType,
      labelStyle: "custom",
      labels: customLabels
    });

    return {
      title: "Finding the Area of an Isosceles Triangle",
      questionText: `Find the area of this isosceles triangle with base ${base} cm and equal sides of length ${integerLegLength} cm. (First find the height using Pythagoras' theorem, then calculate the area.)`,
      visualization: createIsoscelesTriangle({
        base: base,                 // Pass the generated base dimension
        height: height,             // Pass the generated height dimension
        labelStyle: "custom",       // Use custom labels
        labels: [                   // Explicitly provide the labels
          `${base} cm`,
          `${integerLegLength} cm`,
          `${integerLegLength} cm`
        ],
        showArea: false,
        showHeight: false,
        showEqualSides: true,
        units: 'cm',
        sectionType
      }),
      solution
    };
  }
};

export default PythagorasGenerators;