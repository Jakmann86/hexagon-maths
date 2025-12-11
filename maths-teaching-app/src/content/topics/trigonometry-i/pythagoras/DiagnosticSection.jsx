// src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
// Pythagoras Diagnostic - Purple theme
// 3 question types: square area, square root from area, identify hypotenuse
// Each question has its own regenerate button

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import SquareSVG from '../../../../components/math/visualizations/SquareSVG';
import _ from 'lodash';

// ============================================================
// QUESTION GENERATORS
// ============================================================

// Question 1: Find area of square (given side length)
const generateSquareArea = () => {
  const side = _.random(3, 9);
  const area = side * side;
  
  const distractors = [
    side * 4,           // Perimeter mistake
    side * 2,           // Doubling mistake
    area + _.random(1, 5)  // Close but wrong
  ];
  
  const options = _.shuffle([
    { value: `${area}`, label: `${area} cm²`, isCorrect: true },
    { value: `${distractors[0]}`, label: `${distractors[0]} cm²`, isCorrect: false },
    { value: `${distractors[1]}`, label: `${distractors[1]} cm²`, isCorrect: false },
    { value: `${distractors[2]}`, label: `${distractors[2]} cm²`, isCorrect: false }
  ]);
  
  return {
    type: 'squareArea',
    question: 'Find the area of this square:',
    visualization: { type: 'square', sideLength: side, showSide: true, showArea: false },
    options,
    correctAnswer: `${area}`,
    explanation: `Area = side × side = ${side} × ${side} = ${area} cm²`
  };
};

// Question 2: Find side from area (square root)
const generateSquareRoot = () => {
  const side = _.random(4, 10);
  const area = side * side;
  
  const distractors = [
    area / 4,           // Dividing by 4 mistake
    side + 1,           // Close but wrong
    Math.floor(area / 2)  // Halving mistake
  ];
  
  const options = _.shuffle([
    { value: `${side}`, label: `${side} cm`, isCorrect: true },
    { value: `${distractors[0]}`, label: `${distractors[0]} cm`, isCorrect: false },
    { value: `${distractors[1]}`, label: `${distractors[1]} cm`, isCorrect: false },
    { value: `${distractors[2]}`, label: `${distractors[2]} cm`, isCorrect: false }
  ]);
  
  return {
    type: 'squareRoot',
    question: 'Find the side length of this square:',
    visualization: { type: 'square', sideLength: side, showSide: false, showArea: true, areaLabel: `${area} cm²` },
    options,
    correctAnswer: `${side}`,
    explanation: `Side = √${area} = ${side} cm`
  };
};

// Question 3: Identify the hypotenuse
const generateIdentifyHypotenuse = () => {
  // Use letters or numbers randomly
  const useLetters = Math.random() > 0.5;
  const labels = useLetters 
    ? ['a', 'b', 'c']
    : [`${_.random(3, 6)}`, `${_.random(4, 8)}`, `${_.random(5, 10)}`];
  
  // Hypotenuse is always the third label (opposite right angle)
  const hypotenuseLabel = labels[2];
  
  const options = _.shuffle([
    { value: labels[0], label: labels[0], isCorrect: false },
    { value: labels[1], label: labels[1], isCorrect: false },
    { value: labels[2], label: labels[2], isCorrect: true }
  ]);
  
  return {
    type: 'identifyHypotenuse',
    question: 'Which side is the hypotenuse?',
    visualization: { 
      type: 'triangle', 
      base: 6, 
      height: 4, 
      labels: { base: labels[0], height: labels[1], hypotenuse: labels[2] },
      showRightAngle: true
    },
    options,
    correctAnswer: hypotenuseLabel,
    explanation: `The hypotenuse is the longest side, opposite the right angle: ${hypotenuseLabel}`
  };
};

// ============================================================
// QUESTION CARD COMPONENT
// ============================================================

