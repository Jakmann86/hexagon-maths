// src/components/math/shapes/3d/Pyramid3D.jsx
// Square-based pyramid visualization using isometric projection
// Used for 3D Pythagoras challenge questions

import React, { useMemo } from 'react';

/**
 * Pyramid3D - Renders a square-based pyramid with isometric projection
 * 
 * USE CASES:
 * - 3D Pythagoras challenges: Find slant height, edge length, height
 * - Surface area problems
 * - Volume calculations
 * 
 * @param {number} baseSize - Side length of square base
 * @param {number} height - Vertical height of pyramid (apex to base center)
 * @param {string} units - Unit label (default: 'cm')
 * @param {Object} showLabels - Control label visibility
 * @param {Object} showLines - Control which internal lines to show
 * @param {Object} highlightElements - Highlight specific edges/triangles
 * @param {Object} style - Custom styling options
 */
const Pyramid3D = ({
  baseSize = 6,
  height = 8,
  units = 'cm',
  
  // Label visibility
  showLabels = {
    base: true,
    height: true,
    slantHeight: false,
    edgeLength: false,
    vertices: false,
    centerPoint: false    // M label at base center
  },
  
  // Internal lines to show
  showLines = {
    height: true,           // Vertical line from apex to base center
    baseDiagonals: false,   // Diagonals of the square base
    slantHeight: false,     // Line from apex to midpoint of base edge
    triangleFill: false     // Fill the right triangle used in calculation
  },
  
  // Vertex labels
  vertexLabels = {
    show: false,
    labels: ['A', 'B', 'C', 'D', 'V'], // A,B,C,D = base corners, V = apex (vertex)
    color: null
  },
  
  // Custom edge labels (e.g., for marking unknowns)
  edgeLabels = {},
  
  // Custom styling
  style = {},
  className = ''
}) => {
  
  // Isometric projection
  const ISO_ANGLE = Math.PI / 6;
  const SCALE = style.scale || 22;
  
  // Define vertices - rotated slightly for better view of height line
  const vertices = useMemo(() => {
    const toIsometric = (x, y, z) => {
      // Rotate the base slightly (about 15 degrees) so height line is visible
      const rotateAngle = 0.25; // radians, about 14 degrees
      const rotatedX = x * Math.cos(rotateAngle) - y * Math.sin(rotateAngle);
      const rotatedY = x * Math.sin(rotateAngle) + y * Math.cos(rotateAngle);
      
      const isoX = (rotatedX + rotatedY) * Math.cos(ISO_ANGLE);
      const isoY = (rotatedY - rotatedX) * Math.sin(ISO_ANGLE) - z;
      return {
        x: isoX * SCALE,
        y: isoY * SCALE
      };
    };
    
    const half = baseSize / 2;
    
    return {
      // Base corners (square centered at origin)
      A: toIsometric(-half, -half, 0),  // Front-left
      B: toIsometric(half, -half, 0),   // Front-right
      C: toIsometric(half, half, 0),    // Back-right
      D: toIsometric(-half, half, 0),   // Back-left
      // Apex
      V: toIsometric(0, 0, height),     // Top vertex
      // Helper points
      M: toIsometric(0, 0, 0),          // Base center (for height line)
      midAB: toIsometric(0, -half, 0),  // Midpoint of front edge (for slant height)
      midBC: toIsometric(half, 0, 0),   // Midpoint of right edge
      midCD: toIsometric(0, half, 0),   // Midpoint of back edge
      midDA: toIsometric(-half, 0, 0),  // Midpoint of left edge
    };
  }, [baseSize, height, SCALE]);

  // Calculate derived values
  const halfBase = baseSize / 2;
  const slantHeight = Math.sqrt(height * height + halfBase * halfBase);
  const edgeLength = Math.sqrt(height * height + 2 * halfBase * halfBase);
  const baseDiagonal = baseSize * Math.sqrt(2);

  // SVG viewBox calculations
  const allPoints = Object.values(vertices);
  const padding = style.padding || 50;
  const minX = Math.min(...allPoints.map(p => p.x)) - padding;
  const maxX = Math.max(...allPoints.map(p => p.x)) + padding;
  const minY = Math.min(...allPoints.map(p => p.y)) - padding;
  const maxY = Math.max(...allPoints.map(p => p.y)) + padding;

  // Colors
  const colors = {
    edge: style.edgeColor || '#2c3e50',
    hiddenEdge: style.hiddenEdgeColor || '#bdc3c7',
    highlight: style.highlightColor || '#e74c3c',
    heightLine: style.heightLineColor || '#e67e22',  // Orange - distinct from green faces
    slantLine: style.slantLineColor || '#9b59b6',
    triangleFill: style.triangleFillColor || '#e74c3c',
    baseFill: style.baseFillColor || '#3498db',
    faceFill: style.faceFillColor || '#2ecc71',
    vertexBottom: style.vertexBottomColor || '#e74c3c',
    vertexTop: style.vertexTopColor || '#9b59b6'
  };

  // Font sizes
  const fontSizes = {
    dimension: style.labelSize || 13,
    vertex: style.vertexLabelSize || style.labelSize || 14
  };

  // Edge styles
  const edgeStyle = {
    visible: {
      stroke: colors.edge,
      strokeWidth: style.edgeWidth || 2,
      fill: 'none'
    },
    hidden: {
      stroke: colors.hiddenEdge,
      strokeWidth: 1.5,
      strokeDasharray: '6,4',
      fill: 'none'
    },
    construction: {
      stroke: colors.heightLine,
      strokeWidth: 2,
      strokeDasharray: '4,4',
      fill: 'none'
    },
    slant: {
      stroke: colors.slantLine,
      strokeWidth: 2.5,
      fill: 'none'
    }
  };

  // Helper functions
  const createLine = (p1, p2) => `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  const createPath = (points) => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  const getMidpoint = (p1, p2) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  });

  // Get vertex label
  const getVertexLabel = (index) => {
    const defaultLabels = ['A', 'B', 'C', 'D', 'V'];
    return vertexLabels.labels?.[index] || defaultLabels[index];
  };

  const shouldShowVertices = showLabels.vertices || vertexLabels.show;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className={`w-full h-full ${className}`}
      style={{ maxHeight: style.maxHeight || '400px' }}
    >
      {/* Base fill */}
      <path
        d={createPath([vertices.A, vertices.B, vertices.C, vertices.D])}
        fill={colors.baseFill}
        fillOpacity={0.1}
        stroke="none"
      />

      {/* Hidden base edges (front edges - now dashed) */}
      <path d={createLine(vertices.A, vertices.B)} {...edgeStyle.hidden} />
      <path d={createLine(vertices.B, vertices.C)} {...edgeStyle.hidden} />

      {/* Base diagonals (optional) */}
      {showLines.baseDiagonals && (
        <>
          <path d={createLine(vertices.A, vertices.C)} {...edgeStyle.construction} />
          <path d={createLine(vertices.B, vertices.D)} {...edgeStyle.construction} />
        </>
      )}

      {/* Triangle fill for calculation visualization */}
      {showLines.triangleFill && (
        <path
          d={createPath([vertices.V, vertices.M, vertices.midAB])}
          fill={colors.triangleFill}
          fillOpacity={0.2}
          stroke={colors.triangleFill}
          strokeWidth={2}
        />
      )}

      {/* Visible face fills (back faces now visible) */}
      <path
        d={createPath([vertices.V, vertices.C, vertices.D])}
        fill={colors.faceFill}
        fillOpacity={0.15}
        stroke="none"
      />
      <path
        d={createPath([vertices.V, vertices.D, vertices.A])}
        fill={colors.faceFill}
        fillOpacity={0.1}
        stroke="none"
      />

      {/* Height line (apex to base center) */}
      {showLines.height && (
        <path 
          d={createLine(vertices.V, vertices.M)} 
          stroke={colors.heightLine}
          strokeWidth={2}
          strokeDasharray="5,3"
          fill="none"
        />
      )}

      {/* Slant height line (apex to midpoint of left edge DA) */}
      {showLines.slantHeight && (
        <path 
          d={createLine(vertices.V, vertices.midDA)} 
          {...edgeStyle.slant}
        />
      )}

      {/* Visible base edges (back edges - now solid) */}
      <path d={createLine(vertices.C, vertices.D)} {...edgeStyle.visible} />
      <path d={createLine(vertices.D, vertices.A)} {...edgeStyle.visible} />

      {/* Lateral edges (from base to apex) */}
      {/* A-V is visible - front left edge */}
      <path d={createLine(vertices.A, vertices.V)} {...edgeStyle.visible} />
      {/* B-V is hidden - behind the pyramid */}
      <path d={createLine(vertices.B, vertices.V)} {...edgeStyle.hidden} />
      {/* C-V is visible - back right */}
      <path d={createLine(vertices.C, vertices.V)} {...edgeStyle.visible} />
      {/* D-V is visible - back left */}
      <path d={createLine(vertices.D, vertices.V)} {...edgeStyle.visible} />

      {/* Right angle marker at base center */}
      {showLines.height && (
        <RightAngleMarker
          vertex={vertices.M}
          dir1={{ x: vertices.midAB.x - vertices.M.x, y: vertices.midAB.y - vertices.M.y }}
          dir2={{ x: 0, y: -1 }}
          size={8}
          color={colors.heightLine}
        />
      )}

      {/* Dimension Labels */}
      {showLabels.base && (
        <DimensionLabel
          p1={vertices.D}
          p2={vertices.A}
          label={edgeLabels.base || `${baseSize} ${units}`}
          offset={25}
          fontSize={fontSizes.dimension}
          color={colors.edge}
        />
      )}

      {showLabels.height && showLines.height && (
        <text
          x={vertices.M.x - 30}
          y={(vertices.V.y + vertices.M.y) / 2}
          fontSize={fontSizes.dimension}
          fill={colors.heightLine}
          textAnchor="middle"
        >
          {edgeLabels.height || `${height} ${units}`}
        </text>
      )}

      {showLabels.slantHeight && showLines.slantHeight && (
        <DimensionLabel
          p1={vertices.V}
          p2={vertices.midDA}
          label={edgeLabels.slantHeight || `${Math.round(slantHeight * 100) / 100} ${units}`}
          offset={-30}
          fontSize={fontSizes.dimension}
          color={colors.slantLine}
          bold
        />
      )}

      {showLabels.edgeLength && (
        <DimensionLabel
          p1={vertices.A}
          p2={vertices.V}
          label={edgeLabels.edgeLength || `${Math.round(edgeLength * 100) / 100} ${units}`}
          offset={-20}
          fontSize={fontSizes.dimension}
          color={colors.edge}
        />
      )}

      {/* M label - center of base (where height meets base) */}
      {showLabels.centerPoint && showLines.height && (
        <text
          x={vertices.M.x + 12}
          y={vertices.M.y + 15}
          fontSize={fontSizes.vertex}
          fontWeight="bold"
          fill={colors.heightLine}
        >
          M
        </text>
      )}

      {/* Vertex labels */}
      {shouldShowVertices && (
        <>
          <text x={vertices.A.x - 15} y={vertices.A.y + 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexBottom}>{getVertexLabel(0)}</text>
          <text x={vertices.B.x + 8} y={vertices.B.y + 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexBottom}>{getVertexLabel(1)}</text>
          <text x={vertices.C.x + 8} y={vertices.C.y + 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexBottom}>{getVertexLabel(2)}</text>
          <text x={vertices.D.x - 15} y={vertices.D.y + 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexBottom}>{getVertexLabel(3)}</text>
          <text x={vertices.V.x} y={vertices.V.y - 10} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexTop} textAnchor="middle">{getVertexLabel(4)}</text>
        </>
      )}
    </svg>
  );
};

/**
 * Right angle marker for the pyramid
 */
const RightAngleMarker = ({ vertex, dir1, dir2, size = 10, color = '#666' }) => {
  // Normalize directions
  const len1 = Math.sqrt(dir1.x * dir1.x + dir1.y * dir1.y);
  const len2 = Math.sqrt(dir2.x * dir2.x + dir2.y * dir2.y);
  
  if (len1 === 0 || len2 === 0) return null;
  
  const ux1 = (dir1.x / len1) * size;
  const uy1 = (dir1.y / len1) * size;
  const ux2 = (dir2.x / len2) * size;
  const uy2 = (dir2.y / len2) * size;

  const p1 = { x: vertex.x + ux1, y: vertex.y + uy1 };
  const p2 = { x: vertex.x + ux1 + ux2, y: vertex.y + uy1 + uy2 };
  const p3 = { x: vertex.x + ux2, y: vertex.y + uy2 };

  return (
    <path
      d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`}
      stroke={color}
      strokeWidth={1.5}
      fill="none"
    />
  );
};

/**
 * Dimension label component
 */
const DimensionLabel = ({ p1, p2, label, offset = 15, fontSize = 13, color = '#333', bold = false }) => {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  if (len === 0) return null;
  
  const perpX = -dy / len;
  const perpY = dx / len;

  const labelX = midX + perpX * offset;
  const labelY = midY + perpY * offset;

  return (
    <text
      x={labelX}
      y={labelY}
      fontSize={fontSize}
      fontWeight={bold ? 'bold' : 'normal'}
      fill={color}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
};

// Export calculation helpers
Pyramid3D.calculations = {
  slantHeight: (baseSize, height) => Math.sqrt(height * height + (baseSize / 2) * (baseSize / 2)),
  edgeLength: (baseSize, height) => Math.sqrt(height * height + 2 * (baseSize / 2) * (baseSize / 2)),
  baseDiagonal: (baseSize) => baseSize * Math.sqrt(2),
  surfaceArea: (baseSize, height) => {
    const slant = Math.sqrt(height * height + (baseSize / 2) * (baseSize / 2));
    return baseSize * baseSize + 2 * baseSize * slant;
  },
  volume: (baseSize, height) => (1 / 3) * baseSize * baseSize * height
};

export default Pyramid3D;