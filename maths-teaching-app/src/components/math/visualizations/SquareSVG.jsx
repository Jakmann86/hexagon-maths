// src/components/math/visualizations/SquareSVG.jsx
// Simple SVG square for starters and diagnostics - V2.1
// NO right angle markers (it's a square - all angles are 90°)

import React from 'react';

const SquareSVG = ({ 
  sideLength, 
  showSide = true, 
  showArea = false, 
  areaLabel = null,
  units = 'cm',
  showAnswer = false,
  size = 'normal'
}) => {
  const svgWidth = size === 'small' ? 100 : 140;
  const svgHeight = size === 'small' ? 100 : 140;
  const padding = size === 'small' ? 15 : 20;
  const squareSize = svgWidth - padding * 2;
  const fontSize = size === 'small' ? 11 : 14;
  const areaFontSize = size === 'small' ? 12 : 16;
  
  const area = sideLength * sideLength;
  const displayAreaLabel = areaLabel || `${area} ${units}²`;
  
  return (
    <svg 
      width={svgWidth} 
      height={svgHeight} 
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="overflow-visible"
    >
      {/* Square fill and stroke - NO right angle marker */}
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
      
      {/* Area label in center */}
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
    </svg>
  );
};

export default SquareSVG;