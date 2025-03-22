// src/components/math/visualizations/CoordinateDistance.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * CoordinateDistance component visualizes the distance between two points on a coordinate grid,
 * optionally showing the right triangle formed by the horizontal and vertical components.
 * 
 * @param {Array} point1 - [x, y] coordinates of the first point
 * @param {Array} point2 - [x, y] coordinates of the second point
 * @param {boolean} showingDistance - Whether to show the right triangle components
 * @param {string} labelA - Optional label for point1
 * @param {string} labelB - Optional label for point2
 */
const CoordinateDistance = ({ 
  point1 = [1, 1], 
  point2 = [4, 5], 
  showingDistance = false,
  labelA = 'A',
  labelB = 'B'
}) => {
  // Calculate range for the view box with padding
  const xRange = [
    Math.min(point1[0], point2[0]) - 2, 
    Math.max(point1[0], point2[0]) + 2
  ];
  const yRange = [
    Math.min(point1[1], point2[1]) - 2, 
    Math.max(point1[1], point2[1]) + 2
  ];
  
  // Calculate horizontal and vertical differences for the right triangle
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return (
    <MafsLib.Mafs
      viewBox={{ x: xRange, y: yRange }}
      preserveAspectRatio="contain"
    >
      <MafsLib.Coordinates.Cartesian />
      
      {/* Points */}
      <MafsLib.Point x={point1[0]} y={point1[1]} color={MafsLib.Theme.red} />
      <MafsLib.Text x={point1[0] + 0.3} y={point1[1] + 0.3} attach="center" color={MafsLib.Theme.red}>
        {labelA}({point1[0]}, {point1[1]})
      </MafsLib.Text>
      
      <MafsLib.Point x={point2[0]} y={point2[1]} color={MafsLib.Theme.blue} />
      <MafsLib.Text x={point2[0] + 0.3} y={point2[1] + 0.3} attach="center" color={MafsLib.Theme.blue}>
        {labelB}({point2[0]}, {point2[1]})
      </MafsLib.Text>
      
      {/* Line between points */}
      <MafsLib.Line.Segment
        point1={point1}
        point2={point2}
        color={MafsLib.Theme.indigo}
        strokeWidth={2}
      />
      
      {/* Distance label on the line */}
      <MafsLib.Text 
        x={(point1[0] + point2[0]) / 2 + 0.3} 
        y={(point1[1] + point2[1]) / 2 + 0.3} 
        attach="center" 
        color={MafsLib.Theme.indigo}
      >
        {distance.toFixed(2)}
      </MafsLib.Text>
      
      {/* If showing distance, draw the right triangle */}
      {showingDistance && (
        <>
          {/* Horizontal line */}
          <MafsLib.Line.Segment
            point1={point1}
            point2={[point2[0], point1[1]]}
            color={MafsLib.Theme.green}
            strokeWidth={1.5}
            strokeOpacity={0.8}
          />
          
          {/* Horizontal distance label */}
          <MafsLib.Text 
            x={(point1[0] + point2[0]) / 2} 
            y={point1[1] - 0.3} 
            attach="center" 
            color={MafsLib.Theme.green}
          >
            {Math.abs(dx).toFixed(1)}
          </MafsLib.Text>
          
          {/* Vertical line */}
          <MafsLib.Line.Segment
            point1={[point2[0], point1[1]]}
            point2={point2}
            color={MafsLib.Theme.green}
            strokeWidth={1.5}
            strokeOpacity={0.8}
          />
          
          {/* Vertical distance label */}
          <MafsLib.Text 
            x={point2[0] + 0.3} 
            y={(point1[1] + point2[1]) / 2} 
            attach="center" 
            color={MafsLib.Theme.green}
          >
            {Math.abs(dy).toFixed(1)}
          </MafsLib.Text>
          
          {/* Right angle marker */}
          <MafsLib.Polygon
            points={[
              [point2[0], point1[1]],
              [point2[0] - 0.3, point1[1]],
              [point2[0] - 0.3, point1[1] + 0.3]
            ]}
            color={MafsLib.Theme.green}
            fillOpacity={0}
            strokeWidth={1.5}
          />
        </>
      )}
    </MafsLib.Mafs>
  );
};

export default CoordinateDistance;