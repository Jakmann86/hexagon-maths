// src/components/sections/StarterSectionBase.jsx
import React, { useState, useMemo, memo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import ContentRenderer from '../common/ContentRenderer';
import { useUI } from '../../context/UIContext';
import SymbolPuzzleDisplay from '../math/puzzles/SymbolPuzzleDisplay';

/**
 * QuestionDisplay component renders a single question card
 * Styled to match Maths-Starters aesthetic
 */
const QuestionDisplay = memo(({
    type,
    title,
    data,
    showAnswers,
    renderQuestionContent
}) => {
    // Color styles for different question types - with borders
    const typeStyles = {
        lastLesson: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
        lastWeek: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
        lastTopic: 'bg-green-100 hover:bg-green-200 border-green-300',
        lastYear: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
    };

    // Determine question characteristics
    const isPuzzle = data?.difficulty === 'puzzle' || type === 'lastYear';
    const isSymbolPuzzle = data?.isSymbolPuzzle || data?.puzzleDisplay;
    const hasVisualization = data?.visualization;

    // Early return if no question data
    if (!data) {
        return (
            <div className={`${typeStyles[type] || 'bg-gray-100 border-gray-300'} p-6 rounded-lg shadow border-2 min-h-[260px] max-h-[400px] flex items-center justify-center`}>
                <p className="text-gray-500 italic">No question available</p>
            </div>
        );
    }

    // Helper to render content (string or React element)
    const renderContent = (content) => {
        if (React.isValidElement(content)) {
            return content;
        }
        return (
            <ContentRenderer
                content={content}
                sectionType="starter"
                size="large"
                color="default"
                fontWeight="normal"
            />
        );
    };

    return (
        <div className={`
            ${typeStyles[type] || 'bg-gray-100 hover:bg-gray-200 border-gray-300'} 
            p-6 rounded-lg shadow border-2
            min-h-[340px] max-h-[480px]
            flex flex-col
        `}>
            {/* Question Title - Bold, larger, capitalize */}
            <h3 className="font-bold mb-3 text-gray-700 text-xl capitalize">
                {title}
            </h3>

            {/* Question Content */}
            <div className="text-lg mb-2">
                {isSymbolPuzzle && data.puzzleDisplay ? (
                    <SymbolPuzzleDisplay
                        puzzleDisplay={data.puzzleDisplay}
                        mode="question"
                        className="text-lg"
                    />
                ) : data.question ? (
                    renderContent(data.question)
                ) : (
                    <span className="text-gray-500 italic">No question text</span>
                )}
            </div>

            {/* Visualization Container - height can be customized via data.visualizationHeight */}
            {hasVisualization && (
                <div 
                    className="w-full flex justify-center items-center flex-shrink-0 mt-4" 
                    style={{ height: data.visualizationHeight || '100px' }}
                >
                    {renderQuestionContent ? (
                        renderQuestionContent(data, type)
                    ) : isSymbolPuzzle && data.puzzleDisplay ? (
                        <SymbolPuzzleDisplay puzzleDisplay={data.puzzleDisplay} containerHeight={data.visualizationHeight || "100px"} />
                    ) : React.isValidElement(data.visualization) ? (
                        data.visualization
                    ) : (
                        <ContentRenderer content={data.visualization} />
                    )}
                </div>
            )}

            {/* Spacer to push answer to bottom */}
            <div className="flex-grow" />

            {/* Answer Section - with label */}
            {showAnswers && data.answer && (
                <div className="mt-3 pt-3">
                    <h4 className="text-base font-semibold text-gray-700 mb-1">Answer:</h4>
                    <div className="font-bold text-gray-800">
                        {isSymbolPuzzle ? (
                            <div className="whitespace-pre-wrap">
                                {data.answer}
                            </div>
                        ) : (
                            <ContentRenderer
                                content={data.answer}
                                sectionType="starter"
                                size="large"
                                color="default"
                                fontWeight="bold"
                                type={isPuzzle || data.difficulty === 'text' ? 'text' : 'auto'}
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
 * Renders a 2x2 grid of questions with regeneration functionality
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
        while (generators.length < sectionTypes.length) {
            generators.push(() => ({
                question: 'No question available',
                answer: 'N/A'
            }));
        }
        return generators;
    }, [questionGenerators, sectionTypes.length]);

    // State for current questions
    const [questions, setQuestions] = useState(() => {
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

        if (onRegenerateAllQuestions && typeof onRegenerateAllQuestions === 'function') {
            onRegenerateAllQuestions();
        }
    };

    return (
        <Card className={`py-4 px-6 ${className}`}>
            <CardContent>
                {/* Questions Grid - 2x2 layout */}
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
                        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-all flex items-center gap-2 shadow-md"
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