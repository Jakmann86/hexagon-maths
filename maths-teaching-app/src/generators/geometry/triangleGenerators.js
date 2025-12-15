// src/generators/geometry/triangleGenerators.js
// V2.1 - Starter format: answer (final only) + workingOut (expandable)
import _ from 'lodash';
import { createPythagoreanTriangle } from '../../factories/triangleFactory';

/**
 * Generate a triangle area question - V2 format
 * Uses nice integer values for clean answers
 */
export const triangleArea = ({ units = 'cm', sectionContext = {} } = {}) => {
  const { sectionType = 'starter' } = sectionContext;

  // Nice values that give integer areas
  const niceValues = [
    { base: 4, height: 3 },   // area = 6
    { base: 6, height: 4 },   // area = 12
    { base: 8, height: 5 },   // area = 20
    { base: 10, height: 4 },  // area = 20
    { base: 6, height: 6 },   // area = 18
    { base: 8, height: 3 },   // area = 12
    { base: 5, height: 4 },   // area = 10
    { base: 10, height: 6 },  // area = 30
    { base: 12, height: 5 },  // area = 30
  ];
  
  const { base, height } = _.sample(niceValues);
  const area = (base * height) / 2;

  return {
    question: `Calculate the area of this triangle with base ${base} ${units} and height ${height} ${units}.`,
    // V2 format: answer is JUST the final value
    answer: `${area}\\text{ ${units}}^2`,
    // V2 format: workingOut is the expandable working
    workingOut: `\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} \\\\ = \\frac{1}{2} \\times ${base} \\times ${height} \\\\ = ${area}\\text{ ${units}}^2`,
    visualization: createPythagoreanTriangle({
      base,
      height,
      showRightAngle: true,
      labelStyle: 'custom',
      labels: [`${base} ${units}`, `${height} ${units}`, null],
      units,
      sectionType,
      style: {
        fillColor: '#2ecc71',
        fillOpacity: 0.2
      }
    })
  };
};

/**
 * Generate a question about finding a triangle's height from its area
 */
export const triangleLengthFromArea = ({ units = 'cm' } = {}) => {
  const base = _.random(4, 12);
  const factor = _.random(1, 5);
  const area = base * factor;
  const height = (area * 2) / base;

  return {
    question: `A triangle has a base of ${base} ${units} and an area of ${area} ${units}². Find its height.`,
    answer: `${height}\\text{ ${units}}`,
    workingOut: `\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} \\\\ ${area} = \\frac{1}{2} \\times ${base} \\times h \\\\ h = \\frac{2 \\times ${area}}{${base}} = ${height}\\text{ ${units}}`,
    // Diagnostic format fields
    questionDisplay: `A triangle has a base of ${base} ${units} and an area of ${area} ${units}². Find its height.`,
    correctAnswer: `${height}\\text{ ${units}}`,
    options: _.shuffle([
      `${height}\\text{ ${units}}`,
      `${height + 1}\\text{ ${units}}`,
      `${height - 1}\\text{ ${units}}`,
      `${area / base}\\text{ ${units}}`
    ]),
    explanation: `Height = (2 × Area) ÷ base = (2 × ${area}) ÷ ${base} = ${height} ${units}`,
    visualization: createPythagoreanTriangle({
      base,
      height,
      unknownSide: 'height',
      labelStyle: 'custom',
      labels: [`${base} ${units}`, '?', null],
      units,
      sectionType: 'diagnostic',
      style: {
        fillColor: '#2ecc71',
        fillOpacity: 0.2
      }
    })
  };
};

export const triangleGenerators = {
  triangleArea,
  triangleLengthFromArea
};

export default triangleGenerators;