// src/content/topics/trigonometry-i/sohcahtoa2/ChallengeSection.jsx
import React, { useState, useEffect } from 'react';
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
    const newChallenge = generateStackedTrianglesChallenge();
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
    
    const { triangles, targetLine } = challenge;
    
    // Create all triangles
    triangles.forEach((triangle, index) => {
      // Create the triangle points
      const points = [];
      
      triangle.points.forEach((point, pointIndex) => {
        const p = board.create('point', point, {
          name: triangle.labels[pointIndex] || '',
          fixed: true,
          color: triangle.color || '#3498db',
          size: 4,
          label: { 
            offset: [5, 5],
            fontSize: 16,
            color: triangle.color || '#3498db'
          }
        });
        points.push(p);
      });
      
      // Create the triangle
      const poly = board.create('polygon', points, {
        borders: {
          strokeWidth: 2,
          strokeColor: triangle.color || '#3498db'
        },
        fillColor: triangle.color || '#3498db',
        fillOpacity: 0.1,
        hasInnerPoints: false
      });
      
      // Add right angle marker if specified
      if (triangle.rightAngleIndex !== undefined && triangle.rightAngleIndex !== null) {
        // Figure out the points for the right angle
        const rightAnglePoint = points[triangle.rightAngleIndex];
        const prevPoint = points[(triangle.rightAngleIndex - 1 + points.length) % points.length];
        const nextPoint = points[(triangle.rightAngleIndex + 1) % points.length];
        
        // Create right angle marker
        board.create('angle', [prevPoint, rightAnglePoint, nextPoint], {
          radius: 0.3,
          name: '90°',
          type: 'square',
          fillColor: triangle.color || '#3498db',
          fillOpacity: 0.2,
          strokeColor: triangle.color || '#3498db',
          label: { offset: [0, 0] }
        });
      }
      
      // Add side measurements if available
      if (triangle.sideLengths) {
        triangle.sideLengths.forEach((length, sideIndex) => {
          if (!length) return; // Skip if no length provided
          
          // Calculate midpoint of the side for label placement
          const p1 = points[sideIndex];
          const p2 = points[(sideIndex + 1) % points.length];
          
          const midX = (p1.X() + p2.X()) / 2;
          const midY = (p1.Y() + p2.Y()) / 2;
          
          // Add label with offset from the side
          // Calculate normal vector for offset
          const dx = p2.X() - p1.X();
          const dy = p2.Y() - p1.Y();
          const len = Math.sqrt(dx*dx + dy*dy);
          const nx = -dy / len * 0.3; // Normal vector * offset distance
          const ny = dx / len * 0.3;
          
          board.create('text', [midX + nx, midY + ny, `${length}`], {
            fontSize: 14,
            color: triangle.color || '#3498db',
            fixed: true
          });
        });
      }
    });
    
    // Draw the target line with "?" distance if not showing answers
    if (targetLine) {
      const startPoint = board.create('point', targetLine[0], {
        visible: false,
        fixed: true
      });
      
      const endPoint = board.create('point', targetLine[1], {
        visible: false,
        fixed: true
      });
      
      // Create dashed line for the target
      const line = board.create('line', [startPoint, endPoint], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#e74c3c', // Red
        strokeWidth: 2,
        dash: 2
      });
      
      // Show the distance as "?" or the actual value depending on showAnswers
      const midX = (targetLine[0][0] + targetLine[1][0]) / 2;
      const midY = (targetLine[0][1] + targetLine[1][1]) / 2;
      
      board.create('text', [midX, midY - 0.3], showAnswers ? `${challenge.targetDistance}` : '?', {
        fontSize: 16,
        color: '#e74c3c',
        fixed: true,
        fontWeight: 'bold'
      });
    }
    
    board.unsuspendUpdate();
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-red-500 rounded-lg shadow-md bg-white overflow-hidden">
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Stacked Triangles Challenge
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
                <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '400px' }}>
                  <JSXGraphBoard
                    id="stacked-triangles-board"
                    boundingBox={challenge.boundingBox}
                    axis={true}
                    grid={false}
                    height="350px"
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

