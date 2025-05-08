// src/components/sections/StarterSectionBase.jsx
import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { RefreshCw } from 'lucide-react';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

/**
 * Memoized ContentRenderer component for different content types
 * Ensures consistent shape sizing and proper math formatting
 */
const ContentRenderer = memo(({ content, type = 'text' }) => {
    if (!content) return null;
    
    // Handle React elements (like RightTriangle, ShapeDisplay, etc.)
    if (React.isValidElement(content)) {
        // Get component type name for stable key generation
        const componentType = content.type?.displayName || content.type?.name || 'component';
        const elementKey = content.key || `element-${componentType}-${Math.random().toString(36).substr(2, 5)}`;
        
        // Check if this is a shape component (RightTriangle, Square, ShapeDisplay, etc.)
        const isShapeComponent = (
            componentType === 'RightTriangle' || 
            componentType === 'Square' ||
            componentType === 'Rectangle' ||
            componentType === 'Triangle' ||
            componentType === 'ShapeDisplay' ||
            componentType.includes('Triangle') ||
            componentType.includes('Shape')
        );
        
        // Enforce consistent height for shape components
        if (isShapeComponent) {
            // Standard height for all shapes
            const STANDARD_SHAPE_HEIGHT = 140;
            
            // Get current props
            const currentProps = content.props || {};
            
            // Set consistent props based on component type
            let standardProps = {};
            
            if (componentType === 'ShapeDisplay') {
                standardProps = { height: STANDARD_SHAPE_HEIGHT };
            } else {
                standardProps = { 
                    containerHeight: STANDARD_SHAPE_HEIGHT,
                    scale: 0.9  // Slightly smaller scale for better fit
                };
            }
            
            // Create component with standardized height
            return React.cloneElement(content, {
                ...standardProps,
                key: elementKey,
                // Keep the original orientation if specified
                orientation: currentProps.orientation || 'default' 
            });
        }
        
        // Clone with just a key if not a shape component
        if (!content.key) {
            return React.cloneElement(content, { key: elementKey });
        }
        
        return content;
    }

    // Process text content
    const processText = (text) => {
        if (typeof text !== 'string') return text;
        return text.trim();
    };

    // Render based on content type
    switch (type) {
        case 'visualization':
            return (
                <div className="flex justify-center items-center p-1 h-full mt-2">
                    {content}
                </div>
            );
        case 'math':
            return <MathDisplay math={processText(content)} displayMode={true} size="large" />;
        case 'puzzle-answer':
            return (
                <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                    {processText(content)}
                </div>
            );
        default:
            // Detect math strings and use MathDisplay when appropriate
            if (typeof content === 'string' && (content.includes('\\') || content.includes('$'))) {
                return <MathDisplay math={processText(content)} size="normal" />;
            }
            return <div className="text-gray-800 text-lg">{processText(content)}</div>;
    }
});

ContentRenderer.displayName = 'ContentRenderer';

/**
 * Helper function to detect and convert mathematical text to LaTeX
 * This helps ensure consistent math formatting in answers
 */
const formatMathContent = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    // Already has LaTeX commands
    if (text.includes('\\')) return text;
    
    // Replace common mathematical patterns with LaTeX
    return text
        // Format squared and cubed numbers
        .replace(/(\d+)\s*²/g, '$1^2')
        .replace(/(\d+)\s*³/g, '$1^3')
        // Format multiplication signs
        .replace(/(\d+)\s*×\s*(\d+)/g, '$1 \\times $2')
        // Format division signs
        .replace(/(\d+)\s*÷\s*(\d+)/g, '\\frac{$1}{$2}')
        // Format square roots
        .replace(/√\s*(\d+)/g, '\\sqrt{$1}')
        // Format fractions like 1/2
        .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
        // Format pi
        .replace(/π/g, '\\pi');
};

/**
 * Memoized QuestionDisplay component
 * Renders a single question card with improved answer display
 */
