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
 * @param {Object} props.customLabels - Custom labels for sides and area
 * @param {string} props.customLabels.side - Custom label for sides
 * @param {string} props.customLabels.area - Custom label for area
 * @param {Object} props.style - Additional styling options
 * @param {number} props.mafsHeight - Direct height for the Mafs component
 */
const Square = ({
  sideLength = 4,
  showDimensions = false,
  showArea = false,
  areaLabel = '',
  units = '',
  style = {},
  mafsHeight = 250,
  customLabels = {},
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
    backgroundTransparent = true,
  } = style;
  
  // Calculate viewBox with padding
  const padding = Math.max(1, parsedSideLength * 0.15); // Dynamic padding
  const viewBox = {
    x: [-padding, parsedSideLength + padding],
    y: [-padding, parsedSideLength + padding]
  };

  // Custom styles for Mafs component
  const mafsStyles = backgroundTransparent ? {
    background: 'transparent',
    '--mafs-bg': 'transparent',
    '--mafs-fg': '#333'
  } : {};

  // Override label texts if provided in customLabels
  const sideLabel = customLabels.side || (sideLength === '?' ? '?' : `${parsedSideLength} ${units}`);
  const displayedAreaLabel = customLabels.area || 
    (areaLabel || (sideLength !== '?' ? `${parsedSideLength * parsedSideLength} ${units}²` : `?`));

  return (
    <div className="w-full h-full" style={{ background: 'transparent', aspectRatio: '1/1' }}>
      <MafsLib.Mafs 
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        height={mafsHeight} // Use explicit height from props
        width={mafsHeight}  // Make width equal to height for square aspect ratio
        style={mafsStyles}
      >
        {showGrid && <MafsLib.Coordinates.Cartesian 
          xAxis={{ variant: 'secondary' }}
          yAxis={{ variant: 'secondary' }}
        />}
        
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
              y={-0.5}
              attach="center"
              color={MafsLib.Theme.black}
            >
              {sideLabel}
            </MafsLib.Text>
            
            {/* Left side label */}
            <MafsLib.Text
              x={-0.5}
              y={parsedSideLength / 2}
              attach="center"
              color={MafsLib.Theme.black}
            >
              {sideLabel}
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
            {displayedAreaLabel}
          </MafsLib.Text>
        )}
      </MafsLib.Mafs>
    </div>
  );
};

export default Square;