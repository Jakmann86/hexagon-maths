// src/components/math/shapes/RightTriangle.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * RightTriangle - A component for rendering a right-angled triangle with optional labels
 * 
 * @param {Object} props
 * @param {number} props.base - Length of the base (default: 3)
 * @param {number} props.height - Height of the triangle (default: 4)
 * @param {boolean} props.showRightAngle - Whether to show the right angle marker
 * @param {string} props.labelStyle - Style of labels ('standard' or 'algebraic')
 * @param {Object} props.labels - Custom labels for different parts of the triangle
 * @param {Array} props.labels.sides - Labels for sides [base, height, hypotenuse]
 * @param {Array} props.labels.angles - Labels for angles
 * @param {Array} props.labels.vertices - Labels for vertices
 * @param {string} props.units - Units for measurements (e.g. "cm", "m")
 * @param {Object} props.style - Additional styling options
 */
const RightTriangle = ({
  base = 3,
  height = 4,
  showRightAngle = true,
  labelStyle = 'standard',
  labels = {
    sides: ['a', 'b', 'c'], // or any custom labels
  },
  units = 'cm',
  style = {}
}) => {
  // Calculate hypotenuse using Pythagoras' theorem
  const hypotenuse = Math.sqrt(base * base + height * height);
  
  // Default labels based on labelStyle
  const defaultSideLabels = labelStyle === 'algebraic' 
    ? ['a', 'b', 'c'] 
    : [`${base} ${units}`, `${height} ${units}`, `${hypotenuse.toFixed(2)} ${units}`];
    
  // Merge default labels with provided labels
  // This ensures explicit labels passed in always override the defaults
  const sideLabels = labels.sides || defaultSideLabels;
  
  // Prepare custom labeled sides if provided
  const customVertexLabels = labels.vertices || [];
  
  // Default style options
  const {
    fillColor = MafsLib.Theme.indigo,
    fillOpacity = 0.2,
    strokeColor = MafsLib.Theme.indigo,
    strokeWidth = 2,
    showGrid = false,
  } = style;
  
  // Calculate viewBox with padding
  const padding = 1;
  const viewBox = {
    x: [-padding, base + padding],
    y: [-padding, height + padding]
  };

  return (
    <MafsLib.Mafs viewBox={viewBox}>
      {showGrid && <MafsLib.Coordinates.Cartesian />}
      
      {/* Triangle polygon */}
      <MafsLib.Polygon
        points={[
          [0, 0],
          [base, 0],
          [0, height]
        ]}
        color={fillColor}
        fillOpacity={fillOpacity}
        strokeOpacity={1}
        strokeWidth={strokeWidth}
      />

      {/* Right angle marker */}
      {showRightAngle && (
        <MafsLib.Polygon
          points={[
            [0.5, 0],
            [0.5, 0.5],
            [0, 0.5]
          ]}
          color={MafsLib.Theme.black}
          strokeOpacity={1}
          fillOpacity={0}
          strokeWidth={1}
        />
      )}

      {/* Side labels */}
      {/* Base label */}
      <MafsLib.Text
        x={base / 2}
        y={-0.4}
        attach="center"
        color={MafsLib.Theme.black}
      >
        {sideLabels[0]}
      </MafsLib.Text>
      
      {/* Height label */}
      <MafsLib.Text
        x={-0.4}
        y={height / 2}
        attach="center"
        color={MafsLib.Theme.black}
      >
        {sideLabels[1]}
      </MafsLib.Text>
      
      {/* Hypotenuse label */}
      <MafsLib.Text
        x={base / 2 - 0.5}
        y={height / 2 - 0.5}
        attach="center"
        color={MafsLib.Theme.black}
      >
        {sideLabels[2]}
      </MafsLib.Text>
      
      {/* Vertex labels (if provided) */}
      {labels.vertices && (
        <>
          <MafsLib.Text x={0} y={0} attach="southwest" color={MafsLib.Theme.black}>
            {labels.vertices[0]}
          </MafsLib.Text>
          <MafsLib.Text x={base} y={0} attach="southeast" color={MafsLib.Theme.black}>
            {labels.vertices[1]}
          </MafsLib.Text>
          <MafsLib.Text x={0} y={height} attach="northwest" color={MafsLib.Theme.black}>
            {labels.vertices[2]}
          </MafsLib.Text>
        </>
      )}
    </MafsLib.Mafs>
  );
};

export default RightTriangle;