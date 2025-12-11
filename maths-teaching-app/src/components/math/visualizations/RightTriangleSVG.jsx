// src/components/math/visualizations/RightTriangleSVG.jsx
// Pure SVG Right Triangle - Clean, predictable sizing for starters
// Supports Pythagoras (unknown sides) and SOHCAHTOA (angles)

import React from 'react';

/**
 * RightTriangleSVG - Pure SVG right triangle visualization
 * 
 * @param {Object} config - Configuration from generator
 * @param {number} config.base - Base length (for labels)
 * @param {number} config.height - Height length (for labels)  
 * @param {number} config.hypotenuse - Hypotenuse length (for labels)
 * @param {string} config.unknownSide - Which side is unknown: 'base', 'height', 'hypotenuse'
 * @param {number} config.angle - Angle in degrees (for SOHCAHTOA)
 * @param {boolean} config.showAngle - Whether to show angle arc
 * @param {string} config.anglePosition - 'bottom-right' or 'top' (which acute angle)
 * @param {boolean} config.unknownAngle - Whether angle is the unknown
 * @param {Object} config.labels - Custom labels { base, height, hypotenuse, angle }
 * @param {string} config.units - Units string ('cm', 'm', etc)
 * @param {Array} config.knownSides - For find-angle questions: which sides are known ['opposite', 'hypotenuse']
 * @param {boolean} showAnswer - Whether to reveal unknown values
 */
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
    knownSides = null, // For SOHCAHTOA find-angle: ['opposite', 'hypotenuse'] etc
    orientation = 'default' // 'default', 'rotate90', 'rotate180', 'rotate270', 'flip'
  } = config;

  // Calculate hypotenuse if not provided
  const hypotenuse = hypotenuseInput || Math.round(Math.sqrt(base * base + height * height) * 100) / 100;

  // SVG dimensions
  const svgWidth = 180;
  const svgHeight = 140;
  const padding = 30;

  // Calculate scale to fit triangle in SVG
  const maxBase = svgWidth - padding * 2;
  const maxHeight = svgHeight - padding * 2;
  
  // Use a fixed visual size ratio
  const visualRatio = Math.min(maxBase / 4, maxHeight / 3);
  const scale = visualRatio;

  // Base triangle points (right angle at bottom-left)
  const basePoints = {
    rightAngle: { x: padding, y: svgHeight - padding },
    baseEnd: { x: padding + 3.5 * scale, y: svgHeight - padding },
    top: { x: padding, y: svgHeight - padding - 2.8 * scale }
  };

  // Transform points based on orientation
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  const transformPoint = (point) => {
    // Translate to origin
    let x = point.x - centerX;
    let y = point.y - centerY;
    
    switch (orientation) {
      case 'rotate90':
        // Rotate 90° clockwise
        [x, y] = [y, -x];
        break;
      case 'rotate180':
        // Rotate 180°
        [x, y] = [-x, -y];
        break;
      case 'rotate270':
        // Rotate 270° clockwise (90° counter-clockwise)
        [x, y] = [-y, x];
        break;
      case 'flip':
        // Horizontal flip
        x = -x;
        break;
      default:
        // No transformation
        break;
    }
    
    // Translate back
    return { x: x + centerX, y: y + centerY };
  };
  
  const points = {
    rightAngle: transformPoint(basePoints.rightAngle),
    baseEnd: transformPoint(basePoints.baseEnd),
    top: transformPoint(basePoints.top)
  };

  // For SOHCAHTOA with angle at bottom-right:
  // - opposite = height (vertical side)
  // - adjacent = base (horizontal side)  
  // - hypotenuse = diagonal

  // Determine which labels to show based on knownSides (for find-angle questions)
  const shouldShowLabel = (side) => {
    if (!knownSides) return true; // Show all if not specified
    
    // Map side names to SOHCAHTOA terms (assuming angle at bottom-right)
    const sideMapping = {
      height: 'opposite',
      base: 'adjacent',
      hypotenuse: 'hypotenuse'
    };
    
    return knownSides.includes(sideMapping[side]);
  };

  // Build labels
  const getLabel = (side, value) => {
    // Don't show label if this side isn't in knownSides
    if (!shouldShowLabel(side)) return null;
    
    // If there's an explicit label, use it
    if (labels[side] !== undefined) {
      if (showAnswer && labels[side] === '?') {
        return `${value} ${units}`;
      }
      return labels[side];
    }
    
    // If this is the unknown side
    if (unknownSide === side) {
      return showAnswer ? `${value} ${units}` : '?';
    }
    
    // Default: show value with units
    return `${value} ${units}`;
  };

  const baseLabel = getLabel('base', base);
  const heightLabel = getLabel('height', height);
  const hypotenuseLabel = getLabel('hypotenuse', hypotenuse);

  // Angle label
  const getAngleLabel = () => {
    if (!showAngle || !angle) return null;
    if (unknownAngle) {
      return showAnswer ? `${angle}°` : 'θ';
    }
    return `${angle}°`;
  };

  // Create arc path using the same approach as parallel lines
  const createArcPath = (center, startAngle, endAngle, radius) => {
    // Ensure we go the short way around
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 2 * Math.PI;
    if (diff > Math.PI) {
      // Swap direction
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
    
    // Mid angle for label positioning
    const midAngle = startAngle + diff / 2;
    
    return {
      path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      sector: `M ${center.x} ${center.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`,
      midAngle
    };
  };

  // Render angle arc for SOHCAHTOA
  const renderAngleArc = () => {
    if (!showAngle) return null;

    const arcRadius = 22;
    const labelRadius = 36;
    
    if (anglePosition === 'bottom-right') {
      // Angle at baseEnd point
      // Direction to rightAngle (left along base): angle = π (180°)
      // Direction to top (up-left along hypotenuse)
      const toTop = Math.atan2(
        points.top.y - points.baseEnd.y,
        points.top.x - points.baseEnd.x
      );
      const toBase = Math.PI; // Points left
      
      const arc = createArcPath(points.baseEnd, toBase, toTop, arcRadius);
      
      const labelX = points.baseEnd.x + Math.cos(arc.midAngle) * labelRadius;
      const labelY = points.baseEnd.y + Math.sin(arc.midAngle) * labelRadius;

      return (
        <g>
          {/* Filled sector */}
          <path
            d={arc.sector}
            fill="#8b5cf6"
            fillOpacity="0.2"
          />
          {/* Arc line */}
          <path
            d={arc.path}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
          />
          {/* Angle label */}
          <text
            x={labelX}
            y={labelY}
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
    }
    
    if (anglePosition === 'top') {
      // Angle at top point
      // Direction to rightAngle (straight down): angle = π/2 (90° in SVG coords)
      // Direction to baseEnd (down-right along hypotenuse)
      const toBaseEnd = Math.atan2(
        points.baseEnd.y - points.top.y,
        points.baseEnd.x - points.top.x
      );
      const toDown = Math.PI / 2; // Points down
      
      const arc = createArcPath(points.top, toDown, toBaseEnd, arcRadius);
      
      const labelX = points.top.x + Math.cos(arc.midAngle) * labelRadius;
      const labelY = points.top.y + Math.sin(arc.midAngle) * labelRadius;

      return (
        <g>
          <path
            d={arc.sector}
            fill="#8b5cf6"
            fillOpacity="0.2"
          />
          <path
            d={arc.path}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
          />
          <text
            x={labelX}
            y={labelY}
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
    }

    return null;
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
        {showRightAngle && (
          <g>
            {/* Calculate right angle marker based on the two adjacent sides */}
            {(() => {
              // Vectors from right angle to other points
              const toBase = { 
                x: points.baseEnd.x - points.rightAngle.x, 
                y: points.baseEnd.y - points.rightAngle.y 
              };
              const toTop = { 
                x: points.top.x - points.rightAngle.x, 
                y: points.top.y - points.rightAngle.y 
              };
              
              // Normalize vectors
              const baseLen = Math.sqrt(toBase.x * toBase.x + toBase.y * toBase.y);
              const topLen = Math.sqrt(toTop.x * toTop.x + toTop.y * toTop.y);
              
              const baseUnit = { x: toBase.x / baseLen, y: toBase.y / baseLen };
              const topUnit = { x: toTop.x / topLen, y: toTop.y / topLen };
              
              // Right angle marker size
              const markerSize = 12;
              
              // Points for the right angle marker
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
          </g>
        )}

        {/* Angle arc (for SOHCAHTOA) */}
        {renderAngleArc()}

        {/* Labels - positioned relative to midpoints of sides */}
        {baseLabel && (() => {
          const midX = (points.rightAngle.x + points.baseEnd.x) / 2;
          const midY = (points.rightAngle.y + points.baseEnd.y) / 2;
          // Offset perpendicular to the line (outward from triangle center)
          const dx = points.baseEnd.x - points.rightAngle.x;
          const dy = points.baseEnd.y - points.rightAngle.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          // Perpendicular direction (away from triangle)
          const perpX = dy / len;
          const perpY = -dx / len;
          // Check which direction is away from triangle center
          const triCenterX = (points.rightAngle.x + points.baseEnd.x + points.top.x) / 3;
          const triCenterY = (points.rightAngle.y + points.baseEnd.y + points.top.y) / 3;
          const toCenter = (midX + perpX * 10 - triCenterX) * perpX + (midY + perpY * 10 - triCenterY) * perpY;
          const sign = toCenter > 0 ? 1 : -1;
          
          return (
            <text
              x={midX + sign * perpX * 16}
              y={midY + sign * perpY * 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fill="#1a1a1a"
              fontWeight="500"
            >
              {baseLabel}
            </text>
          );
        })()}

        {heightLabel && (() => {
          const midX = (points.rightAngle.x + points.top.x) / 2;
          const midY = (points.rightAngle.y + points.top.y) / 2;
          const dx = points.top.x - points.rightAngle.x;
          const dy = points.top.y - points.rightAngle.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const perpX = dy / len;
          const perpY = -dx / len;
          const triCenterX = (points.rightAngle.x + points.baseEnd.x + points.top.x) / 3;
          const triCenterY = (points.rightAngle.y + points.baseEnd.y + points.top.y) / 3;
          const toCenter = (midX + perpX * 10 - triCenterX) * perpX + (midY + perpY * 10 - triCenterY) * perpY;
          const sign = toCenter > 0 ? 1 : -1;
          
          return (
            <text
              x={midX + sign * perpX * 16}
              y={midY + sign * perpY * 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fill="#1a1a1a"
              fontWeight="500"
            >
              {heightLabel}
            </text>
          );
        })()}

        {hypotenuseLabel && (() => {
          const midX = (points.baseEnd.x + points.top.x) / 2;
          const midY = (points.baseEnd.y + points.top.y) / 2;
          const dx = points.top.x - points.baseEnd.x;
          const dy = points.top.y - points.baseEnd.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const perpX = dy / len;
          const perpY = -dx / len;
          const triCenterX = (points.rightAngle.x + points.baseEnd.x + points.top.x) / 3;
          const triCenterY = (points.rightAngle.y + points.baseEnd.y + points.top.y) / 3;
          const toCenter = (midX + perpX * 10 - triCenterX) * perpX + (midY + perpY * 10 - triCenterY) * perpY;
          const sign = toCenter > 0 ? 1 : -1;
          
          return (
            <text
              x={midX + sign * perpX * 16}
              y={midY + sign * perpY * 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fill="#1a1a1a"
              fontWeight="500"
            >
              {hypotenuseLabel}
            </text>
          );
        })()}
      </svg>
    </div>
  );
};

export default RightTriangleSVG;