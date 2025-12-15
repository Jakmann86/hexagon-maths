// src/components/math/visualizations/SquareSVG.jsx
// Simple SVG square for starters and diagnostics - V3.0
// Accepts either individual props OR config object (Pattern 2 compatible)
// NO right angle markers (it's a square - all angles are 90°)

import React from 'react';

const SquareSVG = ({ 
  // Can receive props individually OR via config object
  config = {},
  sideLength: sideLengthProp, 
  showSide: showSideProp = true, 
  showArea: showAreaProp = false, 
  areaLabel: areaLabelProp = null,
  units: unitsProp = 'cm',
  showAnswer = false,
  size: sizeProp = 'normal'
}) => {
  // Extract from config or use direct props (direct props take precedence)
  const sideLength = sideLengthProp ?? config.sideLength;
  const showSide = showSideProp !== undefined ? showSideProp : (config.showDimensions !== false && !config.showArea);
  const showArea = showAreaProp ?? config.showArea ?? false;
  const areaLabel = areaLabelProp ?? config.areaLabel;
  const units = unitsProp ?? config.units ?? 'cm';
  const size = sizeProp ?? config.size ?? 'normal';

  // Guard against missing sideLength
  if (sideLength === undefined || sideLength === null) {
    console.warn('SquareSVG: sideLength is required');
    return null;
  }

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