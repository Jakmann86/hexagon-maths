// src/components/sections/diagnostic/QuestionTypeSelector.jsx
import React from 'react';

const QuestionTypeSelector = ({ questionTypes, currentType, onTypeChange }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {Object.entries(questionTypes).map(([id, questionData]) => (
                <button
                    key={id}
                    onClick={() => onTypeChange(Number(id))}
                    className={`px-4 py-2 rounded-lg transition-colors ${currentType === Number(id)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                >
                    {questionData.title}
                </button>
            ))}
        </div>
    );
};

export default QuestionTypeSelector;