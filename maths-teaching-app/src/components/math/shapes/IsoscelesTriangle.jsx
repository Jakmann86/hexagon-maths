// src/components/math/shapes/IsoscelesTriangle.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * IsoscelesTriangle - A component for rendering an isosceles triangle with height toggle
 * Sized to match the RightTriangle component
 * 
 * @param {Object} props
 * @param {number} props.base - Length of the base (default: 6)
 * @param {number} props.height - Height of the triangle (default: 4)
 * @param {boolean} props.showHeight - Whether to show the height line
 * @param {string} props.labelStyle - Style of labels ('standard', 'numeric', or 'custom')
 * @param {Object} props.labels - Custom labels for different parts of the triangle
 * @param {Array} props.labels.sides - Labels for sides [base, left side, right side]
 * @param {Array} props.labels.vertices - Labels for vertices [bottom-left, bottom-right, top]
 * @param {string} props.units - Units for measurements (e.g. "cm", "m")
 * @param {Object} props.style - Additional styling options
 * @param {number} props.mafsHeight - Direct height for the Mafs component
 */
const IsoscelesTriangle = ({
  base = 6,
  height = 4,
  showHeight = false,
  labelStyle = 'standard',
  labels = {},
  units = 'cm',
  style = {},
  mafsHeight = 250,
}) => {
  // Calculate equal sides length using Pythagoras' theorem
  const halfBase = base / 2;
  const equalSide = Math.sqrt(halfBase * halfBase + height * height);
  const roundedEqualSide = Math.round(equalSide * 100) / 100; // Round to 2 decimal places
  
  // Default labels based on labelStyle
  let defaultSideLabels = [];
  
  if (labelStyle === 'numeric') {
    defaultSideLabels = [
      `${base} ${units}`,
      `${roundedEqualSide} ${units}`,
      `${roundedEqualSide} ${units}`
    ];
  } else if (labelStyle === 'standard') {
    defaultSideLabels = ['base', 'side', 'side'];
  } else {
    defaultSideLabels = ['b', 'a', 'a'];
  }
  
  // Merge default labels with provided labels
  const sideLabels = labels.sides || defaultSideLabels;
  const vertexLabels = labels.vertices || ['A', 'B', 'C'];
  
  // Default style options
  const {
    fillColor = MafsLib.Theme.green,
    fillOpacity = 0.2,
    strokeColor = MafsLib.Theme.green,
    strokeWidth = 2,
    showGrid = false,
    heightColor = MafsLib.Theme.blue,
    backgroundTransparent = true,
  } = style;
  
  // Calculate viewBox with better padding exactly like RightTriangle
  const maxDim = Math.max(base, height);
  const padding = Math.max(1, maxDim * 0.15); // Dynamic padding based on size
  
  const viewBox = {
    x: [-padding, base + padding],
    y: [-padding, height + padding]
  };

  // Custom styles for Mafs component with background fixes
  const mafsStyles = {
    '--mafs-bg': 'transparent',
    '--mafs-fg': '#333',
    background: 'transparent'
  };

  return (
    <div className="w-full h-full" style={{ background: 'transparent' }}>
      <MafsLib.Mafs 
        className="mafs-transparent"
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
            [base/2, height]
          ]}
          color={fillColor}
          fillOpacity={fillOpacity}
          strokeOpacity={1}
          strokeWidth={strokeWidth}
        />

        {/* Height line (optional) */}
        {showHeight && (
          <>
            <MafsLib.Line.Segment
              point1={[base/2, height]}
              point2={[base/2, 0]}
              color={heightColor}
              strokeWidth={1}
              strokeDasharray={4}
            />
            
            {/* Right angle marker at base of height */}
            <MafsLib.Polygon
              points={[
                [base/2 - 0.3, 0],
                [base/2 - 0.3, 0.3],
                [base/2, 0.3]
              ]}
              color={MafsLib.Theme.black}
              strokeOpacity={1}
              fillOpacity={0}
              strokeWidth={1}
            />
            
            {/* Height label */}
            <MafsLib.Text
              x={base/2 + 0.6}
              y={height/2}
              attach="center"
              color={heightColor}
            >
              {`h = ${height} ${units}`}
            </MafsLib.Text>
          </>
        )}

        {/* Side labels - matching RightTriangle positioning pattern */}
        {/* Base label */}
        <MafsLib.Text
          x={base/2 - 0.75}
          y={-1}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {sideLabels[0]}
        </MafsLib.Text>
        
        {/* Left equal side label */}
        <MafsLib.Text
          x={base/4 - 2}
          y={height/2}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {sideLabels[1]}
        </MafsLib.Text>
        
        {/* Right equal side label */}
        <MafsLib.Text
          x={3*base/4 + 0.5}
          y={height/2}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {sideLabels[2]}
        </MafsLib.Text>
        
        {/* Vertex labels (only if specifically requested) */}
        {labels.vertices && (
          <>
            <MafsLib.Text x={0} y={0} attach="southwest" color={MafsLib.Theme.black}>
              {vertexLabels[0]}
            </MafsLib.Text>
            
            <MafsLib.Text x={base} y={0} attach="southeast" color={MafsLib.Theme.black}>
              {vertexLabels[1]}
            </MafsLib.Text>
            
            <MafsLib.Text x={base/2} y={height} attach="north" color={MafsLib.Theme.black}>
              {vertexLabels[2]}
            </MafsLib.Text>
          </>
        )}
      </MafsLib.Mafs>
    </div>
  );
};

export default IsoscelesTriangle;