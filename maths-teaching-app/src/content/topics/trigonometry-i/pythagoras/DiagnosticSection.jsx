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
 * Uses Pattern 2 architecture with factory-based shape creation
 */
const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Add state to track question changes
    const [questionCounter, setQuestionCounter] = useState(0);

    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    // Get question types from generators
    const questionTypes = {
        squareArea: {
            title: 'Find Square Area',
            generator: () => {
                setQuestionCounter(prev => prev + 1); // Increment counter on new question
                return squareGenerators.squareAreaDiagnostic();
            }
        },
        squareRoot: {
            title: 'Find Side Length',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                return squareGenerators.squareRootDiagnostic();
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
        
        if (React.isValidElement(currentQuestion.visualization)) {
            return (
                <div className="flex justify-center items-center w-full my-4" style={{ height: '240px' }}>
                    {currentQuestion.visualization}
                </div>
            );
        }
        
        if (currentQuestion.visualization.sideLength) {
            // Square config remains unchanged
            return (
                <div className="flex justify-center items-center w-full my-4" style={{ height: '240px' }}>
                    <Square 
                        {...currentQuestion.visualization} 
                        sectionType="diagnostic"
                        orientation="default"
                    />
                </div>
            );
        } else {
            // Triangle config with auto-cycling enabled
            return (
                <div className="flex justify-center items-center w-full my-4" style={{ height: '240px' }}>
                    <RightTriangle 
                        {...currentQuestion.visualization} 
                        sectionType="diagnostic"
                        autoCycle={true}
                        questionId={questionCounter} // Use counter instead of Date.now()
                    />
                </div>
            );
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
                    renderVisualization={renderVisualization}
                />
            </div>
        </div>
    );
};

export default DiagnosticSection;