// src/components/math/visualizations/IsoscelesTriangleDisplay.jsx
// Pattern 2 Visualization Wrapper for Isosceles Triangles
// Used for Pythagoras area questions where we split the triangle
//
// Usage in StarterSectionBase:
// <IsoscelesTriangleDisplay config={data.visualization} showAnswer={showAnswers} />

import React from 'react';

/**
 * IsoscelesTriangleDisplay - Simple SVG isosceles triangle for starters
 * 
 * Generator config format:
 * {
 *   type: 'isosceles-triangle',
 *   base: 6,
 *   equalSide: 5,
 *   height: 4,           // Calculated height (may be hidden)
 *   showHeight: false,   // Whether to show height line
 *   labels: {
 *     base: '6 cm',
 *     leftSide: '5 cm',
 *     rightSide: '5 cm',
 *     height: '?'
 *   },
 *   units: 'cm'
 * }
 */
const IsoscelesTriangleDisplay = ({ 
  config, 
  showAnswer = false,
  sectionType = 'starter',
  className = ''
}) => {
  if (!config) return null;
  
  const {
    base = 6,
    equalSide = 5,
    height,
    showHeight = false,
    labels = {},
    units = 'cm'
  } = config;
  
  // Calculate height if not provided
  const halfBase = base / 2;
  const calculatedHeight = height || Math.sqrt(equalSide * equalSide - halfBase * halfBase);
  const roundedHeight = Math.round(calculatedHeight * 100) / 100;
  
  // SVG dimensions and scaling
  const svgWidth = 160;
  const svgHeight = 120;
  const padding = 20;
  
  // Scale triangle to fit SVG
  const scale = Math.min(
    (svgWidth - padding * 2) / base,
    (svgHeight - padding * 2) / calculatedHeight
  ) * 0.85;
  
  // Triangle points (centered)
  const centerX = svgWidth / 2;
  const bottomY = svgHeight - padding;
  const topY = bottomY - (calculatedHeight * scale);
  
  const points = {
    left: { x: centerX - (halfBase * scale), y: bottomY },
    right: { x: centerX + (halfBase * scale), y: bottomY },
    top: { x: centerX, y: topY }
  };
  
  // Build labels
  const baseLabel = labels.base ?? `${base} ${units}`;
  const leftLabel = labels.leftSide ?? `${equalSide} ${units}`;
  const rightLabel = labels.rightSide ?? `${equalSide} ${units}`;
  const heightLabel = showAnswer 
    ? `${roundedHeight} ${units}` 
    : (labels.height ?? '?');
  
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight} 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        {/* Main triangle */}
        <polygon
          points={`${points.left.x},${points.left.y} ${points.right.x},${points.right.y} ${points.top.x},${points.top.y}`}
          fill="#e0f2fe"
          stroke="#0284c7"
          strokeWidth="2"
        />
        
        {/* Height line (dashed, shown when revealing answer or if showHeight) */}
        {(showAnswer || showHeight) && (
          <>
            <line
              x1={points.top.x}
              y1={points.top.y}
              x2={points.top.x}
              y2={bottomY}
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Right angle marker at base */}
            <path
              d={`M ${points.top.x + 6} ${bottomY} L ${points.top.x + 6} ${bottomY - 6} L ${points.top.x} ${bottomY - 6}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1"
            />
          </>
        )}
        
        {/* Equal side markers (tick marks) */}
        {/* Left side tick */}
        <line
          x1={(points.left.x + points.top.x) / 2 - 4}
          y1={(points.left.y + points.top.y) / 2 - 3}
          x2={(points.left.x + points.top.x) / 2 + 4}
          y2={(points.left.y + points.top.y) / 2 + 3}
          stroke="#0284c7"
          strokeWidth="2"
        />
        {/* Right side tick */}
        <line
          x1={(points.right.x + points.top.x) / 2 - 4}
          y1={(points.right.y + points.top.y) / 2 + 3}
          x2={(points.right.x + points.top.x) / 2 + 4}
          y2={(points.right.y + points.top.y) / 2 - 3}
          stroke="#0284c7"
          strokeWidth="2"
        />
        
        {/* Labels */}
        {/* Base label */}
        <text
          x={centerX}
          y={bottomY + 14}
          textAnchor="middle"
          fontSize="11"
          fill="#1e40af"
          fontWeight="500"
        >
          {baseLabel}
        </text>
        
        {/* Left side label */}
        <text
          x={(points.left.x + points.top.x) / 2 - 12}
          y={(points.left.y + points.top.y) / 2}
          textAnchor="middle"
          fontSize="11"
          fill="#1e40af"
          fontWeight="500"
        >
          {leftLabel}
        </text>
        
        {/* Right side label */}
        <text
          x={(points.right.x + points.top.x) / 2 + 12}
          y={(points.right.y + points.top.y) / 2}
          textAnchor="middle"
          fontSize="11"
          fill="#1e40af"
          fontWeight="500"
        >
          {rightLabel}
        </text>
        
        {/* Height label (only when showing) */}
        {(showAnswer || showHeight) && (
          <text
            x={points.top.x + 14}
            y={(points.top.y + bottomY) / 2}
            textAnchor="start"
            fontSize="11"
            fill="#dc2626"
            fontWeight="500"
          >
            {heightLabel}
          </text>
        )}
      </svg>
    </div>
  );
};

export default IsoscelesTriangleDisplay;