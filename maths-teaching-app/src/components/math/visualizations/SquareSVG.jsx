// src/components/math/visualizations/SquareSVG.jsx
// Simple SVG square for starters and diagnostics
// Used for area/perimeter questions and square root visualization

import React from 'react';

/**
 * SquareSVG - Pure SVG square visualization
 * 
 * @param {Object} props
 * @param {number} props.sideLength - The side length of the square
 * @param {boolean} props.showSide - Whether to show the side length label
 * @param {boolean} props.showArea - Whether to show the area in the center
 * @param {string} props.areaLabel - Custom area label (e.g. "36 cm²")
 * @param {string} props.units - Units for labels (default: 'cm')
 * @param {boolean} props.showAnswer - Whether to reveal the answer (for unknown side)
 */
const SquareSVG = ({ 
  sideLength, 
  showSide = true, 
  showArea = false, 
  areaLabel = null,
  units = 'cm',
  showAnswer = false,
  size = 'normal' // 'small' for starters, 'normal' for diagnostics
}) => {
  // Size based on context
  const svgWidth = size === 'small' ? 100 : 140;
  const svgHeight = size === 'small' ? 100 : 140;
  const padding = size === 'small' ? 15 : 20;
  const squareSize = svgWidth - padding * 2;
  const fontSize = size === 'small' ? 11 : 14;
  const areaFontSize = size === 'small' ? 12 : 16;
  
  // Calculate area if not provided
  const area = sideLength * sideLength;
  const displayAreaLabel = areaLabel || `${area} ${units}²`;
  
  return (
    <svg 
      width={svgWidth} 
      height={svgHeight} 
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="overflow-visible"
    >
      {/* Square fill and stroke */}
      <rect
        x={padding}
        y={padding}
        width={squareSize}
        height={squareSize}
        fill="#dbeafe"
        stroke="#3b82f6"
        strokeWidth="2"
        rx="2"
      />
      
      {/* Area label in center (when showing area) */}
      {showArea && (
        <text
          x={svgWidth / 2}
          y={svgHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={areaFontSize}
          fontWeight="600"
          fill="#1e40af"
        >
          {displayAreaLabel}
        </text>
      )}
      
      {/* Side length label at bottom */}
      {showSide ? (
        <text
          x={svgWidth / 2}
          y={svgHeight - 3}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="500"
          fill="#1a1a1a"
        >
          {sideLength} {units}
        </text>
      ) : (
        // Show ? or revealed answer
        <text
          x={svgWidth / 2}
          y={svgHeight - 3}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="600"
          fill={showAnswer ? "#16a34a" : "#7c3aed"}
        >
          {showAnswer ? `${sideLength} ${units}` : `?`}
        </text>
      )}
      
      {/* Right angle marker in corner */}
      <path
        d={`M ${padding + 8} ${padding} L ${padding + 8} ${padding + 8} L ${padding} ${padding + 8}`}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
  );
};

export default SquareSVG;