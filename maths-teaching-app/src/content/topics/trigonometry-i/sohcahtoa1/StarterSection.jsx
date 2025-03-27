// src/content/topics/trigonometry-i/sohcahtoa1/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import {
    generateSquareQuestion,
    generateSquareRootQuestion,
    generateSquarePerimeterQuestion
} from '../../../../generators/mathematical';

// Let's create some simple trig-related question generators
const generateSineQuestion = ({ units = 'cm' } = {}) => {
    const angles = [30, 45, 60];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const hypotenuse = Math.floor(Math.random() * 8) + 3; // 3 to 10
    
    // Calculate the opposite side using sine
    let opposite;
    if (angle === 30) opposite = hypotenuse * 0.5;
    else if (angle === 45) opposite = hypotenuse * 0.7071;
    else opposite = hypotenuse * 0.866;
    
    opposite = Math.round(opposite * 10) / 10; // Round to 1 decimal place
    
    return {
        question: `In a right-angled triangle, if the hypotenuse is ${hypotenuse}${units} and one angle is ${angle}°, what is the length of the opposite side?`,
        answer: `\\sin(${angle}°) \\times ${hypotenuse} = ${opposite}${units}`
    };
};

const generateCosineQuestion = ({ units = 'cm' } = {}) => {
    const angles = [30, 45, 60];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const hypotenuse = Math.floor(Math.random() * 8) + 3; // 3 to 10
    
    // Calculate the adjacent side using cosine
    let adjacent;
    if (angle === 30) adjacent = hypotenuse * 0.866;
    else if (angle === 45) adjacent = hypotenuse * 0.7071;
    else adjacent = hypotenuse * 0.5;
    
    adjacent = Math.round(adjacent * 10) / 10; // Round to 1 decimal place
    
    return {
        question: `In a right-angled triangle, if the hypotenuse is ${hypotenuse}${units} and one angle is ${angle}°, what is the length of the adjacent side?`,
        answer: `\\cos(${angle}°) \\times ${hypotenuse} = ${adjacent}${units}`
    };
};

const generateTangentQuestion = ({ units = 'cm' } = {}) => {
    const angles = [30, 45, 60];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const adjacent = Math.floor(Math.random() * 8) + 3; // 3 to 10
    
    // Calculate the opposite side using tangent
    let opposite;
    if (angle === 30) opposite = adjacent * 0.5774;
    else if (angle === 45) opposite = adjacent * 1;
    else opposite = adjacent * 1.732;
    
    opposite = Math.round(opposite * 10) / 10; // Round to 1 decimal place
    
    return {
        question: `In a right-angled triangle, if the adjacent side is ${adjacent}${units} and one angle is ${angle}°, what is the length of the opposite side?`,
        answer: `\\tan(${angle}°) \\times ${adjacent} = ${opposite}${units}`
    };
};

const StarterSection = ({ currentTopic, currentLessonId }) => {
    // Use our new trig question generators plus one from Pythagoras for review
    const questionGenerators = [
        () => generatePythagorasQuestion({ units: 'cm' }), // Review from last lesson
        () => generateSineQuestion({ units: 'cm' }),
        () => generateCosineQuestion({ units: 'cm' }),
        () => generateTangentQuestion({ units: 'cm' })
    ];

    return (
        <StarterSectionBase
            questionGenerators={questionGenerators}
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
        />
    );
};

// A review question from previous lesson
const generatePythagorasQuestion = ({ units = 'cm' } = {}) => {
    const a = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const b = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const c = Math.sqrt(a*a + b*b).toFixed(2);
    
    return {
        question: `Using Pythagoras' theorem, find the length of the hypotenuse in a right-angled triangle with sides ${a}${units} and ${b}${units}.`,
        answer: `c = \\sqrt{${a}^2 + ${b}^2} = ${c}${units}`
    };
};

export default StarterSection;