// Function to generate a stacked triangles challenge
const generateStackedTrianglesChallenge = () => {
  // Choose one of three challenge types randomly
  const challengeType = _.sample(['adjacent', 'stacked', 'overlapping']);
  
  let triangles, targetLine, targetDistance, problemText, solution;
  
  if (challengeType === 'adjacent') {
    // Generate two adjacent triangles with shared side
    const base = _.random(3, 6);
    const height1 = _.random(2, 5);
    const height2 = _.random(2, 5);
    
    triangles = [
      {
        points: [[0, 0], [base, 0], [0, height1]],
        labels: ['A', 'B', 'C'],
        color: '#3498db', // Blue
        rightAngleIndex: 0,
        sideLengths: [
          `${base} units`, // AB
          null, // BC
          `${height1} units` // CA
        ]
      },
      {
        points: [[0, 0], [0, -height2], [base, 0]],
        labels: ['A', 'D', 'B'],
        color: '#2ecc71', // Green
        rightAngleIndex: 0,
        sideLengths: [
          `${height2} units`, // AD
          null, // DB
          null  // BA
        ]
      }
    ];
    
    targetLine = [[0, height1], [0, -height2]];
    targetDistance = height1 + height2;
    
    problemText = `In the diagram, triangle ABC and triangle ABD are right-angled triangles with right angles at A. 
                  AB = ${base} units, AC = ${height1} units, and AD = ${height2} units. Find the distance from C to D.`;
    
    solution = [
      {
        explanation: "Looking at the diagram, we can see that C is directly above A, and D is directly below A.",
        formula: null
      },
      {
        explanation: "Since A is at the origin (0, 0), and C is at coordinates (0, " + height1 + "), the y-coordinate of C is " + height1 + ".",
        formula: null
      },
      {
        explanation: "Similarly, D is at coordinates (0, -" + height2 + "), so its y-coordinate is -" + height2 + ".",
        formula: null
      },
      {
        explanation: "Since C and D are on the same vertical line, the distance between them is simply the difference in their y-coordinates.",
        formula: "CD = |y_C - y_D| = |" + height1 + " - (-" + height2 + ")| = " + height1 + " + " + height2 + " = " + targetDistance
      }
    ];
  }
  else if (challengeType === 'stacked') {
    // Stacked triangles with a common side
    const base = _.random(4, 7);
    const height1 = _.random(3, 5);
    
    // Calculate hypotenuse
    const hypotenuse = Math.sqrt(base * base + height1 * height1);
    const roundedHypotenuse = Math.round(hypotenuse * 10) / 10;
    
    // Create a second triangle that shares the hypotenuse
    const height2 = _.random(3, 5);
    const horizontalOffset = Math.sqrt(hypotenuse * hypotenuse - height2 * height2);
    const roundedOffset = Math.round(horizontalOffset * 10) / 10;
    
    triangles = [
      {
        points: [[0, 0], [base, 0], [0, height1]],
        labels: ['A', 'B', 'C'],
        color: '#3498db', // Blue
        rightAngleIndex: 0,
        sideLengths: [
          `${base} units`, // AB
          `${roundedHypotenuse} units`, // BC
          `${height1} units` // CA
        ]
      },
      {
        points: [[0, height1], [base, 0], [base + roundedOffset, height1 - height2]],
        labels: ['C', 'B', 'D'],
        color: '#2ecc71', // Green
        sideLengths: [
          `${roundedHypotenuse} units`, // CB
          null, // BD
          null  // DC
        ]
      }
    ];
    
    targetLine = [[0, 0], [base + roundedOffset, height1 - height2]];
    targetDistance = Math.sqrt(Math.pow(base + roundedOffset, 2) + Math.pow(height1 - height2, 2));
    const roundedDistance = Math.round(targetDistance * 10) / 10;
    
    problemText = `Triangle ABC is right-angled at A. Triangle CBD shares side CB with the first triangle. 
                  If AB = ${base} units, AC = ${height1} units, and the angle CBD is such that point D is at 
                  coordinates (${base + roundedOffset}, ${height1 - height2}), find the distance from A to D.`;
    
    solution = [
      {
        explanation: "We need to find the distance between points A(0, 0) and D(" + (base + roundedOffset) + ", " + (height1 - height2) + ").",
        formula: "d = \\sqrt{(x_D - x_A)^2 + (y_D - y_A)^2}"
      },
      {
        explanation: "Substituting the coordinates:",
        formula: "d = \\sqrt{(" + (base + roundedOffset) + " - 0)^2 + (" + (height1 - height2) + " - 0)^2}"
      },
      {
        explanation: "Simplifying:",
        formula: "d = \\sqrt{" + (base + roundedOffset) + "^2 + " + (height1 - height2) + "^2}"
      },
      {
        explanation: "Calculating:",
        formula: "d = \\sqrt{" + Math.pow(base + roundedOffset, 2) + " + " + Math.pow(height1 - height2, 2) + "} = " + roundedDistance + "\\text{ units}"
      }
    ];
  }
  else if (challengeType === 'overlapping') {
    // Create two triangles where one is partially inside the other
    const base1 = _.random(5, 8);
    const height1 = _.random(3, 6);
    const base2 = _.random(3, 5);
    const height2 = _.random(2, 4);
    const offset = _.random(1, base1 - base2 - 1); // Ensure triangle 2 is inside triangle 1
    
    triangles = [
      {
        points: [[0, 0], [base1, 0], [0, height1]],
        labels: ['A', 'B', 'C'],
        color: '#3498db', // Blue
        rightAngleIndex: 0,
        sideLengths: [
          `${base1} units`, // AB
          null, // BC
          `${height1} units` // CA
        ]
      },
      {
        points: [[offset, 0], [offset + base2, 0], [offset, height2]],
        labels: ['D', 'E', 'F'],
        color: '#2ecc71', // Green
        rightAngleIndex: 0,
        sideLengths: [
          `${base2} units`, // DE
          null, // EF
          `${height2} units` // FD
        ]
      }
    ];
    
    targetLine = [[0, height1], [offset, height2]];
    targetDistance = Math.sqrt(Math.pow(offset, 2) + Math.pow(height1 - height2, 2));
    const roundedDistance = Math.round(targetDistance * 10) / 10;
    
    problemText = `Triangle ABC is right-angled at A. Triangle DEF is right-angled at D, with D at position (${offset}, 0).
                  If AB = ${base1} units, AC = ${height1} units, DE = ${base2} units, and DF = ${height2} units, 
                  find the distance from C to F.`;
    
    solution = [
      {
        explanation: "We need to find the distance between C(0, " + height1 + ") and F(" + offset + ", " + height2 + ").",
        formula: "d = \\sqrt{(x_F - x_C)^2 + (y_F - y_C)^2}"
      },
      {
        explanation: "Substituting the coordinates:",
        formula: "d = \\sqrt{(" + offset + " - 0)^2 + (" + height2 + " - " + height1 + ")^2}"
      },
      {
        explanation: "Simplifying:",
        formula: "d = \\sqrt{" + offset + "^2 + (" + height2 + " - " + height1 + ")^2}"
      },
      {
        explanation: "Calculating:",
        formula: "d = \\sqrt{" + (offset * offset) + " + " + Math.pow(height2 - height1, 2) + "} = " + roundedDistance + "\\text{ units}"
      }
    ];
  }
  
  // Calculate bounding box
  const allPoints = triangles.flatMap(t => t.points);
  const xValues = allPoints.map(p => p[0]);
  const yValues = allPoints.map(p => p[1]);
  
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  
  // Add padding
  const padding = 2;
  const boundingBox = [minX - padding, maxY + padding, maxX + padding, minY - padding];
  
  return {
    triangles,
    targetLine,
    targetDistance,
    problemText,
    solution,
    boundingBox,
    challengeType
  };
};

export default ChallengeSection;