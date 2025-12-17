// src/components/sections/DiagnosticSectionBase.jsx
// V1.0 - Gold Standard Base Component
// Purple theme with darker header (bg-purple-600)
// 1, 2, 3 tab buttons in header to switch question types
// Small refresh button in visualization corner (not header)
// MCQ format with immediate feedback (green/red)

import React, { useState, useMemo, useCallback } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { useUI } from '../../context/UIContext';
import ContentRenderer from '../common/ContentRenderer';
import TeachingNotesPanel from './TeachingNotesPanel';

/**
 * DiagnosticSectionBase - Reusable diagnostic assessment component
 * 
 * @param {Object} props
 * @param {Array} props.questionTypes - Array of question type configs
 *   Each config: { id: string, label: string, title: string, generator: Function }
 * @param {Function} props.renderVisualization - Custom visualization renderer (config) => JSX
 * @param {Object} props.teachingNotes - Standardized teaching notes object
 * @param {Function} props.onQuestionComplete - Callback when question answered
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.currentTopic - Current topic ID
 * @param {number} props.currentLessonId - Current lesson ID
 */
const DiagnosticSectionBase = ({
  questionTypes = [],
  renderVisualization = null,
  teachingNotes = null,
  onQuestionComplete = () => {},
  className = '',
  currentTopic,
  currentLessonId
}) => {
  const { showAnswers } = useUI();
  
  // State
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [regenerateKey, setRegenerateKey] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Generate current question
  const currentQuestion = useMemo(() => {
    if (questionTypes.length === 0) return null;
    
    const currentType = questionTypes[activeTypeIndex];
    if (!currentType?.generator) return null;
    
    try {
      return currentType.generator();
    } catch (error) {
      console.error('Error generating diagnostic question:', error);
      return {
        questionDisplay: 'Error generating question',
        options: ['Try another question'],
        correctAnswer: 'Try another question'
      };
    }
  }, [activeTypeIndex, regenerateKey, questionTypes]);

  // Handlers
  const handleTypeChange = useCallback((index) => {
    setActiveTypeIndex(index);
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, []);

  const handleRegenerate = useCallback(() => {
    setRegenerateKey(prev => prev + 1);
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, []);

  const handleAnswerSelect = useCallback((option) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(option);
    setHasAnswered(true);
    
    const isCorrect = option === currentQuestion?.correctAnswer;
    onQuestionComplete(isCorrect);
  }, [hasAnswered, currentQuestion, onQuestionComplete]);

  // Derived state
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const currentTypeTitle = questionTypes[activeTypeIndex]?.title || 'Diagnostic Question';

  // Render question display
  const renderQuestionDisplay = () => {
    if (!currentQuestion?.questionDisplay) return null;
    
    const qd = currentQuestion.questionDisplay;
    
    // Object format with text and math
    if (typeof qd === 'object' && qd.text) {
      return (
        <div className="space-y-2">
          <p className="text-lg text-gray-800">{qd.text}</p>
          {qd.math && (
            <ContentRenderer
              content={qd.math}
              sectionType="diagnostic"
              size="large"
              center={true}
            />
          )}
        </div>
      );
    }
    
    // String format
    if (typeof qd === 'string') {
      return (
        <ContentRenderer
          content={qd}
          sectionType="diagnostic"
          size="large"
          center={true}
        />
      );
    }
    
    return null;
  };

  // Render visualization - memoize result for conditional rendering
  const visualizationContent = useMemo(() => {
    if (!currentQuestion) return null;
    
    // Use custom renderer if provided
    if (renderVisualization) {
      return renderVisualization(currentQuestion);
    }
    
    // Check for visualization in question
    const viz = currentQuestion.visualization || currentQuestion.shape;
    if (!viz) return null;
    
    // If it's a component config with component and props
    if (viz.component && typeof viz.component === 'function') {
      const { component: Component, props = {} } = viz;
      return <Component {...props} showAnswer={showAnswers} />;
    }
    
    return null;
  }, [currentQuestion, renderVisualization, showAnswers]);

  // Loading state
  if (questionTypes.length === 0 || !currentQuestion) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex justify-center items-center mb-4">
            <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
          <div className="text-gray-600">Loading diagnostic questions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 mb-8 ${className}`}>
      <div className="border-2 border-t-4 border-purple-500 rounded-xl bg-white shadow-md overflow-hidden">
        
        {/* Header - DARKER purple (bg-purple-600) with 1,2,3 tabs */}
        <div className="bg-purple-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Diagnostic: {currentTypeTitle}</h2>
              <p className="text-purple-100 text-sm">Check your prerequisite knowledge</p>
            </div>
            
            {/* Tab buttons - 1, 2, 3 style */}
            <div className="flex items-center gap-2">
              {questionTypes.map((type, index) => (
                <button
                  key={type.id || index}
                  onClick={() => handleTypeChange(index)}
                  className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${
                    activeTypeIndex === index
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'bg-purple-500 text-white hover:bg-purple-400'
                  }`}
                >
                  {type.label || index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Question Text */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
            {renderQuestionDisplay()}
          </div>

          {/* Visualization with small refresh button in corner - only show if has visualization */}
          {visualizationContent ? (
            <div className="flex justify-center mb-4 relative" style={{ minHeight: '180px' }}>
              {/* Small refresh button in top right corner */}
              <button
                onClick={handleRegenerate}
                className="absolute top-0 right-0 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200 transition-colors z-10"
                title="New question"
              >
                <RefreshCw size={16} className="text-gray-600" />
              </button>
              
              {visualizationContent}
            </div>
          ) : (
            /* Just show refresh button inline when no visualization */
            <div className="flex justify-end mb-4">
              <button
                onClick={handleRegenerate}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200 transition-colors"
                title="New question"
              >
                <RefreshCw size={16} className="text-gray-600" />
              </button>
            </div>
          )}

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {currentQuestion?.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isThisCorrect = option === currentQuestion.correctAnswer;
              
              let buttonClass = 'bg-gray-50 border-gray-200 hover:border-purple-400 hover:bg-purple-50';
              
              if (hasAnswered) {
                if (isThisCorrect) {
                  buttonClass = 'bg-green-100 border-green-500 text-green-800';
                } else if (isSelected && !isThisCorrect) {
                  buttonClass = 'bg-red-100 border-red-500 text-red-800';
                } else {
                  buttonClass = 'bg-gray-50 border-gray-200 opacity-50';
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${buttonClass}`}
                >
                  <ContentRenderer
                    content={option}
                    sectionType="diagnostic"
                    size="normal"
                    center={true}
                  />
                  {hasAnswered && isThisCorrect && <Check size={20} className="text-green-600" />}
                  {hasAnswered && isSelected && !isThisCorrect && <X size={20} className="text-red-600" />}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {hasAnswered && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <Check className="text-green-600" />
                    <span className="font-semibold text-green-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <X className="text-red-600" />
                    <span className="font-semibold text-red-800">Not quite</span>
                  </>
                )}
              </div>
              {currentQuestion.explanation && (
                <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
              )}
            </div>
          )}

          {/* Teaching Notes */}
          {showAnswers && teachingNotes && (
            <TeachingNotesPanel teachingNotes={teachingNotes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSectionBase;