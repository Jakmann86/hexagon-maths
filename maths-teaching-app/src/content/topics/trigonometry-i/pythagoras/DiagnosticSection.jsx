// src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
// Pythagoras Diagnostic Section - V2.2
// Updated: 1,2,3 buttons in header (rounded-square style)

import React, { useState, useMemo, useCallback } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import SquareSVG from '../../../../components/math/visualizations/SquareSVG';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';
import pythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';
import _ from 'lodash';

// ============================================================
// CUSTOM SQUARE ROOT GENERATOR (with non-perfect squares)
// Ensures all 4 options are unique
// ============================================================

const generateUniqueOptions = (correctValue, possibleDistractors, formatFn) => {
  const optionSet = new Set();
  optionSet.add(correctValue);
  
  for (const d of possibleDistractors) {
    if (d > 0 && d !== correctValue && !optionSet.has(d)) {
      optionSet.add(d);
      if (optionSet.size >= 4) break;
    }
  }
  
  // If we still don't have 4, add some random variations
  let offset = 1;
  while (optionSet.size < 4) {
    const candidate = correctValue + offset;
    if (!optionSet.has(candidate) && candidate > 0) {
      optionSet.add(candidate);
    }
    offset = offset > 0 ? -offset : -offset + 1;
  }
  
  return _.shuffle(Array.from(optionSet).map(formatFn));
};

const generateSquareRootQuestion = () => {
  const useCalculator = Math.random() > 0.5;
  
  if (useCalculator) {
    // Non-perfect squares - calculator needed
    const nonPerfectAreas = [20, 30, 45, 50, 72, 75, 80, 90, 125, 150];
    const area = _.sample(nonPerfectAreas);
    const side = Math.round(Math.sqrt(area) * 100) / 100;
    
    // Generate unique distractors
    const possibleDistractors = [
      Math.round((side + 0.5) * 100) / 100,
      Math.round((side - 0.5) * 100) / 100,
      Math.round((side + 1) * 100) / 100,
      Math.round((side - 1) * 100) / 100,
      Math.round(area / 4 * 100) / 100,
      Math.round(area / 2 * 100) / 100,
      Math.round(area / 3 * 100) / 100,
    ];
    
    const options = generateUniqueOptions(
      side, 
      possibleDistractors, 
      v => `${v}\\text{ cm}`
    );
    
    return {
      questionDisplay: {
        text: 'Find the side length of a square with area',
        math: `${area}\\text{ cm}^2`
      },
      correctAnswer: `${side}\\text{ cm}`,
      options,
      explanation: `Side length = √${area} ≈ ${side} cm (calculator needed)`,
      visualization: {
        type: 'square',
        sideLength: side,
        showDimensions: false,
        showArea: true,
        areaLabel: `${area} cm²`,
        units: 'cm'
      },
      needsCalculator: true
    };
  } else {
    // Perfect squares - no calculator
    const perfectSquares = [16, 25, 36, 49, 64, 81, 100, 121, 144];
    const area = _.sample(perfectSquares);
    const side = Math.sqrt(area);
    
    // Generate unique distractors
    const possibleDistractors = [
      area / 4,
      area / 2,
      side + 1,
      side - 1,
      side + 2,
      side * 2,
      area / 3,
    ];
    
    const options = generateUniqueOptions(
      side, 
      possibleDistractors, 
      v => `${v}\\text{ cm}`
    );
    
    return {
      questionDisplay: {
        text: 'Find the side length of a square with area',
        math: `${area}\\text{ cm}^2`
      },
      correctAnswer: `${side}\\text{ cm}`,
      options,
      explanation: `Side length = √${area} = ${side} cm`,
      visualization: {
        type: 'square',
        sideLength: side,
        showDimensions: false,
        showArea: true,
        areaLabel: `${area} cm²`,
        units: 'cm'
      },
      needsCalculator: false
    };
  }
};

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
        return generateSquareRootQuestion();
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
    if (qd.text && qd.math) {
      return (
        <p className="text-lg text-gray-800">
          {qd.text} <MathDisplay math={qd.math} displayMode={false} />
        </p>
      );
    }
    return null;
  };

  // Render visualization
  const renderVisualization = () => {
    if (!currentQuestion?.visualization) return null;
    
    const viz = currentQuestion.visualization;
    
    // Square visualization
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
    
    // Right triangle visualization
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
        
        {/* Header with 1,2,3 buttons */}
        <div className="bg-purple-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Diagnostic: {QUESTION_TYPES[activeTypeIndex].title}</h2>
              <p className="text-purple-100 text-sm">Check your prerequisite knowledge</p>
            </div>
            
            {/* Question type selector - rounded-square buttons */}
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
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
            {renderQuestionDisplay()}
          </div>

          {/* Visualization */}
          <div className="flex justify-center mb-6" style={{ height: '200px' }}>
            {renderVisualization()}
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
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

          {/* Regenerate button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              <span>New Question</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSection;