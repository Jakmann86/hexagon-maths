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
        // Determine the operation type randomly
        const operationType = _.sample(['collect', 'multiply', 'divide']);
        
        if (operationType === 'collect') {
            // Randomly decide if we want one or two variable types
            const useOneVariable = Math.random() > 0.5;
            
            // Generate random coefficients for different terms with some negative values
            const xCoefficients = [
                _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9), // 25% chance of negative
                _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9)  // 25% chance of negative
            ];
            
            // Only generate y coefficients if using two variables
            const yCoefficients = useOneVariable ? [0, 0] : [
                _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9), // 25% chance of negative 
                _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9)  // 25% chance of negative
            ];
            
            const constants = [
                _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9), // 25% chance of negative
                _.random(0, 3) === 0 ? -_.random(1, 9) : _.random(1, 9)  // 25% chance of negative
            ];
            
            // Calculate the correct answers
            const simplifiedX = xCoefficients[0] + xCoefficients[1];
            const simplifiedY = yCoefficients[0] + yCoefficients[1];
            const simplifiedConstant = constants[0] + constants[1];
            
            // Helper function to format terms correctly
            const formatTerm = (coefficient, variable = '') => {
                if (coefficient === 0) return '';
                if (coefficient === 1 && variable) return `+${variable}`;
                if (coefficient === -1 && variable) return `-${variable}`;
                return coefficient > 0 ? `+${coefficient}${variable}` : `${coefficient}${variable}`;
            };
            
            // Create the expression string with proper formatting
            const firstX = formatTerm(xCoefficients[0], 'x').replace(/^\+/, ''); // Remove leading + for first term
            const firstY = useOneVariable ? '' : formatTerm(yCoefficients[0], 'y');
            const firstConstant = formatTerm(constants[0]);
            const secondX = formatTerm(xCoefficients[1], 'x');
            const secondY = useOneVariable ? '' : formatTerm(yCoefficients[1], 'y');
            const secondConstant = formatTerm(constants[1]);
            
            const expression = `${firstX}${firstY}${firstConstant}${secondX}${secondY}${secondConstant}`;
            
            // Create the answer string in LaTeX format
            let answerTerms = [];
            if (simplifiedX !== 0) {
                answerTerms.push(simplifiedX === 1 ? 'x' : simplifiedX === -1 ? '-x' : `${simplifiedX}x`);
            }
            if (!useOneVariable && simplifiedY !== 0) {
                if (simplifiedY === 1) {
                    answerTerms.push('y');
                } else if (simplifiedY === -1) {
                    answerTerms.push('-y');
                } else {
                    answerTerms.push(`${simplifiedY}y`);
                }
            }
            if (simplifiedConstant !== 0) {
                answerTerms.push(`${simplifiedConstant}`);
            }
            
            // Format the final answer with proper signs
            let answer = '';
            answerTerms.forEach((term, index) => {
                if (index === 0) {
                    // First term shouldn't have a + if it's positive
                    answer += term;
                } else {
                    // Add + sign only if term doesn't already have a sign
                    if (!term.startsWith('-')) {
                        answer += '+' + term;
                    } else {
                        answer += term;
                    }
                }
            });
            
            // If answer is empty (all terms cancel out), set it to 0
            if (answer === '') answer = '0';
            
            // Generate incorrect options with common mistakes
            // All options need to be in proper LaTeX format
            const incorrectAnswers = [
                // Mistake: Adding everything together
                `${xCoefficients[0] + xCoefficients[1] + yCoefficients[0] + yCoefficients[1] + constants[0] + constants[1]}`,
                // Mistake: Only combining some terms - format more carefully
                (() => {
                    let terms = [];
                    if (simplifiedX !== 0) {
                        terms.push(simplifiedX === 1 ? 'x' : simplifiedX === -1 ? '-x' : `${simplifiedX}x`);
                    }
                    if (!useOneVariable) {
                        if (yCoefficients[0] !== 0) {
                            terms.push(yCoefficients[0] === 1 ? 'y' : yCoefficients[0] === -1 ? '-y' : `${yCoefficients[0]}y`);
                        }
                        if (yCoefficients[1] !== 0) {
                            if (yCoefficients[1] > 0) {
                                terms.push(yCoefficients[1] === 1 ? '+y' : `+${yCoefficients[1]}y`);
                            } else {
                                terms.push(yCoefficients[1] === -1 ? '-y' : `${yCoefficients[1]}y`);
                            }
                        }
                    }
                    if (simplifiedConstant !== 0) {
                        if (simplifiedConstant > 0) {
                            terms.push(`+${simplifiedConstant}`);
                        } else {
                            terms.push(`${simplifiedConstant}`);
                        }
                    }
                    return terms.join('').replace(/^\+/, ''); // Remove leading +
                })(),
                // Mistake: Adding x and y coefficients together
                (() => {
                    if (useOneVariable) {
                        return `${simplifiedX + simplifiedConstant}`;
                    } else {
                        return `${simplifiedX + simplifiedY}x${simplifiedConstant > 0 ? '+' : ''}${simplifiedConstant}`;
                    }
                })()
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
                            <MathDisplay math={useOneVariable ? 
                                `(${xCoefficients[0]}x + ${xCoefficients[1]}x) + (${constants[0]} + ${constants[1]})` :
                                `(${xCoefficients[0]}x + ${xCoefficients[1]}x) + (${yCoefficients[0]}y + ${yCoefficients[1]}y) + (${constants[0]} + ${constants[1]})`} 
                            />
                        </div>
                        <div className="mt-2">
                            <MathDisplay math={useOneVariable ?
                                `${simplifiedX}x + ${simplifiedConstant}` :
                                `${simplifiedX}x + ${simplifiedY}y + ${simplifiedConstant}`}
                            />
                        </div>
                    </div>
                )
            };
        } 
        else if (operationType === 'multiply') {
            // Generate multiplication of terms
            const firstCoefficient = _.random(0, 3) === 0 ? -_.random(2, 6) : _.random(2, 6); // 25% chance of negative
            const secondCoefficient = _.random(0, 3) === 0 ? -_.random(2, 6) : _.random(2, 6); // 25% chance of negative
            
            // Decide whether to multiply by a variable term
            const multiplyByX = Math.random() > 0.5;
            
            let expression, answer, incorrectAnswers;
            
            if (multiplyByX) {
                // Multiply coefficient by variable term (e.g., 3 × 4x)
                expression = `${firstCoefficient} \\times ${secondCoefficient}x`;
                const result = firstCoefficient * secondCoefficient;
                answer = result === 1 ? "x" : result === -1 ? "-x" : `${result}x`;
                
                incorrectAnswers = [
                    // Adding instead of multiplying
                    `${firstCoefficient + secondCoefficient}x`,
                    // Multiplying but forgetting the variable
                    `${firstCoefficient * secondCoefficient}`,
                    // Common calculation error
                    `${firstCoefficient * secondCoefficient + (Math.random() > 0.5 ? 1 : -1)}x`
                ];
            } else {
                // Multiply two variable terms (e.g., 3x × 4x)
                expression = `${firstCoefficient}x \\times ${secondCoefficient}x`;
                const result = firstCoefficient * secondCoefficient;
                answer = result === 1 ? "x^2" : result === -1 ? "-x^2" : `${result}x^2`;
                
                incorrectAnswers = [
                    // Forgetting to square the variable
                    `${firstCoefficient * secondCoefficient}x`,
                    // Adding the coefficients and squaring x
                    `${firstCoefficient + secondCoefficient}x^2`,
                    // Common calculation error
                    `${firstCoefficient * secondCoefficient + (Math.random() > 0.5 ? 1 : -1)}x^2`
                ];
            }
            
            return {
                questionDisplay: (
                    <div>
                        <div className="mb-4">Calculate:</div>
                        <MathDisplay math={expression} />
                    </div>
                ),
                correctAnswer: answer,
                options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
                explanation: (
                    <div>
                        <p>To multiply algebraic terms, we multiply the coefficients and add the powers of variables:</p>
                        <div className="mt-2">
                            <MathDisplay math={expression + " = " + answer} />
                        </div>
                    </div>
                )
            };
        }
        else { // Division case
            // Generate division of terms
            const resultCoefficient = _.random(2, 6); // Result after division
            const divisor = _.random(2, 4); // Divisor value
            
            // Calculate the dividend (to ensure clean division)
            const dividendCoefficient = resultCoefficient * divisor;
            
            // Decide whether to divide a variable term or a squared term
            const divideSquared = Math.random() > 0.5;
            
            let expression, answer, incorrectAnswers;
            
            if (divideSquared) {
                // Divide x² term by coefficient (e.g., 12x² ÷ 3)
                expression = `${dividendCoefficient}x^2 \\div ${divisor}`;
                answer = resultCoefficient === 1 ? "x^2" : `${resultCoefficient}x^2`;
                
                incorrectAnswers = [
                    // Dividing coefficient but not keeping the variable squared
                    `${resultCoefficient}x`,
                    // Dividing coefficient and reducing power incorrectly
                    `${resultCoefficient}x`,
                    // Common calculation error
                    `${resultCoefficient + (Math.random() > 0.5 ? 1 : -1)}x^2`
                ];
            } else {
                // Divide variable term by another variable term (e.g., 12x ÷ 4x)
                expression = `${dividendCoefficient}x \\div ${divisor}x`;
                answer = `${resultCoefficient}`;
                
                incorrectAnswers = [
                    // Keeping the variable
                    `${resultCoefficient}x`,
                    // Dividing incorrectly
                    `${resultCoefficient}x^0`,
                    // Common calculation error
                    `${resultCoefficient + (Math.random() > 0.5 ? 1 : -1)}`
                ];
            }
            
            return {
                questionDisplay: (
                    <div>
                        <div className="mb-4">Calculate:</div>
                        <MathDisplay math={expression} />
                    </div>
                ),
                correctAnswer: answer,
                options: [answer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
                explanation: (
                    <div>
                        <p>To divide algebraic terms, we divide the coefficients and subtract the powers of variables:</p>
                        <div className="mt-2">
                            <MathDisplay math={expression + " = " + answer} />
                        </div>
                    </div>
                )
            };
        }
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