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

    // Use predefined triangles with integer leg lengths
    const triangleSets = [
      { base: 6, height: 4, leg: 5 },     // 3-4-5 triangle folded
      { base: 8, height: 6, leg: 7 },     // Clean integer values
      { base: 10, height: 8, leg: 9 },    // Clean integer values
      { base: 12, height: 5, leg: 13 }    // 5-12-13 Pythagorean triple
    ];

    // Select one of the predefined sets based on seed
    const setIndex = seed % triangleSets.length;
    const selectedSet = triangleSets[setIndex];

    // Extract values from the selected set
    const base = selectedSet.base;
    const height = selectedSet.height;
    const leg = selectedSet.leg;  // Already an integer, no need to round

    // Calculate other values needed for solution
    const halfBase = base / 2;
    const area = (base * height) / 2;

    // Create solution steps with steps to find height using Pythagoras
    const solution = [
      {
        explanation: "For an isosceles triangle, we need to find the height first using Pythagoras' theorem",
        formula: "\\text{leg}^2 = \\text{height}^2 + (\\frac{\\text{base}}{2})^2"
      },
      {
        explanation: "Substitute the known values",
        formula: `${leg}^2 = \\text{height}^2 + (\\frac{${base}}{2})^2`
      },
      {
        explanation: "Calculate the squared terms",
        formula: `${leg * leg} = \\text{height}^2 + ${halfBase * halfBase}`
      },
      {
        explanation: "Rearrange to find height²",
        formula: `\\text{height}^2 = ${leg * leg} - ${halfBase * halfBase}`
      },
      {
        explanation: "Calculate height",
        formula: `\\text{height} = \\sqrt{${leg * leg - halfBase * halfBase}} = ${height}\\text{ cm}`
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
        formula: `\\text{Area} = \\frac{${base * height}}{2} = ${area}\\text{ cm}^2`
      }
    ];

    // Create an isosceles triangle with proper dimensions
    let triangleVisualization;

    try {
      // Create with explicit properties to avoid factory overrides
      triangleVisualization = createIsoscelesTriangle({
        base,
        height,
        showArea: false,
        showHeight: false,
        showEqualSides: true,
        units: 'cm',
        sectionType,
        // Use custom labels with exact integer values 
        labelStyle: "custom",
        labels: [`${base} cm`, `${leg} cm`, `${leg} cm`],
        // Add style with label offset multiplier for better spacing
        style: {
          labelOffsetMultiplier: 2.0 // Increase offset to move labels away from sides
        }
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
      questionText: `Find the area of this isosceles triangle with base ${base} cm and equal sides of length ${leg} cm. (First find the height using Pythagoras' theorem, then calculate the area.)`,
      visualization: triangleVisualization,
      solution
    };
  }
};

export default PythagorasGenerators;