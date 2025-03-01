// src/content/topics/trigonometry-i/pythagoras/generators.js
import _ from 'lodash';

// Useful Pythagorean triples for realistic problems
const PYTHAGOREAN_TRIPLES = [
    { a: 3, b: 4, c: 5 },
    { a: 5, b: 12, c: 13 },
    { a: 6, b: 8, c: 10 },
    { a: 8, b: 15, c: 17 },
    { a: 9, b: 12, c: 15 },
    { a: 7, b: 24, c: 25 },
];

/**
 * Base generator for Pythagoras theorem questions
 * @param {Object} config Configuration options
 * @returns {Object} Question data
 */
export const generatePythagorasQuestion = (config = {}) => {
    const {
        difficulty = 'medium',
        units = 'cm',
        questionType = _.sample(['findHypotenuse', 'findLeg']),
        orientation = _.sample(['right', 'left', 'up', 'down']),
        labelStyle = _.sample(['numeric', 'algebraic']),
    } = config;

    // Select an appropriate triple based on difficulty
    let triples = [...PYTHAGOREAN_TRIPLES];
    if (difficulty === 'easy') {
        triples = triples.slice(0, 2); // Easier triples
    } else if (difficulty === 'hard') {
        triples = triples.slice(3); // Harder triples
    }

    const triple = _.sample(triples);

    // Determine which value to ask for
    let missingValue, correctAnswer, questionText;

    if (questionType === 'findHypotenuse') {
        missingValue = 'c';
        correctAnswer = triple.c;
        questionText = `Find the length of the hypotenuse in this right-angled triangle.`;
    } else {
        // Randomly choose which leg to find
        const legToFind = _.sample(['a', 'b']);
        missingValue = legToFind;
        correctAnswer = triple[legToFind];
        questionText = `Find the length of the missing side in this right-angled triangle.`;
    }

    // Generate plausible distractors
    const distractors = generateDistractors(correctAnswer, triple);

    // Create shape configuration for visualization
    const shapeConfig = {
        orientation,
        labelStyle,
        base: triple.a,
        height: triple.b,
        hypotenuse: triple.c,
        missingValue,
        units,
    };

    return {
        questionText,
        correctAnswer,
        options: _.shuffle([correctAnswer, ...distractors]),
        shapeConfig,
        solution: generateSolution(triple, missingValue),
        difficulty,
    };
};

/**
 * Generate plausible wrong answers for Pythagoras problems
 */
function generateDistractors(correctAnswer, triple) {
    const distractors = new Set();

    // Common mistakes
    distractors.add(triple.a + triple.b); // Adding instead of using Pythagoras
    distractors.add(Math.round(Math.sqrt(Math.abs(triple.a * triple.a - triple.b * triple.b)))); // Subtracting squares

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
    let steps = [];

    steps.push({
        explanation: "Use Pythagoras' theorem: a² + b² = c²",
        formula: "a² + b² = c²"
    });

    if (missingValue === 'c') {
        steps.push({
            explanation: "Substitute the known values",
            formula: `${triple.a}² + ${triple.b}² = c²`
        });

        steps.push({
            explanation: "Calculate the squares",
            formula: `${triple.a * triple.a} + ${triple.b * triple.b} = c²`
        });

        steps.push({
            explanation: "Add the values",
            formula: `${triple.a * triple.a + triple.b * triple.b} = c²`
        });

        steps.push({
            explanation: "Take the square root of both sides",
            formula: `c = √${triple.a * triple.a + triple.b * triple.b} = ${triple.c}`
        });
    } else if (missingValue === 'a') {
        steps.push({
            explanation: "Substitute the known values",
            formula: `a² + ${triple.b}² = ${triple.c}²`
        });

        steps.push({
            explanation: "Rearrange to find a²",
            formula: `a² = ${triple.c}² - ${triple.b}²`
        });

        steps.push({
            explanation: "Calculate the squares",
            formula: `a² = ${triple.c * triple.c} - ${triple.b * triple.b}`
        });

        steps.push({
            explanation: "Subtract the values",
            formula: `a² = ${triple.c * triple.c - triple.b * triple.b}`
        });

        steps.push({
            explanation: "Take the square root of both sides",
            formula: `a = √${triple.c * triple.c - triple.b * triple.b} = ${triple.a}`
        });
    } else if (missingValue === 'b') {
        steps.push({
            explanation: "Substitute the known values",
            formula: `${triple.a}² + b² = ${triple.c}²`
        });

        steps.push({
            explanation: "Rearrange to find b²",
            formula: `b² = ${triple.c}² - ${triple.a}²`
        });

        steps.push({
            explanation: "Calculate the squares",
            formula: `b² = ${triple.c * triple.c} - ${triple.a * triple.a}`
        });

        steps.push({
            explanation: "Subtract the values",
            formula: `b² = ${triple.c * triple.c - triple.a * triple.a}`
        });

        steps.push({
            explanation: "Take the square root of both sides",
            formula: `b = √${triple.c * triple.c - triple.a * triple.a} = ${triple.b}`
        });
    }

    return steps;
}

