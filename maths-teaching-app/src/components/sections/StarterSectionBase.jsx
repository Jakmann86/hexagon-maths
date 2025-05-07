// maths-teaching-app/src/components/sections/StarterSectionBase.jsx
import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { RefreshCw } from 'lucide-react';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

// Memoized ContentRenderer component
const ContentRenderer = memo(({ content, type = 'text', isMath = false }) => {
    if (!content) return null;
    
    // Handle React elements (like RightTriangle)
    if (React.isValidElement(content)) {
        // Special handling for RightTriangle - ensure stable key
        if (content.type?.displayName === 'RightTriangle' || content.type?.name === 'RightTriangle') {
            // Clone with stabilized properties - create a stable key from props
            const stableKey = `triangle-${content.props.base}-${content.props.height}-${content.props.orientation || 'default'}`;
            
            return React.cloneElement(content, {
                key: stableKey,
                scale: 0.9,
                containerHeight: 140,
                orientation: content.props.orientation || 'default'
            });
        }
        
        // Ensure other React elements have a stable key
        const elementKey = content.key || `element-${content.type.displayName || content.type.name || 'unknown'}`;
        if (!content.key) {
            return React.cloneElement(content, { key: elementKey });
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
                <div className="flex justify-center items-center p-1 h-full mt-2">
                    {content}
                </div>
            );
        case 'math':
            return <MathDisplay math={processText(content)} displayMode={true} size="large" />;
        case 'puzzle-answer':
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
});

// Set displayName for debugging
ContentRenderer.displayName = 'ContentRenderer';

// Memoized QuestionDisplay component
const QuestionDisplay = memo(({ type, title, data, showAnswers }) => {
    const typeStyles = {
        section1: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
        section2: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
        section3: 'bg-green-100 hover:bg-green-200 border-green-300',
        section4: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
    };

    const isPuzzle = data?.difficulty === 'puzzle' || type === 'section4';
    
    // Use ref to store visualization content to prevent re-rendering issues
    const visualizationRef = useRef(data?.visualization || data?.shape);

    // Store question/answer refs to prevent recreation
    const questionRef = useRef(data?.question);
    const answerRef = useRef(data?.answer);

    // Update refs when data changes (not on every render)
    useEffect(() => {
        visualizationRef.current = data?.visualization || data?.shape;
        questionRef.current = data?.question;
        answerRef.current = data?.answer;
    }, [data?.visualization, data?.shape, data?.question, data?.answer]);

    return (
        <div 
            className={`
                ${typeStyles[type]} 
                p-4 rounded-lg shadow-md
                min-h-72  
                flex flex-col
                transform transition-all duration-300
                hover:shadow-lg hover:translate-y-[-2px]
                border-2
            `}
        >
            <h3 className="font-bold mb-1 text-lg text-gray-700 line-clamp-1">
                {title}
            </h3>

            <div className="flex-grow flex flex-col">
                <div className="text-base">
                    <ContentRenderer content={questionRef.current} />
                </div>

                {/* Use the ref value to render visualization with a stable key */}
                {visualizationRef.current && (
                    <div className="mt-1 h-32 flex-shrink-0" key={`vis-container-${type}`}>
                        <ContentRenderer 
                            content={visualizationRef.current} 
                            type="visualization" 
                        />
                    </div>
                )}

                {/* Answers section with stable keys */}
                {showAnswers && answerRef.current && (
                    <div className="mt-2 pt-2 border-t-2 border-gray-300" key={`answer-section-${type}`}>
                        <h4 className="text-base font-semibold text-gray-700 mb-1">Answer:</h4>
                        <div className="math-answer">
                            {typeof answerRef.current === 'string' && answerRef.current.includes('\\') && !isPuzzle ? (
                                <MathDisplay 
                                    key={`math-display-${type}`}
                                    math={answerRef.current} 
                                    displayMode={false} 
                                    size="normal" 
                                />
                            ) : (
                                <ContentRenderer 
                                    key={`answer-content-${type}`}
                                    content={answerRef.current} 
                                    type={isPuzzle ? 'puzzle-answer' : 'text'} 
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

QuestionDisplay.displayName = 'QuestionDisplay';

const StarterSectionBase = ({
    questionGenerators = [],
    currentTopic,
    currentLessonId
}) => {
    const { showAnswers } = useUI();
    const initializedRef = useRef(false);

    const sectionTitles = {
        section1: 'Last Lesson',
        section2: 'Last Week',
        section3: 'Last Topic',
        section4: 'Last Year'
    };

    // Memoize generators to prevent recreation
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

    // Use useRef to store a stable reference to the generators
    const generatorsRef = useRef(normalizedGenerators);
    
    // Update the ref when generators change, but don't cause re-renders
    useEffect(() => {
        generatorsRef.current = normalizedGenerators;
    }, [normalizedGenerators]);

    // Store generated questions in state, only update when explicitly regenerated
    const [questions, setQuestions] = useState(() => {
        initializedRef.current = true;
        return {
            section1: normalizedGenerators[0](),
            section2: normalizedGenerators[1](),
            section3: normalizedGenerators[2](),
            section4: normalizedGenerators[3]()
        };
    });

    // Ensure components don't rerender unnecessarily by memoizing questions
    const memoizedQuestions = useMemo(() => questions, [questions]);

    // Only regenerate questions when the button is clicked
    const regenerateAllQuestions = () => {
        setQuestions({
            section1: generatorsRef.current[0](),
            section2: generatorsRef.current[1](),
            section3: generatorsRef.current[2](),
            section4: generatorsRef.current[3]()
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden py-4 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {Object.entries(memoizedQuestions).map(([sectionKey, questionData]) => (
                    <QuestionDisplay
                        key={`question-${sectionKey}`}
                        type={sectionKey}
                        title={sectionTitles[sectionKey]}
                        data={questionData}
                        showAnswers={showAnswers}
                    />
                ))}
            </div>
            
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