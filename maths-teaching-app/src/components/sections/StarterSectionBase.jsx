// src/components/sections/StarterSectionBase.jsx
import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

/**
 * ContentRenderer - Renders different content types consistently
 * No longer forces shape heights - parent components control sizing
 */
const ContentRenderer = memo(({ content, type = 'text' }) => {
    if (!content) return null;

    // Handle React elements without imposing sizing constraints
    if (React.isValidElement(content)) {
        // Get component type name for stable key generation
        const componentType = content.type?.displayName || content.type?.name || 'component';
        const elementKey = content.key || `element-${componentType}-${Math.random().toString(36).substr(2, 5)}`;

        // Return element with key but no forced sizing
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
 * QuestionDisplay component renders a single question card
 * Now accepts custom renderContent function from parent
 */
const QuestionDisplay = memo(({
    type,
    title,
    data,
    showAnswers,
    renderQuestionContent // New prop for parent-controlled rendering
}) => {
    const typeStyles = {
        lastLesson: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
        lastWeek: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
        lastTopic: 'bg-green-100 hover:bg-green-200 border-green-300',
        lastYear: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
    };

    const isPuzzle = data?.difficulty === 'puzzle' || type === 'lastYear';

    // Use refs to hold stable data and prevent re-renders
    const dataRef = useRef(data);

    // Only update the data ref if it's actually a new question
    useEffect(() => {
        if (data &&
            (data !== dataRef.current ||
                data.question !== dataRef.current?.question ||
                data.visualization !== dataRef.current?.visualization)) {
            dataRef.current = data;
        }
    }, [data]);

    // Get data from our stable ref
    const stableData = dataRef.current;

    // Early return if no question data
    if (!stableData) {
        return (
            <Card noBg className={`${typeStyles[type] || 'bg-gray-100 hover:bg-gray-200 border-gray-300'} min-h-[300px] flex flex-col border-2`}>
                <CardContent className="flex items-center justify-center text-gray-500 italic">
                    <p>No question available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card noBg className={`
        ${typeStyles[type] || 'bg-gray-100 hover:bg-gray-200 border-gray-300'} 
        min-h-[300px]
        flex flex-col
        transform transition-all duration-300
        hover:shadow-lg hover:translate-y-[-2px]
        border-2
    `}>
            <CardContent className="flex flex-col h-full">
                <h3 className="font-bold mb-2 text-lg text-gray-700">
                    {title}
                </h3>

                <div className="flex-grow space-y-4">
                    <div>
                        <ContentRenderer content={stableData.question} />
                    </div>

                    {/* Standardized visualization container - always same height even when empty */}
                    <div className="visualization-container h-[120px] w-full flex justify-center items-center">
                        {stableData.visualization && (
                            renderQuestionContent ?
                                renderQuestionContent(stableData, type) :
                                <ContentRenderer content={stableData.visualization} />
                        )}
                    </div>
                </div>

                {/* Answer section at the bottom */}
                {showAnswers && stableData.answer && (
                    <div className="mt-auto pt-3 border-t border-gray-300">
                        <h4 className="text-base font-semibold text-gray-700 mb-1">Answer:</h4>
                        <div className="math-answer overflow-y-auto" style={{ maxHeight: '100px' }}>
                            {isPuzzle || stableData.difficulty === 'text' || !(typeof stableData.answer === 'string' && stableData.answer.includes('\\')) ? (
                                <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                                    {stableData.answer}
                                </div>
                            ) : (
                                <MathDisplay
                                    math={stableData.answer}
                                    displayMode={true}
                                    size="normal"
                                />
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

QuestionDisplay.displayName = 'QuestionDisplay';

/**
 * StarterSectionBase - Main component to display starter questions
 * Now accepts renderQuestionContent for parent-controlled rendering
 */
const StarterSectionBase = ({
    questionGenerators = [],
    renderQuestionContent = null, // New prop for parent control
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
    className = '',
    onRegenerateAllQuestions = null
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

    // Add question cache state to prevent regeneration on toggle
    const [questionCache, setQuestionCache] = useState({});

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

    // REPLACE with this code
    const [questions, setQuestions] = useState(() => {
        initializedRef.current = true;

        // Create initial questions object with section types as keys
        const initialQuestions = {};
        sectionTypes.forEach((type, index) => {
            // Pass section context to generators
            initialQuestions[type] = normalizedGenerators[index]({
                sectionContext: { sectionType: 'starter' }
            });
        });

        // Store these initial questions in our cache
        setQuestionCache(initialQuestions);

        return initialQuestions;
    });

    // Ensure components don't rerender unnecessarily by memoizing questions
    const memoizedQuestions = useMemo(() => questions, [questions]);

    // Only regenerate questions when the button is clicked
    const regenerateAllQuestions = () => {
        // Force new questions
        const newQuestions = {};
        sectionTypes.forEach((type, index) => {
            // Pass section context when regenerating
            newQuestions[type] = generatorsRef.current[index]({
                sectionContext: { sectionType: 'starter' }
            });
        });

        // Update our question cache with these new questions
        setQuestionCache(newQuestions);

        // Update the displayed questions
        setQuestions(newQuestions);

        // Call the external regenerate function if provided
        if (onRegenerateAllQuestions && typeof onRegenerateAllQuestions === 'function') {
            onRegenerateAllQuestions();
        }
    };

    return (
        <Card className={`py-4 px-6 ${className}`}>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {sectionTypes.map((sectionType, index) => (
                        <QuestionDisplay
                            key={`question-${sectionType}`}
                            type={sectionType}
                            title={sectionTitles[sectionType] || `Section ${index + 1}`}
                            data={memoizedQuestions[sectionType]}
                            showAnswers={showAnswers}
                            renderQuestionContent={renderQuestionContent}
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
            </CardContent>
        </Card>
    );
};

export default StarterSectionBase;