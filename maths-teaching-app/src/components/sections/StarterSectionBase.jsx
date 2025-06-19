// src/components/sections/StarterSectionBase.jsx
import React, { useState, useMemo, memo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import ContentRenderer from '../common/ContentRenderer';
import { useUI } from '../../context/UIContext';
import SymbolPuzzleDisplay from '../math/puzzles/SymbolPuzzleDisplay';

/**
 * QuestionDisplay component renders a single question card
 * Handles both regular questions and symbol puzzles
 */
const QuestionDisplay = memo(({
    type,
    title,
    data,
    showAnswers,
    renderQuestionContent
}) => {
    // Color styles for different question types
    const typeStyles = {
        lastLesson: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
        lastWeek: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
        lastTopic: 'bg-green-100 hover:bg-green-200 border-green-300',
        lastYear: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
    };

    // Determine question characteristics
    const isPuzzle = data?.difficulty === 'puzzle' || type === 'lastYear';
    const isSymbolPuzzle = data?.isSymbolPuzzle || data?.puzzleDisplay;

    // Early return if no question data
    if (!data) {
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
                {/* Question Title */}
                <h3 className="font-bold mb-2 text-lg text-gray-700">
                    {title}
                </h3>

                <div className="flex-grow space-y-4">
                    {/* Question Text Area */}
                    <div>
                        {isSymbolPuzzle && data.puzzleDisplay ? (
                            <div className="text-gray-700 text-base leading-relaxed">
                                <SymbolPuzzleDisplay
                                    puzzleDisplay={data.puzzleDisplay}
                                    mode="question"
                                    className="text-base"
                                />
                            </div>
                        ) : data.question ? (
                            // Regular question: use ContentRenderer
                            <ContentRenderer
                                content={data.question}
                                sectionType="starter"
                                size="normal"
                                color="default"
                                fontWeight="normal"
                            />
                        ) : (
                            // No question available
                            <div className="text-gray-500 italic">No question text available</div>
                        )}
                    </div>

                    {/* Visualization Container */}
                    <div className="visualization-container h-[120px] w-full flex justify-center items-center">
                        {data.visualization && (
                            renderQuestionContent ?
                                renderQuestionContent(data, type) :
                                (isSymbolPuzzle && data.puzzleDisplay ?
                                    <SymbolPuzzleDisplay puzzleDisplay={data.puzzleDisplay} containerHeight="120px" /> :
                                    <ContentRenderer content={data.visualization} />)
                        )}
                    </div>
                </div>

                {/* Answer Section */}
                {showAnswers && data.answer && (
                    <div
                        className="mt-auto pt-3 border-t border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="text-base font-semibold text-gray-700 mb-1">Answer:</h4>
                        <div
                            className="math-answer overflow-y-auto"
                            style={{ maxHeight: '100px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Symbol puzzle answers use plain text, others use ContentRenderer */}
                            {isSymbolPuzzle ? (
                                <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                                    {data.answer}
                                </div>
                            ) : (
                                <ContentRenderer
                                    content={data.answer}
                                    sectionType="starter"
                                    size="normal"
                                    color="default"
                                    fontWeight="normal"
                                    type={isPuzzle || data.difficulty === 'text' ? 'text' : 'auto'}
                                    textOptions={{
                                        className: isPuzzle ? 'whitespace-pre-wrap text-gray-700 text-sm leading-relaxed' : 'text-gray-700'
                                    }}
                                    mathOptions={{ displayMode: true }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

// Set display name for debugging
QuestionDisplay.displayName = 'QuestionDisplay';

/**
 * StarterSectionBase - Main component to display starter questions
 * Renders a grid of questions with regeneration functionality
 */
const StarterSectionBase = ({
    questionGenerators = [],
    renderQuestionContent = null,
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

    // Extract configuration with defaults
    const sectionTitles = sectionConfig.titles || {
        lastLesson: 'Last Lesson',
        lastWeek: 'Last Week',
        lastTopic: 'Last Topic',
        lastYear: 'Last Year'
    };

    const sectionTypes = sectionConfig.sections || ['lastLesson', 'lastWeek', 'lastTopic', 'lastYear'];

    // Normalize generators - ensure we have enough generators for all sections
    const normalizedGenerators = useMemo(() => {
        const generators = [...questionGenerators];
        // Fill missing generators with placeholder
        while (generators.length < sectionTypes.length) {
            generators.push(() => ({
                question: 'No question available',
                answer: 'No answer available'
            }));
        }
        return generators;
    }, [questionGenerators, sectionTypes.length]);

    // State for current questions
    const [questions, setQuestions] = useState(() => {
        // Generate initial questions
        const initialQuestions = {};
        sectionTypes.forEach((type, index) => {
            initialQuestions[type] = normalizedGenerators[index]();
        });
        return initialQuestions;
    });

    // Regenerate all questions
    const regenerateAllQuestions = () => {
        const newQuestions = {};
        sectionTypes.forEach((type, index) => {
            newQuestions[type] = normalizedGenerators[index]();
        });
        setQuestions(newQuestions);

        // Call external callback if provided
        if (onRegenerateAllQuestions && typeof onRegenerateAllQuestions === 'function') {
            onRegenerateAllQuestions();
        }
    };

    return (
        <Card className={`py-4 px-6 ${className}`}>
            <CardContent>
                {/* Questions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {sectionTypes.map((sectionType, index) => (
                        <QuestionDisplay
                            key={`question-${sectionType}`}
                            type={sectionType}
                            title={sectionTitles[sectionType] || `Section ${index + 1}`}
                            data={questions[sectionType]}
                            showAnswers={showAnswers}
                            renderQuestionContent={renderQuestionContent}
                        />
                    ))}
                </div>

                {/* New Questions Button */}
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