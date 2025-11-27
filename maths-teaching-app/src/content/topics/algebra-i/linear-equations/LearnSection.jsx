import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { Plus, Minus, RotateCcw } from 'lucide-react';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // The fixed solution value - this is what x equals, and we check balance against this
  const [solutionValue, setSolutionValue] = useState(3);
  
  // Current state of the equation
  const [leftX, setLeftX] = useState(5);
  const [leftConstant, setLeftConstant] = useState(3);
  const [rightX, setRightX] = useState(2);
  const [rightConstant, setRightConstant] = useState(12);

  // Generate equation string
  const formatSide = (xCoeff, constant) => {
    if (xCoeff === 0 && constant === 0) return "0";
    if (xCoeff === 0) return `${constant}`;
    if (constant === 0) return xCoeff === 1 ? "x" : `${xCoeff}x`;
    
    const xPart = xCoeff === 1 ? "x" : `${xCoeff}x`;
    const constantPart = constant > 0 ? ` + ${constant}` : ` - ${Math.abs(constant)}`;
    return `${xPart}${constantPart}`;
  };

  const equation = `${formatSide(leftX, leftConstant)} = ${formatSide(rightX, rightConstant)}`;

  // Calculate tilt by evaluating both sides at the fixed solution value
  // If both sides equal the same thing when x = solutionValue, scale is balanced
  const leftWeight = leftX * solutionValue + leftConstant;
  const rightWeight = rightX * solutionValue + rightConstant;
  const weightDiff = leftWeight - rightWeight;
  const tiltAngle = Math.max(-15, Math.min(15, weightDiff * 2));

  const resetEquation = (lx = 5, lc = 3, rx = 2, rc = 12, sol = 3) => {
    setLeftX(lx);
    setLeftConstant(lc);
    setRightX(rx);
    setRightConstant(rc);
    setSolutionValue(sol);
  };

  // Interactive Balance Scale Component
  const InteractiveBalanceScale = () => {
    const WeightStack = ({ type, count }) => {
      if (count <= 0) return null;
      
      const rows = Math.ceil(count / 3);
      
      return (
        <div className="flex flex-col-reverse items-center space-y-reverse space-y-0.5">
          {Array.from({ length: rows }, (_, rowIndex) => {
            const startIndex = rowIndex * 3;
            const endIndex = Math.min(startIndex + 3, count);
            const blocksInRow = endIndex - startIndex;
            
            return (
              <div key={rowIndex} className="flex space-x-0.5">
                {Array.from({ length: blocksInRow }, (_, blockIndex) => (
                  <div
                    key={blockIndex}
                    className={`w-7 h-5 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      type === 'x' 
                        ? 'bg-blue-500 text-white border border-blue-600'
                        : 'bg-green-400 text-gray-700 border border-green-500'
                    }`}
                  >
                    {type === 'x' ? 'x' : '1'}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      );
    };

    const NegativeIndicator = ({ value, type }) => {
      if (value >= 0) return null;
      return (
        <div className="text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-600">
          {type === 'x' ? `${value}x` : value}
        </div>
      );
    };

    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg">
        {/* Equation Display */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="text-2xl text-center">
            <MathDisplay math={equation} />
          </div>
        </div>

        {/* Balance Scale */}
        <div className="relative w-full max-w-2xl mx-auto" style={{ height: '220px' }}>
          {/* Base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-gray-600 rounded"></div>
          
          {/* Post */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-20 bg-gray-700"></div>
          
          {/* Pivot triangle */}
          <div 
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            style={{ 
              width: 0, 
              height: 0, 
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '10px solid #374151'
            }}
          ></div>
          
          {/* Balance arm container - rotates around center */}
          <div 
            className="absolute bottom-28 left-1/2 transition-transform duration-700 ease-out"
            style={{ 
              width: '480px',
              transform: `translateX(-50%) rotate(${tiltAngle}deg)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Beam */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-700 rounded-full transform -translate-y-1/2"></div>
            
            {/* Left pan assembly */}
            <div className="absolute left-4 top-1/2" style={{ transform: 'translateY(-50%)' }}>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-500"></div>
              <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gray-400 rounded border border-gray-500"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 items-end justify-center min-h-[60px]">
                <WeightStack type="x" count={leftX} />
                <WeightStack type="constant" count={leftConstant} />
                <NegativeIndicator value={leftX < 0 ? leftX : null} type="x" />
                <NegativeIndicator value={leftConstant < 0 ? leftConstant : null} type="constant" />
              </div>
            </div>
            
            {/* Right pan assembly */}
            <div className="absolute right-4 top-1/2" style={{ transform: 'translateY(-50%)' }}>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-500"></div>
              <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gray-400 rounded border border-gray-500"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 items-end justify-center min-h-[60px]">
                <WeightStack type="x" count={rightX} />
                <WeightStack type="constant" count={rightConstant} />
                <NegativeIndicator value={rightX < 0 ? rightX : null} type="x" />
                <NegativeIndicator value={rightConstant < 0 ? rightConstant : null} type="constant" />
              </div>
            </div>
          </div>
        </div>

        {/* Operation Buttons */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
          {/* Left Side Controls */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-center font-medium text-gray-600 mb-3 text-sm">Left Side</h4>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                onClick={() => setLeftX(prev => prev - 1)}
                className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <Minus size={16} />
              </button>
              <div className="w-10 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                {leftX}x
              </div>
              <button
                onClick={() => setLeftX(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setLeftConstant(prev => prev - 1)}
                className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Minus size={16} />
              </button>
              <div className="w-10 h-8 bg-green-400 rounded flex items-center justify-center text-gray-700 font-bold text-sm">
                {leftConstant}
              </div>
              <button
                onClick={() => setLeftConstant(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-center font-medium text-gray-600 mb-3 text-sm">Right Side</h4>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                onClick={() => setRightX(prev => prev - 1)}
                className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <Minus size={16} />
              </button>
              <div className="w-10 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                {rightX}x
              </div>
              <button
                onClick={() => setRightX(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setRightConstant(prev => prev - 1)}
                className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Minus size={16} />
              </button>
              <div className="w-10 h-8 bg-green-400 rounded flex items-center justify-center text-gray-700 font-bold text-sm">
                {rightConstant}
              </div>
              <button
                onClick={() => setRightConstant(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Reset and Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => resetEquation()}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={() => resetEquation(5, 3, 2, 12, 3)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm">
            5x + 3 = 2x + 12
          </button>
          <button onClick={() => resetEquation(4, 2, 1, 8, 2)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm">
            4x + 2 = x + 8
          </button>
          <button onClick={() => resetEquation(6, 4, 3, 10, 2)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm">
            6x + 4 = 3x + 10
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className={`border-t-4 border-${theme.primary}`}>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Solving Equations with x on Both Sides</h2>
          
          <div className="mb-4">
            <InteractiveBalanceScale />
          </div>
          
          {/* Teacher notes - only shown when toggled */}
          {showAnswers && (
            <div className={`mt-8 border-t border-${theme.borderColor} pt-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Notes</h3>
              
              <div className={`mb-6 bg-${theme.pastelBg} p-4 rounded-lg`}>
                <h4 className={`font-medium text-${theme.pastelText} mb-2`}>How to Use This Interactive</h4>
                <p className="text-gray-700 mb-3">
                  The scale responds to changes on each side. When students remove an x from one side only, 
                  the scale tips — demonstrating that they must do the same to both sides to keep it balanced.
                </p>
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <strong>Goal:</strong> Get all the x's on one side and all the numbers on the other, 
                  then divide the constants by the number of x's to find the solution.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Discussion Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700">
                    <li>What happens when you remove an x from only one side?</li>
                    <li>How do we keep the equation balanced?</li>
                    <li>Why do we want all the x's on one side?</li>
                    <li>Once we have "3x = 9", how do we find x?</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Solving Strategy</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Remove x's from both sides until x is only on one side</li>
                    <li>Remove constants from both sides until numbers are only on the other side</li>
                    <li>Divide the constant by the number of x's</li>
                    <li>Check by substituting back</li>
                  </ol>
                </div>
              </div>

              <div className={`mt-4 bg-${theme.pastelBg} p-4 rounded-lg`}>
                <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Key Points</h4>
                <ul className={`list-disc list-inside space-y-1 text-${theme.secondaryText}`}>
                  <li>Blue blocks = x terms, Green blocks = constants</li>
                  <li>Whatever you do to one side, do to the other</li>
                  <li>The scale tips when the equation becomes unbalanced</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;