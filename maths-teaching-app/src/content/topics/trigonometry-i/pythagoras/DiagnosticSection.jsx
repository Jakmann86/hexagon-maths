// src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
// Pythagoras Diagnostic - Purple theme
// V2.0 - Uses unified generators with LaTeX formatting
// 3 question types: square area, square root from area, identify hypotenuse

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import SquareSVG from '../../../../components/math/visualizations/SquareSVG';
import _ from 'lodash';

// ============================================================
// V2 QUESTION GENERATORS - LaTeX formatted answers
// ============================================================

/**
 * Generate square area question (given side, find area)
 * Returns v2 format with LaTeX options
 */
const generateSquareArea = () => {
  const side = _.random(3, 9);
  const area = side * side;
  
  // Generate plausible distractors
  const distractors = _.shuffle([
    side * 4,              // Perimeter mistake
    side * 2,              // Doubling mistake  
    side + side,           // Adding mistake
    area + _.random(1, 5), // Close but wrong
    area - _.random(1, 3)  // Close but wrong
  ]).slice(0, 3);
  
  const options = _.shuffle([
    { value: area, latex: `${area}\\text{ cm}^2`, isCorrect: true },
    { value: distractors[0], latex: `${distractors[0]}\\text{ cm}^2`, isCorrect: false },
    { value: distractors[1], latex: `${distractors[1]}\\text{ cm}^2`, isCorrect: false },
    { value: distractors[2], latex: `${distractors[2]}\\text{ cm}^2`, isCorrect: false }
  ]);
  
  return {
    type: 'squareArea',
    title: 'Area of a Square',
    question: 'Find the area of this square:',
    visualization: { 
      type: 'square', 
      sideLength: side, 
      showSide: true, 
      showArea: false 
    },
    options,
    correctValue: area,
    explanation: `\\text{Area} = \\text{side}^2 = ${side}^2 = ${area}\\text{ cm}^2`
  };
};

/**
 * Generate square root question (given area, find side)
 * Returns v2 format with LaTeX options
 */
const generateSquareRoot = () => {
  const side = _.random(4, 10);
  const area = side * side;
  
  // Generate plausible distractors
  const distractors = _.shuffle([
    area / 4,               // Dividing by 4 mistake
    area / 2,               // Halving mistake
    side + 1,               // Close but wrong
    side - 1,               // Close but wrong
    Math.floor(Math.sqrt(area + 10)) // Wrong square root
  ]).filter(d => d > 0 && d !== side).slice(0, 3);
  
  const options = _.shuffle([
    { value: side, latex: `${side}\\text{ cm}`, isCorrect: true },
    { value: distractors[0], latex: `${distractors[0]}\\text{ cm}`, isCorrect: false },
    { value: distractors[1], latex: `${distractors[1]}\\text{ cm}`, isCorrect: false },
    { value: distractors[2], latex: `${distractors[2]}\\text{ cm}`, isCorrect: false }
  ]);
  
  return {
    type: 'squareRoot',
    title: 'Square Root',
    question: 'Find the side length of this square:',
    visualization: { 
      type: 'square', 
      sideLength: side, 
      showSide: false, 
      showArea: true, 
      areaLabel: `${area} cm²` 
    },
    options,
    correctValue: side,
    explanation: `\\text{Side} = \\sqrt{${area}} = ${side}\\text{ cm}`
  };
};

/**
 * Generate identify hypotenuse question
 * Returns v2 format with orientation support
 */
const generateIdentifyHypotenuse = () => {
  // Random orientation for variety
  const orientations = ['default', 'rotate90', 'rotate180', 'rotate270', 'flip'];
  const orientation = _.sample(orientations);
  
  // Use letters or numbers randomly
  const useLetters = Math.random() > 0.5;
  
  let labels, hypotenuseLabel, options;
  
  if (useLetters) {
    labels = { base: 'a', height: 'b', hypotenuse: 'c' };
    hypotenuseLabel = 'c';
    options = _.shuffle([
      { value: 'a', latex: 'a', isCorrect: false },
      { value: 'b', latex: 'b', isCorrect: false },
      { value: 'c', latex: 'c', isCorrect: true }
    ]);
  } else {
    // Use Pythagorean triple values
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
    const [a, b, c] = _.sample(triples);
    labels = { base: `${a}`, height: `${b}`, hypotenuse: `${c}` };
    hypotenuseLabel = `${c}`;
    options = _.shuffle([
      { value: `${a}`, latex: `${a}\\text{ cm}`, isCorrect: false },
      { value: `${b}`, latex: `${b}\\text{ cm}`, isCorrect: false },
      { value: `${c}`, latex: `${c}\\text{ cm}`, isCorrect: true }
    ]);
  }
  
  return {
    type: 'identifyHypotenuse',
    title: 'Identify Hypotenuse',
    question: 'Which side is the hypotenuse?',
    visualization: { 
      type: 'triangle', 
      base: 6, 
      height: 4, 
      labels,
      showRightAngle: true,
      orientation
    },
    options,
    correctValue: hypotenuseLabel,
    explanation: `\\text{The hypotenuse is the longest side, opposite the right angle: } ${useLetters ? 'c' : hypotenuseLabel + '\\text{ cm}'}`
  };
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  
  // State for all question data
  const [q1, setQ1] = useState(() => generateSquareArea());
  const [q2, setQ2] = useState(() => generateSquareRoot());
  const [q3, setQ3] = useState(() => generateIdentifyHypotenuse());
  
  // State for selected answers (store the value, not the latex)
  const [selected, setSelected] = useState({ q1: null, q2: null, q3: null });
  
  // State for which question is currently visible (1, 2, or 3)
  const [activeQuestion, setActiveQuestion] = useState(1);
  
  // Mapping active state to its data and setter function
  const questionMap = {
    1: { 
      data: q1, 
      setter: setQ1, 
      generator: generateSquareArea, 
      selectedValue: selected.q1,
      selectSetter: (v) => setSelected(s => ({ ...s, q1: v }))
    },
    2: { 
      data: q2, 
      setter: setQ2, 
      generator: generateSquareRoot,
      selectedValue: selected.q2,
      selectSetter: (v) => setSelected(s => ({ ...s, q2: v }))
    },
    3: { 
      data: q3, 
      setter: setQ3, 
      generator: generateIdentifyHypotenuse,
      selectedValue: selected.q3,
      selectSetter: (v) => setSelected(s => ({ ...s, q3: v }))
    },
  };
  
  const currentQ = questionMap[activeQuestion];
  
  // Handler to regenerate the current question
  const handleRegenerate = () => {
    currentQ.setter(currentQ.generator());
    currentQ.selectSetter(null);
  };
  
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
            labels: viz.labels,
            orientation: viz.orientation
          }}
          showAnswer={false}
        />
      );
    }
    
    return null;
  };
  
  // Render options with LaTeX
  const renderOptions = () => {
    const question = currentQ.data;
    const selectedValue = currentQ.selectedValue;
    const onSelect = currentQ.selectSetter;
    
    return (
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, i) => {
          const isSelected = selectedValue === option.value;
          const isCorrect = option.isCorrect;
          
          let buttonClass = 'p-4 rounded-lg border-2 text-center font-medium transition-all ';
          
          if (isSelected) {
            // Show green or red immediately when selected
            buttonClass += isCorrect 
              ? 'bg-green-100 border-green-500 text-green-700'
              : 'bg-red-100 border-red-500 text-red-700';
          } else {
            buttonClass += 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50';
          }
          
          return (
            <button
              key={i}
              onClick={() => onSelect(option.value)}
              className={buttonClass}
            >
              <MathDisplay math={option.latex} />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-purple-500 rounded-xl bg-white shadow-md overflow-hidden">
        {/* Header with title */}
        <div className="bg-purple-500 text-white px-6 py-4">
          <h2 className="text-xl font-bold">{currentQ.data.title}</h2>
          <p className="text-purple-100 text-sm">Prerequisite Check</p>
        </div>
        
        <div className="p-6">
          
          {/* Navigation Buttons */}
          <div className="mb-6 flex justify-center gap-3">
            {[1, 2, 3].map(num => {
              const isActive = activeQuestion === num;
              
              return (
                <button
                  key={num}
                  onClick={() => setActiveQuestion(num)}
                  className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                    isActive 
                      ? 'bg-purple-600 text-white ring-4 ring-purple-200' 
                      : 'bg-gray-200 text-gray-700 hover:bg-purple-100 hover:text-purple-600'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        
          {/* Question Content */}
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden">
              {/* Regenerate button */}
              <div className="px-4 py-2 flex justify-end items-center bg-gray-50 border-b">
                <button
                  onClick={handleRegenerate}
                  className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                  title="New question"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
              
              {/* Question and visualization */}
              <div className="p-6">
                <p className="text-gray-700 mb-6 text-lg font-medium text-center">
                  {currentQ.data.question}
                </p>
                
                <div className="flex justify-center mb-6">
                  {renderVisualization(currentQ.data.visualization)}
                </div>
                
                {renderOptions()}
                
                {/* Show explanation when answer selected */}
                {currentQ.selectedValue && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <MathDisplay math={currentQ.data.explanation} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSection;