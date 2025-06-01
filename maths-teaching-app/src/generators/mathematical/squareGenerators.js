// src/generators/geometry/squareGenerators.js - FIXED for consistent KaTeX
import _ from 'lodash';
import { createSquare } from '../../factories/quadrilateralFactory';

/**
 * Generate a square with area and perimeter question
 * Used primarily for starter questions
 */
export const describeSquare = ({ units = 'cm' } = {}) => {
    // Generate a reasonable side length for a square
    const side = _.random(3, 8);
    const area = side * side;
    const perimeter = side * 4;

    return {
        question: `Find the area and perimeter of a square with sides ${side} ${units}.`,
        answer: `\\text{Area} = ${side}^2 = ${area}\\text{ ${units}}^2\\\\\\text{Perimeter} = 4 \\times ${side} = ${perimeter}\\text{ ${units}}`,
        visualization: createSquare({
            sideLength: side,
            showDimensions: true,
            units,
            sectionType: 'starter',
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.2
            }
        })
    };
};

/**
 * Generate a question about finding the area of a square
 * Used primarily for diagnostic questions
 */
export const squareArea = ({ units = 'cm' } = {}) => {
    // Generate a reasonable side length for a square
    const side = _.random(3, 8);
    const area = side * side;

    return {
        questionDisplay: `Find the area of this square with side length ${side} ${units}.`,
        correctAnswer: `${area}\\text{ ${units}}^2`,
        options: [
            `${area}\\text{ ${units}}^2`,
            `${area + 2}\\text{ ${units}}^2`,
            `${area - 2}\\text{ ${units}}^2`,
            `${side * 4}\\text{ ${units}}^2`  // Common mistake: using perimeter
        ].sort(() => Math.random() - 0.5),
        explanation: {
            text: "Side length = √Area = ",
            math: `\\sqrt{${area}} = ${side}\\text{ ${units}}`
        },
        visualization: createSquare({
            sideLength: side,
            showDimensions: true,
            units,
            sectionType: 'diagnostic',
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.2
            }
        })
    };
};

/**
 * Generate a question about finding the side length of a square from its area
 * Used primarily for diagnostic questions
 */
export const squareRoot = ({ units = 'cm' } = {}) => {
    // Generate a perfect square area for cleaner solutions
    const perfectSquares = [16, 25, 36, 49, 64, 81, 100];
    const area = _.sample(perfectSquares);
    const side = Math.sqrt(area);

    return {
        questionDisplay: `Find the side length of a square with area ${area} ${units}².`,
        correctAnswer: `${side}\\text{ ${units}}`,
        options: [
            `${side}\\text{ ${units}}`,
            `${side + 1}\\text{ ${units}}`,
            `${side - 1}\\text{ ${units}}`,
            `${area / 4}\\text{ ${units}}`  // Common mistake: dividing by 4 instead of square root
        ].sort(() => Math.random() - 0.5),
        explanation: `Side length = √Area = √${area} = ${side} ${units}`,
        visualization: createSquare({
            sideLength: side,
            showDimensions: false,
            showArea: true,
            areaLabel: `${area} ${units}²`,
            units,
            containerHeight: 240,
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.3,
                backgroundTransparent: true
            }
        })
    };
};

/**
 * Generate diagnostic square area question with specific distractors
 */
export const squareAreaDiagnostic = ({ units = 'cm' } = {}) => {
    const side = _.random(3, 8);
    const area = side * side;
    const perimeter = side * 4; // Common misconception

    return {
        questionDisplay: `Find the area of this square with side length ${side} ${units}.`,
        correctAnswer: `${area}\\text{ ${units}}^2`,
        options: [
            `${area}\\text{ ${units}}^2`,        // Correct answer
            `${perimeter}\\text{ ${units}}^2`,   // Mistake: using perimeter
            `${area + side}\\text{ ${units}}^2`, // Mistake: area + side
            `${side * 2}\\text{ ${units}}^2`     // Mistake: doubling instead of squaring
        ].sort(() => Math.random() - 0.5),
        explanation: `Area of a square = side² = ${side}² = ${area} ${units}²`,
        visualization: createSquare({
            sideLength: side,
            showDimensions: true,
            units,
            sectionType: 'diagnostic',
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.2
            }
        })
    };
};

/**
 * Generate diagnostic square root question with specific distractors
 */
export const squareRootDiagnostic = ({ units = 'cm' } = {}) => {
    const perfectSquares = [16, 25, 36, 49, 64, 81, 100];
    const area = _.sample(perfectSquares);
    const side = Math.sqrt(area);

    return {
        questionDisplay: `Find the side length of a square with area ${area} ${units}².`,
        correctAnswer: `${side}\\text{ ${units}}`,
        options: [
            `${side}\\text{ ${units}}`,          // Correct answer
            `${area / 4}\\text{ ${units}}`,      // Mistake: dividing by 4 instead of square root
            `${area / 2}\\text{ ${units}}`,      // Mistake: dividing by 2
            `${side + 1}\\text{ ${units}}`       // Close but wrong
        ].sort(() => Math.random() - 0.5),
        explanation: `Side length = √Area = √${area} = ${side} ${units}`,
        visualization: createSquare({
            sideLength: side,
            showDimensions: false,
            showArea: true,
            areaLabel: `${area} ${units}²`,
            units,
            containerHeight: 240,
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.3
            }
        })
    };
};

/**
 * Square-related solution steps generator
 */
export const generateSquareSolution = (side, questionType, units = 'cm') => {
    const steps = [];

    if (questionType === 'findArea') {
        steps.push({
            explanation: "Use the formula for the area of a square",
            formula: "\\text{Area} = \\text{side}^2"
        });

        steps.push({
            explanation: "Substitute the side length",
            formula: `\\text{Area} = ${side}^2 = ${side * side}\\text{ ${units}}^2`
        });
    }
    else if (questionType === 'findPerimeter') {
        steps.push({
            explanation: "Use the formula for the perimeter of a square",
            formula: "\\text{Perimeter} = 4 \\times \\text{side}"
        });

        steps.push({
            explanation: "Substitute the side length",
            formula: `\\text{Perimeter} = 4 \\times ${side} = ${side * 4}\\text{ ${units}}`
        });
    }
    else if (questionType === 'findSide') {
        steps.push({
            explanation: "Use the formula for the area of a square",
            formula: "\\text{Area} = \\text{side}^2"
        });

        steps.push({
            explanation: "Rearrange to find the side length",
            formula: "\\text{side} = \\sqrt{\\text{Area}}"
        });

        steps.push({
            explanation: "Substitute the area",
            formula: `\\text{side} = \\sqrt{${side * side}} = ${side}\\text{ ${units}}`
        });
    }

    return steps;
};

// Export grouped generators for future expansion
export const squareGenerators = {
    describeSquare,
    squareArea,
    squareRoot,
    squareAreaDiagnostic,
    squareRootDiagnostic,
    generateSquareSolution
};

export default squareGenerators;