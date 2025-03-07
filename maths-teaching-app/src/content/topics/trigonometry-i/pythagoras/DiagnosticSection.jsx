import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import ShapeDisplay from '../../../../components/math/ShapeDisplay';
import { generateSquareAreaQuestion } from '../../../../generators/mathematical/squareGenerators';
import { generateSquareRootQuestion } from '../../../../generators/mathematical/squareRootGenerators';
import { generatePythagorasQuestion } from './generators';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    const questionTypes = {
        squareArea: {
            title: 'Find Square Area',
            generator: () => {
                const question = generateSquareAreaQuestion({ units: 'cm' });
                const area = parseInt(question.side) * parseInt(question.side);
                return {
                    questionDisplay: question.question,
                    correctAnswer: `${area}\\text{ cm}^2`,
                    options: [
                        `${area}\\text{ cm}^2`,
                        `${area + 2}\\text{ cm}^2`,
                        `${area - 2}\\text{ cm}^2`,
                        `${area * 2}\\text{ cm}^2`
                    ],
                    answerDisplay: `\\text{Area } = ${parseInt(question.side)}^2 = ${area}\\text{ cm}^2`,
                    shape: {
                        component: ShapeDisplay,
                        props: {
                            height: 200,
                            shape: {
                                type: 'square',
                                sideLength: parseInt(question.side),
                                showDimensions: true,
                                units: 'cm'
                            }
                        }
                    }
                };
            }
        },
        squareRoot: {
            title: 'Find Side Length',
            generator: () => {
                const question = generateSquareRootQuestion({ units: 'cm' });
                const side = Math.sqrt(parseInt(question.area));
                return {
                    questionDisplay: question.question,
                    correctAnswer: `${side}\\text{ cm}`,
                    options: [
                        `${side}\\text{ cm}`,
                        `${side + 1}\\text{ cm}`,
                        `${side - 1}\\text{ cm}`,
                        `${side * 2}\\text{ cm}`
                    ],
                    answerDisplay: `\\text{Side length } = \\sqrt{${question.area}} = ${side}\\text{ cm}`,
                    shape: {
                        component: ShapeDisplay,
                        props: {
                            shape: {
                                type: 'square',
                                sideLength: '?',
                                showArea: true,
                                area: parseInt(question.area),
                                units: 'cm',
                                height: 200
                            }
                        }
                    }
                };
            }
        },
        pythagorasTheorem: {
            title: 'Identify Hypotenuse',
            generator: () => {
                const question = generatePythagorasQuestion({ difficulty: 'basic' });
                return {
                    questionDisplay: 'Which side is the hypotenuse?',
                    correctAnswer: 'c',
                    options: ['a', 'b', 'c'],
                    answerDisplay: '\\text{The hypotenuse (c) is the longest side, opposite to the right angle}',
                    shape: {
                        component: ShapeDisplay,
                        props: {
                            height: 200,  // Moved height to props level
                            shape: {
                                type: 'rightTriangle',
                                base: 3,
                                height: 4,
                                hypotenuse: 5,
                                showRightAngle: true,
                                labelStyle: 'algebraic',
                                units: 'cm'
                            }
                        }
                    }
                };
            }
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