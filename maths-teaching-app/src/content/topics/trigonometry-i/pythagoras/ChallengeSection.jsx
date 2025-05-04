// src/content/topics/trigonometry-i/pythagoras/ChallengeSection.jsx
import React, { useState, useEffect } from 'react';
import ChallengeSectionBase from '../../../../components/sections/ChallengeSectionBase';
import JSXGraphBoard from '../../../../components/math/JSXGraphBoard';
import { Card, CardContent } from '../../../../components/common/Card';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';
import _ from 'lodash';

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for challenge section
  const theme = useSectionTheme('challenge');
  const { showAnswers } = useUI();
  
  // Challenge state
  const [challenge, setChallenge] = useState(null);

  // Generate a new challenge
  const generateChallenge = () => {
    const newChallenge = generateCoordinateDistanceChallenge();
    setChallenge(newChallenge);
  };

  // Generate challenge on initial render
  useEffect(() => {
    generateChallenge();
  }, []);

  // JSXGraph board update function
  const updateBoard = (board) => {
    if (!challenge) return;
    
    // Clear any existing elements
    board.suspendUpdate();
    board.objects = {};
    
    const { point1, point2 } = challenge;
    
    // Create points
    const p1 = board.create('point', point1, {
      name: 'A',
      fixed: true,
      color: '#e74c3c', // Red
      size: 4,
      label: { offset: [10, 10] }
    });
    
    const p2 = board.create('point', point2, {
      name: 'B',
      fixed: true,
      color: '#3498db', // Blue
      size: 4,
      label: { offset: [10, 10] }
    });
    
    // Create line between points
    const line = board.create('line', [p1, p2], {
      straightFirst: false,
      straightLast: false,
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
        label: { offset: [10, -10] }
      });
      
      // Create triangle sides
      const horizontalLine = board.create('line', [p1, rightAnglePoint], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#2ecc71', // Green
        strokeWidth: 2,
        dash: 2
      });
      
      const verticalLine = board.create('line', [rightAnglePoint, p2], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#2ecc71', // Green
        strokeWidth: 2,
        dash: 2
      });
      
      // Add right angle marker
      board.create('angle', [p2, rightAnglePoint, p1], {
        radius: 0.25,
        name: '90°',
        type: 'square',
        fill: '#2ecc71',
        fillOpacity: 0.4,
        label: { offset: [0, 0] }
      });
      
      // Add dimension labels
      const dx = Math.abs(point2[0] - point1[0]);
      const dy = Math.abs(point2[1] - point1[1]);
      
      board.create('text', [
        (point1[0] + point2[0]) / 2,
        point1[1] - 0.5,
        `a = ${dx.toFixed(1)} units`
      ], { 
        fontSize: 14,
        fixed: true
      });
      
      board.create('text', [
        point2[0] + 0.3,
        (point1[1] + point2[1]) / 2,
        `b = ${dy.toFixed(1)} units`
      ], { 
        fontSize: 14,
        fixed: true
      });
      
      if (challenge.distance) {
        board.create('text', [
          (point1[0] + point2[0]) / 2 - 0.5,
          (point1[1] + point2[1]) / 2 - 0.5,
          `d = ${challenge.distance} units`
        ], { 
          fontSize: 16,
          fixed: true,
          color: '#9b59b6' // Purple
        });
      }
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

                {/* Visualization */}
                <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '350px' }}>
                  <JSXGraphBoard
                    id="coordinate-challenge-board"
                    boundingBox={challenge.boundingBox}
                    axis={true}
                    grid={true}
                    height="300px"
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
                              <div dangerouslySetInnerHTML={{ __html: katex.renderToString(step.formula, { displayMode: true }) }} />
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
  // Function to generate varied points
  const generateVariedPoints = () => {
    // Generate points with a good spread
    const x1 = _.random(-5, 5);
    const y1 = _.random(-5, 5);
    
    // Generate offsets for second point
    const xOffset = _.random(2, 6) * (Math.random() < 0.5 ? 1 : -1);
    const yOffset = _.random(2, 6) * (Math.random() < 0.5 ? 1 : -1);
    
    // Calculate second point coordinates
    const x2 = x1 + xOffset;
    const y2 = y1 + yOffset;
    
    return [[x1, y1], [x2, y2]];
  };
  
  // Generate points
  const [point1, point2] = generateVariedPoints();
  
  // Calculate horizontal and vertical differences
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  
  // Calculate distance using Pythagoras' theorem
  const exactDistance = Math.sqrt(dx * dx + dy * dy);
  const distance = Math.round(exactDistance * 100) / 100; // Round to 2 decimal places
  
  // Calculate bounding box with padding
  const padding = 2;
  const xMin = Math.min(point1[0], point2[0]) - padding;
  const xMax = Math.max(point1[0], point2[0]) + padding;
  const yMin = Math.min(point1[1], point2[1]) - padding;
  const yMax = Math.max(point1[1], point2[1]) + padding;
  
  // Generate problem
  return {
    point1,
    point2,
    dx,
    dy,
    distance,
    exactDistance,
    boundingBox: [xMin, yMax, xMax, yMin], // JSXGraph format: [xmin, ymax, xmax, ymin]
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