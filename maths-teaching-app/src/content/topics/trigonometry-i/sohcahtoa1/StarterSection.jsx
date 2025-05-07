// maths-teaching-app/src/content/topics/trigonometry-i/sohcahtoa1/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/RightTriangle';

// Utility to generate random integers within a range
const randomInt = (min, max) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

// Generate Pythagoras question with hypotenuse
const generatePythagorasHypotenuseQuestion = () => {
    const base = randomInt(3, 6);
    const height = randomInt(3, 6);
    const hypotenuse = Math.sqrt(base*base + height*height).toFixed(2);
    
    return {
        question: `Using Pythagoras' theorem, find the length of the hypotenuse.`,
        answer: `\\sqrt{${base}^2 + ${height}^2} = ${hypotenuse}\\text{ cm}`,
        difficulty: 'medium',
        visualization: (
            <RightTriangle 
                base={base} 
                height={height}
                labelStyle="custom"
                labels={[`${base} cm`, `${height} cm`, `?`]}
                showRightAngle={true}
                style={{
                    fillColor: "#2196F3", // Blue
                    fillOpacity: 0.2
                }}
            />
        )
    };
};

// Generate Pythagoras question with missing side
const generatePythagorasMissingSideQuestion = () => {
    const c = randomInt(7, 10);
    const a = randomInt(3, 6);
    const b = Math.sqrt(c*c - a*a).toFixed(1);
    
    return {
        question: `Calculate the missing side length.`,
        answer: `\\sqrt{${c}^2 - ${a}^2} = ${b}\\text{ cm}`,
        difficulty: 'hard',
        visualization: (
            <RightTriangle 
                base={a} 
                height={Number(b)}
                labelStyle="custom"
                labels={[`${a} cm`, `?`, `${c} cm`]}
                showRightAngle={true}
                style={{
                    fillColor: "#4CAF50", // Green
                    fillOpacity: 0.2
                }}
            />
        )
    };
};

// Generate a triangle area question
const generateTriangleAreaQuestion = () => {
    const area = randomInt(12, 50); // Random area
    const height = randomInt(3, 8);  // Random height
    const base = Math.round((area * 2) / height * 10) / 10; // Calculate base
    
    return {
        question: `A triangle has an area of ${area} cm² and a height of ${height} cm. What is its base?`,
        answer: `\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}\\n${area} = \\frac{1}{2} \\times \\text{base} \\times ${height}\\n\\text{base} = \\frac{2 \\times ${area}}{${height}} = ${base} \\text{ cm}`,
        difficulty: 'medium',
        visualization: (
            <RightTriangle 
                base={base}
                height={height}
                showRightAngle={true}
                labelStyle="custom"
                labels={[`? cm`, `${height} cm`, "h"]}
                style={{
                    fillColor: "#9C27B0", // Purple
                    fillOpacity: 0.2
                }}
            />
        )
    };
};

// Generate a Countdown-style numbers game
const generateCountdownGame = () => {
    // Generate target number (100-999)
    const target = randomInt(100, 999);
    
    // Generate six numbers to work with
    // Mix of small (1-10) and large (25, 50, 75, 100)
    const smallNumbers = [];
    const largeNumbersPool = [25, 50, 75, 100];
    
    // Select 1-4 large numbers
    const numLarge = randomInt(1, 4);
    const selectedLarge = [];
    
    for (let i = 0; i < numLarge; i++) {
        const idx = randomInt(0, largeNumbersPool.length - 1);
        selectedLarge.push(largeNumbersPool[idx]);
        // Remove the number to prevent duplicates
        largeNumbersPool.splice(idx, 1); 
    }
    
    // Select the rest as small numbers
    for (let i = 0; i < 6 - numLarge; i++) {
        smallNumbers.push(randomInt(1, 10));
    }
    
    // Combine all numbers
    const numbers = [...selectedLarge, ...smallNumbers];
    
    // Shuffle the numbers
    const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);
    
    return {
        question: `Numbers Challenge: Use the numbers ${shuffledNumbers.join(', ')} to make ${target}.
You can use +, −, ×, ÷ and each number at most once.`,
        answer: `Example solution:
${target} can be made using ${shuffledNumbers.slice(0, 3).join(', ')}`,
        difficulty: 'puzzle'
    };
};

const StarterSection = ({ currentTopic, currentLessonId }) => {
    // Question generators
    const questionGenerators = [
        // Pythagoras questions with visual representations
        generatePythagorasHypotenuseQuestion,
        generatePythagorasMissingSideQuestion,
        // Triangle area question
        generateTriangleAreaQuestion,
        // Countdown-style numbers game
        generateCountdownGame
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