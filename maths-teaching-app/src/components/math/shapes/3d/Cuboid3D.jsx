// src/components/math/shapes/3d/Cuboid3D.jsx
// 3D Cuboid visualization using isometric projection
// Reusable across: 3D Pythagoras, Surface Area, Volume topics

import React, { useMemo } from 'react';

/**
 * Cuboid3D - Renders a 3D cuboid with isometric projection
 * 
 * USE CASES:
 * - 3D Pythagoras: Show internal diagonal triangles
 * - Surface Area: Highlight individual faces, show face areas
 * - Volume: Show dimensions, calculate w × d × h
 * - Starters/Diagnostics: Label vertices, identify edges
 * 
 * @param {number} width - Width of cuboid (x-axis)
 * @param {number} depth - Depth of cuboid (y-axis) 
 * @param {number} height - Height of cuboid (z-axis)
 * @param {string} units - Unit label (default: 'cm')
 * 
 * @param {Object} showTriangles - Internal triangles for 3D Pythagoras
 * @param {Object} showLabels - Control label visibility
 * @param {Object} showFaces - Control face visibility (for surface area)
 * @param {Object} highlightFaces - Highlight specific faces
 * @param {Object} highlightEdges - Highlight specific edges
 * @param {Object} edgeLabels - Custom labels for specific edges
 * @param {Object} faceLabels - Labels on faces (e.g., area values)
 * @param {Object} vertexLabels - Custom vertex label configuration
 * @param {Object} style - Custom styling options
 */
