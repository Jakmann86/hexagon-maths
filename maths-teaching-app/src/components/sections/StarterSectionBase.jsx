import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

/**
 * Enhanced QuestionDisplay component with styling closer to standalone version
 */
const QuestionDisplay = ({ type, title, data, showAnswers }) => {
    // Match the standalone styling more exactly
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
        return <div className="text-gray-800">{addPeriod(content)}</div>;
    };

    // Calculate dynamic height based on content - scaled down by ~10%
    const calculateAspectRatio = () => {
        // If the content includes a visualization, use a more square aspect ratio
        const hasVisualization = data?.visualization || data?.shape;
        return hasVisualization ? 'aspect-[1.5/0.9]' : 'aspect-[2/0.9]';
    };

    return (
        <div 
            className={`${typeStyles[type]} 
                pt-5 pb-4 px-5
                rounded-lg shadow-md
                ${calculateAspectRatio()}
                flex flex-col
                transform transition-all duration-200
                hover:shadow-lg hover:translate-y-[-2px]
                mt-2 text-[0.95rem]`}
        >
            <h3 className="font-bold mb-2 text-lg text-gray-600">
                {title}
            </h3>

            <div className="flex-grow overflow-auto space-y-3">
                <div className="text-base mb-2">
                    {renderContent(data?.question, false)}
                </div>

                {/* Visualization or shape if available */}
                {data?.visualization && (
                    <div className="flex justify-center my-2">
                        {data.visualization}
                    </div>
                )}

                {showAnswers && data?.answer && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="text-base text-gray-700 font-medium">
                            {renderContent(data?.answer, true)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Enhanced StarterSectionBase component - without title and with bottom button
 */
const StarterSectionBase = ({
    questionGenerators = [],
    currentTopic,
    currentLessonId
}) => {
    const { showAnswers } = useUI();

    // Default section titles
    const sectionTitles = {
        section1: 'Last Lesson',
        section2: 'Last Week',
        section3: 'Last Topic',
        section4: 'Last Year'
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
        <div className="pt-0 -mt-1 pb-4 px-2 bg-white rounded-xl shadow-lg overflow-hidden max-w-[90%] mx-auto">
            {/* Question grid with more responsive layout - scaled down 10% */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
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
            
            {/* New Questions button at the bottom - slightly smaller */}
            <div className="px-3 pb-3 pt-1 flex justify-center">
                <button
                    onClick={regenerateAllQuestions}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 bg-white rounded-full 
                            hover:bg-gray-100 transition-all flex items-center gap-2 shadow-sm"
                    title="Generate New Questions"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm font-medium">New Questions</span>
                </button>
            </div>
        </div>
    );
};

export default StarterSectionBase;