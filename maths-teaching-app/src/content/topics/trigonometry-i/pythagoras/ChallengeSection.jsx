// src/content/topics/trigonometry-i/pythagoras/ChallengeSection.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { RefreshCw } from 'lucide-react';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import CoordinateGrid from '../../../../components/math/CoordinateGrid';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for challenge section
  const theme = useSectionTheme('challenge');
  const { showAnswers } = useUI();

  // State for challenge questions and current index
  const [challenges, setChallenges] = useState([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [visualizationKey, setVisualizationKey] = useState(Date.now());

  // Generate challenges on mount
  useEffect(() => {
    generateChallenges();
  }, []);

  // Function to generate new challenges
  const generateChallenges = () => {
    const newChallenges = PythagorasGenerators.generateChallengeQuestions();
    setChallenges(newChallenges);
    setVisualizationKey(Date.now()); // Force visualization to re-render
  };

  // Customize the coordinate grid for Pythagoras visualizations
  const customizePythagorasGrid = (board, jsxPoints, challenge) => {
    if (!board || !jsxPoints || jsxPoints.length < 2) return;

    const p1 = jsxPoints[0];
    const p2 = jsxPoints[1];
    const { dx, dy, distance } = challenge;

    // Create right angle point
    const rightAnglePoint = board.create('point', [p2.X(), p1.Y()], {
      name: '', // Remove 'C' label
      size: 4,
      fixed: true,
      strokeColor: '#2ecc71', // Green
      fillColor: '#2ecc71',
      withLabel: false, // Ensure no label is shown
      visible: false // Keep this point hidden
    });

    // Create right triangle legs
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
      name: '', // Remove "90°" label
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
      color: '#9b59b6', // Purple
      fixed: true
    });
  };

  // Render function for the challenge
  const renderVisualization = (challenge) => {
    if (!challenge) return null;

    // Extract the visualization config from the challenge
    const { visualizationConfig } = challenge;

    // Prepare the callback for Pythagoras-specific customization
    const onBoardCreated = showAnswers ?
      (board, jsxPoints) => customizePythagorasGrid(board, jsxPoints, challenge) :
      null;

    return (
      <CoordinateGrid
        {...visualizationConfig}
        sectionType="challenge"
        containerHeight={350}
        onBoardCreated={onBoardCreated}
        key={visualizationKey}
      />
    );
  };

  // Get the current challenge
  const currentChallenge = challenges[currentChallengeIndex] || null;

  // Handle generating a new challenge
  const handleNewChallenge = () => {
    generateChallenges();
    setCurrentChallengeIndex(0);
  };

  // If no challenges available yet, show loading
  if (!currentChallenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex justify-center items-center mb-4">
            <RefreshCw className="w-6 h-6 text-red-500 animate-spin" />
          </div>
          <div className="text-gray-600">Loading challenge problems...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-red-500 rounded-lg shadow-md bg-white overflow-hidden">
        {/* Header with title and new challenge button */}
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {currentChallenge.title || "Coordinate Geometry Challenge"}
            </h3>

            <div className="flex items-center gap-2">
              {/* Challenge navigation */}
              {challenges.length > 1 && (
                <div className="flex gap-2 mr-4">
                  {challenges.map((_, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${index === currentChallengeIndex
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      onClick={() => setCurrentChallengeIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* New challenge button */}
              <button
                onClick={handleNewChallenge}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
              >
                <RefreshCw size={18} />
                <span>New Challenge</span>
              </button>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="bg-red-50 p-5 rounded-lg mb-6">
                <div className="text-lg text-gray-800">
                  {currentChallenge.questionText}
                </div>
              </div>

              {/* Coordinate Grid Visualization */}
              <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '400px' }}>
                {renderVisualization(currentChallenge)}
              </div>

              {/* Solution Steps - only visible when showAnswers is true */}
              {showAnswers && currentChallenge.solution && (
                <div className="p-5 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-4">Solution:</h4>
                  <div className="space-y-3">
                    {currentChallenge.solution.map((step, index) => (
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
      </div>
    </div>
  );
};

export default ChallengeSection;