const QuestionDisplay = memo(({ type, title, data, showAnswers }) => {
    const typeStyles = {
        lastLesson: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
        lastWeek: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
        lastTopic: 'bg-green-100 hover:bg-green-200 border-green-300',
        lastYear: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
    };

    const isPuzzle = data?.difficulty === 'puzzle' || type === 'lastYear';
    
    // Use ref to store visualization content to prevent re-rendering issues
    const visualizationRef = useRef(data?.visualization || data?.shape);

    // Store question/answer refs to prevent recreation
    const questionRef = useRef(data?.question);
    const answerRef = useRef(data?.answer);

    // Update refs when data changes (not on every render)
    useEffect(() => {
        visualizationRef.current = data?.visualization || data?.shape;
        questionRef.current = data?.question;
        answerRef.current = data?.answer;
    }, [data?.visualization, data?.shape, data?.question, data?.answer]);

    return (
        <div 
            className={`
                ${typeStyles[type] || 'bg-gray-100 hover:bg-gray-200 border-gray-300'} 
                p-4 rounded-lg shadow-md
                min-h-[300px]
                flex flex-col
                transform transition-all duration-300
                hover:shadow-lg hover:translate-y-[-2px]
                border-2
            `}
        >
            <h3 className="font-bold mb-2 text-lg text-gray-700">
                {title}
            </h3>

            <div className="flex-grow space-y-4">
                <div>
                    <ContentRenderer content={questionRef.current} />
                </div>

                {/* Visualization with consistent height */}
                {visualizationRef.current && (
                    <div className="h-32" key={`vis-container-${type}`}>
                        <ContentRenderer 
                            content={visualizationRef.current} 
                            type="visualization" 
                        />
                    </div>
                )}
            </div>

            {/* Answer section at the bottom */}
            {showAnswers && answerRef.current && (
                <div className="mt-auto pt-3 border-t border-gray-300" key={`answer-section-${type}`}>
                    <h4 className="text-base font-semibold text-gray-700 mb-1">Answer:</h4>
                    <div className="math-answer overflow-y-auto" style={{ maxHeight: '100px' }}>
                        {isPuzzle || data?.difficulty === 'text' || !(typeof answerRef.current === 'string' && answerRef.current.includes('\\')) ? (
                            <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                                {answerRef.current}
                            </div>
                        ) : (
                            <MathDisplay 
                                key={`math-display-${type}`}
                                math={answerRef.current} 
                                displayMode={true} 
                                size="normal" 
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

QuestionDisplay.displayName = 'QuestionDisplay';

/**
 * StarterSectionBase - Main component to display starter questions
 */
const StarterSectionBase = ({
    questionGenerators = [],
    currentTopic,
    currentLessonId,
    sectionConfig = {
        sections: ['lastLesson', 'lastWeek', 'lastTopic', 'lastYear'],
        titles: {
            lastLesson: 'Last Lesson',
            lastWeek: 'Last Week',
            lastTopic: 'Last Topic',
            lastYear: 'Last Year'
        }
    },
    className = ''
}) => {
    const { showAnswers } = useUI();
    const initializedRef = useRef(false);

    // Default section titles
    const sectionTitles = sectionConfig.titles || {
        lastLesson: 'Last Lesson',
        lastWeek: 'Last Week',
        lastTopic: 'Last Topic',
        lastYear: 'Last Year'
    };

    // Section types to use
    const sectionTypes = sectionConfig.sections || 
        ['lastLesson', 'lastWeek', 'lastTopic', 'lastYear'];

    // Memoize generators to prevent recreation
    const normalizedGenerators = useMemo(() => {
        const generators = [...questionGenerators];
        while (generators.length < sectionTypes.length) {
            generators.push(() => ({
                question: 'No question available',
                answer: 'No answer available'
            }));
        }
        return generators;
    }, [questionGenerators, sectionTypes.length]);

    // Use useRef to store a stable reference to the generators
    const generatorsRef = useRef(normalizedGenerators);
    
    // Update the ref when generators change, but don't cause re-renders
    useEffect(() => {
        generatorsRef.current = normalizedGenerators;
    }, [normalizedGenerators]);

    // Store generated questions in state, only update when explicitly regenerated
    const [questions, setQuestions] = useState(() => {
        initializedRef.current = true;
        
        // Create initial questions object with section types as keys
        const initialQuestions = {};
        sectionTypes.forEach((type, index) => {
            initialQuestions[type] = normalizedGenerators[index]();
        });
        
        return initialQuestions;
    });

    // Ensure components don't rerender unnecessarily by memoizing questions
    const memoizedQuestions = useMemo(() => questions, [questions]);

    // Only regenerate questions when the button is clicked
    const regenerateAllQuestions = () => {
        const newQuestions = {};
        sectionTypes.forEach((type, index) => {
            newQuestions[type] = generatorsRef.current[index]();
        });
        setQuestions(newQuestions);
    };

    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden py-4 px-6 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {sectionTypes.map((sectionType, index) => (
                    <QuestionDisplay
                        key={`question-${sectionType}`}
                        type={sectionType}
                        title={sectionTitles[sectionType] || `Section ${index + 1}`}
                        data={memoizedQuestions[sectionType]}
                        showAnswers={showAnswers}
                    />
                ))}
            </div>
            
            <div className="flex justify-center mt-4">
                <button
                    onClick={regenerateAllQuestions}
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600
                        rounded-full transition-all flex items-center gap-2 shadow-md"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-medium">New Questions</span>
                </button>
            </div>
        </div>
    );
};

export default StarterSectionBase;