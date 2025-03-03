// src/components/sections/diagnostic/AnswerOptions.jsx
import React from 'react';
import { Check } from 'lucide-react';
import MathDisplay from '../../common/MathDisplay';

const AnswerOptions = ({
    options,
    correctAnswer,
    selectedAnswer,
    showAnswer,
    onSelectAnswer
}) => {
    const formatAnswer = (answer) => {
        if (typeof answer === 'string' && answer.includes('\\')) {
            return <MathDisplay math={answer} size="normal" />;
        }
        return answer;
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => onSelectAnswer(option)}
                    disabled={showAnswer}
                    className={`p-4 rounded-lg border-2 transition-colors w-full ${showAnswer
                            ? option === correctAnswer
                                ? 'bg-green-100 border-green-500'
                                : option === selectedAnswer
                                    ? 'bg-red-100 border-red-500'
                                    : 'bg-gray-50 border-gray-200'
                            : 'hover:bg-gray-50 border-gray-200'
                        }`}
                >
                    <span className="flex items-center justify-center">
                        {formatAnswer(option)}
                        {showAnswer && option === correctAnswer && (
                            <Check className="inline-block ml-2 w-5 h-5 text-green-500" />
                        )}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default AnswerOptions;