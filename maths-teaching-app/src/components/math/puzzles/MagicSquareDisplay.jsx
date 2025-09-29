// src/components/math/puzzles/MagicSquareDisplay.jsx
import React from 'react';
import { useUI } from '../../../context/UIContext';

/**
 * MagicSquareDisplay - Visual component for magic square puzzles
 * Displays a 3x3 grid with some numbers hidden
 * MINIMAL VERSION - Just magic sum and grid
 */
const MagicSquareDisplay = ({ 
  puzzleData,
  containerHeight = '200px',
  className = ''
}) => {
  const { showAnswers } = useUI();

  if (!puzzleData || !puzzleData.puzzleGrid) {
    return (
      <div className="text-gray-500 italic text-center p-4">
        No puzzle data available
      </div>
    );
  }

  const { puzzleGrid, magicSum, fullSolution } = puzzleData;

  // Determine which grid to show
  const displayGrid = showAnswers ? fullSolution : puzzleGrid;

  return (
    <div className={`magic-square-display flex flex-col items-center justify-center p-4 ${className}`}>
      {/* Magic sum - just the number */}
      <div className="mb-4 text-center">
        <span className="text-blue-600 text-2xl font-bold">{magicSum}</span>
      </div>

      {/* 3x3 Grid */}
      <div className="inline-block border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg">
        {displayGrid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex">
            {row.map((value, colIndex) => {
              const isHidden = puzzleGrid[rowIndex][colIndex] === null;
              const isRevealed = showAnswers && isHidden;

              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`
                    w-16 h-16 flex items-center justify-center
                    border-2 border-gray-400 font-bold text-2xl
                    ${isHidden && !showAnswers ? 'bg-yellow-100' : 'bg-white'}
                    ${isRevealed ? 'bg-green-100 text-green-700' : 'text-gray-800'}
                  `}
                >
                  {value !== null ? (
                    value
                  ) : showAnswers ? (
                    <span className="text-green-700">{fullSolution[rowIndex][colIndex]}</span>
                  ) : (
                    <span className="text-gray-400 text-lg">?</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagicSquareDisplay;