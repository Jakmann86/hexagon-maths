// src/generators/algebra/equationGenerators.js - Updated with Unified Architecture
import _ from 'lodash';

/**
 * Unified division equation generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateDivisionEquation = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // UNIFIED MATH LOGIC
    const unknownOnTop = Math.random() > 0.5;
    let denominator, result, numerator, correctAnswer, questionText, explanation;

    if (unknownOnTop) {
        // x/d = r format
        denominator = difficulty === 'easy' ? _.random(2, 6) : _.random(2, 12);
        result = difficulty === 'easy' ? _.random(2, 6) : _.random(2, 10);
        numerator = denominator * result;
        correctAnswer = numerator;
        questionText = `\\frac{x}{${denominator}} = ${result}`;
        explanation = `Multiply both sides by ${denominator}: x = ${result} × ${denominator} = ${numerator}`;
    } else {
        // n/x = r format
        denominator = difficulty === 'easy' ? _.random(2, 6) : _.random(2, 12);
        result = difficulty === 'easy' ? _.random(2, 6) : _.random(2, 10);
        numerator = denominator * result;
        correctAnswer = denominator;
        questionText = `\\frac{${numerator}}{x} = ${result}`;
        explanation = `Divide ${numerator} by ${result}: x = ${numerator} ÷ ${result} = ${denominator}`;
    }

    // SECTION-AWARE OUTPUT FORMATTING
    if (sectionType === 'starter') {
        return {
            question: `Solve for x: ${questionText}`,
            answer: `\\text{${explanation}}\\\\x = ${correctAnswer}`,
            difficulty: 'algebra'
        };
    }

    else if (sectionType === 'diagnostic') {
        // Generate incorrect options
        const incorrectOptions = unknownOnTop ? [
            correctAnswer + _.random(1, 3),
            Math.max(1, correctAnswer - _.random(1, 3)),
            Math.round(denominator / result)
        ] : [
            correctAnswer + _.random(1, 3),
            Math.max(1, correctAnswer - _.random(1, 3)),
            numerator * result
        ];

        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: questionText,
                layout: 'vertical'
            },
            correctAnswer: `${correctAnswer}`,
            options: [`${correctAnswer}`, ...incorrectOptions.map(val => `${val}`)].sort(() => Math.random() - 0.5),
            explanation: explanation
        };
    }

    else if (sectionType === 'examples') {
        const solution = unknownOnTop ? [
            {
                explanation: "We have a fraction equal to a number",
                formula: questionText
            },
            {
                explanation: "To isolate x, multiply both sides by the denominator",
                formula: `x = ${result} \\times ${denominator}`
            },
            {
                explanation: "Calculate the result",
                formula: `x = ${correctAnswer}`
            }
        ] : [
            {
                explanation: "We have a fraction equal to a number",
                formula: questionText
            },
            {
                explanation: "To find x, divide the numerator by the result",
                formula: `x = \\frac{${numerator}}{${result}}`
            },
            {
                explanation: "Calculate the result",
                formula: `x = ${correctAnswer}`
            }
        ];

        return {
            title: "Solving Division Equations",
            questionText: `Solve for x: ${questionText}`,
            solution
        };
    }

    // Fallback to diagnostic format
    return generateDivisionEquation({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified "think of a number" real-world problem generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateThinkOfNumberQuestion = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'starter'
    } = options;

    // UNIFIED MATH LOGIC
    const originalNumber = difficulty === 'easy' ? _.random(2, 10) : _.random(2, 20);
    
    const operations = [
        { type: 'multiply', value: difficulty === 'easy' ? _.random(2, 4) : _.random(2, 5) },
        { type: 'add', value: difficulty === 'easy' ? _.random(3, 10) : _.random(5, 15) }
    ];
    
    // Calculate final number
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
    
    // Generate real-world contexts
    const contexts = [
        `A taxi charges £${operations[0].value} per mile, plus a base fare of £${operations[1].value}. If the total fare was £${currentNumber}, how many miles was the journey?`,
        `A plumber charges £${operations[0].value} per hour, plus a call-out fee of £${operations[1].value}. If the total bill was £${currentNumber}, how many hours did the job take?`,
        `A phone plan charges £${operations[0].value} per GB of data, plus a monthly fee of £${operations[1].value}. If the total bill was £${currentNumber}, how many GB were used?`,
        `A delivery service charges £${operations[0].value} per mile, plus a fixed fee of £${operations[1].value}. If the total cost is £${currentNumber}, how many miles was the delivery?`,
        `A recipe requires ${operations[0].value} eggs per person, plus ${operations[1].value} extra for the sauce. If the recipe calls for ${currentNumber} eggs total, how many people is it meant to serve?`
    ];
    
    const context = _.sample(contexts);

    // SECTION-AWARE OUTPUT FORMATTING
    if (sectionType === 'starter') {
        return {
            question: context,
            answer: `\\text{Let's call the unknown value } x\\\\
                     \\text{Then: } ${operations[0].value}x + ${operations[1].value} = ${currentNumber}\\\\
                     \\text{Subtract ${operations[1].value} from both sides: } ${operations[0].value}x = ${currentNumber - operations[1].value}\\\\
                     \\text{Divide both sides by ${operations[0].value}: } x = ${originalNumber}`,
            difficulty: 'text'
        };
    }
    
    else if (sectionType === 'diagnostic') {
        // Generate incorrect options
        const incorrectOptions = [
            originalNumber + 1,
            Math.max(1, originalNumber - 1),
            Math.round(currentNumber / operations[0].value) // Common mistake: forgetting the constant
        ];

        return {
            questionDisplay: context,
            correctAnswer: `${originalNumber}`,
            options: [`${originalNumber}`, ...incorrectOptions.map(val => `${val}`)].sort(() => Math.random() - 0.5),
            explanation: `Set up equation: ${operations[0].value}x + ${operations[1].value} = ${currentNumber}, solve to get x = ${originalNumber}`
        };
    }
    
    else if (sectionType === 'examples') {
        const solution = [
            {
                explanation: "Identify the unknown quantity and set up the equation",
                formula: `\\text{Let } x = \\text{ the unknown value}`
            },
            {
                explanation: "Translate the word problem into an equation",
                formula: `${operations[0].value}x + ${operations[1].value} = ${currentNumber}`
            },
            {
                explanation: "Subtract the constant from both sides",
                formula: `${operations[0].value}x = ${currentNumber} - ${operations[1].value} = ${currentNumber - operations[1].value}`
            },
            {
                explanation: "Divide both sides by the coefficient of x",
                formula: `x = \\frac{${currentNumber - operations[1].value}}{${operations[0].value}} = ${originalNumber}`
            }
        ];

        return {
            title: "Real-World Linear Equations",
            questionText: context,
            solution
        };
    }

    // Fallback to starter format
    return generateThinkOfNumberQuestion({ ...options, sectionType: 'starter' });
};

/**
 * Unified linear equation with x on both sides generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateLinearEquationBothSides = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // UNIFIED MATH LOGIC - Generate coefficients to ensure integer solution
    const leftCoeff = difficulty === 'easy' ? _.random(2, 5) : _.random(2, 8);
    const rightCoeff = _.random(1, leftCoeff - 1); // Ensure leftCoeff > rightCoeff
    const leftConstant = difficulty === 'easy' ? _.random(1, 6) : _.random(1, 10);
    const rightConstant = _.random(leftConstant + 1, leftConstant + 10); // Ensure positive solution
    
    // Calculate solution: (rightConstant - leftConstant) / (leftCoeff - rightCoeff)
    const solution = (rightConstant - leftConstant) / (leftCoeff - rightCoeff);
    
    // Only proceed if solution is a positive integer
    if (solution <= 0 || solution !== Math.floor(solution)) {
        return generateLinearEquationBothSides(options); // Regenerate if not integer
    }
    
    const equation = `${leftCoeff}x + ${leftConstant} = ${rightCoeff}x + ${rightConstant}`;

    // SECTION-AWARE OUTPUT FORMATTING
    if (sectionType === 'starter') {
        return {
            question: `Solve for x: ${equation}`,
            answer: `\\text{Collect x terms: } ${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}\\\\
                     \\text{Simplify: } ${leftCoeff - rightCoeff}x = ${rightConstant - leftConstant}\\\\
                     \\text{Divide: } x = ${solution}`,
            difficulty: 'algebra'
        };
    }
    
    else if (sectionType === 'diagnostic') {
        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: equation,
                layout: 'horizontal'
            },
            correctAnswer: `${solution}`,
            options: [
                `${solution}`,
                `${solution + 1}`,
                `${Math.max(1, solution - 1)}`,
                `${Math.floor(solution / 2) || 1}`
            ].sort(() => Math.random() - 0.5),
            explanation: `Collect x terms: ${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}, 
                         Simplify: ${leftCoeff - rightCoeff}x = ${rightConstant - leftConstant}, 
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
    }
    
    else if (sectionType === 'examples') {
        const solution_steps = [
            {
                explanation: "We have an equation with x terms on both sides",
                formula: equation
            },
            {
                explanation: "Subtract the smaller x term from both sides",
                formula: `${leftCoeff}x - ${rightCoeff}x + ${leftConstant} = ${rightConstant}`
            },
            {
                explanation: "Simplify the x terms",
                formula: `${leftCoeff - rightCoeff}x + ${leftConstant} = ${rightConstant}`
            },
            {
                explanation: "Subtract the constant from both sides",
                formula: `${leftCoeff - rightCoeff}x = ${rightConstant} - ${leftConstant}`
            },
            {
                explanation: "Simplify the right side",
                formula: `${leftCoeff - rightCoeff}x = ${rightConstant - leftConstant}`
            },
            {
                explanation: "Divide both sides by the coefficient of x",
                formula: `x = \\frac{${rightConstant - leftConstant}}{${leftCoeff - rightCoeff}} = ${solution}`
            }
        ];

        return {
            title: "Equations with x on Both Sides",
            questionText: `Solve for x: ${equation}`,
            solution: solution_steps
        };
    }

    // Fallback to diagnostic format
    return generateLinearEquationBothSides({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified simple equation generator for basic solving practice
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateSimpleEquation = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'starter'
    } = options;

    // UNIFIED MATH LOGIC
    const coefficient = difficulty === 'easy' ? _.random(2, 5) : _.random(2, 8);
    const constant = difficulty === 'easy' ? _.random(1, 6) : _.random(1, 12);
    const solution = difficulty === 'easy' ? _.random(1, 8) : _.random(1, 15);
    
    // Choose equation type
    const equationType = _.sample(['addition', 'subtraction', 'multiplication', 'division']);
    
    let equation, stepByStep;
    
    switch (equationType) {
        case 'addition':
            equation = `x + ${constant} = ${solution + constant}`;
            stepByStep = `\\text{Subtract ${constant} from both sides: } x = ${solution + constant} - ${constant} = ${solution}`;
            break;
        case 'subtraction':
            equation = `x - ${constant} = ${solution - constant}`;
            stepByStep = `\\text{Add ${constant} to both sides: } x = ${solution - constant} + ${constant} = ${solution}`;
            break;
        case 'multiplication':
            equation = `${coefficient}x = ${coefficient * solution}`;
            stepByStep = `\\text{Divide both sides by ${coefficient}: } x = \\frac{${coefficient * solution}}{${coefficient}} = ${solution}`;
            break;
        case 'division':
            equation = `\\frac{x}{${coefficient}} = ${solution}`;
            stepByStep = `\\text{Multiply both sides by ${coefficient}: } x = ${solution} \\times ${coefficient} = ${solution * coefficient}`;
            solution = solution * coefficient; // Update solution for division case
            break;
    }

    // SECTION-AWARE OUTPUT FORMATTING
    if (sectionType === 'starter') {
        return {
            question: `Solve for x: ${equation}`,
            answer: stepByStep,
            difficulty: 'algebra'
        };
    }
    
    else if (sectionType === 'diagnostic') {
        // Generate incorrect options
        const incorrectOptions = [
            solution + 1,
            Math.max(1, solution - 1),
            solution * 2
        ];

        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: equation
            },
            correctAnswer: `${solution}`,
            options: [`${solution}`, ...incorrectOptions.map(val => `${val}`)].sort(() => Math.random() - 0.5),
            explanation: stepByStep
        };
    }

    // Fallback to starter format
    return generateSimpleEquation({ ...options, sectionType: 'starter' });
};

// Export unified generators
export const equationGenerators = {
    // New unified functions
    generateDivisionEquation,
    generateThinkOfNumberQuestion,
    generateLinearEquationBothSides,
    generateSimpleEquation,

    // Legacy aliases for backward compatibility (temporary)
    divisionEquation: (options) => generateDivisionEquation(options),
    thinkOfNumberQuestion: (options) => generateThinkOfNumberQuestion(options),
    linearEquationBothSides: (options) => generateLinearEquationBothSides(options),
    simpleEquation: (options) => generateSimpleEquation(options)
};

export default equationGenerators;