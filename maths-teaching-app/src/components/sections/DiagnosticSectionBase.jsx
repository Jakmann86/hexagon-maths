import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { useUI } from '../../context/UIContext';
import MathDisplay from '../common/MathDisplay';
import { useSectionTheme } from '../../hooks/useSectionTheme';

/**
 * DiagnosticSectionBase provides a reusable template for diagnostic assessments
 * across different mathematical topics with theming support
 */
const DiagnosticSectionBase = ({
    questionTypes = {},
    currentTopic,
    currentLessonId,
    onQuestionComplete = () => { },
    themeKey = 'diagnostic' // Default to diagnostic theme
}) => {
    // Get theme colors for the section
    const theme = useSectionTheme(themeKey);
    
    // Memoize the type keys to prevent recreating array on each render
    const typeKeys = useMemo(() => Object.keys(questionTypes), [questionTypes]);
    
    // State management for the current question and navigation
    const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const { setCurrentSection } = useUI();

    // Set current section on mount
    useEffect(() => {
        setCurrentSection('diagnostic');
    }, [setCurrentSection]);

    // Generate new question when the component mounts or when type index changes
    // Only run this effect when explicitly needed dependencies change
    useEffect(() => {
        if (typeKeys.length > 0) {
            generateNewQuestion();
        }
    }, [currentTypeIndex, typeKeys.length]); // Only depend on the length, not the array itself

    // Question generation and management
    const generateNewQuestion = () => {
        if (typeKeys.length === 0) return;
        
        const currentTypeId = typeKeys[currentTypeIndex];
        if (!questionTypes[currentTypeId]) return;
        
        const question = questionTypes[currentTypeId].generator();
        setCurrentQuestion(question);
        setShowAnswer(false);
        setSelectedAnswer(null);
    };

    // Answer handling - just show correct/incorrect, no additional UI
    const checkAnswer = (option) => {
        if (!currentQuestion) return;
        
        setSelectedAnswer(option);
        setShowAnswer(true);
        const isCorrect = option === currentQuestion.correctAnswer;
        onQuestionComplete(isCorrect);
    };

    // Shape rendering logic with improved styling
    const renderShape = () => {
        if (!currentQuestion?.shape) return null;
        
        const { component: ShapeComponent, props } = currentQuestion.shape;
        
        if (ShapeComponent && props) {
            return (
                <div className="flex justify-center items-center w-full my-8" style={{ 
                    height: '240px',  // Base height for the container
                    paddingTop: '5%', // 5% extra space on top
                    paddingBottom: '5%' // 5% extra space on bottom
                }}>
                    <ShapeComponent {...props} />
                </div>
            );
        }
        
        return null;
    };

    // Get title based on current question type
    const getCurrentTitle = () => {
        if (typeKeys.length === 0) return "Diagnostic Question";
        const currentTypeId = typeKeys[currentTypeIndex];
        return questionTypes[currentTypeId]?.title || "Diagnostic Question";
    };

    // Loading state
    if (typeKeys.length === 0 || !currentQuestion) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex justify-center items-center mb-4">
                        <RefreshCw className="w-6 h-6 text-purple-700 animate-spin" />
                    </div>
                    <div className="text-gray-600">Loading diagnostic questions...</div>
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div className="space-y-6">
            {/* Header with title, new question button and navigation - matches ExamplesSection */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-6 pt-6">
                {/* Title - from question type */}
                <h3 className="text-xl font-semibold text-gray-800">
                    {getCurrentTitle()}
                </h3>
                
                {/* New Question Button - In the middle */}
                <button
                    onClick={generateNewQuestion}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all"
                >
                    <RefreshCw size={18} />
                    <span>New Question</span>
                </button>
                
                {/* Navigation Buttons (1,2,3) - Matching Examples style */}
                <div className="flex gap-2">
                    {typeKeys.slice(0, 3).map((_, index) => (
                        <button
                            key={index}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                index === currentTypeIndex
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                            onClick={() => {
                                setCurrentTypeIndex(index);
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Question Card */}
            <Card>
                <CardContent className="p-6">
                    {currentQuestion && (
                        <div className="space-y-6 w-full max-w-2xl mx-auto">
                            {/* Question Display */}
                            <div className="text-lg font-medium text-center text-gray-800 pb-4">
                                {typeof currentQuestion.questionDisplay === 'string'
                                    ? currentQuestion.questionDisplay
                                    : currentQuestion.questionDisplay}
                            </div>

                            {/* Shape Visualization */}
                            {renderShape()}

                            {/* Multiple Choice Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => checkAnswer(option)}
                                        disabled={showAnswer}
                                        className={`
                                            relative p-3 rounded-lg border-2 transition-all 
                                            ${showAnswer
                                                ? option === currentQuestion.correctAnswer
                                                    ? 'bg-green-50 border-green-500 text-green-700'
                                                    : option === selectedAnswer
                                                        ? 'bg-red-50 border-red-500 text-red-700'
                                                        : 'bg-gray-50 border-gray-200 opacity-70'
                                                : 'hover:bg-purple-50 border-gray-200 hover:border-purple-300 hover:shadow-md'
                                            }
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
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DiagnosticSectionBase;