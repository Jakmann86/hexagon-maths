// src/components/starters/QuestionDisplay.jsx
import React from 'react';
import MathDisplay from '../common/MathDisplay';

const QuestionDisplay = ({ type, data, showAnswers }) => {
    const typeStyles = {
        lastLesson: 'bg-pink-100 hover:bg-pink-200',
        lastWeek: 'bg-blue-100 hover:bg-blue-200',
        lastTopic: 'bg-green-100 hover:bg-green-200',
        lastYear: 'bg-orange-100 hover:bg-orange-200'
    };

    const typeNames = {
        lastLesson: 'Last Lesson',
        lastWeek: 'Last Week',
        lastTopic: 'Last Topic',
        lastYear: 'Last Year'
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
                {typeNames[type]}
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

export default QuestionDisplay;