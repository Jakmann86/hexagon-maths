import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { Play, RotateCcw, Calculator, CheckCircle, ArrowRight } from 'lucide-react';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // Interactive state management
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState(null);
  const [triangleConfig, setTriangleConfig] = useState({
    angle: 30,
    opposite: 5,
    adjacent: 8.66,
    hypotenuse: 10,
    findSide: 'hypotenuse'
  });
  const [calculatorValue, setCalculatorValue] = useState(null);
  
  // Board reference for JSXGraph
  const boardRef = useRef(null);
  const boardId = 'sohcahtoa-interactive-board';

  // Define ratioInfo object outside of switch statement to avoid hoisting issues
  const ratioInfo = {
    sin: { name: 'SINE', symbol: '\\sin', sides: ['opposite', 'hypotenuse'] },
    cos: { name: 'COSINE', symbol: '\\cos', sides: ['adjacent', 'hypotenuse'] },
    tan: { name: 'TANGENT', symbol: '\\tan', sides: ['opposite', 'adjacent'] }
  };

  // Initialize JSXGraph board with error handling
  useEffect(() => {
    // Check if JSXGraph is available
    if (typeof window !== 'undefined' && window.JXG) {
      try {
        // Clear any existing board
        if (boardRef.current) {
          window.JXG.JSXGraph.freeBoard(boardRef.current);
          boardRef.current = null;
        }

        const board = window.JXG.JSXGraph.initBoard(boardId, {
          boundingbox: [-2, 6, 8, -2],
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
        // JSXGraph not available, component will fall back to text description
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

  // Update visualization when stage or config changes
  useEffect(() => {
    if (boardRef.current) {
      updateTriangleVisualization();
    }
  }, [currentStage, selectedRatio, triangleConfig]);

  const updateTriangleVisualization = () => {
    if (!boardRef.current || !window.JXG) return;

    const board = boardRef.current;
    board.suspendUpdate();

    try {
      // Clear existing objects safely
      const objectIds = Object.keys(board.objects);
      objectIds.forEach(id => {
        if (board.objects[id] && typeof board.objects[id].remove === 'function') {
          try {
            board.removeObject(board.objects[id], false);
          } catch (e) {
            // Ignore removal errors
          }
        }
      });

      // Calculate triangle points
      const scale = 3; // Scale for better visibility
      
      const points = [
        [0, 0], // Right angle point
        [triangleConfig.adjacent * scale / 10, 0], // Adjacent point
        [0, triangleConfig.opposite * scale / 10] // Opposite point
      ];

      // Create triangle points
      const trianglePoints = points.map(p =>
        board.create('point', p, {
          visible: false,
          fixed: true,
          showInfobox: false,
          name: '',
          withLabel: false
        })
      );

      // Determine colors based on selected ratio and stage
      const getHighlightColor = (side) => {
        if (currentStage >= 2 && selectedRatio) {
          const isHighlighted = 
            (side === 'opposite' && (selectedRatio === 'sin' || selectedRatio === 'tan')) ||
            (side === 'adjacent' && (selectedRatio === 'cos' || selectedRatio === 'tan')) ||
            (side === 'hypotenuse' && (selectedRatio === 'sin' || selectedRatio === 'cos'));
          return isHighlighted ? '#e74c3c' : '#3498db';
        }
        return '#3498db';
      };

      const getStrokeWidth = (side) => {
        if (currentStage >= 2 && selectedRatio) {
          const isHighlighted = 
            (side === 'opposite' && (selectedRatio === 'sin' || selectedRatio === 'tan')) ||
            (side === 'adjacent' && (selectedRatio === 'cos' || selectedRatio === 'tan')) ||
            (side === 'hypotenuse' && (selectedRatio === 'sin' || selectedRatio === 'cos'));
          return isHighlighted ? 4 : 2;
        }
        return 2;
      };

      // Create triangle sides with conditional highlighting
      board.create('segment', [trianglePoints[0], trianglePoints[1]], {
        strokeColor: getHighlightColor('adjacent'),
        strokeWidth: getStrokeWidth('adjacent'),
        fixed: true
      });

      board.create('segment', [trianglePoints[0], trianglePoints[2]], {
        strokeColor: getHighlightColor('opposite'),
        strokeWidth: getStrokeWidth('opposite'),
        fixed: true
      });

      board.create('segment', [trianglePoints[1], trianglePoints[2]], {
        strokeColor: getHighlightColor('hypotenuse'),
        strokeWidth: getStrokeWidth('hypotenuse'),
        fixed: true
      });

      // Add right angle marker
      board.create('angle', [trianglePoints[2], trianglePoints[0], trianglePoints[1]], {
        radius: 0.3,
        type: 'square',
        fillColor: 'none',
        strokeWidth: 1.5,
        fixed: true,
        name: '',
        withLabel: false
      });

      // Add angle marker
      board.create('angle', [trianglePoints[0], trianglePoints[1], trianglePoints[2]], {
        radius: 0.5,
        fillColor: '#f39c12',
        fillOpacity: 0.3,
        strokeColor: '#f39c12',
        strokeWidth: 2,
        fixed: true,
        name: `${triangleConfig.angle}°`,
        withLabel: true
      });

      // Add labels based on stage
      if (currentStage >= 1) {
        const labelColor = '#000000';
        
        // Side labels
        board.create('text', [
          triangleConfig.adjacent * scale / 20,
          -0.3,
          triangleConfig.findSide === 'adjacent' ? '?' : `${triangleConfig.adjacent} cm`
        ], {
          fontSize: 14,
          color: labelColor,
          fixed: true,
          anchorX: 'middle'
        });

        board.create('text', [
          -0.5,
          triangleConfig.opposite * scale / 20,
          triangleConfig.findSide === 'opposite' ? '?' : `${triangleConfig.opposite} cm`
        ], {
          fontSize: 14,
          color: labelColor,
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle'
        });

        board.create('text', [
          triangleConfig.adjacent * scale / 20 + 0.5,
          triangleConfig.opposite * scale / 20 + 0.3,
          triangleConfig.findSide === 'hypotenuse' ? '?' : `${triangleConfig.hypotenuse} cm`
        ], {
          fontSize: 14,
          color: labelColor,
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle'
        });

        // Side type labels (shown when ratio is selected)
        if (currentStage >= 2 && selectedRatio) {
          const getLabelTextColor = (side) => {
            const isHighlighted = 
              (side === 'adjacent' && (selectedRatio === 'cos' || selectedRatio === 'tan')) ||
              (side === 'opposite' && (selectedRatio === 'sin' || selectedRatio === 'tan')) ||
              (side === 'hypotenuse' && (selectedRatio === 'sin' || selectedRatio === 'cos'));
            return isHighlighted ? '#e74c3c' : '#7f8c8d';
          };
          
          board.create('text', [
            triangleConfig.adjacent * scale / 20,
            -0.7,
            'adjacent'
          ], {
            fontSize: 12,
            color: getLabelTextColor('adjacent'),
            fixed: true,
            anchorX: 'middle'
          });

          board.create('text', [
            -0.9,
            triangleConfig.opposite * scale / 20,
            'opposite'
          ], {
            fontSize: 12,
            color: getLabelTextColor('opposite'),
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle'
          });

          board.create('text', [
            triangleConfig.adjacent * scale / 20 + 0.8,
            triangleConfig.opposite * scale / 20 + 0.6,
            'hypotenuse'
          ], {
            fontSize: 12,
            color: getLabelTextColor('hypotenuse'),
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle'
          });
        }
      }

    } catch (error) {
      console.warn('Error updating triangle visualization:', error);
    }

    board.unsuspendUpdate();
  };

  const handleRatioSelection = (ratio) => {
    setSelectedRatio(ratio);
    setCurrentStage(2);
    
    // Calculate the trigonometric value
    const angleRad = (triangleConfig.angle * Math.PI) / 180;
    let value;
    switch (ratio) {
      case 'sin':
        value = Math.sin(angleRad);
        break;
      case 'cos':
        value = Math.cos(angleRad);
        break;
      case 'tan':
        value = Math.tan(angleRad);
        break;
      default:
        value = 0;
    }
    setCalculatorValue(Math.round(value * 10000) / 10000);
  };

  const nextStage = () => {
    setCurrentStage(prev => Math.min(prev + 1, 5));
  };

  const resetInteraction = () => {
    setCurrentStage(0);
    setSelectedRatio(null);
    setCalculatorValue(null);
  };

  const generateNewExample = () => {
    const angles = [30, 45, 60];
    const newAngle = angles[Math.floor(Math.random() * angles.length)];
    const newOpposite = Math.floor(Math.random() * 8) + 3;
    const angleRad = (newAngle * Math.PI) / 180;
    const newAdjacent = Math.round((newOpposite / Math.tan(angleRad)) * 100) / 100;
    const newHypotenuse = Math.round((newOpposite / Math.sin(angleRad)) * 100) / 100;
    
    setTriangleConfig({
      angle: newAngle,
      opposite: newOpposite,
      adjacent: newAdjacent,
      hypotenuse: newHypotenuse,
      findSide: 'hypotenuse'
    });
    resetInteraction();
  };

  const getSideValue = (side) => {
    switch (side) {
      case 'opposite': return triangleConfig.opposite;
      case 'adjacent': return triangleConfig.adjacent;
      case 'hypotenuse': return triangleConfig.findSide === 'hypotenuse' ? 'h' : triangleConfig.hypotenuse;
      default: return '?';
    }
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 0:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Interactive Triangle Explorer</h3>
            <p className="text-gray-600">
              We have a right triangle with angle {triangleConfig.angle}° and opposite side {triangleConfig.opposite} cm.
              <br />We want to find the hypotenuse.
            </p>
            <button
              onClick={() => setCurrentStage(1)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 mx-auto"
            >
              <Play size={20} />
              Start Exploration
            </button>
          </div>
        );

      case 1:
        return (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Which Trigonometric Ratio Should We Use?</h3>
            <p className="text-gray-600">
              Look at what we know and what we want to find. Choose the correct ratio:
            </p>
            
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => handleRatioSelection('sin')}
                className="p-6 bg-blue-100 hover:bg-blue-200 rounded-lg border-2 border-blue-300 transition-all text-center"
              >
                <div className="text-2xl font-bold text-blue-700 mb-2">SIN</div>
                <MathDisplay math="\sin(\theta) = \frac{\text{opposite}}{\text{hypotenuse}}" size="normal" />
              </button>
              
              <button
                onClick={() => handleRatioSelection('cos')}
                className="p-6 bg-green-100 hover:bg-green-200 rounded-lg border-2 border-green-300 transition-all text-center"
              >
                <div className="text-2xl font-bold text-green-700 mb-2">COS</div>
                <MathDisplay math="\cos(\theta) = \frac{\text{adjacent}}{\text{hypotenuse}}" size="normal" />
              </button>
              
              <button
                onClick={() => handleRatioSelection('tan')}
                className="p-6 bg-orange-100 hover:bg-orange-200 rounded-lg border-2 border-orange-300 transition-all text-center"
              >
                <div className="text-2xl font-bold text-orange-700 mb-2">TAN</div>
                <MathDisplay math="\tan(\theta) = \frac{\text{opposite}}{\text{adjacent}}" size="normal" />
              </button>
            </div>
          </div>
        );

      case 2: {
        if (!selectedRatio) return null;
        
        const info = ratioInfo[selectedRatio];
        
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">
                Great! You chose {info.name}
              </h3>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <p className="text-gray-700 mb-4">
                {info.name} is the right choice because we know the <strong>{info.sides[0]}</strong> and 
                want to find the <strong>{info.sides[1]}</strong>.
              </p>
              
              <div className="text-center">
                <MathDisplay 
                  math={`${info.symbol}(${triangleConfig.angle}°) = \\frac{\\text{${info.sides[0]}}}{\\text{${info.sides[1]}}}`}
                  size="large"
                />
              </div>
            </div>
            
            <button
              onClick={nextStage}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto"
            >
              Fill in the Values
              <ArrowRight size={20} />
            </button>
          </div>
        );
      }

      case 3: {
        if (!selectedRatio) return null;
        
        const ratioData = ratioInfo[selectedRatio];
        const numerator = getSideValue(ratioData.sides[0]);
        const denominator = getSideValue(ratioData.sides[1]);
        
        return (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Substitute the Known Values</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="space-y-4">
                <MathDisplay 
                  math={`${ratioData.symbol}(${triangleConfig.angle}°) = \\frac{${numerator}}{${denominator}}`}
                  size="large"
                />
                
                <p className="text-gray-700">
                  We know: {ratioData.sides[0]} = {numerator}{typeof numerator === 'number' ? ' cm' : ''}
                  <br />
                  We want to find: {ratioData.sides[1]} = {denominator}{typeof denominator === 'string' ? '' : ' cm'}
                </p>
              </div>
            </div>
            
            <button
              onClick={nextStage}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2 mx-auto"
            >
              <Calculator size={20} />
              Use Calculator
            </button>
          </div>
        );
      }

      case 4: {
        if (!selectedRatio || !calculatorValue) return null;
        
        return (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Calculator Time!</h3>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="space-y-4">
                <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-lg">
                  {ratioInfo[selectedRatio].symbol.replace('\\', '')}({triangleConfig.angle}) = {calculatorValue}
                </div>
                
                <p className="text-gray-700">
                  Now we can substitute this value into our equation:
                </p>
                
                <MathDisplay 
                  math={`${calculatorValue} = \\frac{${triangleConfig.opposite}}{h}`}
                  size="large"
                />
              </div>
            </div>
            
            <button
              onClick={nextStage}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 mx-auto"
            >
              Solve for h
              <ArrowRight size={20} />
            </button>
          </div>
        );
      }

      case 5: {
        if (!selectedRatio || !calculatorValue) return null;
        
        const solution = triangleConfig.opposite / calculatorValue;
        const roundedSolution = Math.round(solution * 100) / 100;
        
        return (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Final Solution</h3>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="space-y-4">
                <p className="text-gray-700">Rearranging the equation to solve for h:</p>
                
                <div className="space-y-2">
                  <MathDisplay math={`${calculatorValue} = \\frac{${triangleConfig.opposite}}{h}`} size="normal" />
                  <MathDisplay math={`h = \\frac{${triangleConfig.opposite}}{${calculatorValue}}`} size="normal" />
                  <MathDisplay math={`h = ${roundedSolution}\\text{ cm}`} size="large" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={generateNewExample}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
              >
                <Play size={20} />
                Try New Example
              </button>
              
              <button
                onClick={resetInteraction}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`border-t-4 border-${theme.primary}`}>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">SOHCAHTOA: Finding Missing Sides</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Interactive Triangle Visualization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Interactive Triangle</h3>
              <div 
                id={boardId} 
                className="w-full bg-gray-50 rounded-lg border border-gray-200"
                style={{ height: '400px' }}
              />
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-2">
                {[0, 1, 2, 3, 4, 5].map((stage) => (
                  <div
                    key={stage}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentStage >= stage 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Interactive Controls */}
            <div className="space-y-6">
              {renderStageContent()}
            </div>
          </div>
          
          {/* Reference Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <h4 className="font-semibold mb-2 text-blue-800">SOH</h4>
              <MathDisplay math="\sin(\theta) = \frac{\text{Opposite}}{\text{Hypotenuse}}" />
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <h4 className="font-semibold mb-2 text-green-800">CAH</h4>
              <MathDisplay math="\cos(\theta) = \frac{\text{Adjacent}}{\text{Hypotenuse}}" />
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <h4 className="font-semibold mb-2 text-orange-800">TOA</h4>
              <MathDisplay math="\tan(\theta) = \frac{\text{Opposite}}{\text{Adjacent}}" />
            </div>
          </div>
          
          {/* Teacher Notes */}
          {showAnswers && (
            <div className={`mt-8 border-t border-${theme.borderColor} pt-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Notes & Classroom Guidance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-3">Interactive Whiteboard Teaching</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700 text-sm">
                    <li>Use large touch targets for ratio selection</li>
                    <li>Let students come up and touch the screen to choose ratios</li>
                    <li>Pause at each stage to ask "Why did we choose this ratio?"</li>
                    <li>Encourage students to explain the color-coding system</li>
                    <li>Use the reset button to try multiple examples</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-3`}>Pedagogical Strategies</h4>
                  <ul className={`list-disc list-inside space-y-2 text-${theme.secondaryText} text-sm`}>
                    <li><strong>Mayer's Coherence:</strong> One concept revealed at a time</li>
                    <li><strong>Signaling Principle:</strong> Color highlights guide attention</li>
                    <li><strong>Active Processing:</strong> Students make decisions at each stage</li>
                    <li><strong>Dual Coding:</strong> Visual triangle + verbal explanation</li>
                    <li><strong>Cognitive Load:</strong> Progressive disclosure prevents overload</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-3">Discussion Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                    <li>"What information do we have, and what do we need to find?"</li>
                    <li>"Which two sides does this ratio connect?"</li>
                    <li>"Why wouldn't we use TAN for this problem?"</li>
                    <li>"How do we know our answer is reasonable?"</li>
                    <li>"What would change if the angle was different?"</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3">Extension Activities</h4>
                  <ul className="list-disc list-inside space-y-2 text-green-700 text-sm">
                    <li>Try the same triangle with different unknown sides</li>
                    <li>Change the angle and observe how ratios change</li>
                    <li>Use real-world contexts (ladders, ramps, buildings)</li>
                    <li>Challenge: Predict the ratio value before calculating</li>
                    <li>Compare calculator answers with exact values (30°, 45°, 60°)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">Assessment Checkpoints</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-700 text-sm">
                  <div>
                    <strong>During Stage 1:</strong> Can students identify which sides they know and need?
                  </div>
                  <div>
                    <strong>During Stage 2:</strong> Do students understand why certain ratios are inappropriate?
                  </div>
                  <div>
                    <strong>During Stage 4:</strong> Can students interpret calculator values correctly?
                  </div>
                  <div>
                    <strong>During Stage 5:</strong> Do students remember to rearrange algebraically?
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