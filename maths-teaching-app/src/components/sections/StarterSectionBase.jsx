// src/components/sections/StarterSectionBase.jsx
// V3.0 - Gold Standard
// - Individual regenerate buttons per question box
// - Fixed separator line not bleeding onto shapes
// - 300px min-height for boxes
// - Pattern 2 compatible (visualization configs, not components)

import React, { useState, useMemo, memo } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import ContentRenderer from '../common/ContentRenderer';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

// Import visualization components for Pattern 2 conversion
import MagicSquareDisplay from '../math/puzzles/MagicSquareDisplay';
import SymbolPuzzleDisplay from '../math/puzzles/SymbolPuzzleDisplay';
import RightTriangleSVG from '../math/visualizations/RightTriangleSVG';
import IsoscelesTriangleDisplay from '../math/visualizations/IsoscelesTriangleDisplay';
import SquareSVG from '../math/visualizations/SquareSVG';

// ============================================================
// VISUALIZATION RENDERER (Pattern 2 conversion)
// ============================================================

/**
 * Converts visualization config to React component
 * This is the Pattern 2 bridge - generators return configs, this renders them
 */
const VisualizationRenderer = ({ visualization, visualizationType, showAnswers }) => {
  if (!visualization) return null;
  
  // If it's already a React element (legacy support), just return it
  if (React.isValidElement(visualization)) {
    return visualization;
  }
  
  // Pattern 2: Convert config to component based on type
  switch (visualizationType || visualization.type) {
    case 'magic-square':
      return (
        <MagicSquareDisplay
          grid={visualization.grid}
          fullGrid={visualization.fullGrid}
          size={visualization.size}
          showAnswer={showAnswers}
          includesNegatives={visualization.includesNegatives}
        />
      );
    
    case 'symbol-puzzle':
      return (
        <SymbolPuzzleDisplay
          puzzleDisplay={visualization.puzzleDisplay || visualization}
          mode="question"
          containerHeight={visualization.height || '100px'}
        />
      );
    
    case 'right-triangle':
      return (
        <RightTriangleSVG
          config={visualization}
          showAnswer={showAnswers}
        />
      );
    
    case 'isosceles-triangle':
      return (
        <IsoscelesTriangleDisplay
          config={visualization}
          showAnswer={showAnswers}
          sectionType="starter"
        />
      );
    
    case 'square':
      return (
        <SquareSVG
          config={visualization}
          showAnswer={showAnswers}
        />
      );
    
    default:
      // If no type but has rendering properties, try to render directly
      if (visualization.grid) {
        return (
          <MagicSquareDisplay
            grid={visualization.grid}
            fullGrid={visualization.fullGrid}
            size={visualization.size}
            showAnswer={showAnswers}
          />
        );
      }
      console.warn('Unknown visualization type:', visualizationType || visualization.type);
      return null;
  }
};

// ============================================================
// QUESTION DISPLAY COMPONENT
// ============================================================

const QuestionDisplay = memo(({
  type,
  title,
  subtitle,
  data,
  showAnswers,
  renderQuestionContent,
  onRegenerate  // NEW: callback for individual regeneration
}) => {
  const [showWorking, setShowWorking] = useState(false);

  // Color configuration by section type
  const colorConfig = {
    lastLesson: {
      header: 'bg-blue-600',
      headerText: 'text-white',
      body: 'bg-blue-50',
      border: 'border-blue-500',
      answerBorder: 'border-blue-300',
      answerBg: 'bg-blue-100',
      text: 'text-blue-700',
      buttonHover: 'hover:bg-blue-500'
    },
    lastWeek: {
      header: 'bg-green-600',
      headerText: 'text-white',
      body: 'bg-green-50',
      border: 'border-green-500',
      answerBorder: 'border-green-300',
      answerBg: 'bg-green-100',
      text: 'text-green-700',
      buttonHover: 'hover:bg-green-500'
    },
    lastTopic: {
      header: 'bg-purple-600',
      headerText: 'text-white',
      body: 'bg-purple-50',
      border: 'border-purple-500',
      answerBorder: 'border-purple-300',
      answerBg: 'bg-purple-100',
      text: 'text-purple-700',
      buttonHover: 'hover:bg-purple-500'
    },
    lastYear: {
      header: 'bg-amber-600',
      headerText: 'text-white',
      body: 'bg-amber-50',
      border: 'border-amber-500',
      answerBorder: 'border-amber-300',
      answerBg: 'bg-amber-100',
      text: 'text-amber-700',
      buttonHover: 'hover:bg-amber-500'
    }
  };

  const colors = colorConfig[type] || colorConfig.lastLesson;

  // Determine question characteristics
  const isPuzzle = data?.metadata?.type?.includes('puzzle') || 
                   data?.difficulty === 'puzzle' || 
                   type === 'lastYear';
  const hasVisualization = data?.visualization;
  const hasWorking = data?.workingOut || data?.working;

  // Early return if no question data
  if (!data) {
    return (
      <div className={`border-2 ${colors.border} rounded-lg overflow-hidden shadow-sm`}>
        <div className={`${colors.header} ${colors.headerText} px-4 py-2 flex justify-between items-center`}>
          <div>
            <h3 className="font-semibold">{title}</h3>
            {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
          </div>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className={`p-1.5 rounded-md bg-white/20 ${colors.buttonHover} transition-colors`}
              title="New question"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
        <div className={`${colors.body} p-4 min-h-[220px] flex items-center justify-center`}>
          <p className="text-gray-500 italic">No question available</p>
        </div>
      </div>
    );
  }

  // Build question display from standardised generator output
  const renderQuestion = () => {
    // New standardised format: instruction + questionMath
    if (data.instruction && data.questionMath) {
      return (
        <span className="text-lg">
          {data.instruction}: <MathDisplay math={data.questionMath} displayMode={false} />
        </span>
      );
    }
    
    // Just questionMath (no instruction)
    if (data.questionMath) {
      return <MathDisplay math={data.questionMath} displayMode={false} />;
    }
    
    // Plain text question
    if (data.questionText) {
      return <span className="text-lg">{data.questionText}</span>;
    }
    
    // Legacy format: data.question (might be string or React element)
    if (data.question) {
      if (React.isValidElement(data.question)) {
        return data.question;
      }
      // Check if it looks like LaTeX
      if (typeof data.question === 'string' && 
          (data.question.includes('\\') || data.question.includes('^') || data.question.includes('_'))) {
        return <MathDisplay math={data.question} displayMode={false} />;
      }
      return <span className="text-lg">{data.question}</span>;
    }
    
    return <span className="text-gray-500 italic">No question text</span>;
  };

  // Build answer display
  const renderAnswer = () => {
    const answer = data.answer;
    const units = data.answerUnits;
    
    if (!answer) return null;
    
    // Check if answer looks like LaTeX
    const isLatex = typeof answer === 'string' && 
                    (answer.includes('\\') || answer.includes('^') || answer.includes('_') || answer.includes('/'));
    
    if (isLatex) {
      const fullAnswer = units ? `${answer} \\text{ ${units}}` : answer;
      return <MathDisplay math={fullAnswer} displayMode={false} />;
    }
    
    // Plain text answer
    return <span>{answer}{units ? ` ${units}` : ''}</span>;
  };

  return (
    <div className={`border-2 ${colors.border} rounded-lg overflow-hidden shadow-sm flex flex-col`}>
      {/* Colored Header with individual regenerate button */}
      <div className={`${colors.header} ${colors.headerText} px-4 py-2 flex-shrink-0 flex justify-between items-center`}>
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className={`p-1.5 rounded-md bg-white/20 ${colors.buttonHover} transition-colors`}
            title="New question"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* Question Body - 220px min height (fits on IWB with title visible) */}
      <div className={`${colors.body} p-4 flex-grow flex flex-col`} style={{ minHeight: '220px' }}>
        {/* Question Content - Centered */}
        <div className="flex-grow flex flex-col justify-center items-center text-center">
          {/* Question Text */}
          <div className="mb-2 w-full">
            {renderQuestion()}
          </div>

          {/* Visualization Container */}
          {hasVisualization && (
            <div 
              className="w-full flex justify-center items-center mt-2" 
              style={{ height: data.visualizationHeight || '120px' }}
            >
              {renderQuestionContent ? (
                // Legacy custom renderer
                renderQuestionContent(data, type)
              ) : (
                // Pattern 2 visualization renderer
                <VisualizationRenderer
                  visualization={data.visualization}
                  visualizationType={data.visualizationType}
                  showAnswers={showAnswers}
                />
              )}
            </div>
          )}
        </div>

        {/* Answer Section - FIXED: separate background to prevent bleeding */}
        {showAnswers && data.answer && (
          <div className={`mt-4 p-3 rounded-lg ${colors.answerBg} border ${colors.answerBorder} flex-shrink-0`}>
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <p className={`text-sm font-medium ${colors.text}`}>Answer:</p>
                <div className="mt-1 font-medium">
                  {renderAnswer()}
                </div>
              </div>
              
              {/* Expand working button */}
              {hasWorking && (
                <button
                  onClick={() => setShowWorking(!showWorking)}
                  className={`ml-2 p-1 ${colors.text} hover:opacity-70 flex-shrink-0`}
                  title={showWorking ? "Hide working" : "Show working"}
                >
                  {showWorking ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              )}
            </div>

            {/* Expanded working section */}
            {showWorking && hasWorking && (
              <div className="mt-3 p-3 bg-white rounded border text-sm">
                <p className="text-gray-500 mb-1">Working:</p>
                <MathDisplay 
                  math={data.workingOut || data.working} 
                  displayMode={true} 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

QuestionDisplay.displayName = 'QuestionDisplay';

// ============================================================
// MAIN COMPONENT
// ============================================================

/**
 * StarterSectionBase - Main component to display starter questions
 * 
 * @param {Array} questionGenerators - Array of generator functions
 * @param {Object} sectionConfig - Configuration for titles and subtitles
 * @param {Function} renderQuestionContent - Optional legacy custom renderer
 */
const StarterSectionBase = ({
  questionGenerators = [],
  renderQuestionContent = null,
  currentTopic,
  currentLessonId,
  sectionConfig = {
    sections: ['lastLesson', 'lastWeek', 'lastTopic', 'lastYear'],
    titles: {
      lastLesson: 'Last Lesson',
      lastWeek: 'Last Week',
      lastTopic: 'Last Topic',
      lastYear: 'Last Year'
    },
    subtitles: {}
  },
  className = '',
  onRegenerateAllQuestions = null
}) => {
  const { showAnswers } = useUI();

  // Extract configuration with defaults
  const sectionTitles = sectionConfig.titles || {
    lastLesson: 'Last Lesson',
    lastWeek: 'Last Week',
    lastTopic: 'Last Topic',
    lastYear: 'Last Year'
  };

  const sectionSubtitles = sectionConfig.subtitles || {};
  const sectionTypes = sectionConfig.sections || ['lastLesson', 'lastWeek', 'lastTopic', 'lastYear'];

  // Normalize generators
  const normalizedGenerators = useMemo(() => {
    const generators = [...questionGenerators];
    while (generators.length < sectionTypes.length) {
      generators.push(() => ({
        questionText: 'No question available',
        answer: 'N/A'
      }));
    }
    return generators;
  }, [questionGenerators, sectionTypes.length]);

  // State for current questions
  const [questions, setQuestions] = useState(() => {
    const initialQuestions = {};
    sectionTypes.forEach((type, index) => {
      try {
        initialQuestions[type] = normalizedGenerators[index]();
      } catch (e) {
        console.error(`Error generating question for ${type}:`, e);
        initialQuestions[type] = { questionText: 'Error generating question', answer: 'N/A' };
      }
    });
    return initialQuestions;
  });

  // Regenerate a single question
  const regenerateSingleQuestion = (sectionType, index) => {
    try {
      const newQuestion = normalizedGenerators[index]();
      setQuestions(prev => ({
        ...prev,
        [sectionType]: newQuestion
      }));
    } catch (e) {
      console.error(`Error regenerating question for ${sectionType}:`, e);
    }
  };

  // Regenerate all questions
  const regenerateAllQuestions = () => {
    const newQuestions = {};
    sectionTypes.forEach((type, index) => {
      try {
        newQuestions[type] = normalizedGenerators[index]();
      } catch (e) {
        console.error(`Error generating question for ${type}:`, e);
        newQuestions[type] = { questionText: 'Error generating question', answer: 'N/A' };
      }
    });
    setQuestions(newQuestions);

    if (onRegenerateAllQuestions && typeof onRegenerateAllQuestions === 'function') {
      onRegenerateAllQuestions();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden p-4 ${className}`}>
      {/* Questions Grid - 2x2 layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {sectionTypes.map((sectionType, index) => (
          <QuestionDisplay
            key={`question-${sectionType}`}
            type={sectionType}
            title={sectionTitles[sectionType] || `Section ${index + 1}`}
            subtitle={sectionSubtitles[sectionType] || ''}
            data={questions[sectionType]}
            showAnswers={showAnswers}
            renderQuestionContent={renderQuestionContent}
            onRegenerate={() => regenerateSingleQuestion(sectionType, index)}
          />
        ))}
      </div>

      {/* New Questions Button - regenerate all */}
      <div className="flex justify-center">
        <button
          onClick={regenerateAllQuestions}
          className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-full transition-all flex items-center gap-2 shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="font-medium">New Questions</span>
        </button>
      </div>
    </div>
  );
};

export default StarterSectionBase;