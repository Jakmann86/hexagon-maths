import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { Plus, Minus } from 'lucide-react';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // State for the interactive equation - start with an unbalanced equation
  const [leftX, setLeftX] = useState(5);
  const [leftConstant, setLeftConstant] = useState(3);
  const [rightX, setRightX] = useState(2);
  const [rightConstant, setRightConstant] = useState(12);

  // Calculate if balanced based on mathematical equality
  const solution = leftX !== rightX ? (rightConstant - leftConstant) / (leftX - rightX) : null;
  const leftSideValue = leftX * (solution || 1) + leftConstant;
  const rightSideValue = rightX * (solution || 1) + rightConstant;
  const isBalanced = Math.abs(leftSideValue - rightSideValue) < 0.001;
  const isValidEquation = leftX !== rightX;

  // Generate equation string
  const formatSide = (xCoeff, constant) => {
    if (xCoeff === 0 && constant === 0) return "0";
    if (xCoeff === 0) return `${constant}`;
    if (constant === 0) return xCoeff === 1 ? "x" : `${xCoeff}x`;
    
    const xPart = xCoeff === 1 ? "x" : `${xCoeff}x`;
    const constantPart = constant > 0 ? ` + ${constant}` : ` - ${Math.abs(constant)}`;
    return `${xPart}${constantPart}`;
  };

  const leftSide = formatSide(leftX, leftConstant);
  const rightSide = formatSide(rightX, rightConstant);
  const equation = `${leftSide} = ${rightSide}`;

  // Interactive Balance Scale Component
  const InteractiveBalanceScale = () => {
    // Calculate visual balance based on actual equation values
    const solution = leftX !== rightX ? (rightConstant - leftConstant) / (leftX - rightX) : 1;
    const leftSideValue = leftX * solution + leftConstant;
    const rightSideValue = rightX * solution + rightConstant;
    const valueDifference = rightSideValue - leftSideValue;
    const tiltAngle = Math.max(-8, Math.min(8, valueDifference * 2));

    const WeightStack = ({ type, count, side, isNegative = false }) => {
      if (count === 0) return null;
      
      const absCount = Math.abs(count);
      const rows = Math.ceil(absCount / 3); // Max 3 blocks per row for better spacing
      
      return (
        <div className="flex flex-col-reverse items-center space-y-reverse space-y-1">
          {Array.from({ length: rows }, (_, rowIndex) => {
            const startIndex = rowIndex * 3;
            const endIndex = Math.min(startIndex + 3, absCount);
            const blocksInRow = endIndex - startIndex;
            
            return (
              <div key={rowIndex} className="flex space-x-1">
                {Array.from({ length: blocksInRow }, (_, blockIndex) => (
                  <div
                    key={blockIndex}
                    className={`w-8 h-6 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      type === 'x' 
                        ? isNegative ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                        : isNegative ? 'bg-red-300 text-gray-700' : 'bg-green-400 text-gray-700'
                    }`}
                  >
                    {type === 'x' ? 'x' : '1'}
                  </div>
                ))}
              </div>
            );
          })}
          {isNegative && count < 0 && (
            <div className="text-red-600 text-xs font-bold mt-1">−{absCount}</div>
          )}
        </div>
      );
    };

    const ControlButton = ({ onClick, icon: Icon, disabled, color = 'blue' }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-8 h-8 rounded-full bg-${color}-500 text-white hover:bg-${color}-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors`}
      >
        <Icon size={16} />
      </button>
    );

    return (
      <div className="flex flex-col items-center space-y-8 p-8 bg-gray-50 rounded-lg">
        {/* Equation Display */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm mb-4">
          <div className="text-center">
            <div className="text-2xl mb-2">
              <MathDisplay math={equation} />
            </div>
          </div>
        </div>

        {/* Balance Scale */}
        <div className="relative w-full max-w-4xl mx-auto" style={{ height: '200px' }}>
          {/* Central pivot */}
          <div className="w-6 h-20 bg-gray-700 absolute left-1/2 top-12 transform -translate-x-1/2 z-10"></div>
          
          {/* Balance arm */}
          <div 
            className="w-[500px] h-3 bg-gray-700 absolute top-20 left-1/2 transform -translate-x-1/2 transition-transform duration-1000 origin-center rounded-full"
            style={{ transform: `translateX(-50%) rotate(${tiltAngle}deg)` }}
          ></div>
          
          {/* Left scale plate */}
          <div 
            className="absolute top-16 left-8 w-48 h-8 bg-gray-400 rounded-lg border-2 border-gray-600 transition-transform duration-1000 shadow-lg"
            style={{ transform: `rotate(${-tiltAngle * 0.3}deg)` }}
          ></div>
          
          {/* Left weights - positioned above the scale */}
          <div 
            className="absolute -top-4 left-8 w-48 flex justify-center items-end transition-transform duration-1000"
            style={{ transform: `rotate(${-tiltAngle * 0.3}deg)` }}
          >
            <div className="flex space-x-6 items-end w-full justify-center">
              <WeightStack type="x" count={leftX} side="left" isNegative={leftX < 0} />
              <WeightStack type="constant" count={leftConstant} side="left" isNegative={leftConstant < 0} />
            </div>
          </div>
          
          {/* Right scale plate */}
          <div 
            className="absolute top-16 right-8 w-48 h-8 bg-gray-400 rounded-lg border-2 border-gray-600 transition-transform duration-1000 shadow-lg"
            style={{ transform: `rotate(${-tiltAngle * 0.3}deg)` }}
          ></div>
          
          {/* Right weights - positioned above the scale */}
          <div 
            className="absolute -top-8 right-8 w-48 flex justify-center items-end transition-transform duration-1000"
            style={{ transform: `rotate(${-tiltAngle * 0.3}deg)` }}
          >
            <div className="flex space-x-6 items-end w-full justify-center">
              <WeightStack type="x" count={rightX} side="right" isNegative={rightX < 0} />
              <WeightStack type="constant" count={rightConstant} side="right" isNegative={rightConstant < 0} />
            </div>
          </div>
        </div>

        {/* Balance status */}
        <div className={`text-center font-bold text-lg transition-colors duration-500 ${
          Math.abs(tiltAngle) < 0.1 ? 'text-green-600' : 'text-orange-600'
        }`}>
          {Math.abs(tiltAngle) < 0.1 ? '⚖️ BALANCED' : '⚖️ UNBALANCED'}
          {solution && Number.isInteger(solution) && Math.abs(solution) < 20 && (
            <div className="text-sm text-gray-600 mt-1">
              (Solution: x = {solution})
            </div>
          )}
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
          {/* Left side controls */}
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-gray-700">Left Side</h4>
            
            {/* X controls */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ControlButton 
                onClick={() => setLeftX(prev => Math.max(0, prev - 1))}
                icon={Minus}
                disabled={leftX <= 0}
                color="red"
              />
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span className="font-mono text-lg w-8">{leftX}</span>
              </div>
              <ControlButton 
                onClick={() => setLeftX(prev => Math.min(10, prev + 1))}
                icon={Plus}
                disabled={leftX >= 10}
                color="blue"
              />
            </div>

            {/* Constant controls */}
            <div className="flex items-center justify-center space-x-3">
              <ControlButton 
                onClick={() => setLeftConstant(prev => prev - 1)}
                icon={Minus}
                disabled={leftConstant <= -10}
                color="red"
              />
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-green-400 rounded"></div>
                <span className="font-mono text-lg w-8">{leftConstant}</span>
              </div>
              <ControlButton 
                onClick={() => setLeftConstant(prev => Math.min(10, prev + 1))}
                icon={Plus}
                disabled={leftConstant >= 10}
                color="green"
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-gray-700">Right Side</h4>
            
            {/* X controls */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ControlButton 
                onClick={() => setRightX(prev => Math.max(0, prev - 1))}
                icon={Minus}
                disabled={rightX <= 0}
                color="red"
              />
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span className="font-mono text-lg w-8">{rightX}</span>
              </div>
              <ControlButton 
                onClick={() => setRightX(prev => Math.min(10, prev + 1))}
                icon={Plus}
                disabled={rightX >= 10}
                color="blue"
              />
            </div>

            {/* Constant controls */}
            <div className="flex items-center justify-center space-x-3">
              <ControlButton 
                onClick={() => setRightConstant(prev => prev - 1)}
                icon={Minus}
                disabled={rightConstant <= -10}
                color="red"
              />
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-green-400 rounded"></div>
                <span className="font-mono text-lg w-8">{rightConstant}</span>
              </div>
              <ControlButton 
                onClick={() => setRightConstant(prev => Math.min(10, prev + 1))}
                icon={Plus}
                disabled={rightConstant >= 10}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Preset examples button */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { setLeftX(4); setLeftConstant(7); setRightX(2); setRightConstant(13); }}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
          >
            4x + 7 = 2x + 13
          </button>
          <button
            onClick={() => { setLeftX(5); setLeftConstant(1); setRightX(3); setRightConstant(9); }}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
          >
            5x + 1 = 3x + 9
          </button>
          <button
            onClick={() => { setLeftX(6); setLeftConstant(-2); setRightX(4); setRightConstant(6); }}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
          >
            6x - 2 = 4x + 6
          </button>
          <button
            onClick={() => { setLeftX(7); setLeftConstant(3); setRightX(2); setRightConstant(18); }}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
          >
            7x + 3 = 2x + 18
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
          
          {/* Main interactive visualization - central focus */}
          <div className="mb-4">
            <InteractiveBalanceScale />
          </div>
          
          {/* Teacher notes - only shown when answers/hints are toggled on */}
          {showAnswers && (
            <div className={`mt-8 border-t border-${theme.borderColor} pt-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Notes</h3>
              
              {/* The Balance Concept */}
              <div className={`mb-6 bg-${theme.pastelBg} p-4 rounded-lg`}>
                <h4 className={`font-medium text-${theme.pastelText} mb-2`}>The Balance Concept</h4>
                <p className="text-gray-700 mb-3">
                  Think of an equation as a balance scale. The equal sign (=) represents the balance point, 
                  and both sides must have equal "weight" to stay balanced.
                </p>
                <p className="text-gray-700 mb-3">
                  When we have x terms on both sides, our goal is to collect all the x terms on one side 
                  and all the numbers on the other side, while maintaining the balance.
                </p>
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <strong>Key Rule:</strong> Whatever operation you perform on one side, 
                  you must perform the same operation on the other side to maintain balance.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Discussion Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700">
                    <li>What happens to the balance if we add different amounts to each side?</li>
                    <li>Why do we move all the x terms to one side instead of leaving them on both sides?</li>
                    <li>Can you create an equation that has no solution?</li>
                    <li>How would you check if your answer is correct?</li>
                    <li>What's the difference between removing 2x and removing 2?</li>
                    <li>Why does the scale stay balanced when we change both sides equally?</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Key Points</h4>
                  <ul className={`list-disc list-inside space-y-2 text-${theme.secondaryText}`}>
                    <li>Blue blocks represent x terms</li>
                    <li>Green blocks represent positive constants</li>
                    <li>Red blocks represent negative values</li>
                    <li>The goal is to get x by itself on one side</li>
                    <li>Always perform the same operation on both sides</li>
                    <li>Check your answer by substituting back into the original equation</li>
                  </ul>
                </div>
              </div>

              {/* Summary & Next Steps */}
              <div className={`mt-6 bg-${theme.pastelBg} p-4 rounded-lg`}>
                <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Summary & Next Steps</h4>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Remember:</strong> An equation is like a balance scale. To solve equations with x on both sides:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
                    <li>Get all x terms on one side by adding or subtracting x terms</li>
                    <li>Get all constant numbers on the other side</li>
                    <li>Divide both sides by the coefficient of x</li>
                    <li>Always check your answer by substituting back into the original equation</li>
                  </ol>
                  <p className="text-gray-700 mt-3">
                    <strong>Next:</strong> In the Examples section, you'll practice the standard algebraic method 
                    without the visual balance scale, building fluency with the mathematical steps.
                  </p>
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