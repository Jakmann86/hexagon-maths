// src/components/math/visualizations/CoordinateVisualization.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * A simple visualization showing two points and the line between them.
 * No extra elements, just the essential visualization for coordinate problems.
 */
const CoordinateVisualization = ({ 
  point1 = [1, 1], 
  point2 = [4, 5],
  label1 = 'A',
  label2 = 'B',
  lineColor = MafsLib.Theme.indigo
}) => {
  // Calculate view box with padding
  const padding = 1;
  const xMin = Math.min(point1[0], point2[0]) - padding;
  const xMax = Math.max(point1[0], point2[0]) + padding;
  const yMin = Math.min(point1[1], point2[1]) - padding;
  const yMax = Math.max(point1[1], point2[1]) + padding;
  
  // Make sure dimensions are proportional
  const width = xMax - xMin;
  const height = yMax - yMin;
  const maxDim = Math.max(width, height);
  const xCenter = (xMin + xMax) / 2;
  const yCenter = (yMin + yMax) / 2;
  
  // Create symmetric viewBox
  const viewBox = {
    x: [xCenter - maxDim/2 - padding/2, xCenter + maxDim/2 + padding/2],
    y: [yCenter - maxDim/2 - padding/2, yCenter + maxDim/2 + padding/2]
  };
  
  return (
    <MafsLib.Mafs
      viewBox={viewBox}
      preserveAspectRatio="contain"
      width="100%"
      height="100%"
    >
      <MafsLib.Coordinates.Cartesian />
      
      {/* Points */}
      <MafsLib.Point x={point1[0]} y={point1[1]} color={MafsLib.Theme.red} />
      <MafsLib.Text x={point1[0] + 0.3} y={point1[1] + 0.3} attach="center" color={MafsLib.Theme.red}>
        {label1}({point1[0]}, {point1[1]})
      </MafsLib.Text>
      
      <MafsLib.Point x={point2[0]} y={point2[1]} color={MafsLib.Theme.blue} />
      <MafsLib.Text x={point2[0] + 0.3} y={point2[1] + 0.3} attach="center" color={MafsLib.Theme.blue}>
        {label2}({point2[0]}, {point2[1]})
      </MafsLib.Text>
      
      {/* Line between points */}
      <MafsLib.Line.Segment
        point1={point1}
        point2={point2}
        color={lineColor}
        strokeWidth={2}
      />
    </MafsLib.Mafs>
  );
};

export default CoordinateVisualization;