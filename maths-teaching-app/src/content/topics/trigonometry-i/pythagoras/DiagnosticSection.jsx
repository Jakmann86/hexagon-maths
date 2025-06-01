// src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
import React, { useState } from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import Square from '../../../../components/math/shapes/quadrilaterals/Square';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

/**
 * DiagnosticSection component for Pythagoras lesson
 * Uses Pattern 2 architecture with unified generators
 */
const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Add state to track question changes
    const [questionCounter, setQuestionCounter] = useState(0);

    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    // Updated question types using unified generators
    const questionTypes = {
        squareArea: {
            title: 'Find Square Area',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                // Use unified generator with diagnostic section type
                return squareGenerators.generateSquareArea({ 
                    sectionType: 'diagnostic',
                    units: 'cm'
                });
            }
        },
        squareRoot: {
            title: 'Find Side Length',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                // Use unified generator with diagnostic section type
                return squareGenerators.generateSquareSideLength({ 
                    sectionType: 'diagnostic',
                    units: 'cm'
                });
            }
        },
        identifyHypotenuse: {
            title: 'Identify Hypotenuse',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                return PythagorasGenerators.identifyHypotenuse();
            }
        }
    };

    // Custom visualization renderer for Pattern 2 conversion
    const renderVisualization = (currentQuestion) => {
        if (!currentQuestion.visualization) return null;
        
        // Handle React elements directly (from generators that return JSX)
        if (React.isValidElement(currentQuestion.visualization)) {
            return (
                <div className="flex justify-center items-center w-full my-4" style={{ height: '240px' }}>
                    {currentQuestion.visualization}
                </div>
            );
        }
        
        // Handle square visualization configs
        if (currentQuestion.visualization.sideLength !== undefined) {
            return (
                <div className="flex justify-center items-center w-full my-4" style={{ height: '240px' }}>
                    <Square 
                        {...currentQuestion.visualization} 
                        sectionType="diagnostic"
                        orientation="default"
                    />
                </div>
            );
        } 
        
        // Handle triangle visualization configs
        if (currentQuestion.visualization.base !== undefined && currentQuestion.visualization.height !== undefined) {
            return (
                <div className="flex justify-center items-center w-full my-4" style={{ height: '240px' }}>
                    <RightTriangle 
                        {...currentQuestion.visualization} 
                        sectionType="diagnostic"
                        autoCycle={true}
                        questionId={questionCounter} // Use counter for orientation cycling
                    />
                </div>
            );
        }
        
        // Fallback for unknown visualization types
        console.warn('Unknown visualization type in diagnostic section:', currentQuestion.visualization);
        return null;
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
                    renderVisualization={renderVisualization}
                />
            </div>
        </div>
    );
};

export default DiagnosticSection;