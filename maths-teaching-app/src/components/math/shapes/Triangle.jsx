// src/components/math/shapes/Triangle.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * Triangle - A component for rendering a generic triangle with optional labels
 * 
 * @param {Object} props
 * @param {Array} props.vertices - Array of [x,y] coordinates for the three vertices
 * @param {Array} props.sideLabels - Labels for the three sides
 * @param {Array} props.angleLabels - Labels for the three angles
 * @param {Array} props.vertexLabels - Labels for the three vertices
 * @param {boolean} props.showArea - Whether to show the area label
 * @param {string} props.areaLabel - Custom area label
 * @param {string} props.units - Units for measurements (e.g. "cm", "m")
 * @param {Object} props.style - Additional styling options
 */
const Triangle = ({
  // Default vertices for an equilateral triangle
  vertices = [[0, 0], [4, 0], [2, 3.46]], 
  sideLabels = [],
  angleLabels = [],
  vertexLabels = [],
  showArea = false,
  areaLabel = '',
  units = '',
  style = {}
}) => {
  // Helper function to find midpoint of a line segment
  const midpoint = (p1, p2) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  
  // Calculate centroid of triangle
  const centroid = [
    (vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3,
    (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3
  ];
  
  // Calculate side midpoints for labels
  const sideMidpoints = [
    midpoint(vertices[0], vertices[1]),
    midpoint(vertices[1], vertices[2]),
    midpoint(vertices[2], vertices[0])
  ];
  
  // Calculate area using Heron's formula (if needed for display)
  const calculateArea = () => {
    const dist = (p1, p2) => 
      Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
    
    const a = dist(vertices[0], vertices[1]);
    const b = dist(vertices[1], vertices[2]);
    const c = dist(vertices[2], vertices[0]);
    
    const s = (a + b + c) / 2; // semi-perimeter
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  };
  
  // Default style options
  const {
    fillColor = MafsLib.Theme.red,
    fillOpacity = 0.2,
    strokeColor = MafsLib.Theme.red,
    strokeWidth = 2,
    showGrid = false,
  } = style;
  
  // Calculate viewBox
  const padding = 1;
  const minX = Math.min(...vertices.map(v => v[0]));
  const maxX = Math.max(...vertices.map(v => v[0]));
  const minY = Math.min(...vertices.map(v => v[1]));
  const maxY = Math.max(...vertices.map(v => v[1]));
  
  const viewBox = {
    x: [minX - padding, maxX + padding],
    y: [minY - padding, maxY + padding]
  };

  return (
    <MafsLib.Mafs viewBox={viewBox}>
      {showGrid && <MafsLib.Coordinates.Cartesian />}
      
      {/* Triangle */}
      <MafsLib.Polygon
        points={vertices}
        color={fillColor}
        fillOpacity={fillOpacity}
        strokeOpacity={1}
        strokeWidth={strokeWidth}
      />
      
      {/* Side labels */}
      {sideLabels.map((label, index) => {
        if (!label) return null;
        
        const [x, y] = sideMidpoints[index];
        const offset = 0.3; // Offset distance from edge
        
        // Calculate normal vector pointing outward
        const idx1 = index;
        const idx2 = (index + 1) % 3;
        const dx = vertices[idx2][0] - vertices[idx1][0];
        const dy = vertices[idx2][1] - vertices[idx1][1];
        const len = Math.sqrt(dx*dx + dy*dy);
        const nx = -dy / len; // Normal x-component (perpendicular)
        const ny = dx / len;  // Normal y-component (perpendicular)
        
        return (
          <MafsLib.Text
            key={`side-${index}`}
            x={x + nx * offset}
            y={y + ny * offset}
            attach="center"
            color={MafsLib.Theme.black}
          >
            {label}
          </MafsLib.Text>
        );
      })}
      
      {/* Vertex labels */}
      {vertexLabels.map((label, index) => {
        if (!label) return null;
        
        const [x, y] = vertices[index];
        
        // Determine attach position based on vertex location
        const attachPos = (() => {
          const [cx, cy] = centroid;
          if (y < cy) return x < cx ? "southwest" : "southeast";
          return x < cx ? "northwest" : "northeast";
        })();
        
        return (
          <MafsLib.Text
            key={`vertex-${index}`}
            x={x}
            y={y}
            attach={attachPos}
            color={MafsLib.Theme.black}
          >
            {label}
          </MafsLib.Text>
        );
      })}
      
      {/* Area label */}
      {showArea && (
        <MafsLib.Text
          x={centroid[0]}
          y={centroid[1]}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {areaLabel || `${calculateArea().toFixed(2)} ${units}²`}
        </MafsLib.Text>
      )}
    </MafsLib.Mafs>
  );
};

export default Triangle;