// src/content/topics/trigonometry-i/pythagoras/generators.js
import _ from 'lodash';
import React from 'react';
import {
    createPythagoreanTriangle,
    createPythagoreanTripleTriangle,
    PYTHAGOREAN_TRIPLES
} from '../../../../factories/triangleFactories';
import MathDisplay from '../../../../components/common/MathDisplay';
import { createSquare } from '../../../../factories/quadrilateralFactories';
import Square from '../../../../components/math/shapes/quadrilaterals/Square';

/**
 * Core generator for Pythagoras' theorem questions
 * 
 * @param {Object} config - Configuration for the question
 * @returns {Object} Question data
 */
export const generatePythagorasQuestion = (config = {}) => {
    const {
        difficulty = 'medium',
        units = 'cm',
        questionType = _.sample(['findHypotenuse', 'findLeg']),
        orientation = _.sample(['default', 'rotate90', 'rotate180', 'rotate270'])
    } = config;

    // Choose appropriate triples based on difficulty
    let triples = [...PYTHAGOREAN_TRIPLES];
    if (difficulty === 'easy') {
        triples = triples.slice(0, 2); // Easier triples (3,4,5 and 5,12,13)
    } else if (difficulty === 'hard') {
        triples = triples.slice(3); // Harder triples
    }

    // Randomly select a triple
    const triple = _.sample(triples);
    const [a, b, c] = triple;

    // Determine what to ask for
    let missingValue, correctAnswer, questionText;

    if (questionType === 'findHypotenuse') {
        missingValue = 'hypotenuse';
        correctAnswer = c;
        questionText = `Find the length of the hypotenuse in this right-angled triangle.`;
    } else {
        // Randomly choose which leg to find
        const legToFind = _.sample(['base', 'height']);
        missingValue = legToFind;
        correctAnswer = legToFind === 'base' ? a : b;
        questionText = `Find the length of the missing side in this right-angled triangle.`;
    }

    // Generate distractors (plausible wrong answers)
    const distractors = generateDistractors(correctAnswer, triple);

    // Create solution steps
    const solution = generateSolution(triple, missingValue);

    return {
        questionText,
        correctAnswer,
        options: _.shuffle([correctAnswer, ...distractors]),
        visualization: createPythagoreanTripleTriangle({
            triple,
            unknownSide: missingValue,
            orientation,
            units,
            sectionType: 'diagnostic'
        }),
        solution,
        difficulty
    };
};

/**
 * Generate plausible distractors (wrong answers) for Pythagoras problems
 */
function generateDistractors(correctAnswer, triple) {
    const [a, b, c] = triple;
    const distractors = new Set();

    // Common mistake: adding instead of using Pythagoras
    distractors.add(a + b);

    // Common mistake: subtracting squares instead of adding
    distractors.add(Math.round(Math.sqrt(Math.abs(a * a - b * b))));

    // Close but incorrect values
    distractors.add(correctAnswer + _.random(1, 2));
    distractors.add(Math.max(1, correctAnswer - _.random(1, 2)));

    // Return three unique distractors
    return Array.from(distractors).slice(0, 3);
}

/**
 * Generate solution steps for Pythagoras problems
 */
