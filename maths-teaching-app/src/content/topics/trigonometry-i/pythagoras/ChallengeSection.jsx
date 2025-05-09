// maths-teaching-app/src/content/topics/trigonometry-i/pythagoras/ChallengeSection.jsx
import React, { useState, useEffect } from 'react';
import JSXGraphBoard from '../../../../components/math/JSXGraphBoard';
import { Card, CardContent } from '../../../../components/common/Card';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';
import _ from 'lodash';
import MathDisplay from '../../../../components/common/MathDisplay';

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for challenge section
  const theme = useSectionTheme('challenge');
  const { showAnswers } = useUI();
  
  // Challenge state
  const [challenge, setChallenge] = useState(null);
  // Track board refresh ID to force complete rerender when needed
  const [boardId, setBoardId] = useState(`coordinate-challenge-${Math.random().toString(36).substr(2, 9)}`);

  // Generate a new challenge
  const generateChallenge = () => {
    const newChallenge = generateCoordinateDistanceChallenge();
    setChallenge(newChallenge);
    // Create a new board ID to force a complete redraw
    setBoardId(`coordinate-challenge-${Math.random().toString(36).substr(2, 9)}`);
  };

  // Generate challenge on initial render
  useEffect(() => {
    generateChallenge();
  }, []);

  // JSXGraph board update function
  const updateBoard = (board) => {
    if (!challenge) return;
    
    board.suspendUpdate();
    
    try {
      // Clear any existing objects
      Object.keys(board.objects).forEach(id => {
        const obj = board.objects[id];
        // Keep the axes but remove other objects
        if (obj && obj.elType !== 'axis' && obj.elType !== 'ticks') {
          try {
            board.removeObject(obj);
          } catch (e) {
            // Ignore errors
          }
        }
      });
      
      const { point1, point2 } = challenge;
      
      // Create points
      const p1 = board.create('point', point1, {
        name: 'A',
        fixed: true,
        color: '#e74c3c', // Red
        size: 4,
        withLabel: true
      });
      
      const p2 = board.create('point', point2, {
        name: 'B',
        fixed: true,
        color: '#3498db', // Blue
        size: 4,
        withLabel: true
      });
      
      // Create line between points
      board.create('segment', [p1, p2], {
        strokeColor: '#9b59b6', // Purple
        strokeWidth: 2
      });
      
      // If showing answers, add the right triangle construction
      if (showAnswers) {
        // Create right angle point
        const rightAnglePoint = board.create('point', [point2[0], point1[1]], {
          name: 'C',
          fixed: true,
          color: '#2ecc71', // Green
          size: 4,
          withLabel: true
        });
        
        // Create horizontal and vertical lines
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
          radius: 0.25,
          name: '90°',
          type: 'square',
          fillColor: '#2ecc71',
          fillOpacity: 0.4
        });
        
        // Add distance label
        board.create('text', [
          (point1[0] + point2[0]) / 2 - 0.5,
          (point1[1] + point2[1]) / 2 - 0.5,
          `d = ${challenge.distance}`
        ], {
          fontSize: 16,
          fixed: true,
          color: '#9b59b6'
        });
      }
    } catch (error) {
      console.error("Error updating JSXGraph board:", error);
    }
    
    board.unsuspendUpdate();
  };

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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
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

                {/* Visualization with built-in grid */}
                <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '350px' }}>
                  <JSXGraphBoard
                    id={boardId}
                    boundingBox={[-6, 6, 6, -6]}
                    axis={true}  // Use JSXGraph's built-in axes
                    grid={true}  // Use JSXGraph's built-in grid
                    height={300}
                    backgroundColor="#f9f9f9"
                    onUpdate={updateBoard}
                    dependencies={[challenge, showAnswers]}
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

// Function to generate a coordinate distance challenge
const generateCoordinateDistanceChallenge = () => {
  // Generate points within fixed -6 to 6 range
  const generatePointsOnGrid = () => {
    const min = -5;  // Leaving 1 unit buffer from edge
    const max = 5;
    
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
    exactDistance,
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