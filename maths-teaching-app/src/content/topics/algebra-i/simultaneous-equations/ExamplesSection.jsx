// src/content/topics/algebra-i/simultaneous-equations/ExamplesSection.jsx
import React, { useState, useEffect } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import { simultaneousEquationsGenerators } from '../../../../generators/algebra/simultaneousEquationsGenerator';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
    const [examples, setExamples] = useState([]);
    const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
    
    // Get theme colors for examples section
    const theme = useSectionTheme('examples');

    // Generate all three types of examples
    const generateExamples = () => {
        const newExamples = [
            // Example 1: Same coefficient elimination
            simultaneousEquationsGenerators.generateEliminationSameCoefficient({
                sectionType: 'examples'
            }),
            
            // Example 2: Multiplication required
            simultaneousEquationsGenerators.generateEliminationWithMultiplication({
                sectionType: 'examples'
            }),
            
            // Example 3: Sign variations
            simultaneousEquationsGenerators.generateEliminationSignVariations({
                sectionType: 'examples'
            })
        ];
        
        setExamples(newExamples);
        setCurrentExampleIndex(0); // Reset to first example
    };

    // Initialize examples on component mount
    useEffect(() => {
        generateExamples();
    }, []);

    // Render function for example content
    const renderExampleContent = (example) => {
        if (!example) return null;

        return (
            <div className="space-y-6">
                {/* Question Display with equations */}
                <div className={`bg-${theme.pastelBg} p-6 rounded-lg mb-6`}>
                    <div className="text-center bg-white p-4 rounded border">
                        <div className="text-lg space-y-2">
                            <div dangerouslySetInnerHTML={{ __html: `$${example.equation1}$` }} />
                            <div dangerouslySetInnerHTML={{ __html: `$${example.equation2}$` }} />
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                            Find the values of x and y
                        </p>
                    </div>
                </div>

                {/* Teacher Working Area */}
                <div className="bg-gray-50 p-6 rounded-lg min-h-48 border border-dashed border-gray-300">
                    {/* Empty space for teacher to work through the problem */}
                </div>

                {/* Solution Answer (only visible when showAnswers is true) */}
                <div className="text-center">
                    <div className="inline-block bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                        <span className="text-blue-800 font-semibold" dangerouslySetInnerHTML={{ 
                            __html: `Answer: $x = ${example.answer.x}, \\quad y = ${example.answer.y}$` 
                        }} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Themed container with green accent for examples */}
            <div className="border-2 border-t-4 border-green-500 rounded-lg shadow-md bg-white overflow-hidden">
                <ExamplesSectionBase
                    examples={examples}
                    generateExamples={generateExamples}
                    renderExampleContent={renderExampleContent}
                    currentTopic={currentTopic}
                    currentLessonId={currentLessonId}
                    currentExampleIndex={currentExampleIndex}
                    setCurrentExampleIndex={setCurrentExampleIndex}
                    themeKey="examples"
                />
            </div>
        </div>
    );
};

export default ExamplesSection;