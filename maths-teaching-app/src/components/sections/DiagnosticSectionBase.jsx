// src/components/sections/DiagnosticSection.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { useUI } from '../../context/UIContext';

/**
 * DiagnosticSection template for interactive diagnostic questions
 * 
 * @param {Object} questionTypes - Dictionary of question types with their generators
 * @param {string} currentTopic - Current topic identifier
 * @param {number} currentLessonId - Current lesson identifier
 * @param {Function} onQuestionComplete - Optional callback when question is answered
 */
const DiagnosticSection = ({
    questionTypes = {},
    currentTopic,
    currentLessonId,
    onQuestionComplete = () => { }
}) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentTypeId, setCurrentTypeId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const { setCurrentSection } = useUI();

    // Initialize with the first question type
    useEffect(() => {
        if (Object.keys(questionTypes).length > 0) {
            setCurrentTypeId(Object.keys(questionTypes)[0]);
        }
    }, [questionTypes]);

    // Set current section on mount
    useEffect(() => {
        setCurrentSection('diagnostic');
    }, [setCurrentSection]);

    // Generate new question when type changes
    useEffect(() => {
        if (currentTypeId && questionTypes[currentTypeId]) {
            generateNewQuestion();
        }
    }, [currentTypeId, questionTypes]);

    const generateNewQuestion = () => {
        if (!currentTypeId || !questionTypes[currentTypeId]) return;

        const question = questionTypes[currentTypeId].generator();
        setCurrentQuestion(question);
        setShowAnswer(false);
        setSelectedAnswer(null);
    };

    const checkAnswer = (option) => {
        setSelectedAnswer(option);
        setShowAnswer(true);
        onQuestionComplete(option === currentQuestion?.correctAnswer);
    };

    // Render shape component if provided
    const renderShape = () => {
        if (!currentQuestion?.shape) return null;

        const { component: ShapeComponent, props = {} } = currentQuestion.shape;

        return ShapeComponent ? (
            <ShapeComponent {...props} className="mx-auto mb-4" />
        ) : null;
    };

    if (!currentTypeId || !currentQuestion) {
        return (
            <div className="text-center p-6">
                <p>Loading diagnostic questions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Question Type Selector */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(questionTypes).map(([id, { title }]) => (
                    <button
                        key={id}
                        onClick={() => setCurrentTypeId(id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${currentTypeId === id
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {title}
                    </button>
                ))}
            </div>

            {/* Question Card */}
            <Card>
                <CardContent className="p-6 flex justify-center items-center">
                    {currentQuestion && (
                        <div className="space-y-6 w-full max-w-md text-center">
                            {/* Question Display */}
                            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                                <div className="text-lg mb-4">
                                    {typeof currentQuestion.questionDisplay === 'string'
                                        ? currentQuestion.questionDisplay
                                        : currentQuestion.questionDisplay}
                                </div>
                                {renderShape()}
                            </div>

                            {/* Multiple Choice Options */}
                            <div className="grid grid-cols-2 gap-4 place-items-center">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => checkAnswer(option)}
                                        disabled={showAnswer}
                                        className={`p-4 rounded-lg border-2 transition-colors w-full ${showAnswer
                                                ? option === currentQuestion.correctAnswer
                                                    ? 'bg-green-100 border-green-500'
                                                    : option === selectedAnswer
                                                        ? 'bg-red-100 border-red-500'
                                                        : 'bg-gray-50 border-gray-200'
                                                : 'hover:bg-gray-50 border-gray-200'
                                            }`}
                                    >
                                        {option}
                                        {showAnswer && option === currentQuestion.correctAnswer && (
                                            <Check className="inline-block ml-2 w-5 h-5 text-green-500" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Solution Display */}
                            {showAnswer && currentQuestion.answerDisplay && (
                                <div className="mt-4 p-3 bg-green-50 rounded-lg text-green-800">
                                    {currentQuestion.answerDisplay}
                                </div>
                            )}

                            {/* Generate New Question Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={generateNewQuestion}
                                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    <span>New Question</span>
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DiagnosticSection;