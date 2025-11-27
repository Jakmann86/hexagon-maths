// src/content/topics/trigonometry-i/sohcahtoa2/LearnSection.jsx
// Simple visualization demonstrating sin(30°) = 1/2 concept
// Teacher-led: shows triangles of different sizes, all with the same O:H ratio

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // Triangle state - random hypotenuse, opposite is always half
  const [triangleConfig, setTriangleConfig] = useState(() => generateTriangle());
  
  // Toggle states for showing/hiding sides
  const [showOpposite, setShowOpposite] = useState(true);
  const [showHypotenuse, setShowHypotenuse] = useState(true);
  
  // Board reference for JSXGraph
  const boardRef = useRef(null);
  const boardId = 'sin30-learn-board';

  // Generate a random 30-60-90 triangle
  function generateTriangle() {
    // Random hypotenuse between 4 and 12 (even numbers for clean halves)
    const hypotenuse = (Math.floor(Math.random() * 5) + 2) * 2; // 4, 6, 8, 10, or 12
    const opposite = hypotenuse / 2; // Always exactly half
    const adjacent = Math.round(Math.sqrt(hypotenuse * hypotenuse - opposite * opposite) * 100) / 100;
    
    return { opposite, hypotenuse, adjacent };
  }

  // Generate new triangle
  const newTriangle = () => {
    setTriangleConfig(generateTriangle());
    // Reset visibility when generating new triangle
    setShowOpposite(true);
    setShowHypotenuse(true);
  };

  // Initialize JSXGraph board
  useEffect(() => {
    if (typeof window !== 'undefined' && window.JXG) {
      try {
        if (boardRef.current) {
          window.JXG.JSXGraph.freeBoard(boardRef.current);
          boardRef.current = null;
        }

        const board = window.JXG.JSXGraph.initBoard(boardId, {
          boundingbox: [-2, 8, 12, -2],
          axis: false,
          grid: false,
          showNavigation: false,
          showCopyright: false,
          pan: { enabled: false },
          zoom: { enabled: false }
        });

        boardRef.current = board;
        updateTriangleVisualization();
      } catch (error) {
        console.warn('JSXGraph initialization failed:', error);
      }
    }

    return () => {
      if (boardRef.current && window.JXG) {
        try {
          window.JXG.JSXGraph.freeBoard(boardRef.current);
        } catch (error) {
          console.warn('JSXGraph cleanup failed:', error);
        }
        boardRef.current = null;
      }
    };
  }, []);

  // Update visualization when triangle or visibility changes
  useEffect(() => {
    if (boardRef.current) {
      updateTriangleVisualization();
    }
  }, [triangleConfig, showOpposite, showHypotenuse]);

  const updateTriangleVisualization = useCallback(() => {
    if (!boardRef.current || !window.JXG) return;

    const board = boardRef.current;
    board.suspendUpdate();

    try {
      // Clear existing objects
      const objectIds = [];
      for (const id in board.objects) {
        if (board.objects[id] && typeof board.objects[id].remove === 'function') {
          objectIds.push(id);
        }
      }
      for (const id of objectIds) {
        board.removeObject(board.objects[id], false);
      }

      const { opposite, hypotenuse, adjacent } = triangleConfig;

      // Scale factor to fit nicely in the view
      const scale = 6 / Math.max(opposite, adjacent);
      const scaledOpp = opposite * scale;
      const scaledAdj = adjacent * scale;

      // Triangle points: right angle at origin, base along x-axis, height along y-axis
      const pointA = [0, 0];           // Right angle vertex
      const pointB = [scaledAdj, 0];   // Base point (30° angle here)
      const pointC = [0, scaledOpp];   // Top point

      // Create invisible points for the triangle (no labels)
      const trianglePoints = [
        board.create('point', pointA, { visible: false, fixed: true, name: '' }),
        board.create('point', pointB, { visible: false, fixed: true, name: '' }),
        board.create('point', pointC, { visible: false, fixed: true, name: '' })
      ];

      // Draw triangle
      board.create('polygon', trianglePoints, {
        fillColor: '#3498db',
        fillOpacity: 0.12,
        borders: {
          strokeColor: '#2980b9',
          strokeWidth: 2.5
        },
        vertices: { visible: false }
      });

      // Right angle marker
      const raSize = 0.4;
      board.create('polygon', [
        [0, 0],
        [raSize, 0],
        [raSize, raSize],
        [0, raSize]
      ], {
        fillColor: 'none',
        borders: { strokeColor: '#7f8c8d', strokeWidth: 1.5 },
        vertices: { visible: false }
      });

      // 30° angle arc at point B
      // Points order [start, vertex, end] going counterclockwise for interior angle
      board.create('angle', [trianglePoints[2], trianglePoints[1], trianglePoints[0]], {
        radius: 0.55,
        name: '',  // We'll add our own label for better positioning
        fillColor: '#e74c3c',
        fillOpacity: 0.25,
        strokeColor: '#c0392b',
        strokeWidth: 2
      });
      
      // Custom 30° label - positioned down and to the left of the angle
      board.create('text', [
        scaledAdj - 1.1,
        0.35,
        '30°'
      ], {
        fontSize: 15,
        color: '#c0392b',
        fontWeight: 'bold',
        fixed: true,
        anchorX: 'middle',
        anchorY: 'middle'
      });

      // Opposite side label (vertical) - only if visible
      if (showOpposite) {
        board.create('text', [
          -0.9,
          scaledOpp / 2,
          `${opposite} cm`
        ], {
          fontSize: 16,
          color: '#e74c3c',
          fontWeight: 'bold',
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle'
        });
      } else {
        // Show "?" when hidden
        board.create('text', [
          -0.6,
          scaledOpp / 2,
          '?'
        ], {
          fontSize: 20,
          color: '#e74c3c',
          fontWeight: 'bold',
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle'
        });
      }

      // Hypotenuse label (diagonal) - only if visible
      const hypMidX = scaledAdj / 2 + 0.4;
      const hypMidY = scaledOpp / 2 + 0.5;
      
      if (showHypotenuse) {
        board.create('text', [
          hypMidX,
          hypMidY,
          `${hypotenuse} cm`
        ], {
          fontSize: 16,
          color: '#2980b9',
          fontWeight: 'bold',
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle'
        });
      } else {
        // Show "?" when hidden
        board.create('text', [
          hypMidX,
          hypMidY,
          '?'
        ], {
          fontSize: 20,
          color: '#2980b9',
          fontWeight: 'bold',
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle'
        });
      }

      // Adjacent (base) - always shown but de-emphasised
      board.create('text', [
        scaledAdj / 2,
        -0.6,
        `${adjacent} cm`
      ], {
        fontSize: 13,
        color: '#95a5a6',
        fixed: true,
        anchorX: 'middle'
      });

    } catch (error) {
      console.warn('Error updating triangle visualization:', error);
    }

    board.unsuspendUpdate();
  }, [triangleConfig, showOpposite, showHypotenuse]);

  return (
    <div className="space-y-6 mb-8">
      <Card className="border-2 border-t-4 border-green-500 shadow-md overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Why is sin(30°) always equal to ½?
            </h3>
            <button
              onClick={newTriangle}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
            >
              <RefreshCw size={18} />
              <span>New Triangle</span>
            </button>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Triangle Visualization */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div 
                id={boardId} 
                style={{ width: '100%', height: '350px' }}
                className="rounded-lg"
              />
              
              {/* Toggle buttons for sides */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setShowOpposite(!showOpposite)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    showOpposite 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {showOpposite ? <Eye size={16} /> : <EyeOff size={16} />}
                  Opposite
                </button>
                <button
                  onClick={() => setShowHypotenuse(!showHypotenuse)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    showHypotenuse 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {showHypotenuse ? <Eye size={16} /> : <EyeOff size={16} />}
                  Hypotenuse
                </button>
              </div>
            </div>

            {/* Ratio Display */}
            <div className="space-y-6">
              {/* The ratio calculation */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 text-center">
                  For this 30° triangle:
                </h4>
                <div className="text-center space-y-3">
                  <MathDisplay 
                    math={`\\sin(30°) = \\frac{\\color{#e74c3c}{\\text{Opposite}}}{\\color{#2980b9}{\\text{Hypotenuse}}} = \\frac{1}{2}`}
                    size="large"
                  />
                  <MathDisplay 
                    math={`= \\frac{\\color{#e74c3c}{${showOpposite ? triangleConfig.opposite : '?'}}}{\\color{#2980b9}{${showHypotenuse ? triangleConfig.hypotenuse : '?'}}} = 0.5`}
                    size="large"
                  />
                </div>
              </div>

              {/* Challenge prompt when a side is hidden */}
              {(!showOpposite || !showHypotenuse) && (
                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                  <p className="text-amber-800 text-center">
                    {!showOpposite && showHypotenuse && (
                      <>
                        <strong>What is the opposite side?</strong><br />
                        <span className="text-base">Hypotenuse = {triangleConfig.hypotenuse} cm, ratio is 1:2</span>
                      </>
                    )}
                    {showOpposite && !showHypotenuse && (
                      <>
                        <strong>What is the hypotenuse?</strong><br />
                        <span className="text-base">Opposite = {triangleConfig.opposite} cm, ratio is 1:2</span>
                      </>
                    )}
                    {!showOpposite && !showHypotenuse && (
                      <>
                        <strong>Both sides hidden!</strong><br />
                        <span className="text-base">Click a toggle to reveal one side</span>
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Key point - only show when both sides visible */}
              {showOpposite && showHypotenuse && (
                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                  <p className="text-amber-800 text-center text-lg">
                    <strong>Try different triangles!</strong><br />
                    <span className="text-base">The ratio is <em>always</em> 1:2</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Notes - only visible with "Show Answers" */}
          {showAnswers && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Teaching Notes: Bringing This Slide to Life
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3">How to Use This Visual</h4>
                  <ol className="list-decimal list-inside space-y-2 text-green-700 text-sm">
                    <li>Start with both sides visible - click "New Triangle" a few times</li>
                    <li>Ask: "What do you notice about the <span className="text-red-600 font-medium">opposite</span> and <span className="text-blue-600 font-medium">hypotenuse</span>?"</li>
                    <li>Guide students to spot the 1:2 ratio</li>
                    <li><strong>Hide the opposite</strong> - ask students to predict it from the hypotenuse</li>
                    <li><strong>Hide the hypotenuse</strong> - ask students to predict it from the opposite</li>
                    <li>Generate new triangles and repeat the prediction game</li>
                  </ol>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-3">Prediction Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                    <li>"The hypotenuse is 10 cm - what's the opposite?" (5 cm)</li>
                    <li>"The opposite is 3 cm - what's the hypotenuse?" (6 cm)</li>
                    <li>"If H = 100, what is O?" (50)</li>
                    <li>"If O = 7, what is H?" (14)</li>
                    <li>"What operation connects O and H?"</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-3">The Key Insight</h4>
                  <p className="text-purple-700 text-sm">
                    All 30-60-90 triangles are <strong>similar</strong> - they have the same shape, 
                    just different sizes. Similar triangles have equal ratios between corresponding sides.
                    This is why sin(30°) is a constant: it's the ratio that defines this shape.
                  </p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-3">Common Misconceptions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700 text-sm">
                    <li>Students may think bigger triangles have bigger sin values</li>
                    <li>Confusion between the ratio (0.5) and the actual lengths</li>
                    <li>Not connecting calculator sin(30°) = 0.5 to this visual ratio</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2">Extension: Other Exact Values</h4>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <MathDisplay math="\sin(30°) = \frac{1}{2}" />
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <MathDisplay math="\sin(45°) = \frac{\sqrt{2}}{2}" />
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <MathDisplay math="\sin(60°) = \frac{\sqrt{3}}{2}" />
                  </div>
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