const Cuboid3D = ({
  width = 4,
  depth = 3,
  height = 5,
  units = 'cm',
  
  // Triangle overlays (3D Pythagoras)
  showTriangles = {
    baseDiagonal: false,
    spaceDiagonal: false
  },
  
  // Label visibility
  showLabels = {
    dimensions: true,
    baseDiagonal: false,
    spaceDiagonal: false,
    vertices: false,
    edges: false,
    faces: false
  },
  
  // Face visibility (all visible by default)
  showFaces = {
    top: true,
    bottom: true,
    front: true,
    back: true,
    left: true,
    right: true
  },
  
  // Face highlighting (for surface area teaching)
  highlightFaces = {
    top: false,
    bottom: false,
    front: false,
    back: false,
    left: false,
    right: false
  },
  
  // Edge highlighting
  highlightEdges = {
    width: false,
    depth: false,
    height: false
  },
  
  // Custom edge labels (override dimension labels)
  edgeLabels = {},
  
  // Face labels (e.g., for showing area on each face)
  faceLabels = {},
  
  // Vertex label configuration
  vertexLabels = {
    show: false,
    labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], // Bottom: A,B,C,D  Top: E,F,G,H
    color: null // null = use default red/blue scheme
  },
  
  // Custom styling
  style = {},
  className = ''
}) => {
  
  // Isometric projection angles (30 degrees)
  const ISO_ANGLE = Math.PI / 6;
  const SCALE = style.scale || 28;
  
  // Define the 8 vertices of the cuboid
  const vertices = useMemo(() => {
    // Calculate isometric coordinates from 3D point
    const toIsometric = (x, y, z) => {
      const isoX = (x + y) * Math.cos(ISO_ANGLE);
      const isoY = (y - x) * Math.sin(ISO_ANGLE) - z;
      return {
        x: isoX * SCALE,
        y: isoY * SCALE
      };
    };
    
    return {
      // Bottom face (z = 0)
      A: toIsometric(0, 0, 0),           // Front-left-bottom
      B: toIsometric(width, 0, 0),       // Front-right-bottom
      C: toIsometric(width, depth, 0),   // Back-right-bottom
      D: toIsometric(0, depth, 0),       // Back-left-bottom
      // Top face (z = height)
      E: toIsometric(0, 0, height),      // Front-left-top
      F: toIsometric(width, 0, height),  // Front-right-top
      G: toIsometric(width, depth, height), // Back-right-top
      H: toIsometric(0, depth, height),  // Back-left-top
    };
  }, [width, depth, height, SCALE]);

  // Calculate values
  const baseDiagonalLength = Math.sqrt(width * width + depth * depth);
  const spaceDiagonalLength = Math.sqrt(width * width + depth * depth + height * height);
  
  // Surface area calculations
  const faceAreas = {
    top: width * depth,
    bottom: width * depth,
    front: width * height,
    back: width * height,
    left: depth * height,
    right: depth * height
  };
  const totalSurfaceArea = 2 * (faceAreas.top + faceAreas.front + faceAreas.left);
  const volume = width * depth * height;

  // SVG viewBox calculations
  const allPoints = Object.values(vertices);
  const padding = style.padding || 50;
  const minX = Math.min(...allPoints.map(p => p.x)) - padding;
  const maxX = Math.max(...allPoints.map(p => p.x)) + padding;
  const minY = Math.min(...allPoints.map(p => p.y)) - padding;
  const maxY = Math.max(...allPoints.map(p => p.y)) + padding;
  const viewWidth = maxX - minX;
  const viewHeight = maxY - minY;

  // Color schemes and sizing
  const colors = {
    edge: style.edgeColor || '#2c3e50',
    hiddenEdge: style.hiddenEdgeColor || '#bdc3c7',
    highlight: style.highlightColor || '#e74c3c',
    faces: {
      top: style.topFaceColor || '#3498db',
      front: style.frontFaceColor || '#2980b9',
      side: style.sideFaceColor || '#1a5276',
      highlighted: style.highlightedFaceColor || '#f39c12'
    },
    triangles: {
      baseDiagonal: style.baseDiagonalColor || '#e74c3c',
      spaceDiagonal: style.spaceDiagonalColor || '#9b59b6'
    },
    vertexBottom: style.vertexBottomColor || '#e74c3c',
    vertexTop: style.vertexTopColor || '#2980b9'
  };

  // Font sizes - can be scaled up for starter sections
  const fontSizes = {
    dimension: style.labelSize || 13,
    dimensionBold: (style.labelSize || 13) + 1,
    vertex: style.vertexLabelSize || style.labelSize || 14,
    face: style.faceLabelSize || style.labelSize || 14
  };

  // Edge styling
  const edgeStyle = {
    visible: {
      stroke: colors.edge,
      strokeWidth: style.edgeWidth || 2,
      fill: 'none'
    },
    hidden: {
      stroke: colors.hiddenEdge,
      strokeWidth: style.hiddenEdgeWidth || 1.5,
      strokeDasharray: '6,4',
      fill: 'none'
    },
    highlight: {
      stroke: colors.highlight,
      strokeWidth: 3,
      fill: 'none'
    }
  };

  // Face styling
  const getFaceStyle = (faceType, isHighlighted) => {
    if (isHighlighted) {
      return {
        fill: colors.faces.highlighted,
        fillOpacity: 0.4,
        stroke: colors.faces.highlighted,
        strokeWidth: 2
      };
    }
    
    const baseOpacity = {
      top: 0.15,
      front: 0.1,
      side: 0.08
    };
    
    return {
      fill: colors.faces[faceType] || colors.faces.side,
      fillOpacity: baseOpacity[faceType] || 0.08,
      stroke: 'none'
    };
  };

  // Triangle styling
  const triangleStyle = {
    baseDiagonal: {
      fill: colors.triangles.baseDiagonal,
      fillOpacity: 0.2,
      stroke: colors.triangles.baseDiagonal,
      strokeWidth: 2.5
    },
    spaceDiagonal: {
      fill: colors.triangles.spaceDiagonal,
      fillOpacity: 0.25,
      stroke: colors.triangles.spaceDiagonal,
      strokeWidth: 2.5
    }
  };

  // Helper functions
  const createPath = (points) => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  };

  const createLine = (p1, p2) => `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  
  const getMidpoint = (p1, p2) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  });
  
  const getFaceCentroid = (points) => ({
    x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
    y: points.reduce((sum, p) => sum + p.y, 0) / points.length
  });

  // Get vertex label
  const getVertexLabel = (index) => {
    if (vertexLabels.labels && vertexLabels.labels[index]) {
      return vertexLabels.labels[index];
    }
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][index];
  };

  // Should show vertices (either from showLabels.vertices or vertexLabels.show)
  const shouldShowVertices = showLabels.vertices || vertexLabels.show;

  return (
    <svg
      viewBox={`${minX} ${minY} ${viewWidth} ${viewHeight}`}
      className={`w-full h-full ${className}`}
      style={{ maxHeight: style.maxHeight || '400px' }}
    >
      {/* Back-left face (A-D-H-E) - draw first so it's behind */}
      {showFaces.left && (
        <path
          d={createPath([vertices.A, vertices.D, vertices.H, vertices.E])}
          {...getFaceStyle('side', highlightFaces.left)}
        />
      )}

      {/* Hidden edges (dashed) - AB, BC, BF */}
      <path d={createLine(vertices.A, vertices.B)} {...edgeStyle.hidden} />
      <path d={createLine(vertices.B, vertices.C)} {...edgeStyle.hidden} />
      <path d={createLine(vertices.B, vertices.F)} {...edgeStyle.hidden} />

      {/* Visible faces */}
      {showFaces.top && (
        <path
          d={createPath([vertices.E, vertices.F, vertices.G, vertices.H])}
          {...getFaceStyle('top', highlightFaces.top)}
        />
      )}
      {showFaces.front && (
        <path
          d={createPath([vertices.A, vertices.B, vertices.F, vertices.E])}
          {...getFaceStyle('front', highlightFaces.front)}
        />
      )}
      {showFaces.right && (
        <path
          d={createPath([vertices.B, vertices.C, vertices.G, vertices.F])}
          {...getFaceStyle('side', highlightFaces.right)}
        />
      )}

      {/* Base diagonal triangle (on bottom face) */}
      {showTriangles.baseDiagonal && (
        <g className="base-diagonal-triangle">
          <path
            d={createPath([vertices.A, vertices.B, vertices.C])}
            {...triangleStyle.baseDiagonal}
          />
          <RightAngleMarker
            vertex={vertices.B}
            arm1={vertices.A}
            arm2={vertices.C}
            size={8}
            color={colors.triangles.baseDiagonal}
          />
        </g>
      )}

      {/* Space diagonal triangle */}
      {showTriangles.spaceDiagonal && (
        <g className="space-diagonal-triangle">
          <path
            d={createPath([vertices.A, vertices.C, vertices.G])}
            {...triangleStyle.spaceDiagonal}
          />
          <path
            d={createLine(vertices.A, vertices.C)}
            stroke={colors.triangles.spaceDiagonal}
            strokeWidth={3}
            fill="none"
          />
          <RightAngleMarker
            vertex={vertices.C}
            arm1={vertices.A}
            arm2={vertices.G}
            size={8}
            color={colors.triangles.spaceDiagonal}
          />
        </g>
      )}

      {/* Visible edges (solid) */}
      <path 
        d={createLine(vertices.A, vertices.D)} 
        {...(highlightEdges.depth ? edgeStyle.highlight : edgeStyle.visible)} 
      />
      <path 
        d={createLine(vertices.D, vertices.C)} 
        {...(highlightEdges.width ? edgeStyle.highlight : edgeStyle.visible)} 
      />
      <path 
        d={createLine(vertices.A, vertices.E)} 
        {...(highlightEdges.height ? edgeStyle.highlight : edgeStyle.visible)} 
      />
      <path d={createLine(vertices.D, vertices.H)} {...edgeStyle.visible} />
      <path d={createLine(vertices.C, vertices.G)} {...edgeStyle.visible} />
      <path d={createLine(vertices.E, vertices.F)} {...edgeStyle.visible} />
      <path d={createLine(vertices.F, vertices.G)} {...edgeStyle.visible} />
      <path d={createLine(vertices.G, vertices.H)} {...edgeStyle.visible} />
      <path d={createLine(vertices.E, vertices.H)} {...edgeStyle.visible} />

      {/* Dimension labels */}
      {showLabels.dimensions && (
        <>
          <DimensionLabel
            p1={vertices.D}
            p2={vertices.C}
            label={edgeLabels.width || `${width} ${units}`}
            offset={20}
            color={colors.edge}
            fontSize={fontSizes.dimension}
          />
          <DimensionLabel
            p1={vertices.A}
            p2={vertices.D}
            label={edgeLabels.depth || `${depth} ${units}`}
            offset={20}
            color={colors.edge}
            fontSize={fontSizes.dimension}
          />
          <DimensionLabel
            p1={vertices.A}
            p2={vertices.E}
            label={edgeLabels.height || `${height} ${units}`}
            offset={-25}
            color={colors.edge}
            fontSize={fontSizes.dimension}
          />
        </>
      )}

      {/* Base diagonal label */}
      {showLabels.baseDiagonal && showTriangles.baseDiagonal && (
        <DimensionLabel
          p1={vertices.A}
          p2={vertices.C}
          label={`${Math.round(baseDiagonalLength * 100) / 100} ${units}`}
          offset={-15}
          color={colors.triangles.baseDiagonal}
          bold
          fontSize={fontSizes.dimension}
        />
      )}

      {/* Space diagonal label */}
      {showLabels.spaceDiagonal && showTriangles.spaceDiagonal && (
        <DimensionLabel
          p1={vertices.A}
          p2={vertices.G}
          label={`${Math.round(spaceDiagonalLength * 100) / 100} ${units}`}
          offset={15}
          color={colors.triangles.spaceDiagonal}
          bold
          fontSize={fontSizes.dimension}
        />
      )}

      {/* Face labels (e.g., for surface area) */}
      {showLabels.faces && (
        <>
          {highlightFaces.top && (
            <text
              x={getFaceCentroid([vertices.E, vertices.F, vertices.G, vertices.H]).x}
              y={getFaceCentroid([vertices.E, vertices.F, vertices.G, vertices.H]).y}
              fontSize={fontSizes.face}
              fontWeight="bold"
              fill={colors.faces.highlighted}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {faceLabels.top || `${faceAreas.top} ${units}²`}
            </text>
          )}
          {highlightFaces.front && (
            <text
              x={getFaceCentroid([vertices.A, vertices.B, vertices.F, vertices.E]).x}
              y={getFaceCentroid([vertices.A, vertices.B, vertices.F, vertices.E]).y}
              fontSize={fontSizes.face}
              fontWeight="bold"
              fill={colors.faces.highlighted}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {faceLabels.front || `${faceAreas.front} ${units}²`}
            </text>
          )}
          {highlightFaces.right && (
            <text
              x={getFaceCentroid([vertices.B, vertices.C, vertices.G, vertices.F]).x}
              y={getFaceCentroid([vertices.B, vertices.C, vertices.G, vertices.F]).y}
              fontSize={fontSizes.face}
              fontWeight="bold"
              fill={colors.faces.highlighted}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {faceLabels.right || `${faceAreas.right} ${units}²`}
            </text>
          )}
        </>
      )}

      {/* Vertex labels */}
      {shouldShowVertices && (
        <>
          <text x={vertices.A.x - 15} y={vertices.A.y + 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexBottom}>{getVertexLabel(0)}</text>
          <text x={vertices.B.x + 8} y={vertices.B.y + 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexBottom}>{getVertexLabel(1)}</text>
          <text x={vertices.C.x + 8} y={vertices.C.y + 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexBottom}>{getVertexLabel(2)}</text>
          <text x={vertices.D.x - 15} y={vertices.D.y + 12} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexBottom}>{getVertexLabel(3)}</text>
          <text x={vertices.E.x - 15} y={vertices.E.y - 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexTop}>{getVertexLabel(4)}</text>
          <text x={vertices.F.x + 8} y={vertices.F.y - 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexTop}>{getVertexLabel(5)}</text>
          <text x={vertices.G.x + 8} y={vertices.G.y - 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexTop}>{getVertexLabel(6)}</text>
          <text x={vertices.H.x - 5} y={vertices.H.y - 5} fontSize={fontSizes.vertex} fontWeight="bold" fill={vertexLabels.color || colors.vertexTop}>{getVertexLabel(7)}</text>
        </>
      )}
    </svg>
  );
};

/**
 * Right angle marker component for triangles
 */
const RightAngleMarker = ({ vertex, arm1, arm2, size = 10, color = '#666' }) => {
  const dx1 = arm1.x - vertex.x;
  const dy1 = arm1.y - vertex.y;
  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const ux1 = (dx1 / len1) * size;
  const uy1 = (dy1 / len1) * size;

  const dx2 = arm2.x - vertex.x;
  const dy2 = arm2.y - vertex.y;
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  const ux2 = (dx2 / len2) * size;
  const uy2 = (dy2 / len2) * size;

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
const DimensionLabel = ({ p1, p2, label, offset = 15, color = '#333', bold = false, fontSize = 13 }) => {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  const perpX = -dy / len;
  const perpY = dx / len;

  const labelX = midX + perpX * offset;
  const labelY = midY + perpY * offset;

  return (
    <text
      x={labelX}
      y={labelY}
      fontSize={bold ? fontSize + 1 : fontSize}
      fontWeight={bold ? 'bold' : 'normal'}
      fill={color}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
};

// Export calculated values for use in generators/sections
Cuboid3D.calculateDiagonals = (width, depth, height) => ({
  baseDiagonal: Math.sqrt(width * width + depth * depth),
  spaceDiagonal: Math.sqrt(width * width + depth * depth + height * height)
});

Cuboid3D.calculateSurfaceArea = (width, depth, height) => ({
  top: width * depth,
  bottom: width * depth,
  front: width * height,
  back: width * height,
  left: depth * height,
  right: depth * height,
  total: 2 * (width * depth + width * height + depth * height)
});

Cuboid3D.calculateVolume = (width, depth, height) => width * depth * height;

export default Cuboid3D;