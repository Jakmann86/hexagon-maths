// src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import ShapeDisplay from '../../../../components/math/ShapeDisplay';
import RightTriangle from '../../../../components/math/shapes/RightTriangle';
import Square from '../../../../components/math/shapes/Square';
import * as MafsLib from 'mafs';
import _ from 'lodash';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    // Adapter for square area questions
    const squareAreaAdapter = () => {
        // Generate side length between 3 and 8
        const side = _.random(3, 8);
        const area = side * side;
        
        return {
            questionDisplay: `Find the area of this square with side length ${side} cm.`,
            correctAnswer: `${area}\\text{ cm}^2`,
            options: [
                `${area}\\text{ cm}^2`,
                `${area + 2}\\text{ cm}^2`,
                `${area - 2}\\text{ cm}^2`,
                `${side * 4}\\text{ cm}^2`  // Common mistake: using perimeter
            ].sort(() => Math.random() - 0.5),
            explanation: `Area of a square = side² = ${side}² = ${area} cm²`,
            visualization: (
                <ShapeDisplay 
                    shape={{
                        type: 'square',
                        sideLength: side,
                        showDimensions: true,
                        units: 'cm',
                        customLabels: {
                            side: `${side} cm`,
                            area: null // No area label
                        },
                        style: {
                            fillColor: '#3498db',
                            fillOpacity: 0.2,
                            backgroundTransparent: true
                        }
                    }}
                    height={240}
                />
            )
        };
    };
    
    // Adapter for square root questions
    const squareRootAdapter = () => {
        // Generate a perfect square area between 16 and 100
        const perfectSquares = [16, 25, 36, 49, 64, 81, 100];
        const area = _.sample(perfectSquares);
        const side = Math.sqrt(area);
        
        return {
            questionDisplay: `Find the side length of a square with area ${area} cm².`,
            correctAnswer: `${side}\\text{ cm}`,
            options: [
                `${side}\\text{ cm}`,
                `${side + 1}\\text{ cm}`,
                `${side - 1}\\text{ cm}`,
                `${area / 4}\\text{ cm}`  // Common mistake: dividing by 4 instead of square root
            ].sort(() => Math.random() - 0.5),
            explanation: `Side length = √Area = √${area} = ${side} cm`,
            visualization: (
                <Square
                    sideLength={side}
                    showDimensions={false}
                    showArea={true}
                    areaLabel={`${area} cm²`}
                    units="cm"
                    containerHeight={240}
                    style={{
                        fillColor: '#3498db',
                        fillOpacity: 0.3,
                        backgroundTransparent: true
                    }}
                />
            )
        };
    };
    
    // Adapter for Pythagoras concept identification
    const pythagorasConceptAdapter = () => {
        // Use a common Pythagorean triple
        const pythagoreanTriples = [
            { a: 3, b: 4, c: 5 },
            { a: 5, b: 12, c: 13 },
            { a: 6, b: 8, c: 10 }
        ];
        
        const triple = _.sample(pythagoreanTriples);
        
        return {
            questionDisplay: 'Which side is the hypotenuse in this right-angled triangle?',
            correctAnswer: 'c',
            options: ['a', 'b', 'c', 'none'].sort(() => Math.random() - 0.5),
            explanation: 'The hypotenuse (c) is the longest side, opposite to the right angle.',
            visualization: (
                <RightTriangle
                    base={triple.a}
                    height={triple.b}
                    showRightAngle={true}
                    labelStyle="algebraic"
                    labels={['a', 'b', 'c']}
                    units="cm"
                    containerHeight={240}
                    style={{
                        fillColor: '#9b59b6',
                        fillOpacity: 0.2
                    }}
                />
            )
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
        <div className="space-y-6 mb-8">
            {/* Use DiagnosticSectionBase with themed wrapper */}
            <div className="border-2 border-t-4 border-purple-500 rounded-lg shadow-md bg-white overflow-hidden">
                <DiagnosticSectionBase
                    questionTypes={questionTypes}
                    currentTopic={currentTopic}
                    currentLessonId={currentLessonId}
                    themeKey="diagnostic"
                />
            </div>
        </div>
    );
};

export default DiagnosticSection;