// src/content/topics/trigonometry-i/sohcahtoa1/ChallengeSection.jsx
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

  // Generate a new challenge
  const generateChallenge = () => {
    const newChallenge = generateBearingsChallenge();
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
    
    try {
      // Store objects to prevent memory leaks and render issues
      const objects = [];
      
      const { start, bearing, distance, secondBearing, secondDistance, directDistance } = challenge;
      
      // Create starting point
      const startPoint = board.create('point', start, {
        name: 'Start',
        fixed: true,
        color: '#e74c3c', // Red
        size: 5,
        label: { offset: [10, 10] }
      });
      objects.push(startPoint);
      
      // Create north line
      const northEnd = [start[0], start[1] + 3];
      const northLine = board.create('line', [start, northEnd], {
        straightFirst: false,
        straightLast: false,
        strokeColor: '#3498db', // Blue
        strokeWidth: 2,
        dash: 1
      });
      objects.push(northLine);
      
      // Create North label CORRECTLY using array notation
      const northText = board.create('text', [start[0], start[1] + 3.3, 'N'], {
        fontSize: 16,
        fixed: true,
        color: '#3498db'
      });
      objects.push(northText);
      
      // Calculate first journey endpoint
      const bearingRadians = (450 - bearing) % 360 * Math.PI / 180;
      const midPoint = [
        start[0] + distance * Math.cos(bearingRadians),
        start[1] + distance * Math.sin(bearingRadians)
      ];
      
      // Create midpoint
      const midPointObj = board.create('point', midPoint, {
        name: 'Mid',
        fixed: true,
        color: secondBearing ? '#9b59b6' : '#f1c40f', // Purple if there's a second leg, otherwise yellow
        size: 5,
        label: { offset: [10, 10] },
        visible: true
      });
      objects.push(midPointObj);
      
      // Create first leg line
      const firstLeg = board.create('segment', [startPoint, midPointObj], {
        strokeColor: '#2ecc71', // Green
        strokeWidth: 3
      });
      objects.push(firstLeg);
      
      // Add first bearing angle marker
      // Create angle points correctly
      const northPoint = board.create('point', northEnd, { visible: false });
      objects.push(northPoint);
      
      const angleSector = board.create('angle', [northPoint, startPoint, midPointObj], {
        radius: 1.5,
        name: `${bearing}°`,
        type: 'sector',
        fill: '#f39c12',
        fillOpacity: 0.4,
        label: { position: 'inside' }
      });
      objects.push(angleSector);
      
      // Final point is either midpoint (single leg) or calculated from second leg
      let finalPoint = [...midPoint];
      let endPointObj;
      
      // Add second leg if needed
      if (secondBearing && secondDistance) {
        const secondBearingRadians = (450 - secondBearing) % 360 * Math.PI / 180;
        finalPoint = [
          midPoint[0] + secondDistance * Math.cos(secondBearingRadians),
          midPoint[1] + secondDistance * Math.sin(secondBearingRadians)
        ];
        
        // Create endpoint
        endPointObj = board.create('point', finalPoint, {
          name: 'End',
          fixed: true,
          color: '#f1c40f', // Yellow
          size: 5,
          label: { offset: [10, 10] }
        });
        objects.push(endPointObj);
        
        // Create second leg line
        const secondLeg = board.create('segment', [midPointObj, endPointObj], {
          strokeColor: '#2ecc71', // Green
          strokeWidth: 3
        });
        objects.push(secondLeg);
        
        // Draw direct path as dashed line
        const directLine = board.create('segment', [startPoint, endPointObj], {
          strokeColor: '#e74c3c', // Red
          strokeWidth: 2,
          dash: 2
        });
        objects.push(directLine);
        
        // If showing answers, show the direct distance
        if (showAnswers && directDistance) {
          // Calculate midpoint for distance label
          const midX = (start[0] + finalPoint[0]) / 2;
          const midY = (start[1] + finalPoint[1]) / 2 - 0.5;
          
          // Create text at midpoint using array notation
          const distanceText = board.create('text', 
            [midX, midY, `Distance: ${directDistance.toFixed(2)} units`], 
            {
              fontSize: 16,
              fixed: true,
              color: '#e74c3c'
            }
          );
          objects.push(distanceText);
        }
      } else {
        // For single leg, create endpoint
        endPointObj = midPointObj;
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
              Bearings and Navigation Challenge
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
                    id="bearings-challenge-board"
                    boundingBox={challenge.boundingBox}
                    axis={false} // Disable axis to fix grid error
                    grid={false} // Disable grid to fix grid error
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

// Function to generate a bearings challenge
const generateBearingsChallenge = () => {
  // Starting point (always origin for simplicity)
  const start = [0, 0];
  
  // Generate random bearing and distance
  const bearing = Math.floor(Math.random() * 36) * 10; // Multiple of 10 degrees
  const distance = Math.floor(Math.random() * 5) + 3; // 3 to 7 units
  
  // 70% chance to have a second leg for more interesting challenges
  const hasSecondLeg = Math.random() < 0.7;
  
  let secondBearing, secondDistance, finalPoint, directDistance;
  let problemText, solution;
  
  // Convert bearing to radians for calculation
  const bearingRadians = (450 - bearing) % 360 * Math.PI / 180;
  
  // Calculate end point after first leg
  const midPoint = [
    start[0] + distance * Math.cos(bearingRadians),
    start[1] + distance * Math.sin(bearingRadians)
  ];
  
  // Handle case with a second leg
  if (hasSecondLeg) {
    // Generate second bearing and distance
    secondBearing = (bearing + 90 + Math.floor(Math.random() * 180)) % 360; // Different direction
    secondDistance = Math.floor(Math.random() * 5) + 3; // 3 to 7 units
    
    // Calculate final position
    const secondBearingRadians = (450 - secondBearing) % 360 * Math.PI / 180;
    finalPoint = [
      midPoint[0] + secondDistance * Math.cos(secondBearingRadians),
      midPoint[1] + secondDistance * Math.sin(secondBearingRadians)
    ];
    
    // Calculate direct distance from start to final
    const dx = finalPoint[0] - start[0];
    const dy = finalPoint[1] - start[1];
    directDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Create problem text and solution
    problemText = `A ship starts at port O and sails ${distance} nautical miles on a bearing of ${bearing}°. It then changes course and sails ${secondDistance} nautical miles on a bearing of ${secondBearing}°. How far is the ship from the starting point?`;
    
    // Calculate components for both legs
    const dx1 = distance * Math.sin(bearing * Math.PI / 180);
    const dy1 = distance * Math.cos(bearing * Math.PI / 180);
    const dx2 = secondDistance * Math.sin(secondBearing * Math.PI / 180);
    const dy2 = secondDistance * Math.cos(secondBearing * Math.PI / 180);
    const totalDx = dx1 + dx2;
    const totalDy = dy1 + dy2;
    
    solution = [
      {
        explanation: "We need to find the distance between the starting point and the final position using the Pythagorean theorem.",
        formula: "\\text{Distance} = \\sqrt{(\\text{east-west displacement})^2 + (\\text{north-south displacement})^2}"
      },
      {
        explanation: `For the first leg (bearing: ${bearing}°, distance: ${distance} miles):`,
        formula: `\\begin{align} \\text{East component} &= ${distance} \\times \\sin(${bearing}°) = ${dx1.toFixed(2)} \\\\ \\text{North component} &= ${distance} \\times \\cos(${bearing}°) = ${dy1.toFixed(2)} \\end{align}`
      },
      {
        explanation: `For the second leg (bearing: ${secondBearing}°, distance: ${secondDistance} miles):`,
        formula: `\\begin{align} \\text{East component} &= ${secondDistance} \\times \\sin(${secondBearing}°) = ${dx2.toFixed(2)} \\\\ \\text{North component} &= ${secondDistance} \\times \\cos(${secondBearing}°) = ${dy2.toFixed(2)} \\end{align}`
      },
      {
        explanation: "Calculate the total displacement in each direction:",
        formula: `\\begin{align} \\text{Total East displacement} &= ${dx1.toFixed(2)} + ${dx2.toFixed(2)} = ${totalDx.toFixed(2)} \\\\ \\text{Total North displacement} &= ${dy1.toFixed(2)} + ${dy2.toFixed(2)} = ${totalDy.toFixed(2)} \\end{align}`
      },
      {
        explanation: "Now apply the Pythagorean theorem to find the direct distance:",
        formula: `\\text{Distance} = \\sqrt{(${totalDx.toFixed(2)})^2 + (${totalDy.toFixed(2)})^2}`
      },
      {
        explanation: "Calculate:",
        formula: `\\text{Distance} = \\sqrt{${(Math.pow(totalDx, 2) + Math.pow(totalDy, 2)).toFixed(2)}} = ${directDistance.toFixed(2)}\\text{ nautical miles}`
      }
    ];
  } 
  // Simple single-leg problem
  else {
    finalPoint = [...midPoint];
    directDistance = distance; // For single leg, direct distance is just the distance
    
    problemText = `A ship sails from port on a bearing of ${bearing}° for a distance of ${distance} nautical miles. Calculate the ship's displacement (direct distance) from the port.`;
    
    // For simple case, explain that the distance is the same as traveled
    if (bearing % 90 === 0) {
      solution = [
        {
          explanation: "Since the bearing is a cardinal direction (0°, 90°, 180°, or 270°), the ship moves in a straight line.",
          formula: `\\text{Displacement} = ${distance}\\text{ nautical miles}`
        }
      ];
    } else {
      // Calculate eastward/northward components
      const dx = distance * Math.sin(bearing * Math.PI / 180);
      const dy = distance * Math.cos(bearing * Math.PI / 180);
      
      solution = [
        {
          explanation: "We need to find the components of the ship's journey in terms of east-west and north-south.",
          formula: "\\text{Displacement} = \\sqrt{(\\text{East component})^2 + (\\text{North component})^2}"
        },
        {
          explanation: `For a bearing of ${bearing}°, we calculate:`,
          formula: `\\begin{align} \\text{East component} &= ${distance} \\times \\sin(${bearing}°) = ${dx.toFixed(2)} \\\\ \\text{North component} &= ${distance} \\times \\cos(${bearing}°) = ${dy.toFixed(2)} \\end{align}`
        },
        {
          explanation: "Apply the Pythagorean theorem:",
          formula: `\\text{Displacement} = \\sqrt{(${dx.toFixed(2)})^2 + (${dy.toFixed(2)})^2}`
        },
        {
          explanation: "This simplifies to just the original distance:",
          formula: `\\text{Displacement} = ${distance}\\text{ nautical miles}`
        }
      ];
    }
  }
  
  // Calculate appropriate bounding box
  const maxDistance = Math.max(distance, secondDistance || 0, 5);
  const padding = maxDistance / 2;
  
  // Adjust bounding box to ensure the north indicator is visible
  const boundingBox = [-padding, maxDistance * 1.5, maxDistance * 1.5, -padding];
  
  return {
    start,
    bearing,
    distance,
    secondBearing,
    secondDistance,
    midPoint,
    finalPoint,
    directDistance,
    problemText,
    solution,
    boundingBox,
    hasSecondLeg
  };
};

export default ChallengeSection;