function generateSolution(triple, missingValue) {
    const [a, b, c] = triple;
    const steps = [];

    steps.push({
        explanation: "Use Pythagoras' theorem: a² + b² = c²",
        formula: "a² + b² = c²"
    });

    if (missingValue === 'hypotenuse') {
        steps.push({
            explanation: "Substitute the known values",
            formula: `${a}² + ${b}² = c²`
        });

        steps.push({
            explanation: "Calculate the squares",
            formula: `${a * a} + ${b * b} = c²`
        });

        steps.push({
            explanation: "Add the values",
            formula: `${a * a + b * b} = c²`
        });

        steps.push({
            explanation: "Take the square root of both sides",
            formula: `c = \\sqrt{${a * a + b * b}} = ${c}`
        });

        // Add calculator method
        steps.push({
            explanation: "Quick calculator method:",
            formula: `c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${c}`
        });
    } else if (missingValue === 'base') {
        steps.push({
            explanation: "Substitute the known values",
            formula: `a² + ${b}² = ${c}²`
        });

        steps.push({
            explanation: "Rearrange to find a²",
            formula: `a² = ${c}² - ${b}²`
        });

        steps.push({
            explanation: "Calculate the squares",
            formula: `a² = ${c * c} - ${b * b}`
        });

        steps.push({
            explanation: "Subtract the values",
            formula: `a² = ${c * c - b * b}`
        });

        steps.push({
            explanation: "Take the square root of both sides",
            formula: `a = \\sqrt{${c * c - b * b}} = ${a}`
        });

        // Add calculator method
        steps.push({
            explanation: "Quick calculator method:",
            formula: `a = \\sqrt{${c}^2 - ${b}^2} = \\sqrt{${c * c} - ${b * b}} = ${a}`
        });
    } else if (missingValue === 'height') {
        steps.push({
            explanation: "Substitute the known values",
            formula: `${a}² + b² = ${c}²`
        });

        steps.push({
            explanation: "Rearrange to find b²",
            formula: `b² = ${c}² - ${a}²`
        });

        steps.push({
            explanation: "Calculate the squares",
            formula: `b² = ${c * c} - ${a * a}`
        });

        steps.push({
            explanation: "Subtract the values",
            formula: `b² = ${c * c - a * a}`
        });

        steps.push({
            explanation: "Take the square root of both sides",
            formula: `b = \\sqrt{${c * c - a * a}} = ${b}`
        });

        // Add calculator method
        steps.push({
            explanation: "Quick calculator method:",
            formula: `b = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${c * c} - ${a * a}} = ${b}`
        });
    }

    return steps;
}

/**
 * Generate a square area/perimeter question
 */
export const generateSquareQuestion = (config = {}) => {
    const {
        difficulty = 'medium',
        units = 'cm',
        questionType = _.sample(['findArea', 'findPerimeter', 'findSide']),
    } = config;

    // Generate a side length based on difficulty
    let side;
    if (difficulty === 'easy') {
        side = _.random(3, 6);
    } else if (difficulty === 'medium') {
        side = _.random(5, 10);
    } else {
        side = _.random(8, 15);
    }

    const area = side * side;
    const perimeter = side * 4;

    let questionText, correctAnswer;

    switch (questionType) {
        case 'findArea':
            questionText = `Find the area of a square with side length ${side}${units}.`;
            correctAnswer = area;
            break;
        case 'findPerimeter':
            questionText = `Find the perimeter of a square with side length ${side}${units}.`;
            correctAnswer = perimeter;
            break;
        case 'findSide':
            questionText = `Find the side length of a square with area ${area}${units}².`;
            correctAnswer = side;
            break;
    }

    // Generate distractors
    const distractors = [];
    if (questionType === 'findArea') {
        distractors.push(side * 4); // Perimeter instead of area
        distractors.push(side * 2); // Doubling instead of squaring
        distractors.push(side + 1); // Just slightly off
    } else if (questionType === 'findPerimeter') {
        distractors.push(area); // Area instead of perimeter
        distractors.push(side * 2); // Only two sides
        distractors.push(side * 3); // Only three sides
    } else {
        distractors.push(Math.sqrt(area / 2)); // Square root of half the area
        distractors.push(area / 4); // Dividing by 4 instead of taking square root
        distractors.push(Math.sqrt(area) + 1); // Just slightly off
    }

    // Create square visualization config
    const squareVisualization = React.createElement(
        'div',
        { style: { height: '220px', width: '100%' } },
        React.createElement(
            'div',
            {
                style: {
                    height: '150px',
                    width: '150px',
                    backgroundColor: '#e0f2fe',
                    border: '2px solid #3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                }
            },
            questionType === 'findSide'
                ? `Area = ${area} ${units}²`
                : `Side = ${side} ${units}`
        )
    );

    return {
        questionText,
        correctAnswer,
        options: _.shuffle([correctAnswer, ...distractors]),
        visualization: squareVisualization,
        solution: generateSquareSolution(side, questionType, units),
        difficulty,
    };
};

/**
 * Generate solution steps for square problems
 */
function generateSquareSolution(side, questionType, units) {
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
}

/**
 * Generate a square area and perimeter question for "Last Lesson"
 * Creates a consistent question with visualization using the quadrilateral factory
 */
export const generateSquareAreaPerimeterQuestion = () => {
    const side = _.random(3, 8);
    const area = side * side;
    const perimeter = side * 4;

    return {
        question: `Find the area and perimeter of a square with sides ${side} cm.`,
        answer: `\\text{Area} = ${side}^2 = ${area}\\text{ cm}^2\\\\\\text{Perimeter} = 4 \\times ${side} = ${perimeter}\\text{ cm}`,
        visualization: createSquare({
            sideLength: side,
            showDimensions: true,
            units: 'cm',
            sectionType: 'starter',
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.2
            }
        })
    };
};

/**
 * Generate a triangle area question for "Last Topic"
 * Creates a consistent question with visualization
 */
export const generateTriangleAreaQuestion = () => {
    const base = _.random(4, 10);
    const height = _.random(3, 8);
    const area = (base * height) / 2;

    return {
        question: `Calculate the area of this triangle with base ${base} cm and height ${height} cm.`,
        answer: `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height} = ${area}\\text{ cm}^2`,
        visualization: createPythagoreanTriangle({
            base: base,
            height: height,
            showRightAngle: true,
            labelStyle: "custom",
            labels: [`${base} cm`, `${height} cm`, null],
            units: 'cm',
            sectionType: 'starter',
            style: {
                fillColor: '#2ecc71',
                fillOpacity: 0.2
            }
        })
    };
};

/**
 * Generate a number puzzle for "Last Year" with complete solution
 */
export const generateNumberPuzzle = () => {
    // Start with numbers that will work for a valid solution
    let target, numbers, operations, steps;

    // Generate a valid puzzle by working backward from the solution
    const generateValidPuzzle = () => {
        // Pick 4 single-digit numbers
        numbers = [_.random(2, 9), _.random(2, 9), _.random(2, 9), _.random(2, 9)];

        // Start with the first two numbers and apply an operation
        let result1 = numbers[0] * numbers[1]; // Use multiplication as first step

        // Second step - addition
        let result2 = result1 + numbers[2];

        // Final step - use the last number to get a nice target
        // Subtraction usually gives a clean result
        target = result2 - numbers[3];

        // Check if target is in a good range (20-100)
        if (target < 20 || target > 100) {
            return false;
        }

        // Define the operations used
        operations = ['×', '+', '-'];

        // Define the solution steps
        steps = [
            `Step 1: ${numbers[0]} × ${numbers[1]} = ${result1}`,
            `Step 2: ${result1} + ${numbers[2]} = ${result2}`,
            `Step 3: ${result2} - ${numbers[3]} = ${target}`
        ];

        return true;
    };

    // Keep trying until we get a valid puzzle
    while (!generateValidPuzzle()) {
        // Try again until success
    }

    return {
        question: `Using the numbers ${numbers.join(', ')} and the operations +, -, ×, ÷, find a way to make ${target}. You can use each number only once.`,
        answer: steps.join('\n'),
        difficulty: 'puzzle'
    };
};

/**
 * Diagnostic Question Generators for Pythagoras topic
 * Add these to your existing generators.js file
 */

// Adapter for square area questions
export const generateSquareAreaQuestion = () => {
    // Generate side length between 3 and 8
    const side = _.random(3, 8);
    const area = side * side;

    return {
        questionDisplay: `Find the area of this square with side length ${side} cm.`,
        correctAnswer: `${area}\\text{ cm}^2`,
        options: [
            `${area}\\text{ cm}^2`,
            `${area + 2}\\text{ cm}^2`,
            `${area - 2}\\text{ cm}^2`,
            `${side * 4}\\text{ cm}^2`  // Common mistake: using perimeter
        ].sort(() => Math.random() - 0.5),
        explanation: `Area of a square = side² = ${side}² = ${area} cm²`,
        visualization: createSquare({
            sideLength: side,
            showDimensions: true,
            units: 'cm',
            sectionType: 'diagnostic',
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.2
            }
        })
    };
};

// Adapter for square root questions
export const generateSquareRootQuestion = () => {
    // Generate a perfect square area between 16 and 100
    const perfectSquares = [16, 25, 36, 49, 64, 81, 100];
    const area = _.sample(perfectSquares);
    const side = Math.sqrt(area);
    
    return {
        questionDisplay: `Find the side length of a square with area ${area} cm².`,
        correctAnswer: `${side}\\text{ cm}`,
        options: [
            `${side}\\text{ cm}`,
            `${side + 1}\\text{ cm}`,
            `${side - 1}\\text{ cm}`,
            `${area / 4}\\text{ cm}`  // Common mistake: dividing by 4 instead of square root
        ].sort(() => Math.random() - 0.5),
        explanation: `Side length = √Area = √${area} = ${side} cm`,
        visualization: createSquare({
            sideLength: side,
            showDimensions: false,
            showArea: true,
            areaLabel: `${area} cm²`, // Original label format
            units: 'cm',
            containerHeight: 240,     // Match original height
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.3,
                backgroundTransparent: true  // Include this prop from original
            }
        })
    };
};

// Adapter for Pythagoras concept identification with enhanced randomization
export const generatePythagorasConceptQuestion = () => {
    // Use a common Pythagorean triple
    const pythagoreanTriples = [
        { a: 3, b: 4, c: 5 },
        { a: 5, b: 12, c: 13 },
        { a: 6, b: 8, c: 10 },
        { a: 8, b: 15, c: 17 },
        { a: 9, b: 12, c: 15 }
    ];
    
    const triple = _.sample(pythagoreanTriples);
    
    // Random orientation for more variety
    const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
    const orientation = _.sample(orientations);
    
    // Choose between algebraic and numeric labeling
    const useAlgebraic = Math.random() > 0.5;
    
    let questionText, correctAnswer, options, labels;
    
    if (useAlgebraic) {
        // Algebraic labels (a, b, c)
        questionText = 'Which side is the hypotenuse in this right-angled triangle?';
        correctAnswer = 'c'; // Always 'c' for algebraic labeling
        options = ['a', 'b', 'c', 'none'].sort(() => Math.random() - 0.5);
        labels = ['a', 'b', 'c']; // Standard algebraic labels
    } else {
        // Numeric labels showing measurements
        questionText = 'Which is the longest side (the hypotenuse) in this right-angled triangle?';
        correctAnswer = `${triple.c} cm`; // The c value with units
        options = [
            `${triple.a} cm`, 
            `${triple.b} cm`, 
            `${triple.c} cm`, 
            'none'
        ].sort(() => Math.random() - 0.5);
        labels = [`${triple.a} cm`, `${triple.b} cm`, `${triple.c} cm`];
    }
    
    return {
        questionDisplay: questionText,
        correctAnswer: correctAnswer,
        options: options,
        explanation: 'The hypotenuse is the longest side in a right-angled triangle, opposite to the right angle.',
        visualization: createPythagoreanTriangle({
            base: triple.a,
            height: triple.b,
            showRightAngle: true,
            labelStyle: useAlgebraic ? "algebraic" : "custom",
            labels: labels,
            orientation: orientation,
            units: 'cm',
            sectionType: 'diagnostic',
            containerHeight: 200, // Reduced size
            style: {
                fillColor: '#9b59b6',
                fillOpacity: 0.2
            }
        })
    };
};

/**
 * Specialized diagnostic question generators for Pythagoras topic
 */
