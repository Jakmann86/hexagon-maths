// src/generators/number/lcmGenerator.js - NEW FILE

import _ from 'lodash';

/**
 * Generate LCM questions for simultaneous equations diagnostic
 * Tests ability to find lowest common multiples for equation scaling
 */
export const generateLCMQuestion = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // Number pairs that commonly appear in simultaneous equations
    const numberPairs = [
        [6, 9], [4, 6], [8, 12], [3, 5], [6, 8], 
        [4, 10], [9, 12], [6, 15], [8, 20], [12, 18]
    ];

    const [num1, num2] = _.sample(numberPairs);
    
    // Calculate LCM using GCD method
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const correctLCM = (num1 * num2) / gcd(num1, num2);

    // Generate strategic distractors
    const incorrectOptions = [
        num1 * num2,              // Product instead of LCM  
        Math.max(num1, num2),     // Just the larger number
        num1 + num2               // Sum instead of LCM
    ].filter(opt => opt !== correctLCM);

    return {
        questionDisplay: {
            text: `What is the lowest common multiple (LCM) of ${num1} and ${num2}?`
        },
        correctAnswer: `${correctLCM}`,
        options: [`${correctLCM}`, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
        explanation: `Find multiples of ${num1}: ${num1}, ${num1 * 2}, ${num1 * 3}... and ${num2}: ${num2}, ${num2 * 2}, ${num2 * 3}... The first common multiple is ${correctLCM}`
    };
};

// Export for use in other generators
export default generateLCMQuestion;