import React, { useState, useEffect } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import { simultaneousEquationsGenerators } from '../../../../generators/algebra/simultaneousEquationsGenerator';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
    const [examples, setExamples] = useState([]);
    const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
    
    const theme = useSectionTheme('examples');
    const { showAnswers } = useUI();

    const generateExamples = () => {
        const newExamples = [
            simultaneousEquationsGenerators.generateEliminationSameCoefficient(),
            simultaneousEquationsGenerators.generateEliminationWithMultiplication(),
            simultaneousEquationsGenerators.generateEliminationSignVariations()
           
        ];
        setExamples(newExamples);
        // DON'T reset to first tab: setCurrentExampleIndex(0);
    };

    useEffect(() => {
        generateExamples();
    }, []);

    const renderExampleContent = (example) => {
        if (!example) return null;

        return (
            <div className="flex flex-col gap-6 items-center pt-4">
                <div className="w-full">
                    <div className={`p-5 bg-${theme.pastelBg} rounded-lg mb-6`}>
                        <div className="text-center space-y-3 text-xl font-mono">
                            <div>{example.equation1}</div>
                            <div>{example.equation2}</div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg min-h-40 h-48 border border-dashed border-gray-300">
                        {/* Working space */}
                    </div>
                    
                    {/* Answer display when toggled */}
                    {showAnswers && (
                        <div className="text-center mt-4">
                            <div className="inline-block bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                                <span className="text-blue-800 font-semibold text-lg">
                                    x = {example.answer.x}, y = {example.answer.y}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 mb-8">
            <div className="border-2 border-t-4 border-orange-500 rounded-lg shadow-md bg-white overflow-hidden">
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