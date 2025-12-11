// src/components/math/visualizations/CoordinateGridSVG.jsx
// Pure SVG Coordinate Grid - For coordinate geometry distance problems
// Used in Pythagoras challenge section

import React from 'react';

/**
 * CoordinateGridSVG - Pure SVG coordinate grid visualization
 * Shows two points on a coordinate plane with optional right triangle construction
 * 
 * @param {Object} config - Configuration from generator
 * @param {Array} config.point1 - First point [x, y]
 * @param {Array} config.point2 - Second point [x, y]
 * @param {string} config.point1Label - Label for point1 (default: 'A')
 * @param {string} config.point2Label - Label for point2 (default: 'B')
 * @param {number} config.gridSize - Grid extends from -gridSize to +gridSize (default: 6)
 * @param {boolean} config.showLine - Whether to show line between points
 * @param {boolean} config.showRightTriangle - Whether to show the right triangle construction
 * @param {boolean} config.showDistanceLabel - Whether to show distance on the line
 * @param {number} config.distance - The distance value to display
 * @param {number} config.dx - Horizontal distance (for labels)
 * @param {number} config.dy - Vertical distance (for labels)
 * @param {boolean} showAnswer - Whether to reveal the solution (right triangle + measurements)
 */
const CoordinateGridSVG = ({ 
  config = {}, 
  showAnswer = false,
  className = '' 
}) => {
  const {
    point1 = [1, 1],
    point2 = [4, 5],
    point1Label = 'A',
    point2Label = 'B',
    gridSize = 6,
    showLine = true,
    showRightTriangle = false,
    showDistanceLabel = false,
    distance = null,
    dx = null,
    dy = null
  } = config;

  // SVG dimensions
  const svgWidth = 380;
  const svgHeight = 380;
  const padding = 40;

  // Calculate the coordinate system
  const gridRange = gridSize * 2; // Total range (e.g., -6 to 6 = 12 units)
  const cellSize = (svgWidth - padding * 2) / gridRange;
  
  // Convert coordinate to SVG position
  const toSvgX = (x) => padding + (x + gridSize) * cellSize;
  const toSvgY = (y) => svgHeight - padding - (y + gridSize) * cellSize;

  // Calculate actual distances if not provided
  const actualDx = dx !== null ? dx : (point2[0] - point1[0]);
  const actualDy = dy !== null ? dy : (point2[1] - point1[1]);
  const actualDistance = distance !== null ? distance : 
    Math.round(Math.sqrt(actualDx * actualDx + actualDy * actualDy) * 100) / 100;

  // Point positions in SVG coordinates
  const p1 = { x: toSvgX(point1[0]), y: toSvgY(point1[1]) };
  const p2 = { x: toSvgX(point2[0]), y: toSvgY(point2[1]) };
  // Right angle point (same x as p2, same y as p1)
  const pRight = { x: toSvgX(point2[0]), y: toSvgY(point1[1]) };

  // Generate grid lines
  const gridLines = [];
  for (let i = -gridSize; i <= gridSize; i++) {
    // Vertical lines
    gridLines.push(
      <line
        key={`v${i}`}
        x1={toSvgX(i)}
        y1={padding}
        x2={toSvgX(i)}
        y2={svgHeight - padding}
        stroke={i === 0 ? '#374151' : '#e5e7eb'}
        strokeWidth={i === 0 ? 2 : 1}
      />
    );
    // Horizontal lines
    gridLines.push(
      <line
        key={`h${i}`}
        x1={padding}
        y1={toSvgY(i)}
        x2={svgWidth - padding}
        y2={toSvgY(i)}
        stroke={i === 0 ? '#374151' : '#e5e7eb'}
        strokeWidth={i === 0 ? 2 : 1}
      />
    );
  }

  // Generate axis labels
  const axisLabels = [];
  for (let i = -gridSize; i <= gridSize; i++) {
    if (i !== 0) {
      // X-axis labels
      axisLabels.push(
        <text
          key={`xl${i}`}
          x={toSvgX(i)}
          y={toSvgY(0) + 18}
          textAnchor="middle"
          fontSize="11"
          fill="#6b7280"
        >
          {i}
        </text>
      );
      // Y-axis labels
      axisLabels.push(
        <text
          key={`yl${i}`}
          x={toSvgX(0) - 10}
          y={toSvgY(i) + 4}
          textAnchor="end"
          fontSize="11"
          fill="#6b7280"
        >
          {i}
        </text>
      );
    }
  }

  // Origin label
  axisLabels.push(
    <text
      key="origin"
      x={toSvgX(0) - 8}
      y={toSvgY(0) + 16}
      textAnchor="end"
      fontSize="11"
      fill="#6b7280"
    >
      0
    </text>
  );

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight} 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        {/* Background */}
        <rect
          x={padding}
          y={padding}
          width={svgWidth - padding * 2}
          height={svgHeight - padding * 2}
          fill="#fafafa"
        />

        {/* Grid lines */}
        {gridLines}

        {/* Axis labels */}
        {axisLabels}

        {/* Axis arrows */}
        {/* X-axis arrow */}
        <polygon
          points={`${svgWidth - padding + 5},${toSvgY(0)} ${svgWidth - padding - 5},${toSvgY(0) - 5} ${svgWidth - padding - 5},${toSvgY(0) + 5}`}
          fill="#374151"
        />
        <text
          x={svgWidth - padding + 12}
          y={toSvgY(0) + 4}
          fontSize="13"
          fontWeight="600"
          fill="#374151"
        >
          x
        </text>

        {/* Y-axis arrow */}
        <polygon
          points={`${toSvgX(0)},${padding - 5} ${toSvgX(0) - 5},${padding + 5} ${toSvgX(0) + 5},${padding + 5}`}
          fill="#374151"
        />
        <text
          x={toSvgX(0) + 10}
          y={padding}
          fontSize="13"
          fontWeight="600"
          fill="#374151"
        >
          y
        </text>

        {/* Right triangle construction (shown when showAnswer is true) */}
        {showAnswer && (showRightTriangle || true) && (
          <>
            {/* Horizontal leg (dashed) */}
            <line
              x1={p1.x}
              y1={p1.y}
              x2={pRight.x}
              y2={pRight.y}
              stroke="#22c55e"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            
            {/* Vertical leg (dashed) */}
            <line
              x1={pRight.x}
              y1={pRight.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#22c55e"
              strokeWidth="2"
              strokeDasharray="6,4"
            />

            {/* Right angle marker */}
            <path
              d={`M ${pRight.x - 10} ${pRight.y} 
                  L ${pRight.x - 10} ${pRight.y + (actualDy > 0 ? -10 : 10)} 
                  L ${pRight.x} ${pRight.y + (actualDy > 0 ? -10 : 10)}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
            />

            {/* Horizontal distance label */}
            <text
              x={(p1.x + pRight.x) / 2}
              y={p1.y + (actualDy > 0 ? 20 : -10)}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#22c55e"
            >
              {Math.abs(actualDx)}
            </text>

            {/* Vertical distance label */}
            <text
              x={pRight.x + 15}
              y={(pRight.y + p2.y) / 2}
              textAnchor="start"
              fontSize="13"
              fontWeight="600"
              fill="#22c55e"
            >
              {Math.abs(actualDy)}
            </text>
          </>
        )}

        {/* Line between points */}
        {showLine && (
          <line
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#9333ea"
            strokeWidth="3"
          />
        )}

        {/* Distance label on line */}
        {showAnswer && (showDistanceLabel || true) && (
          <text
            x={(p1.x + p2.x) / 2 - 15}
            y={(p1.y + p2.y) / 2 - 10}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#9333ea"
          >
            d = {actualDistance}
          </text>
        )}

        {/* Point 1 */}
        <circle
          cx={p1.x}
          cy={p1.y}
          r="6"
          fill="#ef4444"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x={p1.x - 12}
          y={p1.y - 12}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#ef4444"
        >
          {point1Label}({point1[0]}, {point1[1]})
        </text>

        {/* Point 2 */}
        <circle
          cx={p2.x}
          cy={p2.y}
          r="6"
          fill="#3b82f6"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x={p2.x + 12}
          y={p2.y - 12}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#3b82f6"
        >
          {point2Label}({point2[0]}, {point2[1]})
        </text>
      </svg>
    </div>
  );
};

export default CoordinateGridSVG;