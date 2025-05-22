// src/generators/geometry/triangleGenerators.js
import _ from 'lodash';
import { createPythagoreanTriangle } from '../../factories/triangleFactory';

/**
 * Generate a triangle area question
 * Used primarily for starter questions
 */
export const triangleArea = ({ units = 'cm', sectionContext = {} } = {}) => {
  // Extract section type from context, default to 'starter' if not provided
  const { sectionType = 'starter' } = sectionContext;

  // Generate reasonable dimensions for a triangle
  const base = _.random(4, 10);
  const height = _.random(3, 8);
  const area = (base * height) / 2;

  return {
    question: `Calculate the area of this triangle with base ${base} ${units} and height ${height} ${units}.`,
    answer: `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height} = ${area}\\text{ ${units}}^2`,
    visualization: createPythagoreanTriangle({
      base,
      height,
      showRightAngle: true,
      labelStyle: "custom",
      labels: [`${base} ${units}`, `${height} ${units}`, null],
      units,
      sectionType, // Pass the section type from context
      style: {
        fillColor: '#2ecc71',
        fillOpacity: 0.2
      }
    })
  };
};

/**
 * Generate a question about finding a triangle's height from its area
 * Used primarily for diagnostic questions
 */
export const triangleLengthFromArea = ({ units = 'cm' } = {}) => {
  // Generate a triangle with integer values for clean results
  const base = _.random(4, 12);
  // Create an area that's divisible by the base for clean height values
  const factor = _.random(1, 5);
  const area = base * factor;
  const height = (area * 2) / base;

  return {
    questionDisplay: `A triangle has a base of ${base} ${units} and an area of ${area} ${units}². Find its height.`,
    correctAnswer: `${height}\\text{ ${units}}`,
    options: [
      `${height}\\text{ ${units}}`,
      `${height + 1}\\text{ ${units}}`,
      `${height - 1}\\text{ ${units}}`,
      `${area / base}\\text{ ${units}}`  // Common mistake: forgetting the factor of 2
    ].sort(() => Math.random() - 0.5),
    explanation: `Height = \\frac{2 \\times \\text{Area}}{\\text{base}} = \\frac{2 \\times ${area}}{${base}} = ${height} ${units}`,
    visualization: createPythagoreanTriangle({
      base,
      height,
      unknownSide: 'height',
      units,
      sectionType: 'diagnostic',
      style: {
        fillColor: '#2ecc71',
        fillOpacity: 0.2
      }
    })
  };
};

/**
 * Solution steps generator for triangle area problems
 */
export const generateTriangleSolution = (base, height, questionType, units = 'cm') => {
  const steps = [];
  const area = (base * height) / 2;

  if (questionType === 'findArea') {
    steps.push({
      explanation: "Use the formula for the area of a triangle",
      formula: "\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}"
    });

    steps.push({
      explanation: "Substitute the values",
      formula: `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height}`
    });

    steps.push({
      explanation: "Calculate the result",
      formula: `\\text{Area} = \\frac{${base * height}}{2} = ${area}\\text{ ${units}}^2`
    });
  }
  else if (questionType === 'findHeight') {
    steps.push({
      explanation: "Use the formula for the area of a triangle",
      formula: "\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}"
    });

    steps.push({
      explanation: "Rearrange to find the height",
      formula: "\\text{height} = \\frac{2 \\times \\text{Area}}{\\text{base}}"
    });

    steps.push({
      explanation: "Substitute the values",
      formula: `\\text{height} = \\frac{2 \\times ${area}}{${base}} = ${height}\\text{ ${units}}`
    });
  }
  else if (questionType === 'findBase') {
    steps.push({
      explanation: "Use the formula for the area of a triangle",
      formula: "\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}"
    });

    steps.push({
      explanation: "Rearrange to find the base",
      formula: "\\text{base} = \\frac{2 \\times \\text{Area}}{\\text{height}}"
    });

    steps.push({
      explanation: "Substitute the values",
      formula: `\\text{base} = \\frac{2 \\times ${area}}{${height}} = ${base}\\text{ ${units}}`
    });
  }

  return steps;
};

// Export a grouped set of triangle-related generators
export const triangleGenerators = {
  triangleArea,
  triangleLengthFromArea,
  generateTriangleSolution
};

export default triangleGenerators;