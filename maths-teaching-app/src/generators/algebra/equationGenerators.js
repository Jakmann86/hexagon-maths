// src/generators/algebra/equationGenerators.js
import _ from 'lodash';

/**
 * Generate a division equation with unknown in numerator or denominator
 * Designed for diagnostic questions with multiple choice answers
 */
export const generateDivisionEquation = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // Randomly decide whether to put unknown in numerator or denominator
    const unknownOnTop = Math.random() > 0.5;

    if (unknownOnTop) {
        // Generate simple division equation with unknown in numerator: x/d = r
        const denominator = _.random(2, 12);
        const result = _.random(2, 10);
        const numerator = denominator * result; // This ensures clean division

        // Generate incorrect options
        const incorrectOptions = [
            result + _.random(1, 3),           // Too large
            Math.max(1, result - _.random(1, 3)), // Too small
            Math.round(denominator / result)   // Inverted division
        ];

        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: `\\frac{x}{${denominator}} = ${result}`,
                layout: 'vertical'  // Add this to indicate vertical layout
            },
            correctAnswer: `${numerator}`,
            options: [`${numerator}`, ...incorrectOptions.map(val => `${val}`)].sort(() => Math.random() - 0.5),
            explanation: `To solve the equation, multiply both sides by ${denominator}: x = ${result} × ${denominator} = ${numerator}`
        };
    } else {
        // Generate equation with unknown in denominator: n/x = r
        const denominator = _.random(2, 12);
        const result = _.random(2, 10);
        const numerator = denominator * result; // This ensures clean division

        // Generate incorrect options
        const incorrectOptions = [
            denominator + _.random(1, 3),    // Too large
            Math.max(1, denominator - _.random(1, 3)), // Too small
            numerator * result                 // Multiplied instead of divided
        ];

        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: `\\frac{${numerator}}{x} = ${result}`,
                layout: 'vertical'  // Add this to indicate vertical layout
            },
            correctAnswer: `${denominator}`,
            options: [`${denominator}`, ...incorrectOptions.map(val => `${val}`)].sort(() => Math.random() - 0.5),
            explanation: `To solve the equation, divide ${numerator} by ${result}: x = ${numerator} ÷ ${result} = ${denominator}`
        };
    }
};

// Export grouped generators for future expansion
export const equationGenerators = {
    generateDivisionEquation,
    // Future generators can be added here:
    // generateLinearEquation,
    // generateQuadraticEquation,
    // etc.
};

export default equationGenerators;