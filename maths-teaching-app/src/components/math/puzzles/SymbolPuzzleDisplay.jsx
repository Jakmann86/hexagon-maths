// src/components/math/puzzles/SymbolPuzzleDisplay.jsx

import React from 'react';
import { useUI } from '../../../context/UIContext';

/**
 * SymbolPuzzleDisplay - Renders visual symbol algebra puzzles
 * Converts generator config objects into engaging visual displays
 * 
 * @param {Object} props
 * @param {Object} props.puzzleDisplay - Configuration from symbol puzzle generators
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.containerHeight - Height constraint for the component
 */
const SymbolPuzzleDisplay = ({ 
  puzzleDisplay, 
  className = '',
  containerHeight = '120px'
}) => {
  const { showAnswers } = useUI();

  if (!puzzleDisplay) {
    return (
      <div className="text-gray-500 italic text-center p-4">
        No puzzle data available
      </div>
    );
  }

  const {
    type,
    equations,
    symbols,
    theme,
    themeDisplayName,
    solutions,
    targetSymbol,
    difficulty
  } = puzzleDisplay;

  // Base styling classes
  const containerClasses = `
    symbol-puzzle-display 
    flex flex-col justify-center items-center 
    bg-white rounded-lg border-2 border-gray-200 
    p-4 font-mono text-lg
    ${className}
  `;

  // Symbol rendering with proper spacing
  const renderSymbolSequence = (text) => {
    // Handle repeated symbols (🍎🍎🍎 → spaced symbols)
    return text.split('').map((char, index) => {
      // Check if character is an emoji (basic emoji detection)
      const isEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(char);
      
      if (isEmoji) {
        return (
          <span 
            key={index} 
            className="symbol text-2xl mx-0.5 inline-block"
            style={{ fontSize: '1.75rem' }}
          >
            {char}
          </span>
        );
      }
      
      // Regular characters (operators, numbers, etc.)
      return (
        <span 
          key={index} 
          className="operator text-xl font-semibold text-gray-700"
        >
          {char}
        </span>
      );
    });
  };

  // Render equations based on puzzle type
  const renderEquations = () => {
    switch (type) {
      case 'productSum':
        return (
          <div className="space-y-2 text-center">
            {equations.map((equation, index) => (
              <div key={index} className="equation-line">
                {renderSymbolSequence(equation)}
              </div>
            ))}
            
            {/* Separator line */}
            <div className="border-t-2 border-gray-300 w-40 mx-auto my-2"></div>
            
            {/* Question marks for unknowns */}
            <div className="unknowns-line text-lg space-x-6">
              {symbols.map((symbol, index) => (
                <span key={index} className="unknown-item">
                  <span className="symbol text-2xl">{symbol}</span>
                  <span className="operator text-xl font-semibold text-gray-700"> = </span>
                  <span className="text-xl text-gray-500">?</span>
                </span>
              ))}
            </div>
          </div>
        );

      case 'chainSolving':
        return (
          <div className="space-y-3 text-center">
            {equations.map((equation, index) => (
              <div key={index} className="chain-step">
                <div className="equation-line">
                  {renderSymbolSequence(equation)}
                </div>
                {/* Arrow down except for last equation */}
                {index < equations.length - 1 && (
                  <div className="arrow-down text-gray-400 text-lg my-1">↓</div>
                )}
              </div>
            ))}
            
            {/* Final target */}
            <div className="border-t-2 border-gray-300 w-32 mx-auto my-2"></div>
            <div className="target-line text-lg">
              <span className="symbol text-2xl">{targetSymbol}</span>
              <span className="operator text-xl font-semibold text-gray-700"> = </span>
              <span className="text-xl text-gray-500">?</span>
            </div>
          </div>
        );

      case 'simultaneous':
        return (
          <div className="space-y-2 text-center">
            {equations.map((equation, index) => (
              <div key={index} className="equation-line">
                {renderSymbolSequence(equation)}
              </div>
            ))}
            
            {/* Separator line */}
            <div className="border-t-2 border-gray-300 w-48 mx-auto my-2"></div>
            
            {/* Question marks for unknowns */}
            <div className="unknowns-line text-lg space-x-6">
              {symbols.map((symbol, index) => (
                <span key={index} className="unknown-item">
                  <span className="symbol text-2xl">{symbol}</span>
                  <span className="operator text-xl font-semibold text-gray-700"> = </span>
                  <span className="text-xl text-gray-500">?</span>
                </span>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-red-500 text-center">
            Unknown puzzle type: {type}
          </div>
        );
    }
  };

  // Render solutions when answers are shown
  const renderSolutions = () => {
    if (!showAnswers || !solutions) return null;

    return (
      <div className="solutions-overlay absolute inset-0 bg-green-50 bg-opacity-95 flex items-center justify-center rounded-lg border-2 border-green-300">
        <div className="text-center space-y-2">
          <div className="text-green-800 font-semibold text-lg mb-2">Solutions:</div>
          <div className="space-y-1">
            {Object.entries(solutions).map(([symbol, value]) => (
              <div key={symbol} className="solution-item text-lg">
                <span className="symbol text-2xl">{symbol}</span>
                <span className="operator text-xl font-semibold text-green-700"> = </span>
                <span className="value text-xl font-bold text-green-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Theme indicator (subtle)
  const renderThemeIndicator = () => {
    if (!themeDisplayName) return null;
    
    return (
      <div className="absolute top-1 right-2 text-xs text-gray-400 font-sans">
        {themeDisplayName}
      </div>
    );
  };

  return (
    <div 
      className={containerClasses}
      style={{ 
        height: containerHeight,
        minHeight: '120px',
        position: 'relative'
      }}
    >
      {renderThemeIndicator()}
      
      <div className="puzzle-content flex-1 flex items-center justify-center w-full">
        {renderEquations()}
      </div>
      
      {renderSolutions()}
    </div>
  );
};

/**
 * CompactSymbolPuzzle - Smaller version for use in tight spaces
 * Reduces font sizes and spacing for starter question cards
 */
export const CompactSymbolPuzzle = ({ puzzleDisplay, className = '' }) => {
  return (
    <SymbolPuzzleDisplay 
      puzzleDisplay={puzzleDisplay}
      containerHeight="100px"
      className={`compact-puzzle text-base ${className}`}
    />
  );
};

/**
 * ExpandedSymbolPuzzle - Larger version for main lesson content
 * Increases font sizes and spacing for better visibility
 */
export const ExpandedSymbolPuzzle = ({ puzzleDisplay, className = '' }) => {
  return (
    <SymbolPuzzleDisplay 
      puzzleDisplay={puzzleDisplay}
      containerHeight="200px"
      className={`expanded-puzzle text-xl ${className}`}
    />
  );
};

// CSS-in-JS styles for responsive behavior
const styles = `
  .symbol-puzzle-display .symbol {
    line-height: 1;
    vertical-align: middle;
  }
  
  .symbol-puzzle-display .operator {
    line-height: 1;
    vertical-align: middle;
    margin: 0 0.25rem;
  }
  
  .symbol-puzzle-display .equation-line {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.125rem;
  }
  
  .symbol-puzzle-display .unknowns-line {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .symbol-puzzle-display .unknown-item {
    display: flex;
    align-items: center;
    margin: 0 0.5rem;
  }
  
  .symbol-puzzle-display .solution-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .symbol-puzzle-display {
      font-size: 0.875rem;
    }
    
    .symbol-puzzle-display .symbol {
      font-size: 1.5rem;
    }
    
    .symbol-puzzle-display .operator {
      font-size: 1rem;
    }
    
    .symbol-puzzle-display .unknowns-line {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  /* Animation for solution reveal */
  .solutions-overlay {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default SymbolPuzzleDisplay;