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

/**
 * Generate a "think of a number" real-world problem
 * Used for starter questions reviewing linear equation solving
 */
export const generateThinkOfNumberQuestion = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'starter'
    } = options;

    // Generate a number between 2 and 20
    const originalNumber = _.random(2, 20);
    
    // Generate simple operations
    const operations = [
        { type: 'multiply', value: _.random(2, 5) },
        { type: 'add', value: _.random(5, 15) }
    ];
    
    // Calculate the final number
    let currentNumber = originalNumber;
    const steps = [];
    
    for (const operation of operations) {
        const oldNumber = currentNumber;
        if (operation.type === 'multiply') {
            currentNumber *= operation.value;
            steps.push(`${oldNumber} × ${operation.value} = ${currentNumber}`);
        } else if (operation.type === 'add') {
            currentNumber += operation.value;
            steps.push(`${oldNumber} + ${operation.value} = ${currentNumber}`);
        }
    }
    
    // Generate a real-world context
    const contexts = [
        `A delivery service charges £${operations[0].value} per mile, plus a fixed fee of £${operations[1].value}. If the total cost is £${currentNumber}, how many miles was the delivery?`,
        `A plumber charges £${operations[0].value} per hour, plus a call-out fee of £${operations[1].value}. If the total bill was £${currentNumber}, how many hours did the job take?`,
        `A recipe requires ${operations[0].value} eggs per person, plus ${operations[1].value} extra for the sauce. If the recipe calls for ${currentNumber} eggs total, how many people is it meant to serve?`,
        `A taxi charges £${operations[0].value} per mile, plus a base fare of £${operations[1].value}. If the total fare was £${currentNumber}, how many miles was the journey?`,
        `A phone plan charges £${operations[0].value} per GB of data, plus a monthly fee of £${operations[1].value}. If the total bill was £${currentNumber}, how many GB were used?`
    ];
    
    const context = _.sample(contexts);
    
    return {
        question: context,
        answer: `\\text{Let's call the unknown value } x\\\\
                 \\text{Then: } ${operations[0].value}x + ${operations[1].value} = ${currentNumber}\\\\
                 \\text{Subtract ${operations[1].value} from both sides: } ${operations[0].value}x = ${currentNumber - operations[1].value}\\\\
                 \\text{Divide both sides by ${operations[0].value}: } x = ${originalNumber}`,
        difficulty: 'text'  // Mark as text to avoid LaTeX formatting issues
    };
};

/**
 * Generate a simple linear equation with x on both sides
 * For diagnostic or practice questions
 */
export const generateLinearEquationBothSides = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // Generate coefficients to ensure integer solution
    const leftCoeff = _.random(2, 8);
    const rightCoeff = _.random(1, leftCoeff - 1); // Ensure leftCoeff > rightCoeff
    const leftConstant = _.random(1, 10);
    const rightConstant = _.random(leftConstant + 1, 20); // Ensure positive solution
    
    // Calculate solution: (rightConstant - leftConstant) / (leftCoeff - rightCoeff)
    const solution = (rightConstant - leftConstant) / (leftCoeff - rightCoeff);
    
    // Only generate if solution is a positive integer
    if (solution <= 0 || solution !== Math.floor(solution)) {
        return generateLinearEquationBothSides(options); // Regenerate if not integer
    }
    
    return {
        questionDisplay: {
            text: 'Solve for x:',
            math: `${leftCoeff}x + ${leftConstant} = ${rightCoeff}x + ${rightConstant}`,
            layout: 'horizontal'
        },
        correctAnswer: `${solution}`,
        options: [
            `${solution}`,
            `${solution + 1}`,
            `${solution - 1}`,
            `${Math.floor(solution / 2)}`
        ].sort(() => Math.random() - 0.5),
        explanation: `Collect x terms: ${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}
                     Simplify: ${leftCoeff - rightCoeff}x = ${rightConstant - leftConstant}
                     Divide: x = ${solution}`,
        solution: [
            {
                explanation: "Collect all x terms on one side and constants on the other",
                formula: `${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}`
            },
            {
                explanation: "Simplify both sides",
                formula: `${leftCoeff - rightCoeff}x = ${rightConstant - leftConstant}`
            },
            {
                explanation: "Divide both sides by the coefficient of x",
                formula: `x = \\frac{${rightConstant - leftConstant}}{${leftCoeff - rightCoeff}} = ${solution}`
            }
        ]
    };
};

// Export grouped generators for future expansion
export const equationGenerators = {
    generateDivisionEquation,
    generateThinkOfNumberQuestion,
    generateLinearEquationBothSides
    // Future generators can be added here:
    // generateQuadraticEquation,
    // generateSimultaneousEquations,
    // etc.
};

export default equationGenerators;