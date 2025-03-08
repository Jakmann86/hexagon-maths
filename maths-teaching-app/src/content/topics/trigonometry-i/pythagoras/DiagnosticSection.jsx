import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import ShapeDisplay from '../../../../components/math/ShapeDisplay';
import { generateSquareAreaQuestion, generateSquareSideLengthQuestion } from '../../../../generators/mathematical/squareGenerators';
import { generateSquareRootQuestion } from '../../../../generators/mathematical/squareRootGenerators';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Adapter for square area questions
    const squareAreaAdapter = () => {
        const generated = generateSquareAreaQuestion({ units: 'cm' });
        
        // Extract side length from the question text using regex
        const sideMatch = generated.question.match(/(\d+)\s*cm/);
        const side = sideMatch ? parseInt(sideMatch[1]) : 5; // Default to 5 if parsing fails
        const area = side * side;
        
        return {
            questionDisplay: generated.question,
            correctAnswer: `${area}\\text{ cm}^2`,
            options: [
                `${area}\\text{ cm}^2`,
                `${area + 2}\\text{ cm}^2`,
                `${area - 2}\\text{ cm}^2`,
                `${side * 4}\\text{ cm}^2`  // Common mistake: using perimeter
            ].sort(() => Math.random() - 0.5),
            answerDisplay: generated.answer,
            shape: {
                component: ShapeDisplay,
                props: {
                    shape: {
                        type: 'square',
                        sideLength: side,
                        showDimensions: true,
                        units: 'cm'
                    },
                    height: 250, // Explicit height in pixels
                    className: 'my-4' // Add margin for spacing
                }
            }
        };
    };
    
    // Adapter for square root questions
    const squareRootAdapter = () => {
        const generated = generateSquareRootQuestion({ units: 'cm' });
        
        // Extract area from the question text using regex
        const areaMatch = generated.question.match(/(\d+)\s*cm²/);
        const area = areaMatch ? parseInt(areaMatch[1]) : 25; // Default to 25 if parsing fails
        const side = Math.sqrt(area);
        
        return {
            questionDisplay: generated.question,
            correctAnswer: `${side}\\text{ cm}`,
            options: [
                `${side}\\text{ cm}`,
                `${side + 1}\\text{ cm}`,
                `${side - 1}\\text{ cm}`,
                `${area / 4}\\text{ cm}`  // Common mistake: dividing by 4 instead of square root
            ].sort(() => Math.random() - 0.5),
            answerDisplay: generated.answer,
            shape: {
                component: ShapeDisplay,
                props: {
                    shape: {
                        type: 'square',
                        sideLength: '?',
                        showArea: true,
                        areaLabel: `${area} cm²`,
                        units: 'cm'
                    },
                    height: 250, // Explicit height in pixels
                    className: 'my-4' // Add margin for spacing
                }
            }
        };
    };
    
    // Adapter for Pythagoras concept identification
    const pythagorasConceptAdapter = () => {
        return {
            questionDisplay: 'Which side is the hypotenuse in this right-angled triangle?',
            correctAnswer: 'c',
            options: ['a', 'b', 'c', 'none'].sort(() => Math.random() - 0.5),
            answerDisplay: '\\text{The hypotenuse (c) is the longest side, opposite to the right angle}',
            shape: {
                component: ShapeDisplay,
                props: {
                    shape: {
                        type: 'rightTriangle',
                        base: 3,
                        height: 4,
                        showRightAngle: true,
                        labelStyle: 'algebraic', // This will trigger algebraic labels
                        labels: {
                            sides: ['a', 'b', 'c'], // Explicitly set sides
                            angles: ['A', 'B', 'C'], // Explicitly set angles
                            vertices: ['A', 'B', 'C'] // Explicitly set vertices
                        },
                        units: 'cm'
                    },
                    height: 250, // Explicit height in pixels
                    className: 'my-4' // Add margin for spacing
                }
            }
        };
    };

    const questionTypes = {
        squareArea: {
            title: 'Find Square Area',
            generator: squareAreaAdapter
        },
        squareRoot: {
            title: 'Find Side Length',
            generator: squareRootAdapter
        },
        pythagorasTheorem: {
            title: 'Identify Hypotenuse',
            generator: pythagorasConceptAdapter
        }
    };

    return (
        <DiagnosticSectionBase
            questionTypes={questionTypes}
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
        />
    );
};

export default DiagnosticSection;