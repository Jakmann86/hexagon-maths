import React, { useState, useEffect } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { Card, CardContent } from '../components/common/Card';
import { Square, RightTriangle } from '../components/shapes';
import { getQuestions } from '../../data/diagnostic';
import { useUI } from '../context/UIContext';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const DiagnosticQuestion = ({ currentTopic, currentLessonId }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [questionType, setQuestionType] = useState(1);
    const [lessonQuestions, setLessonQuestions] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const { setCurrentSection } = useUI();

    // Fetch lesson questions
    useEffect(() => {
        const fetchLessonQuestions = async () => {
            const questions = await getQuestions(currentTopic, currentLessonId);
            setLessonQuestions(questions);
        };

        fetchLessonQuestions();
    }, [currentTopic, currentLessonId]);

    // Set current section on mount
    useEffect(() => {
        setCurrentSection('diagnostic');
    }, [setCurrentSection]);

    // Generate initial or new question when lesson questions change
    useEffect(() => {
        const currentQuestionType = lessonQuestions?.[questionType];
        if (currentQuestionType) {
            generateNewQuestion();
        }
    }, [lessonQuestions, questionType]);

    const generateNewQuestion = () => {
        const currentQuestionType = lessonQuestions?.[questionType];
        if (currentQuestionType) {
            setCurrentQuestion(currentQuestionType.generator());
            setShowAnswer(false);
            setSelectedAnswer(null);
        }
    };

    const checkAnswer = (option) => {
        setSelectedAnswer(option);
        setShowAnswer(true);
    };

    const renderShape = () => {
        if (!currentQuestion?.shape) return null;

        const { component, props = {} } = currentQuestion.shape;

        // Add default values for required props
        const enhancedProps = {
            units: 'units',
            showRightAngle: true,
            ...props,
            className: "mx-auto mb-4"
        };

        switch (component) {
            case Square:
                return <Square {...enhancedProps} />;
            case RightTriangle:
                return <RightTriangle {...enhancedProps} />;
            default:
                console.warn('Unknown shape component:', component);
                return null;
        }
    };

    const renderQuestionDisplay = () => {
        if (!currentQuestion?.questionDisplay) {
            return null;
        }

        if (typeof currentQuestion.questionDisplay === 'object') {
            return (
                <div className="text-lg mb-4 space-y-2">
                    <p>{currentQuestion.questionDisplay.text}</p>
                    {currentQuestion.questionDisplay.math && (
                        <div dangerouslySetInnerHTML={{
                            __html: katex.renderToString(currentQuestion.questionDisplay.math, {
                                throwOnError: false,
                                displayMode: true
                            })
                        }} />
                    )}
                </div>
            );
        }
        return <div className="text-lg mb-4">{currentQuestion.questionDisplay}</div>;
    };

    const renderAnswerDisplay = () => {
        if (!showAnswer || !currentQuestion?.answerDisplay) return null;

        return (
            <div
                className="mt-4 p-3 bg-green-50 rounded-lg text-green-800"
                dangerouslySetInnerHTML={{ __html: currentQuestion.answerDisplay }}
            />
        );
    };

    if (!lessonQuestions) {
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
                {Object.entries(lessonQuestions).map(([id, questionData]) => (
                    <button
                        key={id}
                        onClick={() => setQuestionType(Number(id))}
                        className={`px-4 py-2 rounded-lg transition-colors ${questionType === Number(id)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {questionData.title}
                    </button>
                ))}
            </div>

            {/* Question Card */}
            <Card>
                <CardContent className="p-6 flex justify-center items-center">
                    {currentQuestion && (
                        <div className="space-y-6 w-full max-w-md text-center"> {/* Added max-width and centering */}
                            {/* Question Display */}
                            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                                {renderQuestionDisplay()}
                                {renderShape()}
                            </div>

                            {/* Multiple Choice Options */}
                            <div className="grid grid-cols-2 gap-4 place-items-center"> {/* Added place-items-center */}
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

export default DiagnosticQuestion;