/**
 * Generate a simple square area/perimeter question
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

    let questionText, correctAnswer, missingValue;

    switch (questionType) {
        case 'findArea':
            questionText = `Find the area of a square with side length ${side}${units}.`;
            correctAnswer = area;
            missingValue = 'area';
            break;
        case 'findPerimeter':
            questionText = `Find the perimeter of a square with side length ${side}${units}.`;
            correctAnswer = perimeter;
            missingValue = 'perimeter';
            break;
        case 'findSide':
            questionText = `Find the side length of a square with area ${area}${units}².`;
            correctAnswer = side;
            missingValue = 'side';
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

    // Shape configuration
    const shapeConfig = {
        sideLength: questionType === 'findSide' ? '?' : side,
        showArea: questionType === 'findSide' || questionType === 'findArea',
        showPerimeter: questionType === 'findPerimeter',
        areaValue: questionType === 'findSide' ? area : undefined,
        units,
    };

    return {
        questionText,
        correctAnswer,
        options: _.shuffle([correctAnswer, ...distractors]),
        shapeConfig,
        solution: generateSquareSolution(side, questionType),
        difficulty,
    };
};

/**
 * Generate solution steps for square problems
 */
function generateSquareSolution(side, questionType) {
    const steps = [];

    if (questionType === 'findArea') {
        steps.push({
            explanation: "Use the formula for the area of a square",
            formula: "Area = side² = side × side"
        });

        steps.push({
            explanation: "Substitute the side length",
            formula: `Area = ${side} × ${side} = ${side * side}`
        });
    }
    else if (questionType === 'findPerimeter') {
        steps.push({
            explanation: "Use the formula for the perimeter of a square",
            formula: "Perimeter = 4 × side"
        });

        steps.push({
            explanation: "Substitute the side length",
            formula: `Perimeter = 4 × ${side} = ${side * 4}`
        });
    }
    else if (questionType === 'findSide') {
        steps.push({
            explanation: "Use the formula for the area of a square",
            formula: "Area = side²"
        });

        steps.push({
            explanation: "Rearrange to find the side length",
            formula: "side = √Area"
        });

        steps.push({
            explanation: "Substitute the area",
            formula: `side = √${side * side} = ${side}`
        });
    }

    return steps;
}

// Diagnostic question generators for Pythagoras topic
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

    // Generate a starter question set
    generateStarterQuestions: () => {
        return {
            lastLesson: pythagoras.findHypotenuse('easy'),
            lastWeek: pythagoras.findLeg('medium'),
            lastTopic: pythagoras.conceptIdentification('medium'),
            lastYear: pythagoras.squareArea('easy')
        };
    }
};

export default pythagoras;