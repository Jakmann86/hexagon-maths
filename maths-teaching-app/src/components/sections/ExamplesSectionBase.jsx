// src/components/sections/ExamplesSectionBase.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { useUI } from '../../context/UIContext';

/**
 * ExamplesSectionBase template for displaying worked examples with step-by-step solutions
 * 
 * @param {Array} examples - Array of example objects with questions and step-by-step solutions
 * @param {Function} generateExamples - Function to generate new examples
 * @param {Function} renderExampleContent - Function to render the content of an example (visualization, etc.)
 * @param {string} currentTopic - Current topic identifier
 * @param {number} currentLessonId - Current lesson identifier
 * @param {string} title - Section title
 * @param {Function} customNavigation - Custom navigation component function (optional)
 * @param {Function} customHeader - Custom header component function (optional)
 * @param {boolean} hideTitle - Whether to hide the default title
 * @param {boolean} useCustomHeaderOnly - Whether to use only the custom header (skipping navigation)
 * @param {number} currentExampleIndex - Current example index (optional, for controlled component)
 * @param {Function} setCurrentExampleIndex - Function to set current example index (optional, for controlled component)
 * @param {Function} onStepAction - Callback for handling custom step actions
 */
const ExamplesSectionBase = ({
    examples = [],
    generateExamples,
    renderExampleContent,
    currentTopic,
    currentLessonId,
    title = "Worked Examples",
    customNavigation = null,
    customHeader = null,
    hideTitle = false,
    useCustomHeaderOnly = false,
    currentExampleIndex: externalIndex,
    setCurrentExampleIndex: setExternalIndex,
    onStepAction = null
}) => {
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

    const goToNextExample = () => {
        setCurrentExampleIndex((prev) => (prev + 1) % examples.length);
    };

    const goToPrevExample = () => {
        setCurrentExampleIndex((prev) => (prev - 1 + examples.length) % examples.length);
    };

    // Default header component
    const renderDefaultHeader = () => (
        <div className="flex justify-between items-center mb-6">
            {!hideTitle && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
            <button
                onClick={generateExamples}
                className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
                title="Generate new examples"
            >
                <RefreshCw size={18} />
                <span className="text-sm font-medium">New Examples</span>
            </button>
        </div>
    );

    // Default navigation component
    const renderDefaultNavigation = () => (
        <div className="flex justify-between items-center mb-4">
            <button
                onClick={goToPrevExample}
                className="p-2 rounded hover:bg-gray-100"
                title="Previous example"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="flex items-center text-gray-500">
                {currentExampleIndex + 1} / {examples.length}
            </span>
            <button
                onClick={goToNextExample}
                className="p-2 rounded hover:bg-gray-100"
                title="Next example"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );

    // Handle steps and step actions
    const handleStepClick = (index, step) => {
        setVisibleStepIndex(index);
        if (onStepAction && step) {
            onStepAction(step);
        }
    };

    return (
        <div className="space-y-6">
            {/* Render either custom or default header */}
            {customHeader 
                ? customHeader(currentExample?.title, generateExamples) 
                : renderDefaultHeader()
            }

            {/* Render navigation if not using custom header only */}
            {!useCustomHeaderOnly && (customNavigation 
                ? customNavigation(currentExampleIndex, setCurrentExampleIndex, examples.length) 
                : renderDefaultNavigation())
            }

            {/* Current example card */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Render the example content (visualization, etc.) */}
                        {renderExampleContent(currentExample)}
                        
                        {/* Solution steps - visible only when showAnswers is true */}
                        {showAnswers && currentExample.steps && (
                            <div className="mt-6 space-y-3 p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-800">Solution:</h4>
                                {currentExample.steps.map((step, stepIndex) => (
                                    <div 
                                        key={stepIndex} 
                                        className={`step cursor-pointer p-3 rounded-lg transition-colors ${
                                            visibleStepIndex === stepIndex 
                                                ? 'bg-green-100 border border-green-200' 
                                                : 'hover:bg-green-100'
                                        }`}
                                        onClick={() => handleStepClick(stepIndex, step)}
                                    >
                                        <p className="text-green-700">{step.explanation}</p>
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