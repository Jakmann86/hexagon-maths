// src/components/math/shapes/Rectangle.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * Rectangle - A component for rendering a rectangle with optional labels and dimensions
 * 
 * @param {Object} props
 * @param {number|string} props.width - Width of rectangle (use string '?' for unknown)
 * @param {number|string} props.height - Height of rectangle (use string '?' for unknown)
 * @param {boolean} props.showDimensions - Whether to show dimension labels
 * @param {boolean} props.showArea - Whether to show area label
 * @param {string} props.areaLabel - Label for area (if showArea is true)
 * @param {string} props.units - Units for measurements (e.g. "cm", "m")
 * @param {Object} props.style - Additional styling options
 */
const Rectangle = ({
  width = 6,
  height = 4,
  showDimensions = false,
  showArea = false,
  areaLabel = '',
  units = '',
  style = {}
}) => {
  // Parse dimensions or use defaults for display
  const parsedWidth = width === '?' ? 6 : Number(width);
  const parsedHeight = height === '?' ? 4 : Number(height);
  
  // Default style options
  const {
    fillColor = MafsLib.Theme.green,
    fillOpacity = 0.2,
    strokeColor = MafsLib.Theme.green,
    strokeWidth = 2,
    showGrid = false,
  } = style;
  
  // Calculate viewBox with padding
  const padding = 1;
  const viewBox = {
    x: [-padding, parsedWidth + padding],
    y: [-padding, parsedHeight + padding]
  };

  return (
    <MafsLib.Mafs viewBox={viewBox}>
      {showGrid && <MafsLib.Coordinates.Cartesian />}
      
      {/* Rectangle polygon */}
      <MafsLib.Polygon
        points={[
          [0, 0],
          [parsedWidth, 0],
          [parsedWidth, parsedHeight],
          [0, parsedHeight]
        ]}
        color={fillColor}
        fillOpacity={fillOpacity}
        strokeOpacity={1}
        strokeWidth={strokeWidth}
      />

      {/* Dimension labels */}
      {showDimensions && (
        <>
          {/* Width label (bottom) */}
          <MafsLib.Text
            x={parsedWidth / 2}
            y={-0.4}
            attach="center"
            color={MafsLib.Theme.black}
          >
            {width === '?' ? '?' : parsedWidth} {units}
          </MafsLib.Text>
          
          {/* Height label (left) */}
          <MafsLib.Text
            x={-0.4}
            y={parsedHeight / 2}
            attach="center"
            color={MafsLib.Theme.black}
          >
            {height === '?' ? '?' : parsedHeight} {units}
          </MafsLib.Text>
        </>
      )}

      {/* Area label */}
      {showArea && (
        <MafsLib.Text
          x={parsedWidth / 2}
          y={parsedHeight / 2}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {areaLabel || (width !== '?' && height !== '?' 
            ? `${parsedWidth * parsedHeight} ${units}²` 
            : `?`
          )}
        </MafsLib.Text>
      )}
    </MafsLib.Mafs>
  );
};

export default Rectangle;