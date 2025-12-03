// src/components/math/shapes/polygons/Quadrilateral.jsx
// Flexible quadrilateral component for various special quadrilaterals
// Supports: square, rectangle, parallelogram, rhombus, trapezium, kite, general

import React, { useMemo } from 'react';

/**
 * Quadrilateral - Renders various types of quadrilaterals
 * 
 * TYPES:
 * - square: All sides equal, all angles 90°
 * - rectangle: Opposite sides equal, all angles 90°
 * - parallelogram: Opposite sides parallel and equal
 * - rhombus: All sides equal, opposite angles equal
 * - trapezium: One pair of parallel sides
 * - kite: Two pairs of adjacent equal sides
 * - general: Custom vertices
 * 
 * @param {string} type - Type of quadrilateral
 * @param {number} width - Width (for rectangle, parallelogram, trapezium)
 * @param {number} height - Height
 * @param {number} skew - Skew amount for parallelogram/rhombus
 * @param {number} topWidth - Top width for trapezium
 * @param {Array} vertices - Custom vertices for 'general' type [{x, y}, ...]
 */
const Quadrilateral = ({
  type = 'rectangle',
  width = 120,
  height = 80,
  skew = 30,           // Horizontal offset for parallelogram/rhombus
  topWidth = 60,       // Top edge width for trapezium
  kiteRatio = 0.3,     // Where the kite "waist" is (0-1)
  
  // Custom vertices for general quadrilateral
  vertices: customVertices = null,
  
  // Display options
  showDiagonals = false,
  showParallelMarks = false,
  showEqualMarks = false,
  showRightAngles = false,
  showAngles = [],          // Array of vertex indices to show angles
  showAllAngles = false,
  
  // Labels
  showLabels = {
    vertices: false,
    sides: false,
    angles: false,
    diagonals: false
  },
  
  vertexLabels = {
    show: false,
    labels: ['A', 'B', 'C', 'D'],
    color: null
  },
  
  sideLabels = {
    show: false,
    labels: null,  // Array of 4 labels [AB, BC, CD, DA]
  },
  
  // Highlighting
  highlightSides = [],      // Indices 0-3
  highlightAngles = [],     // Indices 0-3
  highlightDiagonals = [],  // [0] = AC, [1] = BD
  
  // Styling
  style = {},
  className = ''
}) => {
  
  // Generate vertices based on type
  const vertices = useMemo(() => {
    if (customVertices && type === 'general') {
      return customVertices;
    }
    
    const halfW = width / 2;
    const halfH = height / 2;
    
    switch (type) {
      case 'square':
        const side = Math.min(width, height);
        const halfS = side / 2;
        return [
          { x: -halfS, y: -halfS },  // A - top left
          { x: halfS, y: -halfS },   // B - top right
          { x: halfS, y: halfS },    // C - bottom right
          { x: -halfS, y: halfS }    // D - bottom left
        ];
        
      case 'rectangle':
        return [
          { x: -halfW, y: -halfH },  // A
          { x: halfW, y: -halfH },   // B
          { x: halfW, y: halfH },    // C
          { x: -halfW, y: halfH }    // D
        ];
        
      case 'parallelogram':
        return [
          { x: -halfW + skew, y: -halfH },  // A
          { x: halfW + skew, y: -halfH },   // B
          { x: halfW - skew, y: halfH },    // C
          { x: -halfW - skew, y: halfH }    // D
        ];
        
      case 'rhombus':
        // Diamond shape - diagonals at right angles
        return [
          { x: 0, y: -halfH },       // A - top
          { x: halfW, y: 0 },        // B - right
          { x: 0, y: halfH },        // C - bottom
          { x: -halfW, y: 0 }        // D - left
        ];
        
      case 'trapezium':
        const halfTop = topWidth / 2;
        return [
          { x: -halfTop, y: -halfH },  // A - top left
          { x: halfTop, y: -halfH },   // B - top right
          { x: halfW, y: halfH },      // C - bottom right
          { x: -halfW, y: halfH }      // D - bottom left
        ];
        
      case 'kite':
        const waistY = -halfH + height * kiteRatio;
        return [
          { x: 0, y: -halfH },           // A - top
          { x: halfW, y: waistY },       // B - right
          { x: 0, y: halfH },            // C - bottom
          { x: -halfW, y: waistY }       // D - left
        ];
        
      default:
        return [
          { x: -halfW, y: -halfH },
          { x: halfW, y: -halfH },
          { x: halfW, y: halfH },
          { x: -halfW, y: halfH }
        ];
    }
  }, [type, width, height, skew, topWidth, kiteRatio, customVertices]);
  
  // Calculate angles at each vertex
  const angles = useMemo(() => {
    return vertices.map((v, i) => {
      const prev = vertices[(i - 1 + 4) % 4];
      const next = vertices[(i + 1) % 4];
      
      const angle1 = Math.atan2(prev.y - v.y, prev.x - v.x);
      const angle2 = Math.atan2(next.y - v.y, next.x - v.x);
      
      let diff = angle1 - angle2;
      if (diff < 0) diff += 2 * Math.PI;
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      
      return (diff * 180) / Math.PI;
    });
  }, [vertices]);
  
  // Calculate side lengths
  const sideLengths = useMemo(() => {
    return vertices.map((v, i) => {
      const next = vertices[(i + 1) % 4];
      return Math.sqrt((next.x - v.x) ** 2 + (next.y - v.y) ** 2);
    });
  }, [vertices]);
  
  // Calculate midpoints
  const midpoints = useMemo(() => {
    return vertices.map((v, i) => {
      const next = vertices[(i + 1) % 4];
      return {
        x: (v.x + next.x) / 2,
        y: (v.y + next.y) / 2
      };
    });
  }, [vertices]);
  
  // Diagonal intersection point
  const diagonalIntersection = useMemo(() => {
    const [A, B, C, D] = vertices;
    // Line AC: A + t(C-A)
    // Line BD: B + s(D-B)
    const denom = (D.y - B.y) * (C.x - A.x) - (D.x - B.x) * (C.y - A.y);
    if (Math.abs(denom) < 0.001) return { x: 0, y: 0 };
    
    const t = ((D.x - B.x) * (A.y - B.y) - (D.y - B.y) * (A.x - B.x)) / denom;
    return {
      x: A.x + t * (C.x - A.x),
      y: A.y + t * (C.y - A.y)
    };
  }, [vertices]);
  
  // SVG viewBox
  const padding = style.padding || 50;
  const minX = Math.min(...vertices.map(v => v.x)) - padding;
  const maxX = Math.max(...vertices.map(v => v.x)) + padding;
  const minY = Math.min(...vertices.map(v => v.y)) - padding;
  const maxY = Math.max(...vertices.map(v => v.y)) + padding;
  
  // Colors
  const colors = {
    fill: style.fillColor || '#3498db',
    fillOpacity: style.fillOpacity || 0.15,
    stroke: style.strokeColor || '#2c3e50',
    strokeWidth: style.strokeWidth || 2,
    highlight: style.highlightColor || '#e74c3c',
    diagonal: style.diagonalColor || '#95a5a6',
    angle: style.angleColor || '#27ae60',
    rightAngle: style.rightAngleColor || '#2980b9',
    parallel: style.parallelColor || '#9b59b6',
    equal: style.equalColor || '#e67e22',
    vertex: style.vertexColor || '#2c3e50'
  };
  
  const fontSize = {
    vertex: style.vertexLabelSize || 16,
    side: style.sideLabelSize || 14,
    angle: style.angleLabelSize || 13
  };
  
  // Polygon path
  const polygonPath = vertices.map((v, i) =>
    `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`
  ).join(' ') + ' Z';
  
  // Get vertex label
  const getVertexLabel = (index) => {
    return vertexLabels.labels?.[index] || String.fromCharCode(65 + index);
  };
  
  // Create angle arc - ensuring arc is inside shape and label is outside
  const createAngleArc = (vertexIndex, radius = 20) => {
    const v = vertices[vertexIndex];
    const prev = vertices[(vertexIndex - 1 + 4) % 4];
    const next = vertices[(vertexIndex + 1) % 4];
    
    const angle1 = Math.atan2(prev.y - v.y, prev.x - v.x);
    const angle2 = Math.atan2(next.y - v.y, next.x - v.x);
    
    const start = {
      x: v.x + Math.cos(angle1) * radius,
      y: v.y + Math.sin(angle1) * radius
    };
    const end = {
      x: v.x + Math.cos(angle2) * radius,
      y: v.y + Math.sin(angle2) * radius
    };
    
    // Calculate the interior angle bisector (pointing INTO the shape)
    // We need to find which direction is "inside" the shape
    let midAngle = (angle1 + angle2) / 2;
    
    // Check if midAngle points inside or outside by testing against shape center
    const cx = vertices.reduce((s, v) => s + v.x, 0) / 4;
    const cy = vertices.reduce((s, v) => s + v.y, 0) / 4;
    const toCenter = { x: cx - v.x, y: cy - v.y };
    const midDir = { x: Math.cos(midAngle), y: Math.sin(midAngle) };
    
    // If midAngle points away from center, flip it
    if (midDir.x * toCenter.x + midDir.y * toCenter.y < 0) {
      midAngle += Math.PI;
    }
    
    // Determine sweep direction for the arc
    let diff = angle2 - angle1;
    if (diff < 0) diff += 2 * Math.PI;
    const sweep = diff < Math.PI ? 1 : 0;
    const large = Math.abs(diff) > Math.PI ? 1 : 0;
    
    // Label position - OUTSIDE the shape (opposite to midAngle direction)
    const labelAngle = midAngle + Math.PI; // Point away from center
    
    return {
      path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} ${sweep} ${end.x} ${end.y}`,
      midAngle: midAngle,
      labelAngle: labelAngle,
      vertex: v
    };
  };
  
  // Create right angle marker
  const createRightAngle = (vertexIndex, size = 12) => {
    const v = vertices[vertexIndex];
    const prev = vertices[(vertexIndex - 1 + 4) % 4];
    const next = vertices[(vertexIndex + 1) % 4];
    
    // Unit vectors
    const toPrev = {
      x: (prev.x - v.x) / Math.sqrt((prev.x - v.x) ** 2 + (prev.y - v.y) ** 2),
      y: (prev.y - v.y) / Math.sqrt((prev.x - v.x) ** 2 + (prev.y - v.y) ** 2)
    };
    const toNext = {
      x: (next.x - v.x) / Math.sqrt((next.x - v.x) ** 2 + (next.y - v.y) ** 2),
      y: (next.y - v.y) / Math.sqrt((next.x - v.x) ** 2 + (next.y - v.y) ** 2)
    };
    
    const p1 = { x: v.x + toPrev.x * size, y: v.y + toPrev.y * size };
    const p2 = { x: p1.x + toNext.x * size, y: p1.y + toNext.y * size };
    const p3 = { x: v.x + toNext.x * size, y: v.y + toNext.y * size };
    
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`;
  };
  
  // Create parallel marks (arrow style - pointing along the line)
  const createParallelMark = (sideIndex, count = 1) => {
    const v1 = vertices[sideIndex];
    const v2 = vertices[(sideIndex + 1) % 4];
    const mid = midpoints[sideIndex];
    
    // Direction along the side
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    
    // Perpendicular (pointing outward from shape center)
    const cx = vertices.reduce((s, v) => s + v.x, 0) / 4;
    const cy = vertices.reduce((s, v) => s + v.y, 0) / 4;
    const toCenter = { x: cx - mid.x, y: cy - mid.y };
    let px = -uy;
    let py = ux;
    // Make sure perpendicular points away from center
    if (px * toCenter.x + py * toCenter.y > 0) {
      px = -px;
      py = -py;
    }
    
    const arrowSize = 8;
    const arrowWidth = 5;
    const marks = [];
    
    // Create arrow head(s) pointing along the direction of the side
    const offsets = count === 1 ? [0] : [-5, 5];
    
    offsets.forEach((offset, i) => {
      const baseX = mid.x + ux * offset;
      const baseY = mid.y + uy * offset;
      
      // Arrow pointing in direction of travel (towards v2)
      marks.push({
        type: 'arrow',
        points: [
          { x: baseX - ux * arrowSize - px * arrowWidth, y: baseY - uy * arrowSize - py * arrowWidth },
          { x: baseX, y: baseY },
          { x: baseX - ux * arrowSize + px * arrowWidth, y: baseY - uy * arrowSize + py * arrowWidth }
        ]
      });
    });
    
    return marks;
  };
  
  // Create equal marks (tick marks)
  const createEqualMark = (sideIndex, count = 1) => {
    const v1 = vertices[sideIndex];
    const v2 = vertices[(sideIndex + 1) % 4];
    const mid = midpoints[sideIndex];
    
    // Perpendicular direction
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const px = -dy / len;
    const py = dx / len;
    const ux = dx / len;
    const uy = dy / len;
    
    const tickSize = 8;
    const tickGap = 5;
    const marks = [];
    
    const startOffset = -((count - 1) * tickGap) / 2;
    
    for (let i = 0; i < count; i++) {
      const offset = startOffset + i * tickGap;
      marks.push({
        x1: mid.x + ux * offset - px * tickSize,
        y1: mid.y + uy * offset - py * tickSize,
        x2: mid.x + ux * offset + px * tickSize,
        y2: mid.y + uy * offset + py * tickSize
      });
    }
    
    return marks;
  };
  
  // Determine which sides get parallel/equal marks based on type
  const getParallelSides = () => {
    switch (type) {
      case 'square':
      case 'rectangle':
      case 'parallelogram':
      case 'rhombus':
        return [[0, 2], [1, 3]]; // AB||CD, BC||DA
      case 'trapezium':
        return [[0, 2]]; // Only top and bottom parallel
      default:
        return [];
    }
  };
  
  const getEqualSides = () => {
    switch (type) {
      case 'square':
      case 'rhombus':
        return [[0, 1, 2, 3]]; // All sides equal
      case 'rectangle':
      case 'parallelogram':
        return [[0, 2], [1, 3]]; // Opposite sides equal
      case 'kite':
        return [[0, 3], [1, 2]]; // Adjacent pairs equal
      default:
        return [];
    }
  };
  
  const getRightAngles = () => {
    switch (type) {
      case 'square':
      case 'rectangle':
        return [0, 1, 2, 3];
      default:
        return [];
    }
  };

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className={`w-full h-full ${className}`}
      style={{ maxHeight: style.maxHeight || '400px' }}
    >
      {/* Main shape fill */}
      <path
        d={polygonPath}
        fill={colors.fill}
        fillOpacity={colors.fillOpacity}
        stroke="none"
      />
      
      {/* Diagonals */}
      {showDiagonals && (
        <>
          <line
            x1={vertices[0].x}
            y1={vertices[0].y}
            x2={vertices[2].x}
            y2={vertices[2].y}
            stroke={highlightDiagonals.includes(0) ? colors.highlight : colors.diagonal}
            strokeWidth={highlightDiagonals.includes(0) ? 2.5 : 1.5}
            strokeDasharray="5,4"
          />
          <line
            x1={vertices[1].x}
            y1={vertices[1].y}
            x2={vertices[3].x}
            y2={vertices[3].y}
            stroke={highlightDiagonals.includes(1) ? colors.highlight : colors.diagonal}
            strokeWidth={highlightDiagonals.includes(1) ? 2.5 : 1.5}
            strokeDasharray="5,4"
          />
          {/* Intersection point */}
          <circle
            cx={diagonalIntersection.x}
            cy={diagonalIntersection.y}
            r={3}
            fill={colors.diagonal}
          />
        </>
      )}
      
      {/* Highlighted sides */}
      {highlightSides.map(i => (
        <line
          key={`highlight-${i}`}
          x1={vertices[i].x}
          y1={vertices[i].y}
          x2={vertices[(i + 1) % 4].x}
          y2={vertices[(i + 1) % 4].y}
          stroke={colors.highlight}
          strokeWidth={4}
        />
      ))}
      
      {/* Main outline */}
      <path
        d={polygonPath}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={colors.strokeWidth}
        strokeLinejoin="round"
      />
      
      {/* Parallel marks (arrows) */}
      {showParallelMarks && getParallelSides().map((pair, pairIndex) => (
        pair.map(sideIndex => (
          createParallelMark(sideIndex, pairIndex + 1).map((mark, i) => (
            <polyline
              key={`parallel-${sideIndex}-${i}`}
              points={mark.points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={colors.parallel}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))
        ))
      ))}
      
      {/* Equal marks */}
      {showEqualMarks && getEqualSides().map((group, groupIndex) => (
        group.map(sideIndex => (
          createEqualMark(sideIndex, groupIndex + 1).map((mark, i) => (
            <line
              key={`equal-${sideIndex}-${i}`}
              x1={mark.x1}
              y1={mark.y1}
              x2={mark.x2}
              y2={mark.y2}
              stroke={colors.equal}
              strokeWidth={2}
            />
          ))
        ))
      ))}
      
      {/* Right angle markers */}
      {showRightAngles && getRightAngles().map(i => (
        <path
          key={`right-${i}`}
          d={createRightAngle(i)}
          fill="none"
          stroke={colors.rightAngle}
          strokeWidth={1.5}
        />
      ))}
      
      {/* Angle arcs */}
      {(showAllAngles ? [0, 1, 2, 3] : showAngles).map(i => {
        if (getRightAngles().includes(i) && showRightAngles) return null;
        
        const arc = createAngleArc(i, 22);
        const isHighlighted = highlightAngles.includes(i);
        
        return (
          <g key={`angle-${i}`}>
            <path
              d={arc.path}
              fill={isHighlighted ? colors.highlight : colors.angle}
              fillOpacity={0.2}
              stroke={isHighlighted ? colors.highlight : colors.angle}
              strokeWidth={2}
            />
            {showLabels.angles && (
              <text
                x={vertices[i].x + Math.cos(arc.labelAngle) * 32}
                y={vertices[i].y + Math.sin(arc.labelAngle) * 32}
                fontSize={fontSize.angle}
                fill={isHighlighted ? colors.highlight : colors.angle}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {Math.round(angles[i])}°
              </text>
            )}
          </g>
        );
      })}
      
      {/* Side labels */}
      {(showLabels.sides || sideLabels.show) && midpoints.map((mp, i) => {
        const v1 = vertices[i];
        const v2 = vertices[(i + 1) % 4];
        
        // Perpendicular offset
        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const px = -dy / len * 18;
        const py = dx / len * 18;
        
        // Push outward
        const outward = Math.sign(mp.x * px + mp.y * py) || 1;
        
        const label = sideLabels.labels?.[i] || '';
        if (!label) return null;
        
        return (
          <text
            key={`side-${i}`}
            x={mp.x + px * outward}
            y={mp.y + py * outward}
            fontSize={fontSize.side}
            fill={colors.stroke}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
      
      {/* Vertex labels */}
      {(showLabels.vertices || vertexLabels.show) && vertices.map((v, i) => {
        // Push outward from centre
        const cx = vertices.reduce((sum, v) => sum + v.x, 0) / 4;
        const cy = vertices.reduce((sum, v) => sum + v.y, 0) / 4;
        const dx = v.x - cx;
        const dy = v.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        return (
          <text
            key={`vertex-${i}`}
            x={v.x + (dx / dist) * 18}
            y={v.y + (dy / dist) * 18}
            fontSize={fontSize.vertex}
            fontWeight="bold"
            fill={vertexLabels.color || colors.vertex}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {getVertexLabel(i)}
          </text>
        );
      })}
    </svg>
  );
};

// Export calculations
Quadrilateral.calculations = {
  // Area formulas
  rectangleArea: (w, h) => w * h,
  parallelogramArea: (base, height) => base * height,
  trapeziumArea: (a, b, h) => ((a + b) / 2) * h,
  rhombusArea: (d1, d2) => (d1 * d2) / 2,
  kiteArea: (d1, d2) => (d1 * d2) / 2,
  
  // Properties
  rectangleDiagonal: (w, h) => Math.sqrt(w * w + h * h),
  
  // Sum of angles
  sumOfAngles: () => 360
};

// Type names
Quadrilateral.types = {
  square: 'Square',
  rectangle: 'Rectangle',
  parallelogram: 'Parallelogram',
  rhombus: 'Rhombus',
  trapezium: 'Trapezium',
  kite: 'Kite',
  general: 'Quadrilateral'
};

export default Quadrilateral;