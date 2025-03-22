// src/components/math/visualizations/StackedTriangles.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * StackedTriangles component visualizes a problem with multiple triangles
 * arranged in geometric configurations to apply Pythagoras' theorem.
 * 
 * @param {Object} triangleData - Configuration data for the triangles
 * @param {boolean} showSolution - Whether to show the solution line and distance
 */
const StackedTriangles = ({ 
  triangleData = [], 
  showSolution = false 
}) => {
  // Calculate viewBox based on all triangle points
  const points = triangleData.flatMap(t => t.points || []);
  if (points.length === 0) {
    return <div>No triangle data provided</div>;
  }
  
  const xValues = points.map(p => p[0]);
  const yValues = points.map(p => p[1]);
  
  const minX = Math.min(...xValues) - 1;
  const maxX = Math.max(...xValues) + 1;
  const minY = Math.min(...yValues) - 1;
  const maxY = Math.max(...yValues) + 1;
  
  // Calculate distance for target line if available
  let targetDistance;
  if (triangleData.targetLine) {
    const [p1, p2] = triangleData.targetLine;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    targetDistance = Math.sqrt(dx * dx + dy * dy);
  }
  
  return (
    <MafsLib.Mafs
      viewBox={{ x: [minX, maxX], y: [minY, maxY] }}
      preserveAspectRatio="contain"
    >
      <MafsLib.Coordinates.Cartesian />
      
      {/* Draw each triangle */}
      {triangleData.map((triangle, index) => (
        <React.Fragment key={index}>
          {/* Triangle polygon */}
          <MafsLib.Polygon
            points={triangle.points}
            color={triangle.color || MafsLib.Theme.blue}
            fillOpacity={0.1}
            strokeWidth={2}
          />
          
          {/* Label each vertex if labels are provided */}
          {triangle.labels && triangle.points.map((point, pointIndex) => (
            <React.Fragment key={`point-${index}-${pointIndex}`}>
              <MafsLib.Point
                x={point[0]} 
                y={point[1]} 
                color={triangle.color || MafsLib.Theme.blue}
              />
              {triangle.labels[pointIndex] && (
                <MafsLib.Text 
                  x={point[0] + 0.3} 
                  y={point[1] + 0.3} 
                  attach="center" 
                  color={triangle.color || MafsLib.Theme.blue}
                >
                  {triangle.labels[pointIndex]}
                </MafsLib.Text>
              )}
            </React.Fragment>
          ))}
          
          {/* Right angle marker if specified */}
          {triangle.rightAngleIndex !== undefined && triangle.rightAngleIndex !== null && (
            <MafsLib.Polygon
              points={[
                triangle.points[triangle.rightAngleIndex],
                [
                  triangle.points[triangle.rightAngleIndex][0] + 0.3,
                  triangle.points[triangle.rightAngleIndex][1]
                ],
                [
                  triangle.points[triangle.rightAngleIndex][0] + 0.3,
                  triangle.points[triangle.rightAngleIndex][1] + 0.3
                ]
              ]}
              color={triangle.color || MafsLib.Theme.blue}
              fillOpacity={0}
              strokeWidth={1.5}
            />
          )}
        </React.Fragment>
      ))}
      
      {/* Target line between specified points if showing solution */}
      {showSolution && triangleData.targetLine && (
        <>
          <MafsLib.Line.Segment
            point1={triangleData.targetLine[0]}
            point2={triangleData.targetLine[1]}
            color={MafsLib.Theme.red}
            strokeWidth={2.5}
            strokeDasharray="5,5"
          />
          
          {/* Distance label */}
          <MafsLib.Text
            x={(triangleData.targetLine[0][0] + triangleData.targetLine[1][0]) / 2 + 0.3}
            y={(triangleData.targetLine[0][1] + triangleData.targetLine[1][1]) / 2 + 0.3}
            attach="center"
            color={MafsLib.Theme.red}
          >
            {targetDistance.toFixed(2)}
          </MafsLib.Text>
        </>
      )}
    </MafsLib.Mafs>
  );
};

export default StackedTriangles;