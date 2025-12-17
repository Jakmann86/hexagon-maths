// src/components/math/visualizations/RightTriangleSVG.jsx
// Pure SVG Right Triangle - V2.3
// Fixed: Angle arcs now work correctly for ALL orientations

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

  // Check if this is the "tent" / "right-angle-apex" orientation
  const isApexOrientation = orientation === 'right-angle-apex';

  // Calculate triangle points based on orientation
  const getTrianglePoints = () => {
    const baseScaled = 3.5 * scale;
    const heightScaled = 2.8 * scale;
    
    if (isApexOrientation) {
      // "Tent" shape - right angle at apex (top center)
      return {
        rightAngle: { x: svgWidth / 2, y: padding },
        baseEnd: { x: svgWidth / 2 + 2.5 * scale, y: svgHeight - padding },
        top: { x: svgWidth / 2 - 2.5 * scale, y: svgHeight - padding }
      };
    }
    
    // Standard orientations with rotation/flip
    const basePoints = {
      rightAngle: { x: padding, y: svgHeight - padding },
      baseEnd: { x: padding + baseScaled, y: svgHeight - padding },
      top: { x: padding, y: svgHeight - padding - heightScaled }
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
        case 'flip-vertical': y = -y; break;
        case 'flip-both': [x, y] = [-x, -y]; break;
        default: break;
      }
      
      return { x: x + centerX, y: y + centerY };
    };
    
    return {
      rightAngle: transformPoint(basePoints.rightAngle),
      baseEnd: transformPoint(basePoints.baseEnd),
      top: transformPoint(basePoints.top)
    };
  };
  
  const points = getTrianglePoints();

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

  // Arc path calculation for any vertex
  const createArcPath = (vertex, point1, point2, radius) => {
    // Calculate angles from vertex to each point
    const angle1 = Math.atan2(point1.y - vertex.y, point1.x - vertex.x);
    const angle2 = Math.atan2(point2.y - vertex.y, point2.x - vertex.x);
    
    // Determine sweep direction (always go the shorter way around)
    let startAngle = angle1;
    let endAngle = angle2;
    
    // Calculate the difference
    let diff = endAngle - startAngle;
    
    // Normalize to get the smaller arc
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    
    // Ensure we're drawing the interior angle (should be less than 90° for our triangles)
    const sweepFlag = diff > 0 ? 1 : 0;
    
    const start = {
      x: vertex.x + Math.cos(startAngle) * radius,
      y: vertex.y + Math.sin(startAngle) * radius
    };
    const end = {
      x: vertex.x + Math.cos(endAngle) * radius,
      y: vertex.y + Math.sin(endAngle) * radius
    };
    
    // Calculate midpoint angle for label positioning
    const midAngle = startAngle + diff / 2;
    
    return {
      path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y}`,
      sector: `M ${vertex.x} ${vertex.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y} Z`,
      midAngle,
      labelX: vertex.x + Math.cos(midAngle) * (radius + 14),
      labelY: vertex.y + Math.sin(midAngle) * (radius + 14)
    };
  };

  // Render angle arc at the appropriate vertex based on anglePosition and orientation
  const renderAngleArc = () => {
    if (!showAngle) return null;
    
    const arcRadius = 22;
    let vertex, adjacentPoint1, adjacentPoint2;
    
    // Determine which vertex has the angle based on anglePosition
    // For 'bottom-right', the angle is at the baseEnd vertex (opposite the right angle along the base)
    if (anglePosition === 'bottom-right' || anglePosition === 'base') {
      vertex = points.baseEnd;
      adjacentPoint1 = points.rightAngle; // Along the base
      adjacentPoint2 = points.top; // Along the hypotenuse
    } else if (anglePosition === 'top-left' || anglePosition === 'top') {
      vertex = points.top;
      adjacentPoint1 = points.rightAngle; // Along the height
      adjacentPoint2 = points.baseEnd; // Along the hypotenuse
    } else {
      // Default to bottom-right
      vertex = points.baseEnd;
      adjacentPoint1 = points.rightAngle;
      adjacentPoint2 = points.top;
    }
    
    const arc = createArcPath(vertex, adjacentPoint1, adjacentPoint2, arcRadius);

    return (
      <g>
        <path d={arc.sector} fill="#8b5cf6" fillOpacity="0.2" />
        <path d={arc.path} fill="none" stroke="#7c3aed" strokeWidth="2" />
        <text 
          x={arc.labelX} 
          y={arc.labelY} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontSize="12" 
          fill="#1a1a1a" 
          fontWeight="600"
        >
          {getAngleLabel()}
        </text>
      </g>
    );
  };

  // Calculate label positions - orientation aware
  // Increase offset for longer labels (3+ characters)
  const getLabelPosition = (side, labelText) => {
    const triCenterX = (points.rightAngle.x + points.baseEnd.x + points.top.x) / 3;
    const triCenterY = (points.rightAngle.y + points.baseEnd.y + points.top.y) / 3;
    
    // Base offset, increased for longer labels
    const labelLength = labelText ? String(labelText).length : 0;
    const baseOffset = 20;
    const extraOffset = labelLength >= 5 ? 8 : labelLength >= 3 ? 4 : 0;
    const labelOffset = baseOffset + extraOffset;
    
    const getMidpointAndPerpendicular = (p1, p2) => {
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const perpX = -dy / len;
      const perpY = dx / len;
      
      // Choose direction away from triangle center
      const testX = midX + perpX * 10;
      const testY = midY + perpY * 10;
      const distFromCenter = Math.sqrt((testX - triCenterX) ** 2 + (testY - triCenterY) ** 2);
      const distFromCenterOpp = Math.sqrt((midX - perpX * 10 - triCenterX) ** 2 + (midY - perpY * 10 - triCenterY) ** 2);
      const sign = distFromCenter > distFromCenterOpp ? 1 : -1;
      
      return { 
        x: midX + sign * perpX * labelOffset, 
        y: midY + sign * perpY * labelOffset 
      };
    };
    
    if (side === 'base') {
      return getMidpointAndPerpendicular(points.rightAngle, points.baseEnd);
    }
    if (side === 'height') {
      return getMidpointAndPerpendicular(points.rightAngle, points.top);
    }
    if (side === 'hypotenuse') {
      return getMidpointAndPerpendicular(points.baseEnd, points.top);
    }
    
    return { x: 0, y: 0 };
  };

  // Render right angle marker
  const renderRightAngleMarker = () => {
    if (!showRightAngle) return null;
    
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
        {renderRightAngleMarker()}

        {/* Angle arc */}
        {renderAngleArc()}

        {/* Base label */}
        {baseLabel && (() => {
          const pos = getLabelPosition('base', baseLabel);
          return (
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#1a1a1a" fontWeight="500">
              {baseLabel}
            </text>
          );
        })()}

        {/* Height label */}
        {heightLabel && (() => {
          const pos = getLabelPosition('height', heightLabel);
          return (
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#1a1a1a" fontWeight="500">
              {heightLabel}
            </text>
          );
        })()}

        {/* Hypotenuse label */}
        {hypotenuseLabel && (() => {
          const pos = getLabelPosition('hypotenuse', hypotenuseLabel);
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