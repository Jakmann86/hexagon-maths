import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/RightTriangle';

// Utility to generate random integers within a range
const randomInt = (min, max) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

// Generates Pythagoras questions for review from last lesson
const generatePythagorasQuestions = ({ units = 'cm' } = {}) => [
    // Question 1: Find the hypotenuse with visual representation
    () => {
        const base = randomInt(3, 7);
        const height = randomInt(3, 7);
        const hypotenuse = Math.sqrt(base*base + height*height).toFixed(2);
        
        return {
            question: `Using Pythagoras' theorem, find the length of the hypotenuse.`,
            answer: `\\sqrt{${base}^2 + ${height}^2} = ${hypotenuse}${units}`,
            difficulty: 'medium',
            visualization: (
                <RightTriangle 
                    base={base} 
                    height={height} 
                    units={units}
                    labels={{
                        sides: [`${base} ${units}`, `${height} ${units}`, `x ${units}`]
                    }}
                />
            )
        };
    },
    // Question 2: Known hypotenuse with visual representation
    () => {
        const c = randomInt(7, 15);
        const a = randomInt(3, Math.floor(Math.sqrt(c*c/2)));
        const b = Math.sqrt(c*c - a*a).toFixed(2);
        
        return {
            question: `Calculate the side length.`,
            answer: `\\sqrt{${c}^2 - ${a}^2} = ${b}${units}`,
            difficulty: 'hard',
            visualization: (
                <RightTriangle 
                    base={a} 
                    height={Number(b)} 
                    units={units}
                    labels={{
                        sides: [`${a} ${units}`, `x ${units}`, `${c} ${units}`]
                    }}
                />
            )
        };
    }
];

// Simple algebra question 
const generateAlgebraQuestion = () => {
    // Generate a linear equation solving problem
    const a = randomInt(2, 9);
    const b = randomInt(1, 6);
    const solution = randomInt(3, 12);
    
    const equation = `${a}x + ${b} = ${a * solution + b}`;
    
    return {
        question: `Solve the following equation for x:`,
        answer: `x = ${solution}`,
        difficulty: 'medium',
        question: `Solve the following equation for x: ${equation}`,
        explanation: `To solve this equation:
1. Subtract ${b} from both sides
2. Divide both sides by ${a}
3. Find the value of x`
    };
};

// Number construction puzzle
const generateNumberConstructionPuzzle = () => {
    return {
        question: `Using only the operations +, -, ×, ÷, and the numbers 1, 2, 3, 4, how many different ways can you create the number 24? 

Rules:
- You must use each number exactly once
- You can use each operation 
- Intermediate steps can be any number

Submit your unique solutions!`,
        answer: 'Open-ended problem with multiple possible solutions',
        difficulty: 'puzzle'
    };
};

const StarterSection = ({ currentTopic, currentLessonId }) => {
    // Question generators
    const questionGenerators = [
        // Pythagoras questions with visual representations
        ...generatePythagorasQuestions(),
        // Algebra question
        generateAlgebraQuestion,
        // Puzzle question
        generateNumberConstructionPuzzle
    ];

    return (
        <StarterSectionBase
            questionGenerators={questionGenerators}
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
        />
    );
};

export default StarterSection;