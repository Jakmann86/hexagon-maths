// src/content/topics/trigonometry-i/pythagoras/ChallengeSection.jsx
// Pythagoras Challenge Section - V3.0
// Small refresh button in visualization corner (like Examples/Diagnostic)

import React, { useState, useMemo } from 'react';
import { RefreshCw, Trophy } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import CoordinateGridSVG from '../../../../components/math/visualizations/CoordinateGridSVG';
import pythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

// ============================================================
// MAIN COMPONENT
// ============================================================

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const [regenerateKey, setRegenerateKey] = useState(0);

  // Generate challenge question
  const challenge = useMemo(() => {
    return pythagorasGenerators.generateCoordinateChallenge();
  }, [regenerateKey]);

  const handleRegenerate = () => {
    setRegenerateKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-red-500 rounded-xl bg-white shadow-md overflow-hidden">
        
        {/* Header with Trophy icon */}
        <div className="bg-red-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Trophy Icon */}
              <div className="bg-yellow-400 p-2 rounded-lg">
                <Trophy size={24} className="text-yellow-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Challenge: Coordinate Distance</h2>
                <p className="text-red-100 text-sm">Apply Pythagoras' Theorem to coordinate geometry</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Question */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
            <h4 className="text-red-800 font-semibold mb-2">Problem</h4>
            <p className="text-gray-800 text-lg">{challenge.questionText}</p>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coordinate Grid with refresh button in corner */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center relative" style={{ minHeight: '400px' }}>
              {/* Small refresh button in top right corner */}
              <button
                onClick={handleRegenerate}
                className="absolute top-3 right-3 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200 transition-colors z-10"
                title="New challenge"
              >
                <RefreshCw size={16} className="text-gray-600" />
              </button>
              <CoordinateGridSVG 
                config={{
                  ...challenge.visualization,
                  showRightTriangle: showAnswers
                }}
                showAnswer={showAnswers}
              />
            </div>

            {/* Blank working space */}
            <div 
              className="bg-white rounded-xl border-2 border-dashed border-gray-300" 
              style={{ minHeight: '400px' }}
            />
          </div>

          {/* Solution Steps */}
          {showAnswers && challenge.solution && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-700">Solution</h4>
              <div className="space-y-2">
                {challenge.solution.map((step, i) => (
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
                  <MathDisplay math={challenge.answer} displayMode={false} />
                </div>
              </div>
            </div>
          )}

          {/* Teaching Notes */}
          {showAnswers && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teaching Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Key Insight</h4>
                  <p className="text-sm text-green-700">
                    The distance formula IS Pythagoras' Theorem! The horizontal and vertical 
                    distances form the two shorter sides of a right triangle, with the 
                    distance between points being the hypotenuse.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Discussion Points</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Why draw a right triangle?</li>
                    <li>• What are the "legs" of this triangle?</li>
                    <li>• When might we need this in real life?</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Extension</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• What if one point was at the origin?</li>
                    <li>• Can you find the midpoint too?</li>
                    <li>• 3D distance: add z² to the formula</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">Common Errors</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Subtracting coordinates in wrong order (negatives)</li>
                    <li>• Forgetting to square the differences</li>
                    <li>• Adding coordinates instead of subtracting</li>
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

export default ChallengeSection;