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
 * @param {number} props.mafsHeight - Direct height for the Mafs component
 */
const RightTriangle = ({
  base = 3,
  height = 4,
  showRightAngle = true,
  labelStyle = 'standard',
  labels = {},
  units = 'cm',
  style = {},
  mafsHeight = 250,
}) => {
  // Calculate hypotenuse using Pythagoras' theorem
  const hypotenuse = Math.sqrt(base * base + height * height);
  
  // Default labels based on labelStyle
  const defaultSideLabels = labelStyle === 'algebraic' 
    ? ['a', 'b', 'c'] 
    : [`${base} ${units}`, `${height} ${units}`, `${hypotenuse.toFixed(2)} ${units}`];
    
  // Merge default labels with provided labels
  const sideLabels = labels.sides || defaultSideLabels;
  
  // Default style options
  const {
    fillColor = MafsLib.Theme.indigo,
    fillOpacity = 0.2,
    strokeColor = MafsLib.Theme.indigo,
    strokeWidth = 2,
    showGrid = false,
    backgroundTransparent = true,
  } = style;
  
  // Calculate viewBox with better padding
  const maxDim = Math.max(base, height);
  const padding = Math.max(1, maxDim * 0.15); // Dynamic padding based on size
  
  const viewBox = {
    x: [-padding, base + padding],
    y: [-padding, height + padding]
  };

  // Custom styles for Mafs component
  const mafsStyles = backgroundTransparent ? {
    background: 'transparent',
    '--mafs-bg': 'transparent',
    '--mafs-fg': '#333'
  } : {};

  return (
    <div className="w-full h-full" style={{ background: 'transparent' }}>
      <MafsLib.Mafs 
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        height={mafsHeight} // Use explicit height from props
        width={mafsHeight}  // Make width equal to height for consistent aspect ratio
        style={mafsStyles}
      >
        {/* Optional grid with faint axes */}
        {showGrid && <MafsLib.Coordinates.Cartesian 
          xAxis={{ variant: 'secondary' }}
          yAxis={{ variant: 'secondary' }}
        />}
        
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
          y={-0.5}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {sideLabels[0]}
        </MafsLib.Text>
        
        {/* Height label */}
        <MafsLib.Text
          x={-0.5}
          y={height / 2}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {sideLabels[1]}
        </MafsLib.Text>
        
        {/* Hypotenuse label */}
        <MafsLib.Text
          x={base / 2 - 0.7}
          y={height / 2 - 0.7}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {sideLabels[2]}
        </MafsLib.Text>
        
        {/* Vertex labels removed as requested */}
      </MafsLib.Mafs>
    </div>
  );
};

export default RightTriangle;