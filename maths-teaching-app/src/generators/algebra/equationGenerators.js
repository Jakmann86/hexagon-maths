// src/generators/algebra/equationGenerators.js - Enhanced with Phase 1 additions
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

import _ from 'lodash';

/**
 * Generate a linear equation with x on both sides
 * Section-aware output for starter, diagnostic, and examples sections
 * Equations like: 3x + 5 = 2x + 8
 */
export const generateLinearEquationBothSidesStarter = (options = {}) => {
    const { 
        difficulty = 'medium',
        sectionType = 'starter' 
    } = options;

    let attempts = 0;
    let solution, leftCoeff, rightCoeff, leftConstant, rightConstant;

    // Try up to 10 times to generate a valid equation
    while (attempts < 10) {
        // Generate coefficients to ensure integer solution
        if (difficulty === 'easy') {
            leftCoeff = _.random(2, 5);
            rightCoeff = 1; // Keep it simple for easy difficulty
            leftConstant = _.random(1, 5);
            rightConstant = _.random(leftConstant + 1, 15);
        } else if (difficulty === 'medium') {
            leftCoeff = _.random(2, 6);
            rightCoeff = _.random(1, leftCoeff - 1);
            leftConstant = _.random(1, 8);
            rightConstant = _.random(leftConstant + 1, 20);
        } else {
            leftCoeff = _.random(3, 8);
            rightCoeff = _.random(1, leftCoeff - 1);
            leftConstant = _.random(1, 10);
            rightConstant = _.random(leftConstant + 1, 25);
        }
        
        // Calculate solution: (rightConstant - leftConstant) / (leftCoeff - rightCoeff)
        const numerator = rightConstant - leftConstant;
        const denominator = leftCoeff - rightCoeff;
        solution = numerator / denominator;
        
        // Check if solution is a positive integer
        if (solution > 0 && solution === Math.floor(solution) && solution <= 20) {
            break; // Valid solution found
        }
        attempts++;
    }

    // Fallback to simple values if no valid solution found
    if (attempts >= 10) {
        leftCoeff = 5;
        rightCoeff = 2;
        leftConstant = 3;
        rightConstant = 12;
        solution = 3; // Manual calculation: (12-3)/(5-2) = 3
    }

    // Format the equation
    const equation = `${leftCoeff}x + ${leftConstant} = ${rightCoeff}x + ${rightConstant}`;
    
    // Calculate intermediate values for steps
    const simplifiedCoeff = leftCoeff - rightCoeff;
    const simplifiedConstant = rightConstant - leftConstant;

    // SECTION-AWARE OUTPUT
    if (sectionType === 'starter') {
        // Create the working steps with proper LaTeX formatting for starter section
        const workingSteps = [];
        
        // Step 1: Collect x terms on one side
        workingSteps.push(`${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}`);
        
        // Step 2: Simplify
        workingSteps.push(`${simplifiedCoeff}x = ${simplifiedConstant}`);
        
        // Step 3: Divide to solve
        if (simplifiedCoeff === 1) {
            workingSteps.push(`x = ${solution}`);
        } else {
            workingSteps.push(`x = \\frac{${simplifiedConstant}}{${simplifiedCoeff}}`);
            workingSteps.push(`x = ${solution}`);
        }

        return {
            question: `Solve: ${equation}`,
            answer: workingSteps.join('\\\\'),
            difficulty: 'algebra'
        };
    }
    
    else if (sectionType === 'diagnostic') {
        // Generate incorrect options based on common mistakes
        const incorrectOptions = [
            `${solution + 1}`, // Arithmetic error
            `${solution - 1}`, // Arithmetic error
            `${Math.max(1, Math.floor(solution / 2))}`, // Division error
            `${rightConstant - leftConstant}`, // Forgot to divide by coefficient
            `${leftCoeff + rightCoeff}` // Added coefficients instead of subtracting
        ].filter(opt => opt != solution && opt > 0); // Remove if accidentally correct or negative

        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: equation,
                layout: 'horizontal'
            },
            correctAnswer: `${solution}`,
            options: [`${solution}`, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
            explanation: `Collect x terms: ${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}
                         Simplify: ${simplifiedCoeff}x = ${simplifiedConstant}
                         Divide: x = ${solution}`
        };
    }
    
    else if (sectionType === 'examples') {
        const solutionSteps = [
            {
                explanation: "Start with the equation",
                formula: equation
            },
            {
                explanation: "Collect all x terms on the left side and constants on the right",
                formula: `${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}`
            },
            {
                explanation: "Simplify the x terms on the left",
                formula: `(${leftCoeff} - ${rightCoeff})x = ${rightConstant} - ${leftConstant}`
            },
            {
                explanation: "Calculate the coefficients",
                formula: `${simplifiedCoeff}x = ${simplifiedConstant}`
            }
        ];

        // Add division step if coefficient is not 1
        if (simplifiedCoeff !== 1) {
            solutionSteps.push({
                explanation: `Divide both sides by ${simplifiedCoeff}`,
                formula: `x = \\frac{${simplifiedConstant}}{${simplifiedCoeff}}`
            });
        }

        solutionSteps.push({
            explanation: "Solution",
            formula: `x = ${solution}`
        });

        // Add verification step
        solutionSteps.push({
            explanation: "Check: Substitute x = " + solution + " into the original equation",
            formula: `${leftCoeff}(${solution}) + ${leftConstant} = ${rightCoeff}(${solution}) + ${rightConstant}`
        });

        const leftCheck = leftCoeff * solution + leftConstant;
        const rightCheck = rightCoeff * solution + rightConstant;
        
        solutionSteps.push({
            explanation: "Verify both sides are equal",
            formula: `${leftCheck} = ${rightCheck} \\checkmark`
        });

        return {
            title: "Solving Equations with x on Both Sides",
            questionText: `Solve ${equation}`,
            solution: solutionSteps
        };
    }

    // Fallback to starter format if section type not specified
    return generateLinearEquationBothSidesStarter({ ...options, sectionType: 'starter' });
};

