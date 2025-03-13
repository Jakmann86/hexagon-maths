// src/components/math/shapes/Square.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * Square - A component for rendering a square shape with optional labels and dimensions
 * 
 * @param {Object} props
 * @param {number|string} props.sideLength - Length of square sides (use string '?' for unknown)
 * @param {boolean} props.showDimensions - Whether to show dimension labels
 * @param {boolean} props.showArea - Whether to show area label
 * @param {string} props.areaLabel - Label for area (if showArea is true)
 * @param {string} props.units - Units for measurements (e.g. "cm", "m")
 * @param {Object} props.style - Additional styling options
 * @param {string} props.style.fillColor - Fill color (default: blue)
 * @param {number} props.style.fillOpacity - Fill opacity (default: 0.2)
 * @param {string} props.style.strokeColor - Stroke color (default: blue)
 * @param {number} props.style.strokeWidth - Stroke width (default: 2)
 */
const Square = ({
  sideLength = 4,
  showDimensions = false,
  showArea = false,
  areaLabel = '',
  units = '',
  style = {}
}) => {
  // Parse side length or use default for display
  const parsedSideLength = sideLength === '?' ? 4 : Number(sideLength);
  
  // Default style options
  const {
    fillColor = MafsLib.Theme.blue,
    fillOpacity = 0.2,
    strokeColor = MafsLib.Theme.blue,
    strokeWidth = 2,
    showGrid = false,
  } = style;
  
  // Calculate viewBox with padding
  const padding = 1;
  const viewBox = {
    x: [-padding, parsedSideLength + padding],
    y: [-padding, parsedSideLength + padding]
  };

  return (
    <MafsLib.Mafs viewBox={viewBox}>
      {showGrid && <MafsLib.Coordinates.Cartesian />}
      
      {/* Square polygon */}
      <MafsLib.Polygon
        points={[
          [0, 0],
          [parsedSideLength, 0],
          [parsedSideLength, parsedSideLength],
          [0, parsedSideLength]
        ]}
        color={fillColor}
        fillOpacity={fillOpacity}
        strokeOpacity={1}
        strokeWidth={strokeWidth}
      />

      {/* Dimension labels */}
      {showDimensions && (
        <>
          {/* Bottom side label */}
          <MafsLib.Text
            x={parsedSideLength / 2}
            y={-0.4}
            attach="center"
            color={MafsLib.Theme.black}
          >
            {sideLength === '?' ? '?' : parsedSideLength} {units}
          </MafsLib.Text>
          
          {/* Left side label */}
          <MafsLib.Text
            x={-0.4}
            y={parsedSideLength / 2}
            attach="center"
            color={MafsLib.Theme.black}
          >
            {sideLength === '?' ? '?' : parsedSideLength} {units}
          </MafsLib.Text>
        </>
      )}

      {/* Area label */}
      {showArea && (
        <MafsLib.Text
          x={parsedSideLength / 2}
          y={parsedSideLength / 2}
          attach="center"
          color={MafsLib.Theme.black}
        >
          {areaLabel || (sideLength !== '?' ? `${parsedSideLength * parsedSideLength} ${units}²` : `?`)}
        </MafsLib.Text>
      )}
    </MafsLib.Mafs>
  );
};

export default Square;