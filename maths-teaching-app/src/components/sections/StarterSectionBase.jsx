import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

// Flexible content renderer with smart type handling
const ContentRenderer = ({ content, type = 'text', isMath = false }) => {
  if (!content) return null;
  
  // Direct React element rendering
  if (React.isValidElement(content)) {
    return content;
  }

  // Smart text processing
  const processText = (text) => {
    if (typeof text !== 'string') return text;
    
    const trimmedText = text.trim();
    
    // Add period to text-based questions if no punctuation exists
    if (!['?', '.', '!'].includes(trimmedText.slice(-1))) {
      return `${trimmedText}.`;
    }
    
    return trimmedText;
  };

  // Rendering based on content type
  switch (type) {
    case 'visualization':
      return (
        <div className="flex justify-center items-center w-full">
          {content}
        </div>
      );
    case 'math':
      return <MathDisplay math={processText(content)} displayMode={true} />;
    default:
      // Check if content has LaTeX markers and use MathDisplay if it does
      if (typeof content === 'string' && (content.includes('\\') || content.includes('$'))) {
        return <MathDisplay math={processText(content)} />;
      }
      return <div className="text-gray-800">{processText(content)}</div>;
  }
};

const QuestionDisplay = ({ type, title, data, showAnswers }) => {
  // Consistent styling for different section types
  const typeStyles = {
    section1: 'bg-pink-100 hover:bg-pink-200',
    section2: 'bg-blue-100 hover:bg-blue-200',
    section3: 'bg-green-100 hover:bg-green-200',
    section4: 'bg-orange-100 hover:bg-orange-200'
  };

  return (
    <div 
      className={`
        ${typeStyles[type]} 
        p-4 rounded-lg shadow-md
        ${showAnswers ? '' : 'aspect-[2/1]'}
        flex flex-col
        transform transition-all duration-300
        hover:shadow-lg hover:translate-y-[-2px]
        overflow-hidden
      `}
    >
      <h3 className="font-bold mb-2 text-lg text-gray-600">
        {title}
      </h3>

      <div className="flex-grow flex flex-col space-y-3 overflow-hidden">
        {/* Main question content */}
        <div className="text-base flex-grow">
          <ContentRenderer content={data?.question} />
        </div>

        {/* Visualization */}
        {(data?.visualization || data?.shape) && (
          <ContentRenderer 
            content={data.visualization || data.shape} 
            type="visualization" 
          />
        )}

        {/* Answer section */}
        {showAnswers && data?.answer && (
          <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
            <h4 className="text-sm font-medium text-gray-600">Answer:</h4>
            <div className="math-answer">
              {typeof data.answer === 'string' && data.answer.includes('\\') ? (
                <MathDisplay math={data.answer} displayMode={true} />
              ) : (
                <ContentRenderer 
                  content={data.answer} 
                  type="math" 
                  isMath={true} 
                />
              )}
            </div>
            
            {/* Show explanation if available */}
            {data.explanation && (
              <div className="mt-2 text-sm text-gray-700">
                <p className="font-medium">Explanation:</p>
                {typeof data.explanation === 'string' && data.explanation.includes('\\') ? (
                  <MathDisplay math={data.explanation} />
                ) : (
                  <ContentRenderer content={data.explanation} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StarterSectionBase = ({
  questionGenerators = [],
  currentTopic,
  currentLessonId
}) => {
  const { showAnswers } = useUI();

  // Default section titles
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

  // Dynamic questions state with generator memoization
  const [questions, setQuestions] = useState(() => ({
    section1: normalizedGenerators[0](),
    section2: normalizedGenerators[1](),
    section3: normalizedGenerators[2](),
    section4: normalizedGenerators[3]()
  }));

  // Regenerate questions with consistent generator application
  const regenerateAllQuestions = () => {
    setQuestions({
      section1: normalizedGenerators[0](),
      section2: normalizedGenerators[1](),
      section3: normalizedGenerators[2](),
      section4: normalizedGenerators[3]()
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-[90%] mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      
      <div className="flex justify-center mt-4">
        <button
          onClick={regenerateAllQuestions}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 
            bg-gray-100 rounded-full hover:bg-gray-200 
            transition-all flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">New Questions</span>
        </button>
      </div>
    </div>
  );
};

export default StarterSectionBase;