export const pythagoras = {
    // Basic identification of the Pythagorean theorem
    conceptIdentification: (difficulty = 'medium') => {
        return generatePythagorasQuestion({
            difficulty,
            questionType: 'findHypotenuse',
            labelStyle: 'algebraic'
        });
    },

    // Finding the hypotenuse
    findHypotenuse: (difficulty = 'medium') => {
        return generatePythagorasQuestion({
            difficulty,
            questionType: 'findHypotenuse',
            labelStyle: 'numeric'
        });
    },

    // Finding a missing leg
    findLeg: (difficulty = 'medium') => {
        return generatePythagorasQuestion({
            difficulty,
            questionType: 'findLeg',
            labelStyle: 'numeric'
        });
    },

    // Square-related questions
    squareArea: (difficulty = 'easy') => {
        return generateSquareQuestion({
            difficulty,
            questionType: 'findArea'
        });
    },

    /**
    * Generate starter questions for the Pythagoras topic
    * Returns an object with questions for different review categories
    */
    generateStarterQuestions: () => {
        // Create the questions
        const questions = {
            lastLesson: generateSquareAreaPerimeterQuestion(),
            lastTopic: generateTriangleAreaQuestion(),
            lastWeek: {
                question: "Name all the quadrilaterals (4-sided shapes):",
                answer: `• Square: Equal sides, all 90° angles\n• Rectangle: Opposite sides equal, all angles 90°\n• Rhombus: All sides equal, opposite angles equal\n• Parallelogram: Opposite sides parallel & equal`,
                difficulty: 'text' // Mark as text to avoid LaTeX formatting
            },
            lastYear: generateNumberPuzzle()
        };

        return questions;
    },

    /**
 * Add this to the pythagoras object in generators.js
 */
    generateDiagnosticQuestions: () => {
        return {
            squareArea: {
                title: 'Find Square Area',
                generator: generateSquareAreaQuestion
            },
            squareRoot: {
                title: 'Find Side Length',
                generator: generateSquareRootQuestion
            },
            pythagorasTheorem: {
                title: 'Identify Hypotenuse',
                generator: generatePythagorasConceptQuestion
            }
        };
    },

    /**
 * Generate example questions with random properties for worked examples
 * Creates new random examples each time it's called
 */
    generateExampleQuestions: () => {
        // We'll always generate 3 examples, but with randomized properties

        // Get all possible orientations
        const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];

        // Get all possible missing sides
        const missingSides = ['base', 'height', 'hypotenuse'];

        // Make a copy of triples to work with
        const availableTriples = [...PYTHAGOREAN_TRIPLES];

        // Titles for each type of problem
        const titles = {
            'base': "Find the Base",
            'height': "Find the Height",
            'hypotenuse': "Find the Hypotenuse"
        };

        // Question text templates
        const questionTemplates = {
            'base': "Find the length of the base in this right-angled triangle.",
            'height': "Find the length of the height in this right-angled triangle.",
            'hypotenuse': "Find the length of the hypotenuse in this right-angled triangle."
        };

        // Create 3 random but distinct examples
        const examples = [];

        for (let i = 0; i < 3; i++) {
            // Pick a random triple
            const tripleIndex = _.random(0, availableTriples.length - 1);
            const triple = availableTriples[tripleIndex];

            // Remove this triple to avoid duplicates
            availableTriples.splice(tripleIndex, 1);

            // If we run out of triples, reset the array
            if (availableTriples.length === 0) {
                availableTriples.push(...PYTHAGOREAN_TRIPLES);
            }

            // Pick a random missing side
            const missingSide = _.sample(missingSides);

            // Pick a random orientation
            const orientation = _.sample(orientations);

            // Generate solution steps
            const solution = generateSolution(triple, missingSide);

            // Create the example
            examples.push({
                title: titles[missingSide] || "Find the Missing Side",
                question: questionTemplates[missingSide] || "Find the length of the missing side in this right-angled triangle.",
                triple: triple,
                missingValue: missingSide,
                orientation: orientation,
                steps: solution,
                visualization: createPythagoreanTripleTriangle({
                    triple,
                    unknownSide: missingSide,
                    orientation,
                    units: 'cm',
                    sectionType: 'examples'
                })
            });
        }

        // Add a bit more variety to the 3rd example if it exists
        if (examples.length >= 3) {
            examples[2].question = "Find the length of the missing side to 1 decimal place.";
        }

        return examples;
    },

    /**
     * Generate challenge questions for the challenge section
     */
    generateChallengeQuestions: () => {
        // Create more complex Pythagoras challenges
        const challenges = [
            // Challenge 1: Finding height of a ladder against a wall
            {
                problemText: "A ladder of length 10m reaches a height of 8m up a wall. How far is the base of the ladder from the wall?",
                solution: [
                    {
                        explanation: "Let x be the distance from the wall to the base of the ladder.",
                        formula: "x^2 + 8^2 = 10^2"
                    },
                    {
                        explanation: "Substitute the values:",
                        formula: "x^2 + 64 = 100"
                    },
                    {
                        explanation: "Rearrange to find x²:",
                        formula: "x^2 = 100 - 64 = 36"
                    },
                    {
                        explanation: "Take the square root:",
                        formula: "x = \\sqrt{36} = 6\\text{ m}"
                    }
                ],
                visualization: createPythagoreanTriangle({
                    base: 6,
                    height: 8,
                    unknownSide: 'base',
                    orientation: 'rotate270',
                    sectionType: 'challenge'
                })
            },

            // Challenge 2: Ship navigation problem
            {
                problemText: "A ship sails 24km east and then 10km north. How far is the ship from its starting point?",
                solution: [
                    {
                        explanation: "The ship's journey creates a right-angled triangle.",
                        formula: "\\text{distance}^2 = 24^2 + 10^2"
                    },
                    {
                        explanation: "Calculate the squares:",
                        formula: "\\text{distance}^2 = 576 + 100 = 676"
                    },
                    {
                        explanation: "Take the square root:",
                        formula: "\\text{distance} = \\sqrt{676} = 26\\text{ km}"
                    }
                ],
                visualization: createPythagoreanTriangle({
                    base: 24,
                    height: 10,
                    orientation: 'default',
                    sectionType: 'challenge'
                })
            }
        ];

        return challenges;
    }
};

export default pythagoras;