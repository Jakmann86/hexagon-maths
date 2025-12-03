// src/components/math/shapes/polygons/RegularPolygon.jsx
// Flexible regular polygon component for geometry lessons
// Supports triangles through dodecagons with angle annotations

import React, { useMemo } from 'react';

/**
 * RegularPolygon - Renders any regular n-sided polygon
 * 
 * USE CASES:
 * - Interior angles of polygons
 * - Exterior angles of polygons
 * - Symmetry and properties
 * - Tessellations
 * 
 * @param {number} sides - Number of sides (3-12)
 * @param {number} size - Radius from center to vertex (default: 100)
 * @param {boolean} showInteriorAngles - Show interior angle arcs
 * @param {boolean} showExteriorAngles - Show exterior angle arcs
 * @param {boolean} showCentre - Show centre point
 * @param {boolean} showRadii - Show lines from centre to vertices
 * @param {boolean} showTriangles - Split into triangles from centre
 * @param {Array} highlightAngles - Array of vertex indices to highlight
 * @param {Array} highlightSides - Array of side indices to highlight
 * @param {Object} showLabels - Control label visibility
 * @param {Object} vertexLabels - Custom vertex label configuration
 * @param {Object} style - Custom styling
 */
const RegularPolygon = ({
  sides = 6,
  size = 100,
  rotation = -90, // Start from top by default
  
  // Angle display
  showInteriorAngles = false,
  showExteriorAngles = false,
  showOneInterior = null,    // Show just one interior angle at vertex index
  showOneExterior = null,    // Show just one exterior angle at vertex index
  
  // Centre and radii
  showCentre = false,
  showRadii = false,
  showTrianglesFromCentre = false,    // Split into triangles from centre
  showTrianglesFromVertex = false,    // Split into triangles from one vertex (for n-2 formula)
  triangleVertex = 0,                  // Which vertex to draw triangles from
  showApothem = false,                 // Line from centre perpendicular to side
  
  // Highlighting
  highlightAngles = [],      // Vertex indices to highlight
  highlightSides = [],       // Side indices to highlight
  
  // Labels
  showLabels = {
    vertices: false,
    sides: false,
    interiorAngle: false,
    exteriorAngle: false,
    centre: false
  },
  
  // Custom labels
  vertexLabels = {
    show: false,
    labels: null,  // Auto-generate A, B, C... if null
    color: null
  },
  
  sideLabels = {
    show: false,
    labels: null,  // Can be array of labels or single value for all
  },
  
  // Styling
  style = {},
  className = ''
}) => {
  
  // Calculate interior angle
  const interiorAngle = ((sides - 2) * 180) / sides;
  const exteriorAngle = 180 - interiorAngle;
  
  // Generate vertices
  const vertices = useMemo(() => {
    const points = [];
    const angleStep = (2 * Math.PI) / sides;
    const startAngle = (rotation * Math.PI) / 180;
    
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      points.push({
        x: Math.cos(angle) * size,
        y: Math.sin(angle) * size,
        angle: angle
      });
    }
    return points;
  }, [sides, size, rotation]);
  
  // Calculate midpoints for side labels and apothem
  const midpoints = useMemo(() => {
    return vertices.map((v, i) => {
      const next = vertices[(i + 1) % sides];
      return {
        x: (v.x + next.x) / 2,
        y: (v.y + next.y) / 2
      };
    });
  }, [vertices, sides]);
  
  // Apothem length (perpendicular distance from centre to side)
  const apothemLength = size * Math.cos(Math.PI / sides);
  
  // SVG viewBox
  const padding = style.padding || 60;
  const viewSize = size + padding;
  
  // Colors
  const colors = {
    fill: style.fillColor || '#3498db',
    fillOpacity: style.fillOpacity || 0.15,
    stroke: style.strokeColor || '#2c3e50',
    strokeWidth: style.strokeWidth || 2,
    highlight: style.highlightColor || '#e74c3c',
    highlightFill: style.highlightFillColor || '#e74c3c',
    interior: style.interiorAngleColor || '#27ae60',
    exterior: style.exteriorAngleColor || '#9b59b6',
    radii: style.radiiColor || '#95a5a6',
    centre: style.centreColor || '#e67e22',
    vertex: style.vertexColor || '#2c3e50',
    triangleFill: style.triangleFillColor || '#3498db'
  };
  
  // Font sizes
  const fontSize = {
    vertex: style.vertexLabelSize || 16,
    angle: style.angleLabelSize || 14,
    side: style.sideLabelSize || 14
  };
  
  // Generate polygon path
  const polygonPath = vertices.map((v, i) => 
    `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`
  ).join(' ') + ' Z';
  
  // Get vertex label
  const getVertexLabel = (index) => {
    if (vertexLabels.labels && vertexLabels.labels[index]) {
      return vertexLabels.labels[index];
    }
    return String.fromCharCode(65 + index); // A, B, C, ...
  };
  
  // Get side label
  const getSideLabel = (index) => {
    if (sideLabels.labels) {
      if (Array.isArray(sideLabels.labels)) {
        return sideLabels.labels[index] || '';
      }
      return sideLabels.labels; // Same label for all sides
    }
    return '';
  };
  
  // Create arc path for angles
  const createArcPath = (vertex, prevVertex, nextVertex, radius, isExterior = false) => {
    // Calculate angles
    const angle1 = Math.atan2(prevVertex.y - vertex.y, prevVertex.x - vertex.x);
    const angle2 = Math.atan2(nextVertex.y - vertex.y, nextVertex.x - vertex.x);
    
    let startAngle, endAngle;
    
    if (isExterior) {
      // Exterior angle - extend one side outward
      startAngle = angle2;
      endAngle = angle1 + Math.PI; // Extend the line
    } else {
      // Interior angle
      startAngle = angle2;
      endAngle = angle1;
    }
    
    // Ensure we go the short way for interior angles
    if (!isExterior) {
      let diff = endAngle - startAngle;
      if (diff < 0) diff += 2 * Math.PI;
      if (diff > Math.PI) {
        [startAngle, endAngle] = [endAngle, startAngle];
      }
    }
    
    const start = {
      x: vertex.x + Math.cos(startAngle) * radius,
      y: vertex.y + Math.sin(startAngle) * radius
    };
    const end = {
      x: vertex.x + Math.cos(endAngle) * radius,
      y: vertex.y + Math.sin(endAngle) * radius
    };
    
    const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const sweep = isExterior ? 0 : 1;
    
    return {
      path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`,
      midAngle: (startAngle + endAngle) / 2,
      vertex
    };
  };

  return (
    <svg
      viewBox={`${-viewSize} ${-viewSize} ${viewSize * 2} ${viewSize * 2}`}
      className={`w-full h-full ${className}`}
      style={{ maxHeight: style.maxHeight || '400px' }}
    >
      {/* Triangle divisions from centre */}
      {showTrianglesFromCentre && vertices.map((v, i) => {
        const next = vertices[(i + 1) % sides];
        return (
          <path
            key={`triangle-${i}`}
            d={`M 0 0 L ${v.x} ${v.y} L ${next.x} ${next.y} Z`}
            fill={colors.triangleFill}
            fillOpacity={0.1 + (i % 2) * 0.05}
            stroke={colors.radii}
            strokeWidth={1}
          />
        );
      })}
      
      {/* Triangle divisions from one vertex (for n-2 formula) */}
      {showTrianglesFromVertex && (() => {
        const origin = vertices[triangleVertex];
        const triangles = [];
        
        // Draw triangles to all non-adjacent vertices
        for (let i = 0; i < sides; i++) {
          // Skip the origin vertex and its adjacent vertices
          if (i === triangleVertex || i === (triangleVertex + 1) % sides || i === (triangleVertex - 1 + sides) % sides) continue;
          
          const v1 = vertices[i];
          const v2 = vertices[(i + 1) % sides];
          
          // Only draw if neither endpoint is adjacent to origin
          if ((i + 1) % sides !== triangleVertex) {
            triangles.push(
              <path
                key={`vtriangle-${i}`}
                d={`M ${origin.x} ${origin.y} L ${v1.x} ${v1.y} L ${v2.x} ${v2.y} Z`}
                fill={colors.triangleFill}
                fillOpacity={0.08 + (triangles.length % 2) * 0.06}
                stroke={colors.interior}
                strokeWidth={1.5}
                strokeDasharray="5,3"
              />
            );
          }
        }
        
        // Draw diagonals from the origin vertex
        const diagonals = [];
        for (let i = 2; i < sides - 1; i++) {
          const targetIndex = (triangleVertex + i) % sides;
          diagonals.push(
            <line
              key={`diagonal-${i}`}
              x1={origin.x}
              y1={origin.y}
              x2={vertices[targetIndex].x}
              y2={vertices[targetIndex].y}
              stroke={colors.interior}
              strokeWidth={1.5}
              strokeDasharray="5,3"
            />
          );
        }
        
        return (
          <g>
            {diagonals}
          </g>
        );
      })()}
      
      {/* Main polygon fill */}
      {!showTrianglesFromCentre && (
        <path
          d={polygonPath}
          fill={colors.fill}
          fillOpacity={colors.fillOpacity}
          stroke="none"
        />
      )}
      
      {/* Radii from centre */}
      {showRadii && !showTrianglesFromCentre && vertices.map((v, i) => (
        <line
          key={`radius-${i}`}
          x1={0}
          y1={0}
          x2={v.x}
          y2={v.y}
          stroke={colors.radii}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      ))}
      
      {/* Apothem */}
      {showApothem && (
        <line
          x1={0}
          y1={0}
          x2={midpoints[0].x}
          y2={midpoints[0].y}
          stroke={colors.centre}
          strokeWidth={2}
          strokeDasharray="5,3"
        />
      )}
      
      {/* Highlighted sides */}
      {highlightSides.map(sideIndex => {
        const v1 = vertices[sideIndex];
        const v2 = vertices[(sideIndex + 1) % sides];
        return (
          <line
            key={`highlight-side-${sideIndex}`}
            x1={v1.x}
            y1={v1.y}
            x2={v2.x}
            y2={v2.y}
            stroke={colors.highlight}
            strokeWidth={4}
          />
        );
      })}
      
      {/* Polygon outline */}
      <path
        d={polygonPath}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={colors.strokeWidth}
        strokeLinejoin="round"
      />
      
      {/* Interior angles - all */}
      {showInteriorAngles && vertices.map((v, i) => {
        const prev = vertices[(i - 1 + sides) % sides];
        const next = vertices[(i + 1) % sides];
        const arc = createArcPath(v, prev, next, 25, false);
        const isHighlighted = highlightAngles.includes(i);
        
        return (
          <g key={`interior-${i}`}>
            <path
              d={arc.path}
              fill="none"
              stroke={isHighlighted ? colors.highlight : colors.interior}
              strokeWidth={isHighlighted ? 3 : 2}
            />
          </g>
        );
      })}
      
      {/* Interior angle - single */}
      {showOneInterior !== null && (() => {
        const i = showOneInterior;
        const v = vertices[i];
        const prev = vertices[(i - 1 + sides) % sides];
        const next = vertices[(i + 1) % sides];
        const arc = createArcPath(v, prev, next, 25, false);
        
        return (
          <g>
            <path
              d={arc.path}
              fill={colors.interior}
              fillOpacity={0.2}
              stroke={colors.interior}
              strokeWidth={2}
            />
            {showLabels.interiorAngle && (
              <text
                x={v.x + Math.cos(arc.midAngle) * 40}
                y={v.y + Math.sin(arc.midAngle) * 40}
                fontSize={fontSize.angle}
                fill={colors.interior}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {Math.round(interiorAngle)}°
              </text>
            )}
          </g>
        );
      })()}
      
      {/* Exterior angles - all */}
      {showExteriorAngles && vertices.map((v, i) => {
        const prev = vertices[(i - 1 + sides) % sides];
        const next = vertices[(i + 1) % sides];
        
        // Draw extended line
        const extendDir = {
          x: v.x - prev.x,
          y: v.y - prev.y
        };
        const extendLen = Math.sqrt(extendDir.x * extendDir.x + extendDir.y * extendDir.y);
        const extendEnd = {
          x: v.x + (extendDir.x / extendLen) * 40,
          y: v.y + (extendDir.y / extendLen) * 40
        };
        
        return (
          <g key={`exterior-${i}`}>
            <line
              x1={v.x}
              y1={v.y}
              x2={extendEnd.x}
              y2={extendEnd.y}
              stroke={colors.exterior}
              strokeWidth={1.5}
              strokeDasharray="4,3"
            />
          </g>
        );
      })}
      
      {/* Exterior angle - single */}
      {showOneExterior !== null && (() => {
        const i = showOneExterior;
        const v = vertices[i];
        const prev = vertices[(i - 1 + sides) % sides];
        const next = vertices[(i + 1) % sides];
        
        // Extended line direction
        const extendDir = {
          x: v.x - prev.x,
          y: v.y - prev.y
        };
        const extendLen = Math.sqrt(extendDir.x * extendDir.x + extendDir.y * extendDir.y);
        const extendEnd = {
          x: v.x + (extendDir.x / extendLen) * 50,
          y: v.y + (extendDir.y / extendLen) * 50
        };
        
        // Arc for exterior angle
        const arcRadius = 30;
        const angleToNext = Math.atan2(next.y - v.y, next.x - v.x);
        const angleExtend = Math.atan2(extendEnd.y - v.y, extendEnd.x - v.x);
        
        const arcStart = {
          x: v.x + Math.cos(angleToNext) * arcRadius,
          y: v.y + Math.sin(angleToNext) * arcRadius
        };
        const arcEnd = {
          x: v.x + Math.cos(angleExtend) * arcRadius,
          y: v.y + Math.sin(angleExtend) * arcRadius
        };
        
        return (
          <g>
            <line
              x1={v.x}
              y1={v.y}
              x2={extendEnd.x}
              y2={extendEnd.y}
              stroke={colors.exterior}
              strokeWidth={2}
              strokeDasharray="4,3"
            />
            <path
              d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEnd.x} ${arcEnd.y}`}
              fill={colors.exterior}
              fillOpacity={0.2}
              stroke={colors.exterior}
              strokeWidth={2}
            />
            {showLabels.exteriorAngle && (
              <text
                x={v.x + Math.cos((angleToNext + angleExtend) / 2) * 45}
                y={v.y + Math.sin((angleToNext + angleExtend) / 2) * 45}
                fontSize={fontSize.angle}
                fill={colors.exterior}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {Math.round(exteriorAngle)}°
              </text>
            )}
          </g>
        );
      })()}
      
      {/* Centre point */}
      {showCentre && (
        <g>
          <circle
            cx={0}
            cy={0}
            r={4}
            fill={colors.centre}
          />
          {showLabels.centre && (
            <text
              x={12}
              y={5}
              fontSize={fontSize.vertex}
              fill={colors.centre}
              fontWeight="bold"
            >
              O
            </text>
          )}
        </g>
      )}
      
      {/* Side labels */}
      {(showLabels.sides || sideLabels.show) && midpoints.map((mp, i) => {
        const v1 = vertices[i];
        const v2 = vertices[(i + 1) % sides];
        
        // Offset perpendicular to the side
        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / len * 20;
        const perpY = dx / len * 20;
        
        // Push outward from centre
        const outward = Math.sign(mp.x * perpX + mp.y * perpY) || 1;
        
        return (
          <text
            key={`side-label-${i}`}
            x={mp.x + perpX * outward}
            y={mp.y + perpY * outward}
            fontSize={fontSize.side}
            fill={colors.stroke}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {getSideLabel(i)}
          </text>
        );
      })}
      
      {/* Vertex labels */}
      {(showLabels.vertices || vertexLabels.show) && vertices.map((v, i) => {
        // Push label outward from centre
        const labelDist = 20;
        const angle = Math.atan2(v.y, v.x);
        
        return (
          <text
            key={`vertex-${i}`}
            x={v.x + Math.cos(angle) * labelDist}
            y={v.y + Math.sin(angle) * labelDist}
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
      
      {/* Vertex dots for highlighted angles */}
      {highlightAngles.map(i => (
        <circle
          key={`vertex-dot-${i}`}
          cx={vertices[i].x}
          cy={vertices[i].y}
          r={5}
          fill={colors.highlight}
        />
      ))}
    </svg>
  );
};

// Export useful calculations
RegularPolygon.calculations = {
  interiorAngle: (sides) => ((sides - 2) * 180) / sides,
  exteriorAngle: (sides) => 360 / sides,
  sumOfInteriorAngles: (sides) => (sides - 2) * 180,
  sumOfExteriorAngles: () => 360,
  apothem: (sides, radius) => radius * Math.cos(Math.PI / sides),
  sideLength: (sides, radius) => 2 * radius * Math.sin(Math.PI / sides),
  area: (sides, radius) => (1/2) * sides * radius * radius * Math.sin((2 * Math.PI) / sides),
  perimeter: (sides, radius) => sides * 2 * radius * Math.sin(Math.PI / sides)
};

// Polygon names helper
RegularPolygon.names = {
  3: 'Triangle',
  4: 'Square',
  5: 'Pentagon',
  6: 'Hexagon',
  7: 'Heptagon',
  8: 'Octagon',
  9: 'Nonagon',
  10: 'Decagon',
  11: 'Hendecagon',
  12: 'Dodecagon'
};

export default RegularPolygon;