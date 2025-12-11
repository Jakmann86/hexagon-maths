// src/content/topics/trigonometry-i/pythagoras/ChallengeSection.jsx
// Pythagoras Challenge Section - Red theme
// Coordinate geometry challenge - preserves original content

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { RefreshCw } from 'lucide-react';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import CoordinateGrid from '../../../../components/math/CoordinateGrid';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  const theme = useSectionTheme('challenge');
  const { showAnswers } = useUI();

  // State for challenge
  const [challenge, setChallenge] = useState(null);
  const [visualizationKey, setVisualizationKey] = useState(Date.now());

  // Generate challenge on mount
  useEffect(() => {
    generateChallenge();
  }, []);

  // Generate new challenge
  const generateChallenge = () => {
    const newChallenge = pythagorasGenerators.generateCoordinateChallenge();
    setChallenge(newChallenge);
    setVisualizationKey(Date.now());
  };

  // Customize the coordinate grid for Pythagoras
  const customizePythagorasGrid = (board, jsxPoints) => {
    if (!board || !jsxPoints || jsxPoints.length < 2 || !challenge) return;

    const p1 = jsxPoints[0];
    const p2 = jsxPoints[1];
    const { dx, dy, distance } = challenge;

    // Create right angle point
    const rightAnglePoint = board.create('point', [p2.X(), p1.Y()], {
      name: '',
      size: 4,
      fixed: true,
      strokeColor: '#2ecc71',
      fillColor: '#2ecc71',
      withLabel: false,
      visible: false
    });

    // Create right triangle legs (dashed)
    board.create('segment', [p1, rightAnglePoint], {
      strokeColor: '#2ecc71',
      strokeWidth: 2,
      dash: 2,
      fixed: true
    });

    board.create('segment', [rightAnglePoint, p2], {
      strokeColor: '#2ecc71',
      strokeWidth: 2,
      dash: 2,
      fixed: true
    });

    // Add right angle marker
    board.create('angle', [p2, rightAnglePoint, p1], {
      radius: 0.3,
      type: 'square',
      fillColor: '#2ecc71',
      fillOpacity: 0.3,
      name: '',
      withLabel: false
    });

    // Add length labels
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Horizontal leg label
    board.create('text', [
      (p1.X() + rightAnglePoint.X()) / 2,
      p1.Y() - 0.5,
      `${absX}`
    ], {
      fontSize: 14,
      color: '#2ecc71',
      fixed: true
    });

    // Vertical leg label
    board.create('text', [
      rightAnglePoint.X() + 0.5,
      (rightAnglePoint.Y() + p2.Y()) / 2,
      `${absY}`
    ], {
      fontSize: 14,
      color: '#2ecc71',
      fixed: true
    });

    // Hypotenuse label (distance)
    board.create('text', [
      (p1.X() + p2.X()) / 2 + 0.3,
      (p1.Y() + p2.Y()) / 2 + 0.3,
      `${distance}`
    ], {
      fontSize: 14,
      color: '#9b59b6',
      fixed: true
    });
  };

  // Render visualization
  const renderVisualization = () => {
    if (!challenge) return null;

    const onBoardCreated = showAnswers 
      ? (board, jsxPoints) => customizePythagorasGrid(board, jsxPoints)
      : null;

    return (
      <CoordinateGrid
        {...challenge.visualizationConfig}
        sectionType="challenge"
        containerHeight={420}
        onBoardCreated={onBoardCreated}
        key={visualizationKey}
      />
    );
  };

  // Loading state
  if (!challenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-red-500 animate-spin mb-2" />
          <p className="text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-red-500 rounded-lg shadow-md bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Challenge Problem</h2>
              <p className="text-red-100 text-sm">Apply Pythagoras to coordinate geometry</p>
            </div>
            <button
              onClick={generateChallenge}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              <span>New Challenge</span>
            </button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                <p className="text-lg text-gray-800">
                  {challenge.questionText}
                </p>
              </div>

              {/* Coordinate Grid Visualization */}
              <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '460px' }}>
                {renderVisualization()}
              </div>

              {/* Solution - only visible when showAnswers is true */}
              {showAnswers && challenge.solution && (
                <div className="p-5 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-4">Solution:</h4>
                  <div className="space-y-3">
                    {challenge.solution.map((step, index) => (
                      <div key={index} className="mb-3">
                        <p className="text-gray-700">{step.explanation}</p>
                        {step.formula && (
                          <div className="mt-2 text-center bg-white p-2 rounded-md">
                            <MathDisplay math={step.formula} displayMode={true} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Notes */}
        {showAnswers && (
          <div className="px-6 pb-6">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teaching Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Key Points</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                    <li>The distance formula IS Pythagoras' theorem</li>
                    <li>Draw the right triangle on the grid</li>
                    <li>Horizontal distance = |x₂ - x₁|</li>
                    <li>Vertical distance = |y₂ - y₁|</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Extension</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                    <li>What if the line was horizontal/vertical?</li>
                    <li>Can you find the midpoint too?</li>
                    <li>How does this link to the formula sheet?</li>
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

export default ChallengeSection;