/**
 * Alternative version for word problems with equations having x on both sides
 * Creates contextual problems that lead to equations like 3x + 5 = 2x + 8
 * Section-aware output
 */
export const generateLinearEquationBothSidesWordProblem = (options = {}) => {
    const { 
        difficulty = 'medium',
        sectionType = 'starter'
    } = options;

    // Generate a valid equation first
    let leftCoeff = _.random(2, 5);
    let rightCoeff = _.random(1, leftCoeff - 1);
    let solution = _.random(3, 12);
    
    // Calculate constants based on the desired solution
    let leftConstant = _.random(2, 10);
    let rightConstant = leftCoeff * solution + leftConstant - rightCoeff * solution;

    // Verify the equation works
    const checkLeft = leftCoeff * solution + leftConstant;
    const checkRight = rightCoeff * solution + rightConstant;
    
    if (checkLeft !== checkRight) {
        // Adjust rightConstant to make it work
        rightConstant = checkLeft - rightCoeff * solution;
    }

    // Create contextual word problems
    const contexts = [
        {
            setup: `Two phone plans are being compared. Plan A charges £${leftCoeff} per GB plus a £${leftConstant} monthly fee. Plan B charges £${rightCoeff} per GB plus a £${rightConstant} monthly fee.`,
            question: `For how many GB of data will both plans cost the same?`,
            variable: 'GB of data',
            unit: 'GB'
        },
        {
            setup: `Two taxi companies have different rates. Company A charges £${leftCoeff} per mile plus a £${leftConstant} base fare. Company B charges £${rightCoeff} per mile plus a £${rightConstant} base fare.`,
            question: `For what distance will both companies charge the same amount?`,
            variable: 'miles',
            unit: 'miles'
        },
        {
            setup: `Two gym memberships are available. Gym A costs £${leftCoeff} per visit plus a £${leftConstant} joining fee. Gym B costs £${rightCoeff} per visit plus a £${rightConstant} joining fee.`,
            question: `After how many visits will the total cost be the same for both gyms?`,
            variable: 'visits',
            unit: 'visits'
        }
    ];

    const context = _.sample(contexts);
    const equation = `${leftCoeff}x + ${leftConstant} = ${rightCoeff}x + ${rightConstant}`;
    
    // SECTION-AWARE OUTPUT
    if (sectionType === 'starter') {
        const workingSteps = [
            `Let x = the number of ${context.variable}`,
            `Set up equation: ${equation}`,
            `Collect x terms: ${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}`,
            `Simplify: ${leftCoeff - rightCoeff}x = ${rightConstant - leftConstant}`,
            `Solve: x = ${solution}`,
            `Answer: ${solution} ${context.unit}`
        ];

        return {
            question: `${context.setup}\n${context.question}`,
            answer: workingSteps.join('\\\\'),
            difficulty: 'word-problem'
        };
    }
    
    else if (sectionType === 'examples') {
        return {
            title: "Word Problems Leading to Equations with x on Both Sides",
            questionText: `${context.setup} ${context.question}`,
            solution: [
                {
                    explanation: "Define the variable",
                    formula: `\\text{Let } x = \\text{ the number of ${context.variable}}`
                },
                {
                    explanation: "Set up equation for Plan/Company/Gym A",
                    formula: `\\text{Cost}_A = ${leftCoeff}x + ${leftConstant}`
                },
                {
                    explanation: "Set up equation for Plan/Company/Gym B",
                    formula: `\\text{Cost}_B = ${rightCoeff}x + ${rightConstant}`
                },
                {
                    explanation: "Set the costs equal to find when they're the same",
                    formula: equation
                },
                {
                    explanation: "Collect x terms on one side",
                    formula: `${leftCoeff}x - ${rightCoeff}x = ${rightConstant} - ${leftConstant}`
                },
                {
                    explanation: "Simplify",
                    formula: `${leftCoeff - rightCoeff}x = ${rightConstant - leftConstant}`
                },
                {
                    explanation: "Divide to solve for x",
                    formula: `x = \\frac{${rightConstant - leftConstant}}{${leftCoeff - rightCoeff}} = ${solution}`
                },
                {
                    explanation: "State the answer with units",
                    formula: `\\text{Both cost the same at } ${solution} \\text{ ${context.unit}}`
                },
                {
                    explanation: "Verify the answer",
                    formula: `\\text{Cost at } ${solution} \\text{ ${context.unit}: £}${checkLeft}`
                }
            ]
        };
    }

    // Fallback to starter format
    return generateLinearEquationBothSidesWordProblem({ ...options, sectionType: 'starter' });
};



/**
 * Generate a "think of a number" real-world problem
 * Used for starter questions reviewing linear equation solving
 * FIXED: Now returns pure text answers for better starter section display
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
    
    // FIXED: Pure text answer without LaTeX for starter sections
    const plainTextAnswer = `Let's call the unknown value x.
Then: ${operations[0].value}x + ${operations[1].value} = ${currentNumber}
Subtract ${operations[1].value} from both sides: ${operations[0].value}x = ${currentNumber - operations[1].value}
Divide both sides by ${operations[0].value}: x = ${originalNumber}

Answer: ${originalNumber}`;
    
    return {
        question: context,
        answer: plainTextAnswer,
        difficulty: 'text'  // Mark as text to ensure proper text rendering
    };
};

/**
 * Generate a simple linear equation with x on both sides
 * For diagnostic or practice questions
 * IMPROVED: Better error handling to avoid infinite recursion
 */
export const generateLinearEquationBothSides = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    let attempts = 0;
    let solution, leftCoeff, rightCoeff, leftConstant, rightConstant;

    // Try up to 10 times to generate a valid equation
    while (attempts < 10) {
        // Generate coefficients to ensure integer solution
        leftCoeff = _.random(2, 8);
        rightCoeff = _.random(1, leftCoeff - 1); // Ensure leftCoeff > rightCoeff
        leftConstant = _.random(1, 10);
        rightConstant = _.random(leftConstant + 1, 20); // Ensure positive solution
        
        // Calculate solution: (rightConstant - leftConstant) / (leftCoeff - rightCoeff)
        solution = (rightConstant - leftConstant) / (leftCoeff - rightCoeff);
        
        // Check if solution is a positive integer
        if (solution > 0 && solution === Math.floor(solution) && solution <= 20) {
            break; // Valid solution found
        }
        attempts++;
    }

    // Fallback to simple values if no valid solution found
    if (attempts >= 10) {
        leftCoeff = 5;
        rightCoeff = 2;
        leftConstant = 3;
        rightConstant = 12;
        solution = 3; // Manual calculation: (12-3)/(5-2) = 3
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
            `${Math.max(1, Math.floor(solution / 2))}`
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

/**
 * NEW: Generate simple rearrangement equations
 * Handles equations like x + a = b, ax = c, etc.
 * Section-aware output for starter, diagnostic, examples
 */
export const generateSimpleRearrangement = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // Generate different types of simple rearrangement
    const equationTypes = ['addition', 'subtraction', 'multiplication', 'division'];
    const equationType = difficulty === 'easy' ? 
        _.sample(['addition', 'multiplication']) : 
        _.sample(equationTypes);

    let equation, solution, workingSteps;

    if (equationType === 'addition') {
        // x + a = b
        const a = _.random(2, 15);
        const b = _.random(a + 1, 25);
        solution = b - a;
        equation = `x + ${a} = ${b}`;
        workingSteps = [
            `x + ${a} = ${b}`,
            `x = ${b} - ${a}`,
            `x = ${solution}`
        ];
    } 
    else if (equationType === 'subtraction') {
        // x - a = b
        const a = _.random(2, 10);
        const b = _.random(1, 15);
        solution = a + b;
        equation = `x - ${a} = ${b}`;
        workingSteps = [
            `x - ${a} = ${b}`,
            `x = ${b} + ${a}`,
            `x = ${solution}`
        ];
    }
    else if (equationType === 'multiplication') {
        // ax = b
        const a = _.random(2, 8);
        const quotient = _.random(2, 12);
        const b = a * quotient;
        solution = quotient;
        equation = `${a}x = ${b}`;
        workingSteps = [
            `${a}x = ${b}`,
            `x = ${b} \\div ${a}`,
            `x = ${solution}`
        ];
    }
    else { // division
        // x/a = b
        const a = _.random(2, 8);
        const b = _.random(2, 10);
        solution = a * b;
        equation = `\\frac{x}{${a}} = ${b}`;
        workingSteps = [
            `\\frac{x}{${a}} = ${b}`,
            `x = ${b} \\times ${a}`,
            `x = ${solution}`
        ];
    }

    // Section-aware output
    if (sectionType === 'starter') {
        return {
            question: `Solve: ${equation}`,
            answer: workingSteps.join('\\\\'),
            difficulty: 'algebra'
        };
    }
    
    else if (sectionType === 'diagnostic') {
        const incorrectOptions = [];
        
        // Generate misconception-based distractors
        if (equationType === 'addition') {
            incorrectOptions.push(`${solution + 2 * parseInt(equation.match(/\+ (\d+)/)[1])}`); // Added instead of subtracted
            incorrectOptions.push(`${solution - 2}`); // Arithmetic error
            incorrectOptions.push(`${parseInt(equation.match(/= (\d+)/)[1])}`); // Didn't solve, just copied answer
        } else if (equationType === 'multiplication') {
            incorrectOptions.push(`${solution * 2}`); // Multiplied instead of divided
            incorrectOptions.push(`${Math.max(1, solution - 1)}`); // Arithmetic error
            incorrectOptions.push(`${parseInt(equation.match(/= (\d+)/)[1])}`); // Copied the result
        }

        // Fill remaining slots with other plausible values
        while (incorrectOptions.length < 3) {
            const randomValue = _.random(1, 20);
            if (randomValue !== solution && !incorrectOptions.includes(`${randomValue}`)) {
                incorrectOptions.push(`${randomValue}`);
            }
        }

        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: equation
            },
            correctAnswer: `${solution}`,
            options: [`${solution}`, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
            explanation: `${workingSteps.join(' → ')}`
        };
    }
    
    else if (sectionType === 'examples') {
        const stepExplanations = {
            'addition': "Subtract the constant from both sides",
            'subtraction': "Add the constant to both sides", 
            'multiplication': "Divide both sides by the coefficient",
            'division': "Multiply both sides by the denominator"
        };

        return {
            title: "Simple Rearrangement",
            questionText: `Solve ${equation}`,
            solution: [
                {
                    explanation: "Start with the given equation",
                    formula: equation
                },
                {
                    explanation: stepExplanations[equationType],
                    formula: workingSteps[1]
                },
                {
                    explanation: "Calculate the result",
                    formula: workingSteps[2]
                }
            ]
        };
    }

    // Fallback
    return generateSimpleRearrangement({ ...options, sectionType: 'diagnostic' });
};

/**
 * NEW: Generate equations containing brackets
 * Handles equations like 3(x + 2) = 15, 2(x - 1) = 8, etc.
 * Section-aware output for starter, diagnostic, examples
 */
export const generateBracketEquation = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // Generate equation components
    const outsideCoeff = difficulty === 'easy' ? _.random(2, 4) : _.random(2, 6);
    const insideConstant = _.random(1, 8);
    const useSubtraction = difficulty !== 'easy' && Math.random() > 0.6;
    
    // Calculate the right-hand side to ensure integer solution
    const desiredSolution = _.random(2, 12);
    const rightSide = outsideCoeff * (desiredSolution + (useSubtraction ? -insideConstant : insideConstant));
    
    // Build equation
    const equation = useSubtraction ? 
        `${outsideCoeff}(x - ${insideConstant}) = ${rightSide}` :
        `${outsideCoeff}(x + ${insideConstant}) = ${rightSide}`;

    const solution = desiredSolution;

    // Working steps
    const step1 = `${outsideCoeff}(x ${useSubtraction ? '-' : '+'} ${insideConstant}) = ${rightSide}`;
    const step2 = `x ${useSubtraction ? '-' : '+'} ${insideConstant} = ${Math.floor(rightSide / outsideCoeff)}`;
    const step3 = `x = ${Math.floor(rightSide / outsideCoeff)} ${useSubtraction ? '+' : '-'} ${insideConstant}`;
    const step4 = `x = ${solution}`;

    // Section-aware output
    if (sectionType === 'starter') {
        return {
            question: `Solve: ${equation}`,
            answer: `${step1}\\\\${step2}\\\\${step3}\\\\${step4}`,
            difficulty: 'algebra'
        };
    }
    
    else if (sectionType === 'diagnostic') {
        const incorrectOptions = [
            `${Math.floor(rightSide / outsideCoeff)}`, // Forgot to handle the constant inside brackets
            `${solution + (useSubtraction ? -2 * insideConstant : 2 * insideConstant)}`, // Wrong operation with constant
            `${Math.max(1, solution - 1)}` // Arithmetic error
        ];

        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: equation
            },
            correctAnswer: `${solution}`,
            options: [`${solution}`, ...incorrectOptions].sort(() => Math.random() - 0.5),
            explanation: `First divide both sides by ${outsideCoeff}, then ${useSubtraction ? 'add' : 'subtract'} ${insideConstant}`
        };
    }
    
    else if (sectionType === 'examples') {
        return {
            title: "Equations with Brackets",
            questionText: `Solve ${equation}`,
            solution: [
                {
                    explanation: "Start with the given equation",
                    formula: step1
                },
                {
                    explanation: `Divide both sides by ${outsideCoeff}`,
                    formula: step2
                },
                {
                    explanation: `${useSubtraction ? 'Add' : 'Subtract'} ${insideConstant} ${useSubtraction ? 'to' : 'from'} both sides`,
                    formula: step3
                },
                {
                    explanation: "Calculate the final answer",
                    formula: step4
                }
            ]
        };
    }

    return generateBracketEquation({ ...options, sectionType: 'diagnostic' });
};

/**
 * NEW: Generate fractional equations (improved from division)
 * Handles equations like x/3 + 2 = 5, (x+1)/4 = 3, etc.
 * Section-aware output for starter, diagnostic, examples
 */
export const generateFractionalEquation = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // Choose equation type
    const equationTypes = difficulty === 'easy' ? 
        ['simple_fraction'] : 
        ['simple_fraction', 'fraction_plus_constant', 'fraction_with_addition'];
    
    const equationType = _.sample(equationTypes);
    
    let equation, solution, workingSteps;

    if (equationType === 'simple_fraction') {
        // x/a = b → x = ab
        const a = _.random(2, 8);
        const b = _.random(2, 10);
        solution = a * b;
        equation = `\\frac{x}{${a}} = ${b}`;
        workingSteps = [
            `\\frac{x}{${a}} = ${b}`,
            `x = ${b} \\times ${a}`,
            `x = ${solution}`
        ];
    }
    else if (equationType === 'fraction_plus_constant') {
        // x/a + b = c → x = a(c - b)
        const a = _.random(2, 6);
        const b = _.random(1, 5);
        const c = _.random(b + 2, 15);
        solution = a * (c - b);
        equation = `\\frac{x}{${a}} + ${b} = ${c}`;
        workingSteps = [
            `\\frac{x}{${a}} + ${b} = ${c}`,
            `\\frac{x}{${a}} = ${c} - ${b}`,
            `\\frac{x}{${a}} = ${c - b}`,
            `x = ${c - b} \\times ${a}`,
            `x = ${solution}`
        ];
    }
    else { // fraction_with_addition
        // (x + a)/b = c → x = bc - a
        const a = _.random(1, 6);
        const b = _.random(2, 6);
        const c = _.random(2, 8);
        solution = b * c - a;
        
        // Ensure positive solution
        if (solution <= 0) {
            return generateFractionalEquation(options);
        }
        
        equation = `\\frac{x + ${a}}{${b}} = ${c}`;
        workingSteps = [
            `\\frac{x + ${a}}{${b}} = ${c}`,
            `x + ${a} = ${c} \\times ${b}`,
            `x + ${a} = ${c * b}`,
            `x = ${c * b} - ${a}`,
            `x = ${solution}`
        ];
    }

    // Section-aware output
    if (sectionType === 'starter') {
        return {
            question: `Solve: ${equation}`,
            answer: workingSteps.join('\\\\'),
            difficulty: 'algebra'
        };
    }
    
    else if (sectionType === 'diagnostic') {
        const incorrectOptions = [];
        
        // Generate misconception-based distractors
        if (equationType === 'simple_fraction') {
            const a = parseInt(equation.match(/frac{x}{(\d+)}/)[1]);
            const b = parseInt(equation.match(/= (\d+)/)[1]);
            incorrectOptions.push(`${Math.floor(b / a)}`); // Divided instead of multiplied
            incorrectOptions.push(`${b}`); // Ignored the fraction
            incorrectOptions.push(`${a}`); // Mixed up the numbers
        } else if (equationType === 'fraction_plus_constant') {
            incorrectOptions.push(`${solution / 2}`); // Forgot to multiply by denominator
            incorrectOptions.push(`${solution + 4}`); // Arithmetic error
            incorrectOptions.push(`${Math.abs(solution - 10)}`); // Different arithmetic error
        }

        // Fill remaining slots
        while (incorrectOptions.length < 3) {
            const randomValue = _.random(1, 30);
            if (randomValue !== solution && !incorrectOptions.includes(`${randomValue}`)) {
                incorrectOptions.push(`${randomValue}`);
            }
        }

        return {
            questionDisplay: {
                text: 'Solve for x:',
                math: equation
            },
            correctAnswer: `${solution}`,
            options: [`${solution}`, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
            explanation: workingSteps.slice(-2).join(' → ')
        };
    }
    
    else if (sectionType === 'examples') {
        return {
            title: "Fractional Equations",
            questionText: `Solve ${equation}`,
            solution: workingSteps.map((step, index) => ({
                explanation: index === 0 ? "Start with the given equation" :
                           index === workingSteps.length - 1 ? "Calculate the final answer" :
                           "Simplify step by step",
                formula: step
            }))
        };
    }

    return generateFractionalEquation({ ...options, sectionType: 'diagnostic' });
};

/**
 * NEW: Generate three-step equations with fractions/division
 * Handles equations like (2x + 3)/4 = 5, (x - 1)/3 = 2, etc.
 * Section-aware output for starter, diagnostic, examples
 */
export const generateThreeStepEquation = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Generate equation components: (ax + b)/c = d
  let a, b, c, d, solution;

  if (difficulty === 'easy') {
    // Simple coefficients for clean solutions
    a = _.random(1, 3);
    b = _.random(1, 6);
    c = _.random(2, 4);
    d = _.random(2, 8);
    
    // Calculate solution: x = (cd - b)/a
    solution = (c * d - b) / a;
    
    // Ensure integer solution by adjusting d if needed
    if (solution !== Math.floor(solution)) {
      d = Math.ceil((b + a * _.random(1, 8)) / c);
      solution = (c * d - b) / a;
    }
  } else if (difficulty === 'medium') {
    a = _.random(1, 4);
    b = _.random(1, 8);
    c = _.random(2, 5);
    
    // Work backwards from a nice solution
    solution = _.random(1, 10);
    d = (a * solution + b) / c;
    
    // Ensure d is a nice number
    if (d !== Math.floor(d)) {
      solution = _.random(2, 12);
      d = Math.ceil((a * solution + b) / c);
      solution = (c * d - b) / a;
    }
  } else {
    // Hard: May have decimal solutions
    a = _.random(2, 5);
    b = _.random(1, 10);
    c = _.random(2, 6);
    d = _.random(3, 15);
    solution = (c * d - b) / a;
    
    // Round to 1 decimal place if needed
    solution = Math.round(solution * 10) / 10;
  }

  // Build equation string
  const numerator = b >= 0 ? `${a}x + ${b}` : `${a}x - ${Math.abs(b)}`;
  const equation = a === 1 ? 
    (b >= 0 ? `\\frac{x + ${b}}{${c}} = ${d}` : `\\frac{x - ${Math.abs(b)}}{${c}} = ${d}`) :
    `\\frac{${numerator}}{${c}} = ${d}`;

  // Working steps for solution
  const step1 = `${numerator} = ${d} \\times ${c}`;
  const step2 = `${numerator} = ${d * c}`;
  const step3 = a === 1 ? 
    (b >= 0 ? `x = ${d * c} - ${b}` : `x = ${d * c} + ${Math.abs(b)}`) :
    (b >= 0 ? `${a}x = ${d * c} - ${b}` : `${a}x = ${d * c} + ${Math.abs(b)}`);
  const step4 = a === 1 ? `x = ${solution}` : `x = \\frac{${d * c - b}}{${a}} = ${solution}`;

  // Section-aware output
  if (sectionType === 'starter') {
    return {
      question: `Solve: ${equation}`,
      answer: `${step1}\\\\${step2}\\\\${step3}\\\\${step4}`,
      difficulty: 'algebra'
    };
  }
  
  else if (sectionType === 'diagnostic') {
    const incorrectOptions = [
      `${d}`, // Forgot to multiply by denominator
      `${(d * c) / a}`, // Forgot to handle the constant b
      `${solution + 1}`, // Arithmetic error
      `${Math.abs(solution - 2)}` // Different arithmetic error
    ].filter(opt => opt != solution); // Remove if accidentally correct

    return {
      questionDisplay: {
        text: 'Solve for x:',
        math: equation
      },
      correctAnswer: `${solution}`,
      options: [`${solution}`, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `Multiply both sides by ${c}, then solve: x = ${solution}`
    };
  }
  
  else if (sectionType === 'examples') {
    return {
      title: "Three-Step Equations with Fractions",
      questionText: `Solve ${equation}`,
      solution: [
        {
          explanation: "Start with the equation",
          formula: equation
        },
        {
          explanation: `Multiply both sides by ${c} to clear the fraction`,
          formula: step1
        },
        {
          explanation: "Simplify the right side",
          formula: step2
        },
        {
          explanation: a === 1 ? 
            (b >= 0 ? `Subtract ${b} from both sides` : `Add ${Math.abs(b)} to both sides`) :
            (b >= 0 ? `Subtract ${b} from both sides` : `Add ${Math.abs(b)} to both sides`),
          formula: step3
        },
        ...(a === 1 ? [] : [{
          explanation: `Divide both sides by ${a}`,
          formula: step4
        }]),
        {
          explanation: "Final answer",
          formula: `x = ${solution}`
        }
      ]
    };
  }

  return generateThreeStepEquation({ ...options, sectionType: 'diagnostic' });
};

// Export grouped generators for future expansion
export const equationGenerators = {
    generateDivisionEquation,
    generateThinkOfNumberQuestion,
    generateLinearEquationBothSides,
    generateThreeStepEquation,
    generateSimpleRearrangement,
    generateBracketEquation,
    generateFractionalEquation,
    generateLinearEquationBothSidesStarter,
    generateLinearEquationBothSidesWordProblem,
    // Add more generators here as needed
};

export default equationGenerators;