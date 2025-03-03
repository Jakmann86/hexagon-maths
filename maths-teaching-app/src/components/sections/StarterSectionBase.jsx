import React, { useState } from 'react';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

/**
 * Internal QuestionDisplay component
 */
const QuestionDisplay = ({ type, title, data, showAnswers }) => {
    const typeStyles = {
        section1: 'bg-pink-100 hover:bg-pink-200',
        section2: 'bg-blue-100 hover:bg-blue-200',
        section3: 'bg-green-100 hover:bg-green-200',
        section4: 'bg-orange-100 hover:bg-orange-200'
    };

    const renderContent = (content, isMath = false) => {
        if (!content) return null;
        
        if (React.isValidElement(content)) {
            return content;
        }

        // Add period to the end of the question if it doesn't already have punctuation
        const addPeriod = (text) => {
            if (typeof text === 'string') {
                const trimmedText = text.trim();
                if (trimmedText && !['?', '.', '!'].includes(trimmedText.slice(-1))) {
                    return `${trimmedText}.`;
                }
            }
            return text;
        };

        if (isMath) {
            return <MathDisplay math={content} />;
        }
        return <div>{addPeriod(content)}</div>;
    };

    return (
        <div className={`${typeStyles[type]} pt-5 pb-4 pl-4 pr-4 rounded-lg aspect-[1.6/0.7] flex flex-col mt-3`}>
            <h3 className="font-bold mb-2 text-xl text-gray-600">
                {title}
            </h3>

            <div className="flex-grow overflow-auto">
                <div className="text-base text-gray-800 mb-2">
                    {renderContent(data?.question, false)}
                </div>

                {showAnswers && data?.answer && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                        <div className="text-base text-gray-700">
                            {renderContent(data?.answer, true)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * StarterSection template provides a standardized way to display 
 * starter/warm-up questions across different topics
 */
const StarterSectionBase = ({
    questionGenerators = [],
    currentTopic,
    currentLessonId
}) => {
    const { showAnswers, toggleAnswers } = useUI();  // Get both showAnswers and toggleAnswers

    // Default section titles are now handled internally
    const sectionTitles = {
        section1: '1',
        section2: '2',
        section3: '3',
        section4: '4'
    };

    // Simplified config
    const config = {
        columns: 2,
        sectionTitles
    };

    // Ensure we have exactly 4 generators, using empty generators if needed
    const normalizedGenerators = [...questionGenerators];
    while (normalizedGenerators.length < 4) {
        normalizedGenerators.push(() => ({
            question: 'No question available',
            answer: 'No answer available'
        }));
    }

    // State to store current questions
    const [questions, setQuestions] = useState(() => ({
        section1: normalizedGenerators[0](),
        section2: normalizedGenerators[1](),
        section3: normalizedGenerators[2](),
        section4: normalizedGenerators[3]()
    }));

    // Function to regenerate all questions
    const regenerateAllQuestions = () => {
        setQuestions({
            section1: normalizedGenerators[0](),
            section2: normalizedGenerators[1](),
            section3: normalizedGenerators[2](),
            section4: normalizedGenerators[3]()
        });
    };

    

    return (
        <div className="space-y-4">
            {/* Header with controls */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={toggleAnswers}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    {showAnswers ? (
                        <>
                            <EyeOff className="w-4 h-4" />
                            Hide Answers
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4" />
                            Show Answers
                        </>
                    )}
                </button>
            </div>

            {/* Question grid with regenerate button in corner */}
            <div className="relative">
                <button
                    onClick={regenerateAllQuestions}
                    className="absolute -top-2 -right-2 p-2 text-gray-600 hover:text-gray-800 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                    title="Generate New Questions"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>

                {/* Question grid */}
                <div className={`grid grid-cols-1 md:grid-cols-${config.columns} gap-4`}>
                    {Object.entries(questions).map(([sectionKey, questionData]) => (
                        <QuestionDisplay
                            key={sectionKey}
                            type={sectionKey}
                            title={sectionTitles[sectionKey]}
                            data={questionData}
                            showAnswers={showAnswers}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StarterSectionBase;