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
                smallDisplay={true}
                position="higher"
                labels={[`${base} cm`, `${height} cm`, `?`]}
                showRightAngle={true}
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
                smallDisplay={true}
                position="lower"
                labels={[`${a} cm`, `?`, `${c} cm`]}
                showRightAngle={true}
            />
        )
    };
};

// Generate a trigonometry question (preview of upcoming lesson)
const generateTrigQuestionPreview = () => {
    // Use common angles with nice values
    const angles = [30, 45, 60];
    const angle = angles[randomInt(0, 2)];
    const hypotenuse = randomInt(5, 9);
    
    // Calculate the opposite side using sine
    let opposite;
    if (angle === 30) opposite = hypotenuse * 0.5;
    else if (angle === 45) opposite = hypotenuse * 0.7071;
    else opposite = hypotenuse * 0.866;
    
    opposite = Math.round(opposite * 10) / 10;
    
    // Calculate the base for the right triangle
    const base = angle === 45 ? opposite : 
                (angle === 30 ? Math.sqrt(hypotenuse*hypotenuse - opposite*opposite) : 
                opposite/Math.sqrt(3));
    
    return {
        question: `In a right-angled triangle, the hypotenuse is ${hypotenuse} cm and one angle is ${angle}°. What is the length of the side opposite to this angle?`,
        answer: `${hypotenuse} \\times \\sin(${angle}°) = ${opposite}\\text{ cm}`,
        difficulty: 'preview',
        visualization: (
            <RightTriangle 
                base={base}
                height={opposite}
                smallDisplay={true}
                position="middle"
                labels={[`b`, `a = ?`, `c = ${hypotenuse}`]}
                showRightAngle={true}
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
    
    // Create an example solution (using simpler combinations for teaching purposes)
    // For demonstration, we'll create a path to reach the target
    const exampleNumbers = [...shuffledNumbers]; // Copy the numbers
    let solutionSteps = [];
    let currentValue = 0;
    let remainingTarget = target;
    
    // Try to construct a reasonable solution path
    // This is a simplified approach to guarantee we can show a valid solution
    if (target % 2 === 0 && shuffledNumbers.includes(2)) {
        // For even targets, we might use division by 2
        currentValue = target * 2;
        solutionSteps.push(`${currentValue} ÷ 2 = ${target}`);
        remainingTarget = currentValue;
        exampleNumbers.splice(exampleNumbers.indexOf(2), 1);
    } else if (shuffledNumbers.includes(25) && target % 25 === 0) {
        // For targets divisible by 25
        currentValue = target / 25;
        solutionSteps.push(`25 × ${currentValue} = ${target}`);
        remainingTarget = currentValue;
        exampleNumbers.splice(exampleNumbers.indexOf(25), 1);
    } else {
        // Start with multiplication of two numbers
        const num1 = exampleNumbers[0];
        const num2 = exampleNumbers[1];
        currentValue = num1 * num2;
        solutionSteps.push(`${num1} × ${num2} = ${currentValue}`);
        remainingTarget = target - currentValue;
        exampleNumbers.splice(0, 2);
        
        // If we need to add or subtract to reach target
        if (remainingTarget !== 0) {
            const num3 = exampleNumbers[0];
            if (remainingTarget > 0) {
                solutionSteps.push(`${currentValue} + ${num3} = ${currentValue + num3}`);
                currentValue += num3;
                remainingTarget -= num3;
            } else {
                solutionSteps.push(`${currentValue} - ${num3} = ${currentValue - num3}`);
                currentValue -= num3;
                remainingTarget += num3;
            }
        }
    }
    
    // If we couldn't get to the target exactly, acknowledge this
    if (currentValue !== target) {
        solutionSteps.push(`(Note: This is one approach. You would need additional steps to reach ${target} exactly.)`);
    }
    
    return {
        question: `Numbers Challenge: Use the numbers ${shuffledNumbers.join(', ')} to make ${target}.
You can use +, −, ×, ÷ and each number at most once.`,
        answer: `Example solution:\n${solutionSteps.join('\n')}`,
        difficulty: 'puzzle'
    };
};

const StarterSection = ({ currentTopic, currentLessonId }) => {
    // Question generators
    const questionGenerators = [
        // Pythagoras questions with visual representations
        generatePythagorasHypotenuseQuestion,
        generatePythagorasMissingSideQuestion,
        // Preview of upcoming trigonometry content
        generateTrigQuestionPreview,
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