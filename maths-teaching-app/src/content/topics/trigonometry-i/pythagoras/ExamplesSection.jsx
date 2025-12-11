// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
// Pythagoras Examples Section - Orange theme
// V2.0 - Uses unified generators with proper LaTeX formatting

import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import _ from 'lodash';

// ============================================================
// V2 EXAMPLE GENERATORS - Local wrappers for examples section
// ============================================================

/**
 * Generate find hypotenuse example with full solution steps
 */
const generateFindHypotenuseExample = () => {
  // Use Pythagorean triple for clean numbers
  const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]];
  const [a, b, c] = _.sample(triples);
  
  return {
    title: 'Finding the Hypotenuse',
    questionText: `Find the length of the hypotenuse in this right-angled triangle with base ${a} cm and height ${b} cm.`,
    visualization: {
      base: a,
      height: b,
      unknownSide: 'hypotenuse',
      showRightAngle: true,
      units: 'cm'
    },
    answer: `c = ${c}\\text{ cm}`,
    solution: [
      { explanation: "Write down Pythagoras' theorem", formula: "a^2 + b^2 = c^2" },
      { explanation: "Substitute the known values", formula: `${a}^2 + ${b}^2 = c^2` },
      { explanation: "Calculate the squares", formula: `${a * a} + ${b * b} = c^2` },
      { explanation: "Add the values", formula: `${a * a + b * b} = c^2` },
      { explanation: "Take the square root", formula: `c = \\sqrt{${a * a + b * b}} = ${c}\\text{ cm}` }
    ]
  };
};

/**
 * Generate find missing side example with full solution steps
 */
const generateFindMissingSideExample = () => {
  // Use Pythagorean triple for clean numbers
  const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
  const [a, b, c] = _.sample(triples);
  
  // Randomly choose to find base or height
  const findBase = Math.random() > 0.5;
  
  if (findBase) {
    return {
      title: 'Finding a Shorter Side',
      questionText: `Find the length of the base in this right-angled triangle with hypotenuse ${c} cm and height ${b} cm.`,
      visualization: {
        base: a,
        height: b,
        hypotenuse: c,
        unknownSide: 'base',
        showRightAngle: true,
        units: 'cm'
      },
      answer: `a = ${a}\\text{ cm}`,
      solution: [
        { explanation: "Write down Pythagoras' theorem", formula: "a^2 + b^2 = c^2" },
        { explanation: "Rearrange to find a²", formula: "a^2 = c^2 - b^2" },
        { explanation: "Substitute the known values", formula: `a^2 = ${c}^2 - ${b}^2` },
        { explanation: "Calculate the squares", formula: `a^2 = ${c * c} - ${b * b}` },
        { explanation: "Subtract", formula: `a^2 = ${c * c - b * b}` },
        { explanation: "Take the square root", formula: `a = \\sqrt{${c * c - b * b}} = ${a}\\text{ cm}` }
      ]
    };
  } else {
    return {
      title: 'Finding a Shorter Side',
      questionText: `Find the length of the height in this right-angled triangle with hypotenuse ${c} cm and base ${a} cm.`,
      visualization: {
        base: a,
        height: b,
        hypotenuse: c,
        unknownSide: 'height',
        showRightAngle: true,
        units: 'cm'
      },
      answer: `b = ${b}\\text{ cm}`,
      solution: [
        { explanation: "Write down Pythagoras' theorem", formula: "a^2 + b^2 = c^2" },
        { explanation: "Rearrange to find b²", formula: "b^2 = c^2 - a^2" },
        { explanation: "Substitute the known values", formula: `b^2 = ${c}^2 - ${a}^2` },
        { explanation: "Calculate the squares", formula: `b^2 = ${c * c} - ${a * a}` },
        { explanation: "Subtract", formula: `b^2 = ${c * c - a * a}` },
        { explanation: "Take the square root", formula: `b = \\sqrt{${c * c - a * a}} = ${b}\\text{ cm}` }
      ]
    };
  }
};

/**
 * Generate isosceles triangle area example
 */
const generateIsoscelesAreaExample = () => {
  // Generate isosceles triangle with nice numbers
  const bases = [6, 8, 10, 12];
  const base = _.sample(bases);
  const halfBase = base / 2;
  
  // Equal sides (must be longer than half base for valid triangle)
  const legLengths = [5, 10, 13, 15].filter(l => l > halfBase);
  const leg = _.sample(legLengths);
  
  // Calculate height using Pythagoras
  const heightSquared = leg * leg - halfBase * halfBase;
  const height = Math.sqrt(heightSquared);
  const heightRounded = Math.round(height * 100) / 100;
  
  // Calculate area
  const area = (base * height) / 2;
  const areaRounded = Math.round(area * 100) / 100;
  
  return {
    title: 'Isosceles Triangle Area',
    questionText: `Find the area of an isosceles triangle with base ${base} cm and equal sides ${leg} cm.`,
    visualization: {
      base: base,
      height: heightRounded,
      showRightAngle: true,
      labels: {
        base: `${base} cm`,
        height: '?',
        hypotenuse: `${leg} cm`
      },
      units: 'cm'
    },
    answer: `\\text{Area} = ${areaRounded}\\text{ cm}^2`,
    solution: [
      { explanation: "The height splits the base in half, creating a right triangle", formula: `\\text{Half base} = \\frac{${base}}{2} = ${halfBase}\\text{ cm}` },
      { explanation: "Use Pythagoras to find the height", formula: `h^2 + ${halfBase}^2 = ${leg}^2` },
      { explanation: "Rearrange to find h²", formula: `h^2 = ${leg}^2 - ${halfBase}^2 = ${leg * leg} - ${halfBase * halfBase} = ${heightSquared}` },
      { explanation: "Take the square root", formula: `h = \\sqrt{${heightSquared}} = ${heightRounded}\\text{ cm}` },
      { explanation: "Now find the area", formula: `\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}` },
      { explanation: "Substitute the values", formula: `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${heightRounded} = ${areaRounded}\\text{ cm}^2` }
    ]
  };
};

// Map tab IDs to generators
const generateForTab = (tabId) => {
  switch (tabId) {
    case 1: return generateFindHypotenuseExample();
    case 2: return generateFindMissingSideExample();
    case 3: return generateIsoscelesAreaExample();
    default: return generateFindHypotenuseExample();
  }
};

// ============================================================
// EXAMPLE CARD COMPONENT
// ============================================================

const ExampleCard = ({ example, showAnswers }) => {
  const steps = example.solution || [];
  
  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
        <h3 className="font-semibold text-orange-800 mb-2">{example.title}</h3>
        <p className="text-gray-700">{example.questionText}</p>
      </div>
      
      {/* Two column layout: Visualization + Working Area - BIGGER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualization - larger */}
        <div 
          className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex items-center justify-center" 
          style={{ minHeight: '280px' }}
        >
          {example.visualization ? (
            <RightTriangleSVG 
              config={example.visualization}
              showAnswer={showAnswers}
            />
          ) : (
            <p className="text-gray-400">No diagram</p>
          )}
        </div>
        
        {/* Blank working area for teacher IWB - larger, no label */}
        <div 
          className="bg-white rounded-xl border-2 border-dashed border-gray-300"
          style={{ minHeight: '280px' }}
        />
      </div>
      
      {/* Solution steps - only shown when answers revealed */}
      {showAnswers && (
        <div className="border-t border-gray-200 pt-4">
          {/* Answer highlight */}
          <div className="bg-orange-500 text-white p-4 rounded-xl text-center mb-4">
            <p className="font-medium">Answer:</p>
            <div className="text-xl">
              <MathDisplay math={example.answer} displayMode={false} />
            </div>
          </div>
          
          {/* Working steps */}
          <h4 className="font-semibold text-gray-700 mb-3">Solution Steps</h4>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-gray-50 border border-gray-200"
              >
                <p className="text-sm text-gray-600 mb-1">{step.explanation}</p>
                <MathDisplay math={step.formula} displayMode={true} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  
  // Example tabs
  const tabs = [
    { id: 1, label: 'Find Hypotenuse' },
    { id: 2, label: 'Find Shorter Side' },
    { id: 3, label: 'Isosceles Area' }
  ];
  
  const [activeTab, setActiveTab] = useState(1);
  const [regenerateKey, setRegenerateKey] = useState(0);
  
  // Generate example for current tab using local v2 generators
  const currentExample = useMemo(() => {
    return generateForTab(activeTab);
  }, [activeTab, regenerateKey]);
  
  const regenerateExample = () => {
    setRegenerateKey(prev => prev + 1);
  };
  
  return (
    <div className="space-y-6 mb-8">
      {/* Main examples card - Orange theme */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-t-4 border-orange-500">
        
        {/* Header */}
        <div className="bg-orange-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Worked Examples</h2>
              <p className="text-orange-100 text-sm">Step through each solution</p>
            </div>
            <button
              onClick={regenerateExample}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              <span>New Example</span>
            </button>
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 bg-orange-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-orange-700 border-b-2 border-orange-500 bg-white'
                  : 'text-gray-500 hover:text-orange-600 hover:bg-orange-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Example content */}
        <div className="p-6">
          <ExampleCard 
            example={currentExample} 
            showAnswers={showAnswers}
          />
        </div>
        
        {/* Teacher notes - visible when showAnswers is true */}
        {showAnswers && (
          <div className="px-6 pb-6">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teaching Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Green box */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Delivery Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                    <li>Work through on the board alongside the screen</li>
                    <li>Pause at each step and ask "What do we do next?"</li>
                    <li>Get students to check the answer makes sense</li>
                    <li>Generate new examples for independent practice</li>
                  </ul>
                </div>
                
                {/* Blue box */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Key Points</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                    <li>Always identify the hypotenuse first</li>
                    <li>Label clearly: a, b for legs, c for hypotenuse</li>
                    <li>Show the squaring step explicitly</li>
                    <li>Emphasise the final square root</li>
                  </ul>
                </div>
                
                {/* Purple box */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Extension</h4>
                  <ul className="list-disc list-inside space-y-1 text-purple-700 text-sm">
                    <li>What if we know the hypotenuse and one other side?</li>
                    <li>How do we rearrange the formula?</li>
                    <li>Can you find a missing shorter side?</li>
                  </ul>
                </div>
                
                {/* Amber box */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">Watch For</h4>
                  <ul className="list-disc list-inside space-y-1 text-amber-700 text-sm">
                    <li>Students who forget to square root at the end</li>
                    <li>Calculator errors with order of operations</li>
                    <li>Confusing which side is which</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamplesSection;