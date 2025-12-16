// src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
// Pythagoras Diagnostic Section - V3.1 (Gold Standard)
// Uses generators from centralised files - no duplicate code
// Single small refresh button in visualization corner

import React, { useState, useMemo } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import SquareSVG from '../../../../components/math/visualizations/SquareSVG';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';
import pythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

// ============================================================
// QUESTION TYPES
// ============================================================

const QUESTION_TYPES = [
  { id: 'squareArea', label: '1', title: 'Find Square Area' },
  { id: 'squareRoot', label: '2', title: 'Find Side Length' },
  { id: 'identifyHypotenuse', label: '3', title: 'Identify Hypotenuse' }
];

// ============================================================
// MAIN COMPONENT
// ============================================================

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [regenerateKey, setRegenerateKey] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Generate question based on active type
  const currentQuestion = useMemo(() => {
    const typeId = QUESTION_TYPES[activeTypeIndex].id;
    
    switch (typeId) {
      case 'squareArea':
        return squareGenerators.generateSquareArea({ sectionType: 'diagnostic', units: 'cm' });
      case 'squareRoot':
        return squareGenerators.generateSquareSideLength({ sectionType: 'diagnostic', units: 'cm' });
      case 'identifyHypotenuse':
        return pythagorasGenerators.identifyHypotenuse();
      default:
        return null;
    }
  }, [activeTypeIndex, regenerateKey]);

  const handleTypeChange = (index) => {
    setActiveTypeIndex(index);
    setSelectedAnswer(null);
    setHasAnswered(false);
  };

  const handleRegenerate = () => {
    setRegenerateKey(prev => prev + 1);
    setSelectedAnswer(null);
    setHasAnswered(false);
  };

  const handleAnswerSelect = (option) => {
    if (hasAnswered) return;
    setSelectedAnswer(option);
    setHasAnswered(true);
  };

  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  // Render question text
  const renderQuestionDisplay = () => {
    if (!currentQuestion?.questionDisplay) return null;
    
    const qd = currentQuestion.questionDisplay;
    if (typeof qd === 'string') {
      return <p className="text-lg text-gray-800">{qd}</p>;
    }
    if (qd.text) {
      return (
        <p className="text-lg text-gray-800">
          {qd.text}
          {qd.math && <> <MathDisplay math={qd.math} displayMode={false} /></>}
        </p>
      );
    }
    return null;
  };

  // Render visualization
  const renderVisualization = () => {
    if (!currentQuestion?.visualization) return null;
    
    const viz = currentQuestion.visualization;
    
    if (viz.type === 'square' || viz.sideLength !== undefined) {
      return (
        <SquareSVG
          sideLength={viz.sideLength}
          showSide={viz.showDimensions !== false && !viz.showArea}
          showArea={viz.showArea || false}
          areaLabel={viz.areaLabel}
          units={viz.units || 'cm'}
          showAnswer={showAnswers}
        />
      );
    }
    
    if (viz.type === 'right-triangle' || viz.base !== undefined) {
      return (
        <RightTriangleSVG
          config={viz}
          showAnswer={showAnswers}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-purple-500 rounded-xl bg-white shadow-md overflow-hidden">
        
        {/* Header with 1,2,3 buttons only */}
        <div className="bg-purple-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Diagnostic: {QUESTION_TYPES[activeTypeIndex].title}</h2>
              <p className="text-purple-100 text-sm">Check your prerequisite knowledge</p>
            </div>
            <div className="flex items-center gap-2">
              {QUESTION_TYPES.map((type, index) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(index)}
                  className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${
                    activeTypeIndex === index
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'bg-purple-400 text-white hover:bg-purple-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Question */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
            {renderQuestionDisplay()}
          </div>

          {/* Visualization with small refresh button in corner */}
          <div className="flex justify-center mb-4 relative" style={{ height: '180px' }}>
            <button
              onClick={handleRegenerate}
              className="absolute top-0 right-0 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200 transition-colors z-10"
              title="New question"
            >
              <RefreshCw size={16} className="text-gray-600" />
            </button>
            {renderVisualization()}
          </div>

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
                  <MathDisplay math={option} displayMode={false} />
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
                  <><Check className="text-green-600" /><span className="font-semibold text-green-800">Correct!</span></>
                ) : (
                  <><X className="text-red-600" /><span className="font-semibold text-red-800">Not quite</span></>
                )}
              </div>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSection;