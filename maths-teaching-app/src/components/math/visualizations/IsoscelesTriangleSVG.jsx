// src/components/math/visualizations/IsoscelesTriangleSVG.jsx
// Pure SVG Isosceles Triangle - V2.1 with improved label positioning

import React from 'react';

const IsoscelesTriangleSVG = ({ 
  config = {}, 
  showAnswer = false,
  className = '' 
}) => {
  const {
    base = 8,
    equalSide = 5,
    height: providedHeight,
    showHeight = false,
    showRightAngle = true,
    labels = {},
    units = 'cm'
  } = config;

  const halfBase = base / 2;
  const calculatedHeight = providedHeight || Math.sqrt(equalSide * equalSide - halfBase * halfBase);
  const height = Math.round(calculatedHeight * 100) / 100;

  // SVG dimensions
  const svgWidth = 220;
  const svgHeight = 180;
  const padding = 35;

  const availableWidth = svgWidth - padding * 2;
  const availableHeight = svgHeight - padding * 2;
  
  const scaleX = availableWidth / base;
  const scaleY = availableHeight / height;
  const scale = Math.min(scaleX, scaleY) * 0.85;

  const scaledBase = base * scale;
  const scaledHeight = height * scale;
  
  const startX = (svgWidth - scaledBase) / 2;
  const baseY = svgHeight - padding;
  const apexY = baseY - scaledHeight;

  const points = {
    apex: { x: svgWidth / 2, y: apexY },
    leftBase: { x: startX, y: baseY },
    rightBase: { x: startX + scaledBase, y: baseY },
    midBase: { x: svgWidth / 2, y: baseY }
  };

  const getLabel = (key, defaultValue) => {
    if (labels[key] !== undefined) {
      if (showAnswer && labels[key] === '?') {
        return `${defaultValue} ${units}`;
      }
      return labels[key];
    }
    return `${defaultValue} ${units}`;
  };

  const baseLabel = getLabel('base', base);
  const leftSideLabel = getLabel('leftSide', equalSide);
  const rightSideLabel = getLabel('rightSide', equalSide);
  const heightLabel = labels.height === '?' 
    ? (showAnswer ? `${height} ${units}` : '?')
    : (labels.height || `${height} ${units}`);

  // Hash marks for equal sides
  const getHashMarkPosition = (p1, p2) => {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / len;
    const perpY = dx / len;
    return {
      x1: midX + perpX * 6,
      y1: midY + perpY * 6,
      x2: midX - perpX * 6,
      y2: midY - perpY * 6
    };
  };

  const leftHashMark = getHashMarkPosition(points.apex, points.leftBase);
  const rightHashMark = getHashMarkPosition(points.apex, points.rightBase);

  // Improved label positions - pushed out MORE
  const getSlantLabelPosition = (p1, p2, side) => {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / len;
    const perpY = dx / len;
    
    // Push labels OUTWARD from triangle center - increased offset to 24
    const offset = 24;
    if (side === 'left') {
      return { x: midX - offset, y: midY };
    } else {
      return { x: midX + offset, y: midY };
    }
  };

  const leftLabelPos = getSlantLabelPosition(points.apex, points.leftBase, 'left');
  const rightLabelPos = getSlantLabelPosition(points.apex, points.rightBase, 'right');

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg 
        width={svgWidth} 
        height={svgHeight} 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        {/* Triangle fill */}
        <polygon
          points={`${points.apex.x},${points.apex.y} ${points.leftBase.x},${points.leftBase.y} ${points.rightBase.x},${points.rightBase.y}`}
          fill="#fef3c7"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Height line (dashed) */}
        {(showHeight || showAnswer) && (
          <line
            x1={points.apex.x}
            y1={points.apex.y}
            x2={points.midBase.x}
            y2={points.midBase.y}
            stroke="#dc2626"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
        )}

        {/* Right angle marker at base */}
        {(showHeight || showAnswer) && showRightAngle && (
          <path
            d={`M ${points.midBase.x - 10} ${points.midBase.y} 
                L ${points.midBase.x - 10} ${points.midBase.y - 10} 
                L ${points.midBase.x} ${points.midBase.y - 10}`}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
        )}

        {/* Hash marks on equal sides */}
        <line
          x1={leftHashMark.x1} y1={leftHashMark.y1}
          x2={leftHashMark.x2} y2={leftHashMark.y2}
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        <line
          x1={rightHashMark.x1} y1={rightHashMark.y1}
          x2={rightHashMark.x2} y2={rightHashMark.y2}
          stroke="#1a1a1a"
          strokeWidth="2"
        />

        {/* Base label */}
        <text
          x={svgWidth / 2}
          y={baseY + 20}
          textAnchor="middle"
          fontSize="13"
          fill="#1a1a1a"
          fontWeight="500"
        >
          {baseLabel}
        </text>

        {/* Left side label - pushed out more */}
        <text
          x={leftLabelPos.x}
          y={leftLabelPos.y}
          textAnchor="middle"
          fontSize="13"
          fill="#1a1a1a"
          fontWeight="500"
        >
          {leftSideLabel}
        </text>

        {/* Right side label - pushed out more */}
        <text
          x={rightLabelPos.x}
          y={rightLabelPos.y}
          textAnchor="middle"
          fontSize="13"
          fill="#1a1a1a"
          fontWeight="500"
        >
          {rightSideLabel}
        </text>

        {/* Height label - positioned to the RIGHT of the height line, not overlapping */}
        {(showHeight || showAnswer) && (
          <text
            x={points.midBase.x + 25}
            y={(points.apex.y + points.midBase.y) / 2}
            textAnchor="start"
            fontSize="13"
            fill="#dc2626"
            fontWeight="600"
          >
            h = {heightLabel}
          </text>
        )}

        {/* Half-base labels when showing height */}
        {(showHeight || showAnswer) && (
          <text
            x={(points.leftBase.x + points.midBase.x) / 2}
            y={baseY + 20}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
          >
            {base/2} {units}
          </text>
        )}
      </svg>
    </div>
  );
};

export default IsoscelesTriangleSVG;