// src/content/topics/algebra-i/expanding-brackets/DiagnosticSection.jsx
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import Rectangle from '../../../../components/math/shapes/Rectangle';
import MathDisplay from '../../../../components/common/MathDisplay';
import _ from 'lodash';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    // Adapter for simplifying expressions (collecting like terms)
    const simplifyingExpressionsAdapter = () => {
        // Generate random coefficients for different terms
        const xCoefficients = [_.random(1, 9), _.random(1, 9)];
        const yCoefficients = [_.random(1, 9), _.random(1, 9)];
        const constants = [_.random(1, 9), _.random(1, 9)];
        
        // Calculate the correct answers
        const simplifiedX = xCoefficients[0] + xCoefficients[1];
        const simplifiedY = yCoefficients[0] + yCoefficients[1];
        const simplifiedConstant = constants[0] + constants[1];
        
        // Create the expression string
        const expression = `${xCoefficients[0]}x + ${yCoefficients[0]}y + ${constants[0]} + ${xCoefficients[1]}x + ${yCoefficients[1]}y + ${constants[1]}`;
        
        // Create the answer string
        const answer = `${simplifiedX}x + ${simplifiedY}y + ${simplifiedConstant}`;
        
        // Generate incorrect options with common mistakes
        const incorrectAnswers = [
            // Mistake: Adding everything together
            `${xCoefficients[0] + xCoefficients[1] + yCoefficients[0] + yCoefficients[1] + constants[0] + constants[1]}`,
            // Mistake: Only combining some terms
            `${simplifiedX}x + ${yCoefficients[0]}y + ${yCoefficients[1]}y + ${simplifiedConstant}`,
            // Mistake: Adding x and y coefficients separately
            `${simplifiedX + simplifiedY}x + ${simplifiedConstant}`
        ];
        
        return {
            questionDisplay: (
                <div>
                    <div className="mb-4">Simplify by collecting like terms:</div>
                    <MathDisplay math={expression} />
                </div>
            ),
            correctAnswer: answer,
            options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
            explanation: (
                <div>
                    <p>To simplify, we collect the like terms (terms with the same variable):</p>
                    <div className="mt-2">
                        <MathDisplay math={`(${xCoefficients[0]}x + ${xCoefficients[1]}x) + (${yCoefficients[0]}y + ${yCoefficients[1]}y) + (${constants[0]} + ${constants[1]})`} />
                    </div>
                    <div className="mt-2">
                        <MathDisplay math={`${simplifiedX}x + ${simplifiedY}y + ${simplifiedConstant}`} />
                    </div>
                </div>
            )
        };
    };
    
    // Adapter for substitution
    const substitutionAdapter = () => {
        // Generate a simple expression
        const a = _.random(2, 5);
        const b = _.random(1, 5);
        const c = _.random(1, 5);
        
        // Generate values to substitute
        const xValue = _.random(1, 5);
        const yValue = _.random(1, 5);
        
        // Calculate the result of substitution
        const result = a * xValue + b * yValue + c;
        
        // Generate expression string
        const expression = `${a}x + ${b}y + ${c}`;
        
        // Generate incorrect answers with common mistakes
        const incorrectAnswers = [
            // Mistake: Substituting x but not y
            a * xValue + b + c,
            // Mistake: Substituting y but not x
            a + b * yValue + c,
            // Mistake: Multiplying incorrectly
            a + xValue + b + yValue + c
        ];
        
        return {
            questionDisplay: (
                <div>
                    <div className="mb-4">Substitute x = {xValue} and y = {yValue} into the expression:</div>
                    <MathDisplay math={expression} />
                </div>
            ),
            correctAnswer: `${result}`,
            options: [`${result}`, ...incorrectAnswers.map(val => `${val}`)].sort(() => Math.random() - 0.5),
            explanation: (
                <div>
                    <p>Substitute x = {xValue} and y = {yValue} into the expression:</p>
                    <div className="mt-2">
                        <MathDisplay math={`${a}(${xValue}) + ${b}(${yValue}) + ${c}`} />
                    </div>
                    <div className="mt-2">
                        <MathDisplay math={`${a * xValue} + ${b * yValue} + ${c}`} />
                    </div>
                    <div className="mt-2">
                        <MathDisplay math={`${result}`} />
                    </div>
                </div>
            )
        };
    };
    
    // Adapter for expanding single brackets
    const expandingSingleBracketsAdapter = () => {
        // Generate a simple expression with single brackets
        const outsideFactor = _.random(2, 6);
        const firstTerm = _.random(1, 6);
        const secondTerm = _.random(1, 6);
        
        // Calculate the expanded form
        const expandedFirst = outsideFactor * firstTerm;
        const expandedSecond = outsideFactor * secondTerm;
        
        // Generate expression string
        const expression = `${outsideFactor}(${firstTerm}x + ${secondTerm})`;
        
        // Correct answer
        const answer = `${expandedFirst}x + ${expandedSecond}`;
        
        // Generate incorrect answers with common mistakes
        const incorrectAnswers = [
            // Mistake: Only multiplying the first term
            `${expandedFirst}x + ${secondTerm}`,
            // Mistake: Adding instead of multiplying
            `${outsideFactor + firstTerm}x + ${outsideFactor + secondTerm}`,
            // Mistake: Miscalculation
            `${expandedFirst + 1}x + ${expandedSecond - 1}`
        ];
        
        return {
            questionDisplay: (
                <div>
                    <div className="mb-4">Expand:</div>
                    <MathDisplay math={expression} />
                </div>
            ),
            correctAnswer: answer,
            options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
            explanation: (
                <div>
                    <p>To expand, we multiply the term outside the brackets by each term inside:</p>
                    <div className="mt-2">
                        <MathDisplay math={`${outsideFactor}(${firstTerm}x + ${secondTerm}) = ${outsideFactor} \\times ${firstTerm}x + ${outsideFactor} \\times ${secondTerm}`} />
                    </div>
                    <div className="mt-2">
                        <MathDisplay math={`${expandedFirst}x + ${expandedSecond}`} />
                    </div>
                </div>
            ),
            visualization: (
                <div className="flex justify-center items-center mt-4 mb-2" style={{ height: '160px' }}>
                    <Rectangle
                        width={firstTerm + secondTerm}
                        height={outsideFactor}
                        showDimensions={true}
                        customLabels={{
                            width: `${firstTerm}x + ${secondTerm}`,
                            height: `${outsideFactor}`
                        }}
                        style={{
                            fillColor: '#9b59b6',
                            fillOpacity: 0.2
                        }}
                    />
                </div>
            )
        };
    };

    const questionTypes = {
        simplifying: {
            title: 'Simplifying Expressions',
            generator: simplifyingExpressionsAdapter
        },
        substitution: {
            title: 'Substitution',
            generator: substitutionAdapter
        },
        expanding: {
            title: 'Expanding Brackets',
            generator: expandingSingleBracketsAdapter
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