// src/content/topics/trigonometry-i/sohcahtoa1/DiagnosticSection.jsx
import React, { useState } from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Add state to track question changes for triangle cycling
    const [questionCounter, setQuestionCounter] = useState(0);

    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    const questionTypes = {
        equations: {
            title: 'Solving Equations',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                return equationGenerators.generateDivisionEquation({ sectionType: 'diagnostic' });
            }
        },
        trigValues: {
            title: 'Calculator Skills',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                return SohcahtoaGenerators.generateTrigCalculatorQuestion({ sectionType: 'diagnostic' });
            }
        },
        sideLabeling: {
            title: 'Triangle Labeling',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                return SohcahtoaGenerators.generateTriangleLabelingQuestion({ sectionType: 'diagnostic' });
            }
        }
    };

    // Custom visualization renderer for Pattern 2 conversion
    const renderVisualization = (currentQuestion) => {
        if (!currentQuestion.visualization) return null;
        
        // If it's already a React element, just return it
        if (React.isValidElement(currentQuestion.visualization)) {
            return (
                <div className="flex justify-center items-center w-full my-4" style={{ height: '200px' }}>
                    {currentQuestion.visualization}
                </div>
            );
        }
        
        // Convert triangle config to component (Pattern 2)
        if (currentQuestion.visualization.base && currentQuestion.visualization.height) {
            return (
                <div className="flex justify-center items-center w-full my-4" style={{ height: '200px' }}>
                    <RightTriangle 
                        {...currentQuestion.visualization} 
                        containerHeight={180}
                        sectionType="diagnostic"
                        questionId={questionCounter} // Pass counter for orientation cycling
                    />
                </div>
            );
        }
        
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