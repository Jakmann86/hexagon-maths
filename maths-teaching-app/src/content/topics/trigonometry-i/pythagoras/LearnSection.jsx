// src/content/topics/trigonometry-i/pythagoras/LearnSection.jsx
// Pythagoras Learn Section - Green theme
// Interactive triangle demonstration - preserves original visualization style

import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { RefreshCw, Eye, EyeOff, RotateCcw } from 'lucide-react';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import _ from 'lodash';

// Pythagorean triples for nice numbers
const PYTHAGOREAN_TRIPLES = [
  [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]
];

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // Triangle dimensions
  const [dimensions, setDimensions] = useState({ a: 3, b: 4, c: 5 });
  
  // Toggle states for showing/hiding values
  const [showSideA, setShowSideA] = useState(true);
  const [showSideB, setShowSideB] = useState(true);
  const [showSideC, setShowSideC] = useState(false);
  
  // Generate new triangle
  const newTriangle = () => {
    const [a, b, c] = _.sample(PYTHAGOREAN_TRIPLES);
    setDimensions({ a, b, c });
    setShowSideA(true);
    setShowSideB(true);
    setShowSideC(false);
  };
  
  // Reset view
  const resetView = () => {
    setShowSideA(true);
    setShowSideB(true);
    setShowSideC(false);
  };
  
  // Calculate intermediate values
  const aSquared = dimensions.a * dimensions.a;
  const bSquared = dimensions.b * dimensions.b;
  const cSquared = aSquared + bSquared;
  
  // Build visualization config for RightTriangle
  const triangleConfig = {
    base: dimensions.a,
    height: dimensions.b,
    showRightAngle: true,
    labelStyle: 'custom',
    labels: [
      showSideA ? `${dimensions.a} cm` : '?',
      showSideB ? `${dimensions.b} cm` : '?',
      showSideC ? `${dimensions.c} cm` : '?'
    ],
    units: 'cm',
    sectionType: 'learn'
  };

  return (
    <div className="space-y-6 mb-8">
      <Card className="border-2 border-t-4 border-green-500 shadow-md overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Pythagoras' Theorem: Finding the Hypotenuse
            </h3>
            <button
              onClick={newTriangle}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
            >
              <RefreshCw size={18} />
              <span>New Triangle</span>
            </button>
          </div>

          {/* Main content - two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Triangle Visualization */}
            <div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200" style={{ minHeight: '320px' }}>
                <RightTriangle
                  {...triangleConfig}
                  containerHeight={300}
                />
              </div>

              {/* Toggle Controls */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button
                  onClick={() => setShowSideA(!showSideA)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    showSideA
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  {showSideA ? <Eye size={16} /> : <EyeOff size={16} />}
                  Side a
                </button>

                <button
                  onClick={() => setShowSideB(!showSideB)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    showSideB
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  {showSideB ? <Eye size={16} /> : <EyeOff size={16} />}
                  Side b
                </button>

                <button
                  onClick={() => setShowSideC(!showSideC)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    showSideC
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  {showSideC ? <Eye size={16} /> : <EyeOff size={16} />}
                  Side c
                </button>

                <button
                  onClick={resetView}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-sm"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Right: Formula and Explanation */}
            <div className="space-y-4">
              {/* Key formula */}
              <div className="bg-green-100 p-5 rounded-xl border border-green-300">
                <h4 className="font-semibold text-green-800 mb-3">Pythagoras' Theorem</h4>
                <div className="text-center text-2xl mb-3">
                  <MathDisplay math="a^2 + b^2 = c^2" displayMode={true} />
                </div>
                <p className="text-green-700 text-sm text-center">
                  The square of the hypotenuse equals the sum of the squares of the other two sides
                </p>
              </div>

              {/* Current triangle values */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Current Triangle</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Side a</div>
                    <div className="text-lg font-bold text-red-600">
                      {showSideA ? `${dimensions.a} cm` : '?'}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Side b</div>
                    <div className="text-lg font-bold text-blue-600">
                      {showSideB ? `${dimensions.b} cm` : '?'}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Side c</div>
                    <div className="text-lg font-bold text-green-600">
                      {showSideC ? `${dimensions.c} cm` : '?'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation preview */}
              {showSideA && showSideB && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Working Out</h4>
                  <div className="text-center space-y-1">
                    <MathDisplay math={`${dimensions.a}^2 + ${dimensions.b}^2 = c^2`} />
                    <MathDisplay math={`${aSquared} + ${bSquared} = c^2`} />
                    <MathDisplay math={`${cSquared} = c^2`} />
                    {showSideC && (
                      <MathDisplay math={`c = \\sqrt{${cSquared}} = ${dimensions.c}\\text{ cm}`} />
                    )}
                  </div>
                </div>
              )}

              {/* Prompt when c is hidden */}
              {!showSideC && showSideA && showSideB && (
                <div className="bg-green-500 text-white p-4 rounded-xl text-center">
                  <p className="font-medium">
                    Click "Side c" to reveal the hypotenuse!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Notes - only visible with "Show Answers" */}
          {showAnswers && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Teaching Notes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Green box - How to use */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3">How to Use This Visual</h4>
                  <ol className="list-decimal list-inside space-y-2 text-green-700 text-sm">
                    <li>Start with a and b visible, c hidden</li>
                    <li>Ask: "How can we find the longest side?"</li>
                    <li>Work through the formula on the board</li>
                    <li>Reveal c to check the answer</li>
                    <li>Generate new triangles for more practice</li>
                  </ol>
                </div>
                
                {/* Blue box - Key questions */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-3">Key Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                    <li>"Which side is the hypotenuse?"</li>
                    <li>"Where is c in relation to the right angle?"</li>
                    <li>"Why do we square the numbers?"</li>
                    <li>"What's the last step to find c?"</li>
                    <li>"How do you know your answer is sensible?"</li>
                  </ul>
                </div>
                
                {/* Purple box - Key process */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-3">The Process</h4>
                  <div className="text-purple-700 text-sm space-y-2">
                    <p><strong>1. Identify:</strong> The hypotenuse is opposite the right angle</p>
                    <p><strong>2. Label:</strong> Call the hypotenuse c</p>
                    <p><strong>3. Substitute:</strong> Put values into a² + b² = c²</p>
                    <p><strong>4. Calculate:</strong> Square, then add</p>
                    <p><strong>5. Square root:</strong> Take √ to find c</p>
                  </div>
                </div>
                
                {/* Amber box - Misconceptions */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-3">Common Misconceptions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700 text-sm">
                    <li><strong>Adding:</strong> Writing a + b = c</li>
                    <li><strong>Forgetting √:</strong> Giving c² as the final answer</li>
                    <li><strong>Wrong side:</strong> Using formula when c is given</li>
                    <li><strong>Calculator:</strong> Typing √9+16 not √(9+16)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;