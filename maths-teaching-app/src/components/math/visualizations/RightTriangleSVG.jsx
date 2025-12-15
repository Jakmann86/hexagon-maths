// src/components/math/visualizations/RightTriangleSVG.jsx
// Pure SVG Right Triangle - V2.2 with orientation-aware label positioning

import React from 'react';

const RightTriangleSVG = ({ 
  config = {}, 
  showAnswer = false,
  className = '' 
}) => {
  const {
    base = 6,
    height = 5,
    hypotenuse: hypotenuseInput,
    unknownSide = null,
    angle = null,
    showAngle = false,
    anglePosition = 'bottom-right',
    unknownAngle = false,
    labels = {},
    units = 'cm',
    showRightAngle = true,
    orientation = 'default'
  } = config;

  const hypotenuse = hypotenuseInput || Math.round(Math.sqrt(base * base + height * height) * 100) / 100;

  // SVG dimensions
  const svgWidth = 180;
  const svgHeight = 140;
  const padding = 30;

  const maxBase = svgWidth - padding * 2;
  const maxHeight = svgHeight - padding * 2;
  const visualRatio = Math.min(maxBase / 4, maxHeight / 3);
  const scale = visualRatio;

  // Base triangle points (before transformation)
  const basePoints = {
    rightAngle: { x: padding, y: svgHeight - padding },
    baseEnd: { x: padding + 3.5 * scale, y: svgHeight - padding },
    top: { x: padding, y: svgHeight - padding - 2.8 * scale }
  };

  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  const transformPoint = (point) => {
    let x = point.x - centerX;
    let y = point.y - centerY;
    
    switch (orientation) {
      case 'rotate90': [x, y] = [y, -x]; break;
      case 'rotate180': [x, y] = [-x, -y]; break;
      case 'rotate270': [x, y] = [-y, x]; break;
      case 'flip': x = -x; break;
      default: break;
    }
    
    return { x: x + centerX, y: y + centerY };
  };
  
  const points = {
    rightAngle: transformPoint(basePoints.rightAngle),
    baseEnd: transformPoint(basePoints.baseEnd),
    top: transformPoint(basePoints.top)
  };

  // Build labels
  const getLabel = (side, value) => {
    if (labels[side] !== undefined) {
      if (showAnswer && labels[side] === '?') {
        return `${value} ${units}`;
      }
      return labels[side];
    }
    if (unknownSide === side) {
      return showAnswer ? `${value} ${units}` : '?';
    }
    return `${value} ${units}`;
  };

  const baseLabel = getLabel('base', base);
  const heightLabel = getLabel('height', height);
  const hypotenuseLabel = getLabel('hypotenuse', hypotenuse);

  // Angle label for SOHCAHTOA
  const getAngleLabel = () => {
    if (!showAngle || !angle) return null;
    if (unknownAngle) return showAnswer ? `${angle}°` : 'θ';
    return `${angle}°`;
  };

  // Arc path for angles
  const createArcPath = (center, startAngle, endAngle, radius) => {
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 2 * Math.PI;
    if (diff > Math.PI) {
      const temp = startAngle;
      startAngle = endAngle;
      endAngle = temp;
      diff = 2 * Math.PI - diff;
    }
    
    const start = {
      x: center.x + Math.cos(startAngle) * radius,
      y: center.y + Math.sin(startAngle) * radius
    };
    const end = {
      x: center.x + Math.cos(endAngle) * radius,
      y: center.y + Math.sin(endAngle) * radius
    };
    
    const largeArc = diff > Math.PI ? 1 : 0;
    const midAngle = startAngle + diff / 2;
    
    return {
      path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      sector: `M ${center.x} ${center.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`,
      midAngle
    };
  };

  const renderAngleArc = () => {
    if (!showAngle) return null;
    const arcRadius = 22;
    const labelRadius = 36;
    
    if (anglePosition === 'bottom-right') {
      const toTop = Math.atan2(points.top.y - points.baseEnd.y, points.top.x - points.baseEnd.x);
      const toBase = Math.PI;
      const arc = createArcPath(points.baseEnd, toBase, toTop, arcRadius);
      const labelX = points.baseEnd.x + Math.cos(arc.midAngle) * labelRadius;
      const labelY = points.baseEnd.y + Math.sin(arc.midAngle) * labelRadius;

      return (
        <g>
          <path d={arc.sector} fill="#8b5cf6" fillOpacity="0.2" />
          <path d={arc.path} fill="none" stroke="#7c3aed" strokeWidth="2" />
          <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#1a1a1a" fontWeight="600">
            {getAngleLabel()}
          </text>
        </g>
      );
    }
    return null;
  };

  // Calculate label positions - ORIENTATION AWARE
  // Push labels AWAY from the triangle center, perpendicular to each edge
  const getLabelPosition = (side) => {
    const triCenterX = (points.rightAngle.x + points.baseEnd.x + points.top.x) / 3;
    const triCenterY = (points.rightAngle.y + points.baseEnd.y + points.top.y) / 3;
    const labelOffset = 20;
    
    if (side === 'base') {
      // Base is from rightAngle to baseEnd
      const midX = (points.rightAngle.x + points.baseEnd.x) / 2;
      const midY = (points.rightAngle.y + points.baseEnd.y) / 2;
      
      // Get perpendicular direction
      const dx = points.baseEnd.x - points.rightAngle.x;
      const dy = points.baseEnd.y - points.rightAngle.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const perpX = -dy / len;
      const perpY = dx / len;
      
      // Choose direction away from triangle center
      const testX = midX + perpX * 10;
      const testY = midY + perpY * 10;
      const distFromCenter = Math.sqrt((testX - triCenterX) ** 2 + (testY - triCenterY) ** 2);
      const distFromCenterOpp = Math.sqrt((midX - perpX * 10 - triCenterX) ** 2 + (midY - perpY * 10 - triCenterY) ** 2);
      const sign = distFromCenter > distFromCenterOpp ? 1 : -1;
      
      return { x: midX + sign * perpX * labelOffset, y: midY + sign * perpY * labelOffset };
    }
    
    if (side === 'height') {
      // Height is from rightAngle to top
      const midX = (points.rightAngle.x + points.top.x) / 2;
      const midY = (points.rightAngle.y + points.top.y) / 2;
      
      // Get perpendicular direction
      const dx = points.top.x - points.rightAngle.x;
      const dy = points.top.y - points.rightAngle.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const perpX = -dy / len;
      const perpY = dx / len;
      
      // Choose direction away from triangle center
      const testX = midX + perpX * 10;
      const testY = midY + perpY * 10;
      const distFromCenter = Math.sqrt((testX - triCenterX) ** 2 + (testY - triCenterY) ** 2);
      const distFromCenterOpp = Math.sqrt((midX - perpX * 10 - triCenterX) ** 2 + (midY - perpY * 10 - triCenterY) ** 2);
      const sign = distFromCenter > distFromCenterOpp ? 1 : -1;
      
      return { x: midX + sign * perpX * labelOffset, y: midY + sign * perpY * labelOffset };
    }
    
    if (side === 'hypotenuse') {
      // Hypotenuse is from baseEnd to top
      const midX = (points.baseEnd.x + points.top.x) / 2;
      const midY = (points.baseEnd.y + points.top.y) / 2;
      
      // Get perpendicular direction
      const dx = points.top.x - points.baseEnd.x;
      const dy = points.top.y - points.baseEnd.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const perpX = -dy / len;
      const perpY = dx / len;
      
      // Choose direction away from triangle center
      const testX = midX + perpX * 10;
      const testY = midY + perpY * 10;
      const distFromCenter = Math.sqrt((testX - triCenterX) ** 2 + (testY - triCenterY) ** 2);
      const distFromCenterOpp = Math.sqrt((midX - perpX * 10 - triCenterX) ** 2 + (midY - perpY * 10 - triCenterY) ** 2);
      const sign = distFromCenter > distFromCenterOpp ? 1 : -1;
      
      return { x: midX + sign * perpX * labelOffset, y: midY + sign * perpY * labelOffset };
    }
    
    return { x: 0, y: 0 };
  };

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
          points={`${points.rightAngle.x},${points.rightAngle.y} ${points.baseEnd.x},${points.baseEnd.y} ${points.top.x},${points.top.y}`}
          fill="#e8f4f8"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right angle marker */}
        {showRightAngle && (() => {
          const toBase = { 
            x: points.baseEnd.x - points.rightAngle.x, 
            y: points.baseEnd.y - points.rightAngle.y 
          };
          const toTop = { 
            x: points.top.x - points.rightAngle.x, 
            y: points.top.y - points.rightAngle.y 
          };
          
          const baseLen = Math.sqrt(toBase.x * toBase.x + toBase.y * toBase.y);
          const topLen = Math.sqrt(toTop.x * toTop.x + toTop.y * toTop.y);
          
          const baseUnit = { x: toBase.x / baseLen, y: toBase.y / baseLen };
          const topUnit = { x: toTop.x / topLen, y: toTop.y / topLen };
          
          const markerSize = 12;
          
          const p1 = {
            x: points.rightAngle.x + baseUnit.x * markerSize,
            y: points.rightAngle.y + baseUnit.y * markerSize
          };
          const p2 = {
            x: points.rightAngle.x + baseUnit.x * markerSize + topUnit.x * markerSize,
            y: points.rightAngle.y + baseUnit.y * markerSize + topUnit.y * markerSize
          };
          const p3 = {
            x: points.rightAngle.x + topUnit.x * markerSize,
            y: points.rightAngle.y + topUnit.y * markerSize
          };
          
          return (
            <path
              d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
          );
        })()}

        {renderAngleArc()}

        {/* Base label */}
        {baseLabel && (() => {
          const pos = getLabelPosition('base');
          return (
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#1a1a1a" fontWeight="500">
              {baseLabel}
            </text>
          );
        })()}

        {/* Height label */}
        {heightLabel && (() => {
          const pos = getLabelPosition('height');
          return (
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#1a1a1a" fontWeight="500">
              {heightLabel}
            </text>
          );
        })()}

        {/* Hypotenuse label */}
        {hypotenuseLabel && (() => {
          const pos = getLabelPosition('hypotenuse');
          return (
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#1a1a1a" fontWeight="500">
              {hypotenuseLabel}
            </text>
          );
        })()}
      </svg>
    </div>
  );
};

export default RightTriangleSVG;