// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
// Pythagoras Examples Section - V2.1
// Fixed: Dynamic title per tab, no "working space" label, decimal support

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import IsoscelesTriangleSVG from '../../../../components/math/visualizations/IsoscelesTriangleSVG';
import pythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

// ============================================================
// TAB CONFIGURATION - with dynamic titles
// ============================================================

const TABS = [
  { id: 1, label: 'Finding the Hypotenuse', shortLabel: 'Find Hypotenuse' },
  { id: 2, label: 'Finding a Shorter Side', shortLabel: 'Find Short Side' },
  { id: 3, label: 'Isosceles Triangle Area', shortLabel: 'Isosceles Area' }
];

// ============================================================
// EXAMPLE CARD COMPONENT
// ============================================================

const ExampleCard = ({ example, showAnswers, activeTab }) => {
  if (!example) return null;
  
  // Determine visualization type based on tab
  const isIsosceles = activeTab === 3 || example.visualization?.type === 'isosceles-triangle';
  
  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h4 className="text-orange-800 font-medium mb-2">Question</h4>
        <p className="text-gray-800">{example.questionText}</p>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualization */}
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center" style={{ minHeight: '280px' }}>
          {isIsosceles ? (
            <IsoscelesTriangleSVG 
              config={example.visualization} 
              showAnswer={showAnswers} 
            />
          ) : (
            <RightTriangleSVG 
              config={example.visualization} 
              showAnswer={showAnswers} 
            />
          )}
        </div>

        {/* Blank working space - NO LABEL */}
        <div 
          className="bg-white rounded-xl border-2 border-dashed border-gray-300" 
          style={{ minHeight: '280px' }}
        />
      </div>

      {/* Solution Steps */}
      {showAnswers && example.solution && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Solution</h4>
          <div className="space-y-2">
            {example.solution.map((step, i) => (
              <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">{step.explanation}</p>
                <MathDisplay math={step.formula} displayMode={true} />
              </div>
            ))}
          </div>
          
          {/* Final Answer */}
          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
            <div className="flex items-center gap-2">
              <span className="text-green-800 font-semibold">Answer:</span>
              <MathDisplay math={example.answer} displayMode={false} />
            </div>
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
  const [activeTab, setActiveTab] = useState(1);
  const [regenerateKey, setRegenerateKey] = useState(0);

  // Generate example based on active tab
  const example = useMemo(() => {
    return pythagorasGenerators.generateForExamplesTab(activeTab);
  }, [activeTab, regenerateKey]);

  const handleRegenerate = () => {
    setRegenerateKey(prev => prev + 1);
  };

  const handlePrevTab = () => {
    setActiveTab(prev => prev > 1 ? prev - 1 : TABS.length);
  };

  const handleNextTab = () => {
    setActiveTab(prev => prev < TABS.length ? prev + 1 : 1);
  };

  // Get current tab info for dynamic title
  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-orange-500 rounded-xl bg-white shadow-md overflow-hidden">
        
        {/* Header - DYNAMIC TITLE */}
        <div className="bg-orange-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{currentTab?.label || 'Worked Examples'}</h2>
              <p className="text-orange-100 text-sm">Step-by-step solutions to guide your working</p>
            </div>
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              <span>New Example</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevTab}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-2">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.shortLabel}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextTab}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Example Content */}
          <ExampleCard 
            example={example} 
            showAnswers={showAnswers} 
            activeTab={activeTab}
          />

          {/* Teaching Notes */}
          {showAnswers && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teaching Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Delivery Tips</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {activeTab === 1 && (
                      <>
                        <li>• Emphasise that we're finding the longest side</li>
                        <li>• Show why we ADD the squares together</li>
                        <li>• Remind: square root "undoes" the squaring</li>
                      </>
                    )}
                    {activeTab === 2 && (
                      <>
                        <li>• Start with identifying which side is unknown</li>
                        <li>• Explain the REARRANGEMENT step clearly</li>
                        <li>• Highlight: hypotenuse is ALWAYS the largest</li>
                      </>
                    )}
                    {activeTab === 3 && (
                      <>
                        <li>• Draw the height line clearly - it splits the triangle</li>
                        <li>• Point out the TWO right triangles formed</li>
                        <li>• Remind: base is halved when finding height</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">
                    {activeTab === 1 ? 'Check Understanding' : activeTab === 2 ? 'Common Errors' : 'Extension'}
                  </h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    {activeTab === 1 && (
                      <>
                        <li>• Ask: "Why can't we just add the sides?"</li>
                        <li>• Ask: "What does the ² mean in the formula?"</li>
                        <li>• Try with decimal answers for calculator practice</li>
                      </>
                    )}
                    {activeTab === 2 && (
                      <>
                        <li>• Students subtracting instead of rearranging</li>
                        <li>• Forgetting to square root at the end</li>
                        <li>• Mixing up which side to subtract</li>
                      </>
                    )}
                    {activeTab === 3 && (
                      <>
                        <li>• What if the triangle was equilateral?</li>
                        <li>• Can you find the perimeter too?</li>
                        <li>• Link to area of any triangle: ½ × b × h</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamplesSection;