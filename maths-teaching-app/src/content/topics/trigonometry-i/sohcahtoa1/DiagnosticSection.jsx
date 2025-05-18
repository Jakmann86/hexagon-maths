// src/content/topics/trigonometry-i/sohcahtoa1/DiagnosticSection.jsx
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import _ from 'lodash';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import MathDisplay from '../../../../components/common/MathDisplay';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    // Adapter for 1-step division equations (combines both types)
    const equationDivisionAdapter = () => {
        // Randomly decide whether to put unknown in numerator or denominator
        const unknownOnTop = Math.random() > 0.5;
        
        if (unknownOnTop) {
            // Generate simple division equation with unknown in numerator
            const denominator = _.random(2, 12);
            const result = _.random(2, 10);
            const numerator = denominator * result; // This ensures clean division
            
            // Generate incorrect options
            const incorrectOptions = [
                result + _.random(1, 3),           // Too large
                Math.max(1, result - _.random(1, 3)), // Too small
                denominator / result               // Inverted division
            ];
            
            return {
                questionDisplay: (
                    <div>
                        <div className="mb-4">Solve for x:</div>
                        <MathDisplay math={`\\frac{x}{${denominator}} = ${result}`} />
                    </div>
                ),
                correctAnswer: `${numerator}`,
                options: [`${numerator}`, ...incorrectOptions.map(val => `${val}`)].sort(() => Math.random() - 0.5),
                explanation: <MathDisplay math={`\\text{To solve } \\frac{x}{${denominator}} = ${result}\\text{, we multiply both sides by ${denominator}:}\\\\\\\\
                x = ${result} \\times ${denominator} = ${numerator}`} />
            };
        } else {
            // This approach ensures clean division with terminating decimals
            // First choose the denominator (integer), then calculate numerator for clean division
            const denominator = _.random(2, 12);
            const result = _.random(2, 10);
            const numerator = denominator * result; // This ensures clean division
            
            // Generate incorrect options
            const incorrectOptions = [
                denominator + _.random(1, 3),    // Too large
                Math.max(1, denominator - _.random(1, 3)), // Too small
                numerator * result                 // Multiplied instead of divided
            ];
            
            return {
                questionDisplay: (
                    <div>
                        <div className="mb-4">Solve for x:</div>
                        <MathDisplay math={`\\frac{${numerator}}{x} = ${result}`} />
                    </div>
                ),
                correctAnswer: `${denominator}`,
                options: [`${denominator}`, ...incorrectOptions.map(val => `${val}`)].sort(() => Math.random() - 0.5),
                explanation: <MathDisplay math={`\\text{To solve } \\frac{${numerator}}{x} = ${result}\\text{, we divide ${numerator} by ${result}:}\\\\\\\\
                x = \\frac{${numerator}}{${result}} = ${denominator}`} />
            };
        }
    };
    
    // Adapter for basic trig calculator usage
    const trigCalculatorAdapter = () => {
        // Common angles and their exact values
        const trigValues = {
            sine: {
                '30°': 0.5,
                '45°': 0.7071,
                '60°': 0.866
            },
            cosine: {
                '30°': 0.866,
                '45°': 0.7071,
                '60°': 0.5
            },
            tangent: {
                '30°': 0.5774,
                '45°': 1,
                '60°': 1.732
            }
        };
        
        // Select random function and angle
        const func = _.sample(['sine', 'cosine', 'tangent']);
        const angle = _.sample(['30°', '45°', '60°']);
        
        // Get correct value with some rounding for display
        const exactValue = trigValues[func][angle];
        const correctAnswer = Math.round(exactValue * 10000) / 10000;
        
        // Generate incorrect options with good distractors
        const incorrectOptions = [];
        
        // Add function confusion error (e.g., using cos instead of sin)
        for (const otherFunc of ['sine', 'cosine', 'tangent']) {
            if (otherFunc !== func) {
                incorrectOptions.push(Math.round(trigValues[otherFunc][angle] * 10000) / 10000);
            }
        }
        
        // Add minor calculation error
        incorrectOptions.push(Math.round((exactValue + 0.05) * 10000) / 10000);
        
        // Convert function name for display
        const funcSymbol = {
            'sine': '\\sin',
            'cosine': '\\cos',
            'tangent': '\\tan'
        }[func];
        
        return {
            questionDisplay: `Use your calculator to find ${func} of ${angle}.`,
            correctAnswer: `${correctAnswer}`,
            options: [`${correctAnswer}`, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
            explanation: <MathDisplay math={`${funcSymbol}(${angle}) = ${correctAnswer}`} />
        };
    };
    
    // Adapter for triangle side labeling
    const triangleLabelingAdapter = () => {
        // Use a fixed setup for clarity and correctness
        const base = _.random(3, 6);
        const height = _.random(3, 6);
        
        // Create a custom triangle with explicit labels that clearly show the relationship to angle θ
        const customTriangle = () => {
            // Generate a random side to identify
            const sideToIdentify = _.sample(['adjacent', 'opposite', 'hypotenuse']);
            
            // Create explicit labels for each side based on its relationship to angle θ
            const sideLabels = {
                adjacent: _.sample(['a', 'p', 'x']),      // Label for adjacent side
                opposite: _.sample(['b', 'q', 'y']),      // Label for opposite side
                hypotenuse: _.sample(['c', 'r', 'z'])     // Label for hypotenuse
            };
            
            // Now we know exactly which label corresponds to which side
            const correctAnswer = sideLabels[sideToIdentify];
            
            return {
                sideToIdentify,
                correctAnswer,
                allLabels: [sideLabels.adjacent, sideLabels.opposite, sideLabels.hypotenuse],
                triangleLabels: [sideLabels.opposite, sideLabels.adjacent, sideLabels.hypotenuse]
                // Order is [horizontal, vertical, hypotenuse] to match RightTriangle component
            };
        };
        
        // Generate the question details
        const question = customTriangle();
        
        return {
            questionDisplay: `Which side is the ${question.sideToIdentify} side relative to the angle θ?`,
            correctAnswer: question.correctAnswer,
            options: question.allLabels.sort(() => Math.random() - 0.5),
            explanation: <div>The <strong>{question.sideToIdentify}</strong> side is labeled as <strong>{question.correctAnswer}</strong>.</div>,
            visualization: (
                <div className="flex justify-center items-center" style={{ height: '200px', width: '100%' }}>
                    <RightTriangle 
                        base={base}
                        height={height}
                        orientation="default"
                        labelStyle="custom"
                        showRightAngle={true}
                        showAngles={[false, true]} // Show angle at third/top vertex
                        angleLabels={['', 'θ']}
                        labels={question.triangleLabels} // [horizontal/opposite, vertical/adjacent, hypotenuse]
                        containerHeight={180}
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
        equations: {
            title: 'Solving Equations',
            generator: equationDivisionAdapter
        },
        trigValues: {
            title: 'Calculator Skills',
            generator: trigCalculatorAdapter
        },
        sideLabeling: {
            title: 'Triangle Labeling',
            generator: triangleLabelingAdapter
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