// src/content/topics/trigonometry-i/sohcahtoa1/DiagnosticSection.jsx
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import ShapeDisplay from '../../../../components/math/ShapeDisplay';
import * as MafsLib from 'mafs';
import _ from 'lodash';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    // Adapter for sine ratio questions
    const sineQuestionAdapter = () => {
        // Generate values
        const angles = [30, 45, 60];
        const angle = _.sample(angles);
        const hypotenuse = _.random(5, 10);
        
        // Calculate the opposite side
        let opposite;
        if (angle === 30) opposite = hypotenuse * 0.5;
        else if (angle === 45) opposite = hypotenuse * 0.7071;
        else opposite = hypotenuse * 0.866;
        
        opposite = Math.round(opposite * 10) / 10; // Round to 1 decimal place
        
        // Generate incorrect options
        const incorrectOptions = [
            Math.round(opposite * 1.2 * 10) / 10, // 20% higher
            Math.round(opposite * 0.8 * 10) / 10, // 20% lower
            Math.round(hypotenuse * Math.cos(angle * Math.PI / 180) * 10) / 10 // Using cosine instead
        ];
        
        return {
            questionDisplay: `Using the sine ratio, find the length of side "a" (opposite to the angle).`,
            correctAnswer: opposite,
            options: [opposite, ...incorrectOptions].sort(() => Math.random() - 0.5),
            answerDisplay: `\\sin(${angle}°) = \\frac{a}{${hypotenuse}} \\implies a = ${hypotenuse} \\times \\sin(${angle}°) = ${opposite}`,
            shape: {
                component: ShapeDisplay,
                props: {
                    shape: {
                        type: 'rightTriangle',
                        base: hypotenuse * Math.cos(angle * Math.PI / 180).toFixed(1),
                        height: opposite,
                        showRightAngle: true,
                        labelStyle: 'custom',
                        labels: {
                            sides: [
                                `c = ${hypotenuse} cm`, // Hypotenuse
                                `b`, // Adjacent 
                                `a = ?` // Opposite (what we're solving for)
                            ]
                        },
                        units: 'cm',
                        style: {
                            fillColor: MafsLib.Theme.indigo,
                            backgroundTransparent: true
                        }
                    },
                    height: 250
                }
            }
        };
    };
    
    // Adapter for cosine ratio questions
    const cosineQuestionAdapter = () => {
        // Generate values
        const angles = [30, 45, 60];
        const angle = _.sample(angles);
        const hypotenuse = _.random(5, 10);
        
        // Calculate the adjacent side
        let adjacent;
        if (angle === 30) adjacent = hypotenuse * 0.866;
        else if (angle === 45) adjacent = hypotenuse * 0.7071;
        else adjacent = hypotenuse * 0.5;
        
        adjacent = Math.round(adjacent * 10) / 10; // Round to 1 decimal place
        
        // Generate incorrect options
        const incorrectOptions = [
            Math.round(adjacent * 1.2 * 10) / 10, // 20% higher
            Math.round(adjacent * 0.8 * 10) / 10, // 20% lower
            Math.round(hypotenuse * Math.sin(angle * Math.PI / 180) * 10) / 10 // Using sine instead
        ];
        
        return {
            questionDisplay: `Using the cosine ratio, find the length of side "b" (adjacent to the angle).`,
            correctAnswer: adjacent,
            options: [adjacent, ...incorrectOptions].sort(() => Math.random() - 0.5),
            answerDisplay: `\\cos(${angle}°) = \\frac{b}{${hypotenuse}} \\implies b = ${hypotenuse} \\times \\cos(${angle}°) = ${adjacent}`,
            shape: {
                component: ShapeDisplay,
                props: {
                    shape: {
                        type: 'rightTriangle',
                        base: adjacent,
                        height: hypotenuse * Math.sin(angle * Math.PI / 180).toFixed(1),
                        showRightAngle: true,
                        labelStyle: 'custom',
                        labels: {
                            sides: [
                                `b = ?`, // Base/Adjacent (what we're solving for)
                                `a`, // Opposite
                                `c = ${hypotenuse} cm` // Hypotenuse
                            ]
                        },
                        units: 'cm',
                        style: {
                            fillColor: MafsLib.Theme.indigo,
                            backgroundTransparent: true
                        }
                    },
                    height: 250
                }
            }
        };
    };
    
    // Adapter for tangent ratio questions
    const tangentQuestionAdapter = () => {
        // Generate values
        const angles = [30, 45, 60];
        const angle = _.sample(angles);
        const adjacent = _.random(5, 10);
        
        // Calculate the opposite side
        let opposite;
        if (angle === 30) opposite = adjacent * 0.5774;
        else if (angle === 45) opposite = adjacent * 1;
        else opposite = adjacent * 1.732;
        
        opposite = Math.round(opposite * 10) / 10; // Round to 1 decimal place
        
        // Generate incorrect options
        const incorrectOptions = [
            Math.round(opposite * 1.2 * 10) / 10, // 20% higher
            Math.round(opposite * 0.8 * 10) / 10, // 20% lower
            Math.round(adjacent / Math.tan(angle * Math.PI / 180) * 10) / 10 // Using 1/tan instead
        ];
        
        return {
            questionDisplay: `Using the tangent ratio, find the length of side "a" (opposite to the angle).`,
            correctAnswer: opposite,
            options: [opposite, ...incorrectOptions].sort(() => Math.random() - 0.5),
            answerDisplay: `\\tan(${angle}°) = \\frac{a}{${adjacent}} \\implies a = ${adjacent} \\times \\tan(${angle}°) = ${opposite}`,
            shape: {
                component: ShapeDisplay,
                props: {
                    shape: {
                        type: 'rightTriangle',
                        base: adjacent,
                        height: opposite,
                        showRightAngle: true,
                        labelStyle: 'custom',
                        labels: {
                            sides: [
                                `b = ${adjacent} cm`, // Adjacent
                                `a = ?`, // Opposite (what we're solving for)
                                `c` // Hypotenuse
                            ]
                        },
                        units: 'cm',
                        style: {
                            fillColor: MafsLib.Theme.indigo,
                            backgroundTransparent: true
                        }
                    },
                    height: 250
                }
            }
        };
    };

    const questionTypes = {
        sineRatio: {
            title: 'Sine Ratio',
            generator: sineQuestionAdapter
        },
        cosineRatio: {
            title: 'Cosine Ratio',
            generator: cosineQuestionAdapter
        },
        tangentRatio: {
            title: 'Tangent Ratio',
            generator: tangentQuestionAdapter
        }
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Use DiagnosticSectionBase with themed wrapper */}
            <div className="border-2 border-t-4 border-purple-500 rounded-lg shadow-md bg-white overflow-hidden">
                <DiagnosticSectionBase
                    questionTypes={questionTypes}
                    currentTopic={currentTopic}
                    currentLessonId={currentLessonId}
                    themeKey="diagnostic" // Pass theme key to base component
                />
            </div>
        </div>
    );
};

export default DiagnosticSection;