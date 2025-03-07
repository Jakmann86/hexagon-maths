import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { useUI } from '../../context/UIContext';
import MathDisplay from '../common/MathDisplay';

/**
 * DiagnosticSectionBase provides a reusable template for diagnostic assessments
 * across different mathematical topics
 */
const DiagnosticSectionBase = ({
    questionTypes = {},
    currentTopic,
    currentLessonId,
    onQuestionComplete = () => { }
}) => {
    // State management for question flow
    const [showAnswer, setShowAnswer] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
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

    // Question generation and management
    const generateNewQuestion = () => {
        if (!currentTypeId || !questionTypes[currentTypeId]) return;
        const question = questionTypes[currentTypeId].generator();
        setCurrentQuestion(question);
        setShowAnswer(false);
        setShowFeedback(false);
        setSelectedAnswer(null);
    };

    // Answer handling
    const checkAnswer = (option) => {
        setSelectedAnswer(option);
        setShowAnswer(true);
        setShowFeedback(true);
        const isCorrect = option === currentQuestion?.correctAnswer;
        onQuestionComplete(isCorrect);
    };

    const nextQuestion = () => {
        generateNewQuestion();
    };

    // Shape rendering logic
    const renderShape = () => {
        if (!currentQuestion?.shape) return null;
        
        if (currentQuestion.shape.component && currentQuestion.shape.props) {
            const ShapeComp = currentQuestion.shape.component;
            return (
                <div className="flex justify-center w-full max-w-md mx-auto my-6">
                    <ShapeComp {...currentQuestion.shape.props} />
                </div>
            );
        }
        
        return null;
    };

    // Loading state
    if (!currentTypeId || !currentQuestion) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex justify-center items-center mb-4">
                        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                    <div className="text-gray-600">Loading diagnostic questions...</div>
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div className="space-y-6">
            {/* Question Type Selector */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start overflow-x-auto pb-2">
                {Object.entries(questionTypes).map(([id, { title }]) => (
                    <button
                        key={id}
                        onClick={() => setCurrentTypeId(id)}
                        className={`px-4 py-2 rounded-lg transition-all transform ${
                            currentTypeId === id
                                ? 'bg-indigo-100 text-indigo-700 shadow-md scale-105'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
                        }`}
                    >
                        {title}
                    </button>
                ))}
            </div>

            {/* Question Card */}
            <Card className="shadow-lg border-t-4 border-indigo-500 overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-6">
                        {currentQuestion && (
                            <div className="space-y-6 w-full max-w-2xl mx-auto">
                                {/* Question Display */}
                                <div className="text-lg font-medium text-center text-gray-800">
                                    {typeof currentQuestion.questionDisplay === 'string'
                                        ? currentQuestion.questionDisplay
                                        : currentQuestion.questionDisplay}
                                </div>

                                {/* Shape Visualization */}
                                {renderShape()}

                                {/* Multiple Choice Options */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    {currentQuestion.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => checkAnswer(option)}
                                            disabled={showAnswer}
                                            className={`
                                                relative p-4 rounded-lg border-2 transition-all transform
                                                ${showAnswer
                                                    ? option === currentQuestion.correctAnswer
                                                        ? 'bg-green-50 border-green-500 text-green-700'
                                                        : option === selectedAnswer
                                                            ? 'bg-red-50 border-red-500 text-red-700'
                                                            : 'bg-gray-50 border-gray-200 opacity-70'
                                                    : 'hover:bg-gray-50 border-gray-200 hover:border-indigo-300 hover:shadow-md'
                                                }
                                                ${showAnswer && option === selectedAnswer ? 'scale-105' : ''}
                                            `}
                                        >
                                            {/* Option Display - handles LaTeX formatting */}
                                            {typeof option === 'string' && option.includes('\\text') ? (
                                                <div className="text-lg">
                                                    <MathDisplay math={option} />
                                                </div>
                                            ) : (
                                                <span className="text-lg">{option}</span>
                                            )}
                                            
                                            {/* Correct Answer Indicator */}
                                            {showAnswer && option === currentQuestion.correctAnswer && (
                                                <div className="absolute -right-2 -top-2 bg-green-500 rounded-full p-1 shadow-md">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            
                                            {/* Incorrect Answer Indicator */}
                                            {showAnswer && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                                                <div className="absolute -right-2 -top-2 bg-red-500 rounded-full p-1 shadow-md">
                                                    <X className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Feedback and Next Question UI */}
                                {showFeedback && (
                                    <div className="mt-6 flex flex-col items-center">
                                        {/* Solution Display */}
                                        {currentQuestion.answerDisplay && (
                                            <div className={`w-full p-4 rounded-lg mb-4 ${
                                                selectedAnswer === currentQuestion.correctAnswer
                                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                            }`}>
                                                <div className="font-medium text-center">
                                                    {typeof currentQuestion.answerDisplay === 'string' && 
                                                     currentQuestion.answerDisplay.includes('\\text') ? (
                                                        <MathDisplay math={currentQuestion.answerDisplay} />
                                                    ) : (
                                                        currentQuestion.answerDisplay
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Next Question Button */}
                                        <button
                                            onClick={nextQuestion}
                                            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
                                        >
                                            <span>Next Question</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                                
                                {/* New Question Button */}
                                {!showFeedback && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={generateNewQuestion}
                                            className="flex items-center space-x-2 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            <span>New Question</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DiagnosticSectionBase;