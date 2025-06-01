import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { useUI } from '../../context/UIContext';
import MathDisplay from '../common/MathDisplay';
import { useSectionTheme } from '../../hooks/useSectionTheme';

/**
 * ContentRenderer - Renders different types of content consistently
 * PATTERN 2 ENFORCED: Only accepts config objects, no React elements
 */
const ContentRenderer = React.memo(({ content, type = 'text' }) => {
  if (!content) return null;

  // Handle explicit content objects with type override
  if (typeof content === 'object' && content.content !== undefined) {
    const { content: innerContent, type: overrideType = 'text' } = content;
    // Recursively render with explicit type
    return <ContentRenderer content={innerContent} type={overrideType} />;
  }

  // Handle structured content with mixed text and math
  if (typeof content === 'object' && content.text !== undefined) {
    if (content.layout === 'vertical') {
      return (
        <div className="flex flex-col items-center gap-3">
          <span className="text-gray-800 text-lg">{content.text}</span>
          {content.math && <MathDisplay math={content.math} size="normal" />}
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-800 text-lg">{content.text}</span>
          {content.math && <MathDisplay math={content.math} size="normal" />}
        </div>
      );
    }
  }

  switch (type) {
    case 'math':
      return <MathDisplay math={content} />;
    case 'html':
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    default:
      // Enhanced auto-detection for math content
      if (typeof content === 'string') {
        // Always render as math if:
        // 1. Contains LaTeX commands
        // 2. Contains math symbols 
        // 3. Is a pure number (for consistent diagnostic option rendering)
        const isLaTeX = content.includes('\\') || content.includes('\\text');  // Fixed string termination
        const isPureNumber = /^\d+(\.\d+)?$/.test(content.trim());
        const hasUnits = /\d+\s*(cm|m|mm|km|°|degrees)/.test(content);
        
        if (isLaTeX || isPureNumber || hasUnits) {
          return <MathDisplay math={content} />;
        }
      }
      return <div className="text-gray-800 text-lg text-center">{content}</div>;
  }
});

ContentRenderer.displayName = 'ContentRenderer';

/**
 * VisualizationRenderer - Generic renderer for visualization content
 * PATTERN 2 ENFORCED: Only accepts config objects, no React elements
 */
const VisualizationRenderer = React.memo(({ visualization }) => {
  if (!visualization) return null;

  // Only support component+props pattern (config-based)
  if (visualization.component && typeof visualization.component === 'function') {
    const { component: Component, props = {} } = visualization;
    return (
      <div className="flex justify-center items-center w-full my-4" style={{ height: '240px' }}>
        <Component {...props} />
      </div>
    );
  }

  // If we get here, it's likely a config object that needs custom rendering
  console.warn('DiagnosticSectionBase: Visualization config received but no custom renderVisualization provided. Use the renderVisualization prop to convert configs to components.');
  return (
    <div className="flex justify-center items-center w-full my-4 text-gray-500 italic">
      <p>Visualization requires custom renderer</p>
    </div>
  );
});

VisualizationRenderer.displayName = 'VisualizationRenderer';

/**
 * DiagnosticSectionBase - Reusable template for diagnostic assessments
 * PATTERN 2 ARCHITECTURE: Generators return config objects, sections convert to components
 * 
 * @param {Object} props
 * @param {Object} props.questionTypes - Question types with generators (must return config objects)
 * @param {string} props.currentTopic - Current topic ID
 * @param {number} props.currentLessonId - Current lesson ID
 * @param {Function} props.onQuestionComplete - Callback when question is answered
 * @param {string} props.themeKey - Theme key for styling
 * @param {React.ReactNode} props.loadingIndicator - Custom loading indicator
 * @param {Function} props.renderVisualization - REQUIRED for visualizations: converts config objects to React components
 * @param {boolean} props.autoSelectNextType - Auto select next question type after answering
 */
const DiagnosticSectionBase = ({
  questionTypes = {},
  currentTopic,
  currentLessonId,
  onQuestionComplete = () => { },
  themeKey = 'diagnostic',
  loadingIndicator,
  renderVisualization,
  autoSelectNextType = false,
  className = ''
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
  const [answered, setAnswered] = useState(false);
  const { setCurrentSection } = useUI();

  // Set current section on mount
  useEffect(() => {
    setCurrentSection('diagnostic');
  }, [setCurrentSection]);

  // Generate new question when the component mounts or when type index changes
  useEffect(() => {
    if (typeKeys.length > 0) {
      generateNewQuestion();
    }
  }, [currentTypeIndex, typeKeys.length]);

  // Question generation and management
  const generateNewQuestion = useCallback(() => {
    if (typeKeys.length === 0) return;

    const currentTypeId = typeKeys[currentTypeIndex];
    if (!questionTypes[currentTypeId]) return;

    const generator = questionTypes[currentTypeId].generator;

    if (typeof generator === 'function') {
      try {
        const question = generator();
        
        // PATTERN 2 VALIDATION: Warn if generator returns React elements
        if (question.visualization && React.isValidElement(question.visualization)) {
          console.error('PATTERN 2 VIOLATION: Generator returned React element in visualization. Generators should return config objects only.');
        }
        if (question.questionDisplay && React.isValidElement(question.questionDisplay)) {
          console.error('PATTERN 2 VIOLATION: Generator returned React element in questionDisplay. Generators should return config objects only.');
        }
        
        setCurrentQuestion(question);
        setShowAnswer(false);
        setSelectedAnswer(null);
        setAnswered(false);
      } catch (error) {
        console.error("Error generating question:", error);
        setCurrentQuestion({
          questionDisplay: "Error generating question",
          options: ["Try another question type"],
          correctAnswer: "Try another question type"
        });
      }
    }
  }, [typeKeys, currentTypeIndex, questionTypes]);

  // Handle answer selection
  const checkAnswer = useCallback((option) => {
    if (!currentQuestion || answered) return;

    setSelectedAnswer(option);
    setShowAnswer(true);
    setAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    onQuestionComplete(isCorrect);

    // Auto-select next question type if enabled
    if (autoSelectNextType && isCorrect) {
      const timer = setTimeout(() => {
        setCurrentTypeIndex(prev => (prev + 1) % typeKeys.length);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentQuestion, answered, onQuestionComplete, autoSelectNextType, typeKeys.length]);

  // Render visualization with Pattern 2 enforcement
  const renderQuestionVisualization = useCallback(() => {
    if (!currentQuestion) return null;

    // PATTERN 2: Use custom renderer if provided (preferred approach)
    if (renderVisualization && typeof renderVisualization === 'function') {
      return renderVisualization(currentQuestion);
    }

    // Fallback to generic renderer (limited functionality)
    const visualization = currentQuestion.visualization || currentQuestion.shape;

    if (!visualization) return null;

    return <VisualizationRenderer visualization={visualization} />;
  }, [currentQuestion, renderVisualization]);

  // Get title based on current question type
  const getCurrentTitle = useCallback(() => {
    if (typeKeys.length === 0) return "Diagnostic Question";
    const currentTypeId = typeKeys[currentTypeIndex];
    return questionTypes[currentTypeId]?.title || "Diagnostic Question";
  }, [typeKeys, currentTypeIndex, questionTypes]);

  // Custom loading indicator or default
  const renderLoadingState = () => {
    if (loadingIndicator) return loadingIndicator;

    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full bg-${theme.secondary} flex justify-center items-center mb-4`}>
            <RefreshCw className={`w-6 h-6 text-${theme.secondaryText} animate-spin`} />
          </div>
          <div className="text-gray-600">Loading diagnostic questions...</div>
        </div>
      </div>
    );
  };

  // Loading state
  if (typeKeys.length === 0 || !currentQuestion) {
    return renderLoadingState();
  }

  // Main render
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with title, new question button and navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-6 pt-6">
        {/* Title - from question type */}
        <h3 className="text-xl font-semibold text-gray-800">
          {getCurrentTitle()}
        </h3>

        {/* New Question Button */}
        <button
          onClick={generateNewQuestion}
          className={`flex items-center gap-2 px-4 py-2 bg-${theme.secondary} text-${theme.secondaryText} rounded-lg hover:bg-${theme.primary} hover:text-white transition-all`}
        >
          <RefreshCw size={18} />
          <span>New Question</span>
        </button>

        {/* Navigation Buttons - Optimized for up to 5 tabs */}
        <div className="flex gap-2">
          {typeKeys.map((typeKey, index) => (
            <button
              key={typeKey}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${index === currentTypeIndex
                ? `bg-${theme.primary} text-white`
                : `bg-${theme.secondary} text-${theme.secondaryText} hover:bg-${theme.primaryHover} hover:text-white`
                }`}
              onClick={() => setCurrentTypeIndex(index)}
              aria-label={questionTypes[typeKey]?.title || `Question Type ${index + 1}`}
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
                <ContentRenderer content={currentQuestion.questionDisplay} />
              </div>

              {/* Visualization */}
              {renderQuestionVisualization()}

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={`option-${index}-${option}`}
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
                        : `hover:bg-${theme.pastelBg} border-gray-200 hover:border-${theme.borderColor} hover:shadow-md`
                      }
                    `}
                  >
                    {/* Option Display - Force KaTeX for numeric answers */}
                    <ContentRenderer content={option} type="math" />

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

              {/* Feedback Area (optional) */}
              {showAnswer && currentQuestion.explanation && (
                <div className={`mt-4 p-4 rounded-lg bg-${theme.pastelBg} border border-${theme.borderColor}`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Explanation:</h4>
                  <ContentRenderer content={currentQuestion.explanation} />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticSectionBase;