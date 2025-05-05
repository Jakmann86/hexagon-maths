// maths-teaching-app/src/components/sections/StarterSectionBase.jsx
import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

// Content renderer with improved answer display
const ContentRenderer = ({ content, type = 'text', isMath = false }) => {
    if (!content) return null;
    
    if (React.isValidElement(content)) {
        if (content.type?.name === 'RightTriangle') {
            return React.cloneElement(content, {
                scale: 0.6,
                containerHeight: 110,
                orientation: content.props.orientation || 'random'
            });
        }
        return content;
    }

    const processText = (text) => {
        if (typeof text !== 'string') return text;
        return text.trim();
    };

    switch (type) {
        case 'visualization':
            return (
                <div className="flex justify-center items-center p-1 h-full">
                    {content}
                </div>
            );
        case 'math':
            return <MathDisplay math={processText(content)} displayMode={true} size="large" />;
        case 'puzzle-answer':  // Special case for puzzle answers
            return (
                <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                    {processText(content)}
                </div>
            );
        default:
            if (typeof content === 'string' && (content.includes('\\') || content.includes('$'))) {
                return <MathDisplay math={processText(content)} size="normal" />;
            }
            return <div className="text-gray-800 text-lg">{processText(content)}</div>;
    }
};

// Improved QuestionDisplay with taller boxes and better answer rendering
const QuestionDisplay = ({ type, title, data, showAnswers }) => {
    const typeStyles = {
        section1: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
        section2: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
        section3: 'bg-green-100 hover:bg-green-200 border-green-300',
        section4: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
    };

    // Determine if this is a puzzle question
    const isPuzzle = data?.difficulty === 'puzzle' || type === 'section4';

    return (
        <div 
            className={`
                ${typeStyles[type]} 
                p-4 rounded-lg shadow-md
                h-72  
                flex flex-col
                transform transition-all duration-300
                hover:shadow-lg hover:translate-y-[-2px]
                border-2
                overflow-hidden
            `}
        >
            <h3 className="font-bold mb-2 text-lg text-gray-700 line-clamp-1">
                {title}
            </h3>

            <div className="flex-grow flex flex-col overflow-hidden">
                <div className="text-base flex-grow min-h-0 overflow-hidden">
                    <ContentRenderer content={data?.question} />
                </div>

                {(data?.visualization || data?.shape) && (
                    <div className="mt-2 h-28 flex-shrink-0">
                        <ContentRenderer 
                            content={data.visualization || data.shape} 
                            type="visualization" 
                        />
                    </div>
                )}

                {showAnswers && data?.answer && (
                    <div className="mt-2 pt-2 border-t-2 border-gray-300 overflow-auto">
                        <h4 className="text-base font-semibold text-gray-700 mb-1">Answer:</h4>
                        <div className="math-answer overflow-auto max-h-24">
                            {typeof data.answer === 'string' && data.answer.includes('\\') && !isPuzzle ? (
                                <MathDisplay math={data.answer} displayMode={false} size="normal" />
                            ) : (
                                <ContentRenderer 
                                    content={data.answer} 
                                    type={isPuzzle ? 'puzzle-answer' : 'text'} 
                                />
                            )}
                        </div>
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden py-4 px-6">
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
            <div className="flex justify-center mt-4">
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