// src/components/sections/ExamplesSectionBase.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { useUI } from '../../context/UIContext';
import { useSectionTheme } from '../../hooks/useSectionTheme';

/**
 * ExamplesSectionBase template for displaying worked examples with step-by-step solutions
 * 
 * @param {Array} examples - Array of example objects with questions and step-by-step solutions
 * @param {Function} generateExamples - Function to generate new examples
 * @param {Function} renderExampleContent - Function to render the content of an example (visualization, etc.)
 * @param {string} currentTopic - Current topic identifier
 * @param {number} currentLessonId - Current lesson identifier
 * @param {string} title - Section title (optional, uses example title if available)
 * @param {Function} onStepAction - Callback for handling custom step actions
 * @param {string} themeKey - Theme key for section colors (default: 'examples')
 * @param {number} currentExampleIndex - Current example index (optional, for controlled component)
 * @param {Function} setCurrentExampleIndex - Function to set current example index (optional, for controlled component)
 */
const ExamplesSectionBase = ({
    examples = [],
    generateExamples,
    renderExampleContent,
    currentTopic,
    currentLessonId,
    title = "Worked Examples",
    onStepAction = null,
    themeKey = 'examples',
    currentExampleIndex: externalIndex,
    setCurrentExampleIndex: setExternalIndex
}) => {
    // Get theme colors for the section
    const theme = useSectionTheme(themeKey);

    const { showAnswers } = useUI();
    // Use internal state only if external state is not provided
    const [internalIndex, setInternalIndex] = useState(0);
    const [visibleStepIndex, setVisibleStepIndex] = useState(null);
    
    // Use external index if provided, otherwise use internal
    const currentExampleIndex = externalIndex !== undefined ? externalIndex : internalIndex;
    const setCurrentExampleIndex = setExternalIndex || setInternalIndex;
    
    // Initialize examples if needed
    useEffect(() => {
        if (examples.length === 0 && generateExamples) {
            generateExamples();
        }
    }, [examples, generateExamples]);

    // Reset visible step index when changing examples
    useEffect(() => {
        setVisibleStepIndex(null);
    }, [currentExampleIndex]);

    // If no examples or render function provided, show a placeholder
    if (examples.length === 0 || !renderExampleContent) {
        return (
            <div className="text-center p-6">
                <p>No examples available for this topic.</p>
            </div>
        );
    }

    const currentExample = examples[currentExampleIndex];

    // Function to regenerate examples and reset state
    const handleGenerateNew = () => {
        generateExamples();
        setVisibleStepIndex(null);
        if (onStepAction) {
            // Reset any custom step state via callback
            onStepAction({ reset: true });
        }
    };

    // Handle steps and step actions
    const handleStepClick = (index, step) => {
        setVisibleStepIndex(index);
        if (onStepAction && step) {
            onStepAction(step);
        }
    };

    return (
        <div className="space-y-6">
            {/* Integrated header with title, new question button, and navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-6 pt-6">
                {/* Title - use current example title if available, otherwise use prop title */}
                <h3 className="text-xl font-semibold text-gray-800">
                    {currentExample?.title || title}
                </h3>
                
                {/* New Question Button */}
                <button
                    onClick={handleGenerateNew}
                    className={`flex items-center gap-2 px-4 py-2 bg-${theme.pastelBg} text-${theme.secondaryText} rounded-lg hover:bg-${theme.secondary} transition-all`}
                >
                    <RefreshCw size={18} />
                    <span>New Question</span>
                </button>
                
                {/* Navigation Buttons */}
                <div className="flex gap-2">
                    {examples.map((_, index) => (
                        <button
                            key={index}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                index === currentExampleIndex
                                    ? `bg-${theme.primary} text-white`
                                    : `bg-${theme.pastelBg} text-${theme.secondaryText} hover:bg-${theme.secondary}`
                            }`}
                            onClick={() => {
                                setCurrentExampleIndex(index);
                                setVisibleStepIndex(null);
                                if (onStepAction) {
                                    // Reset any custom step state
                                    onStepAction({ reset: true });
                                }
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Current example card */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Render the example content (visualization, etc.) */}
                        {renderExampleContent(currentExample)}
                        
                        {/* Solution steps - visible only when showAnswers is true */}
                        {showAnswers && currentExample.steps && (
                            <div className={`mt-6 space-y-3 p-4 bg-${theme.pastelBg} rounded-lg`}>
                                <h4 className={`font-semibold text-${theme.secondaryText} mb-4`}>Solution:</h4>
                                {currentExample.steps.map((step, stepIndex) => (
                                    <div 
                                        key={stepIndex} 
                                        className={`step cursor-pointer p-3 rounded-lg transition-colors ${
                                            visibleStepIndex === stepIndex 
                                                ? `bg-${theme.secondary} border border-${theme.borderColor}` 
                                                : `hover:bg-${theme.secondary} hover:bg-opacity-50`
                                        }`}
                                        onClick={() => handleStepClick(stepIndex, step)}
                                    >
                                        <p className="text-gray-700">{step.explanation}</p>
                                        <div className="flex justify-center my-2">
                                            {step.math}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamplesSectionBase;