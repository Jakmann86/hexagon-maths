// Enhanced StarterSectionBase.jsx with MathStarters styling
import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

// Improve content renderer to match MathStarters styling
const ContentRenderer = ({ content, type = 'text', isMath = false }) => {
    if (!content) return null;
    
    // Direct React element rendering
    if (React.isValidElement(content)) {
        return content;
    }

    // Process text with MathStarters styling
    const processText = (text) => {
        if (typeof text !== 'string') return text;
        return text.trim();
    };

    // Enhanced rendering based on content type
    switch (type) {
        case 'visualization':
            return (
                <div className="flex justify-center items-center p-2">
                    {content}
                </div>
            );
        case 'math':
            return <MathDisplay math={processText(content)} displayMode={true} size="large" />;
        default:
            if (typeof content === 'string' && (content.includes('\\') || content.includes('$'))) {
                return <MathDisplay math={processText(content)} size="large" />;
            }
            return <div className="text-gray-800 text-lg">{processText(content)}</div>;
    }
};

// Enhanced QuestionDisplay with MathStarters styling
const QuestionDisplay = ({ type, title, data, showAnswers }) => {
    // Use MathStarters color scheme
    const typeStyles = {
        section1: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
        section2: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
        section3: 'bg-green-100 hover:bg-green-200 border-green-300',
        section4: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
    };

    return (
        <div 
            className={`
                ${typeStyles[type]} 
                p-5 rounded-lg shadow-md
                ${showAnswers ? 'aspect-auto' : 'aspect-[2/1]'}
                flex flex-col
                transform transition-all duration-300
                hover:shadow-lg hover:translate-y-[-2px]
                border-2
            `}
        >
            <h3 className="font-bold mb-3 text-xl text-gray-700">
                {title}
            </h3>

            <div className="flex-grow flex flex-col space-y-4 overflow-hidden">
                {/* Main question with larger font */}
                <div className="text-lg flex-grow">
                    <ContentRenderer content={data?.question} />
                </div>

                {/* Visualization */}
                {(data?.visualization || data?.shape) && (
                    <ContentRenderer 
                        content={data.visualization || data.shape} 
                        type="visualization" 
                    />
                )}

                {/* Answer section with enhanced styling */}
                {showAnswers && data?.answer && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-300 space-y-3">
                        <h4 className="text-lg font-semibold text-gray-700">Answer:</h4>
                        <div className="math-answer">
                            {typeof data.answer === 'string' && data.answer.includes('\\') ? (
                                <MathDisplay math={data.answer} displayMode={true} size="large" />
                            ) : (
                                <ContentRenderer 
                                    content={data.answer} 
                                    type="math" 
                                    isMath={true} 
                                />
                            )}
                        </div>
                        
                        {/* Explanation with clearer styling */}
                        {data.explanation && (
                            <div className="mt-3 text-base text-gray-700 bg-gray-50 p-3 rounded-md">
                                <p className="font-medium mb-1">Explanation:</p>
                                <ContentRenderer content={data.explanation} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Main component with MathStarters layout
const StarterSectionBase = ({
    questionGenerators = [],
    currentTopic,
    currentLessonId
}) => {
    const { showAnswers } = useUI();

    // Section titles in MathStarters style
    const sectionTitles = {
        section1: 'Last Lesson',
        section2: 'Last Week',
        section3: 'Last Topic',
        section4: 'Last Year'
    };

    // Ensure exactly 4 generators with fallback
    const normalizedGenerators = useMemo(() => {
        const generators = [...questionGenerators];
        while (generators.length < 4) {
            generators.push(() => ({
                question: 'No question available',
                answer: 'No answer available'
            }));
        }
        return generators;
    }, [questionGenerators]);

    // Questions state
    const [questions, setQuestions] = useState(() => ({
        section1: normalizedGenerators[0](),
        section2: normalizedGenerators[1](),
        section3: normalizedGenerators[2](),
        section4: normalizedGenerators[3]()
    }));

    // Regenerate questions
    const regenerateAllQuestions = () => {
        setQuestions({
            section1: normalizedGenerators[0](),
            section2: normalizedGenerators[1](),
            section3: normalizedGenerators[2](),
            section4: normalizedGenerators[3]()
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden py-5 px-6">
            {/* 2x2 grid like MathStarters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            
            {/* Regenerate button in MathStarters style */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={regenerateAllQuestions}
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600
                        rounded-full transition-all flex items-center gap-2 shadow-md"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-medium">New Questions</span>
                </button>
            </div>
        </div>
    );
};

export default StarterSectionBase;