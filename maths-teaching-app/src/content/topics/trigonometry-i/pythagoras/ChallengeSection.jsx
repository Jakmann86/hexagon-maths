// src/content/topics/trigonometry-i/sohcahtoa1/ChallengeSection.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import { RefreshCw } from 'lucide-react';

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for challenge section
  const theme = useSectionTheme('challenge');
  const { showAnswers } = useUI();
  
  // Challenge state
  const [challenge, setChallenge] = useState(null);
  const [boardKey, setBoardKey] = useState(Date.now()); // For forcing re-renders

  // Generate a new challenge
  const generateChallenge = () => {
    const newChallenge = generateSimpleCoordinateChallenge();
    setChallenge(newChallenge);
    setBoardKey(Date.now()); // Force board recreation
  };

  // Generate challenge on initial render
  useEffect(() => {
    generateChallenge();
  }, []);

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-red-500 rounded-lg shadow-md bg-white overflow-hidden">
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Coordinate Geometry Challenge
            </h3>
            
            <button
              onClick={generateChallenge}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
            >
              <RefreshCw size={18} />
              <span>New Challenge</span>
            </button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {challenge && (
              <div className="space-y-6">
                {/* Problem Statement */}
                <div className="bg-red-50 p-5 rounded-lg mb-6">
                  <div className="text-lg text-gray-800">
                    {challenge.problemText}
                  </div>
                </div>

                {/* Coordinate Grid Visualization */}
                <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '400px' }}>
                  <CoordinateGrid 
                    key={boardKey}
                    point1={challenge.point1}
                    point2={challenge.point2}
                    showSolution={showAnswers}
                    distance={challenge.distance}
                  />
                </div>

                {/* Solution Steps - only visible when showAnswers is true */}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple coordinate grid component with complete board recreation on each render
const CoordinateGrid = ({ point1, point2, showSolution, distance }) => {
  const boardId = `coord-grid-${Math.random().toString(36).substring(2, 9)}`;
  
  // Initialize the board when the component mounts
  useEffect(() => {
    // Create the board
    const board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: [-6, 6, 6, -6],
      axis: true,
      grid: true,
      showCopyright: false,
      showNavigation: false,
      // Disable panning and zooming for more stability
      pan: { enabled: false },
      zoom: { enabled: false }
    });

    // Create points
    const p1 = board.create('point', point1, {
      name: 'A',
      withLabel: true,
      fixed: true,
      size: 4,
      color: '#e74c3c', // Red
      label: { offset: [10, 10] }
    });

    const p2 = board.create('point', point2, {
      name: 'B',
      withLabel: true,
      fixed: true,
      size: 4,
      color: '#3498db', // Blue
      label: { offset: [10, 10] }
    });

    // Create line segment between points
    board.create('segment', [p1, p2], {
      strokeColor: '#9b59b6', // Purple
      strokeWidth: 2
    });

    // Add right triangle construction if solution should be shown
    if (showSolution) {
      // Create right angle point
      const rightAnglePoint = board.create('point', [point2[0], point1[1]], {
        name: 'C',
        fixed: true,
        size: 4,
        color: '#2ecc71', // Green
        label: { offset: [10, 10] }
      });

      // Create horizontal and vertical legs
      board.create('segment', [p1, rightAnglePoint], {
        strokeColor: '#2ecc71', // Green
        strokeWidth: 2,
        dash: 2
      });

      board.create('segment', [rightAnglePoint, p2], {
        strokeColor: '#2ecc71', // Green
        strokeWidth: 2,
        dash: 2
      });

      // Add right angle marker
      board.create('angle', [p2, rightAnglePoint, p1], {
        radius: 0.3,
        type: 'square',
        fillColor: '#2ecc71',
        fillOpacity: 0.4,
        name: '90°'
      });

      // Add distance label
      const midX = (point1[0] + point2[0]) / 2;
      const midY = (point1[1] + point2[1]) / 2;
      board.create('text', [midX + 0.5, midY + 0.5, `d = ${distance}`], {
        fontSize: 16,
        color: '#9b59b6' // Purple
      });
    }

    // Clean up when the component unmounts
    return () => {
      JXG.JSXGraph.freeBoard(board);
    };
  }, [boardId]); // boardId changes on every render due to the random ID

  return (
    <div 
      id={boardId} 
      style={{ 
        width: '100%', 
        height: '350px',
        background: '#f9f9f9', // Light background for better visibility
        border: '1px solid #eee',
        borderRadius: '4px'
      }}
    />
  );
};

// Function to generate a coordinate distance challenge
const generateSimpleCoordinateChallenge = () => {
  // Generate points within fixed -4 to 4 range for readability
  const generatePointsOnGrid = () => {
    const min = -4;
    const max = 4;
    
    const x1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const y1 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Ensure second point is sufficiently separated but still on grid
    let x2, y2;
    do {
      x2 = Math.floor(Math.random() * (max - min + 1)) + min;
      y2 = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (Math.abs(x2 - x1) < 2 || Math.abs(y2 - y1) < 2);
    
    return [[x1, y1], [x2, y2]];
  };
  
  // Generate points
  const [point1, point2] = generatePointsOnGrid();
  
  // Calculate horizontal and vertical differences
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  
  // Calculate distance using Pythagoras' theorem
  const exactDistance = Math.sqrt(dx * dx + dy * dy);
  const distance = Math.round(exactDistance * 100) / 100; // Round to 2 decimal places
  
  // Generate problem
  return {
    point1,
    point2,
    dx,
    dy,
    distance,
    problemText: `Find the distance between the points A(${point1[0]}, ${point1[1]}) and B(${point2[0]}, ${point2[1]}) on the coordinate plane.`,
    solution: [
      {
        explanation: "To find the distance between two points, we use the distance formula, which is derived from the Pythagorean theorem.",
        formula: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}"
      },
      {
        explanation: "Substitute the coordinates of points A and B:",
        formula: `d = \\sqrt{(${point2[0]} - ${point1[0]})^2 + (${point2[1]} - ${point1[1]})^2}`
      },
      {
        explanation: "Calculate the differences:",
        formula: `d = \\sqrt{(${dx})^2 + (${dy})^2}`
      },
      {
        explanation: "Square the differences:",
        formula: `d = \\sqrt{${dx * dx} + ${dy * dy}}`
      },
      {
        explanation: "Add the squares:",
        formula: `d = \\sqrt{${dx * dx + dy * dy}}`
      },
      {
        explanation: "Take the square root to find the distance:",
        formula: `d = ${distance}`
      }
    ]
  };
};

export default ChallengeSection;