const QuestionCard = ({ title, question, onRegenerate, children }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-500 text-white px-4 py-2 flex justify-between items-center">
        <h3 className="font-semibold">{title}</h3>
        <button
          onClick={onRegenerate}
          className="p-1.5 hover:bg-purple-600 rounded-lg transition-colors"
          title="New question"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-gray-700 mb-4 font-medium">{question.question}</p>
        {children}
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  
  // State for each question type
  const [q1, setQ1] = useState(() => generateSquareArea());
  const [q2, setQ2] = useState(() => generateSquareRoot());
  const [q3, setQ3] = useState(() => generateIdentifyHypotenuse());
  
  // Selected answers
  const [selected, setSelected] = useState({ q1: null, q2: null, q3: null });
  
  // Render visualization based on type
  const renderVisualization = (viz) => {
    if (viz.type === 'square') {
      return (
        <SquareSVG
          sideLength={viz.sideLength}
          showSide={viz.showSide}
          showArea={viz.showArea}
          areaLabel={viz.areaLabel}
          units="cm"
          size="normal"
        />
      );
    }
    
    if (viz.type === 'triangle') {
      return (
        <RightTriangleSVG
          config={{
            base: viz.base,
            height: viz.height,
            showRightAngle: viz.showRightAngle,
            labels: viz.labels
          }}
          showAnswer={false}
        />
      );
    }
    
    return null;
  };
  
  // Render options
  const renderOptions = (question, selectedValue, onSelect) => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {question.options.map((option, i) => {
          const isSelected = selectedValue === option.value;
          const showResult = showAnswers && isSelected;
          const isCorrect = option.isCorrect;
          
          let buttonClass = 'p-3 rounded-lg border-2 text-center font-medium transition-all ';
          
          if (showResult) {
            buttonClass += isCorrect 
              ? 'bg-green-100 border-green-500 text-green-700'
              : 'bg-red-100 border-red-500 text-red-700';
          } else if (isSelected) {
            buttonClass += 'bg-purple-100 border-purple-500 text-purple-700';
          } else {
            buttonClass += 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50';
          }
          
          return (
            <button
              key={i}
              onClick={() => onSelect(option.value)}
              className={buttonClass}
              disabled={showAnswers}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="border-2 border-t-4 border-purple-500 rounded-xl bg-white shadow-md overflow-hidden">
        <div className="bg-purple-500 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Diagnostic Check</h2>
          <p className="text-purple-100 text-sm">Check your prerequisite knowledge</p>
        </div>
        
        <div className="p-6">
          {/* Three question cards in a grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Q1: Square Area */}
            <QuestionCard
              title="Area of Square"
              question={q1}
              onRegenerate={() => {
                setQ1(generateSquareArea());
                setSelected(s => ({ ...s, q1: null }));
              }}
            >
              <div className="flex justify-center mb-4">
                {renderVisualization(q1.visualization)}
              </div>
              {renderOptions(q1, selected.q1, (v) => setSelected(s => ({ ...s, q1: v })))}
              {showAnswers && selected.q1 && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {q1.explanation}
                </p>
              )}
            </QuestionCard>
            
            {/* Q2: Square Root */}
            <QuestionCard
              title="Square Root"
              question={q2}
              onRegenerate={() => {
                setQ2(generateSquareRoot());
                setSelected(s => ({ ...s, q2: null }));
              }}
            >
              <div className="flex justify-center mb-4">
                {renderVisualization(q2.visualization)}
              </div>
              {renderOptions(q2, selected.q2, (v) => setSelected(s => ({ ...s, q2: v })))}
              {showAnswers && selected.q2 && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {q2.explanation}
                </p>
              )}
            </QuestionCard>
            
            {/* Q3: Identify Hypotenuse */}
            <QuestionCard
              title="Identify Hypotenuse"
              question={q3}
              onRegenerate={() => {
                setQ3(generateIdentifyHypotenuse());
                setSelected(s => ({ ...s, q3: null }));
              }}
            >
              <div className="flex justify-center mb-4">
                {renderVisualization(q3.visualization)}
              </div>
              {renderOptions(q3, selected.q3, (v) => setSelected(s => ({ ...s, q3: v })))}
              {showAnswers && selected.q3 && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {q3.explanation}
                </p>
              )}
            </QuestionCard>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSection;