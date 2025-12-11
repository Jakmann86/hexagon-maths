// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
// Pythagoras Examples Section - Orange theme
// Worked examples with step-by-step solutions

import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';

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
  
  // Generate example for current tab
  const currentExample = useMemo(() => {
    return pythagorasGenerators.generateForExamplesTab(activeTab, { 
      difficulty: 'medium' 
    });
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