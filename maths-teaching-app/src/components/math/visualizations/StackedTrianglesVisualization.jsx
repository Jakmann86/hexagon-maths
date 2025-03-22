// src/components/math/visualizations/StackedTrianglesVisualization.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * Component for visualizing stacked triangles for Pythagoras problems
 */
const StackedTrianglesVisualization = ({ triangleData }) => {
  // Calculate viewBox with extra padding
  const points = triangleData.flatMap(t => t.points);
  const xValues = points.map(p => p[0]);
  const yValues = points.map(p => p[1]);
  
  const padding = 2;
  const minX = Math.min(...xValues) - padding;
  const maxX = Math.max(...xValues) + padding;
  const minY = Math.min(...yValues) - padding;
  const maxY = Math.max(...yValues) + padding;
  
  return (
    <div className="w-full h-full">
      <MafsLib.Mafs
        viewBox={{ x: [minX, maxX], y: [minY, maxY] }}
        preserveAspectRatio="contain"
        height={400}
      >
        <MafsLib.Coordinates.Cartesian />
        
        {/* Draw each triangle */}
        {triangleData.map((triangle, index) => (
          <React.Fragment key={index}>
            <MafsLib.Polygon
              points={triangle.points}
              color={triangle.color || MafsLib.Theme.blue}
              fillOpacity={0.1}
              strokeWidth={2}
            />
            
            {/* Label each vertex */}
            {triangle.points.map((point, pointIndex) => (
              <React.Fragment key={`point-${index}-${pointIndex}`}>
                <MafsLib.Point x={point[0]} y={point[1]} color={triangle.color || MafsLib.Theme.blue} />
                {triangle.labels && triangle.labels[pointIndex] && (
                  <MafsLib.Text x={point[0] + 0.3} y={point[1] + 0.3} attach="center" color={triangle.color || MafsLib.Theme.blue}>
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
        
        {/* Show the target line */}
        {triangleData.targetLine && (
          <MafsLib.Line.Segment
            point1={triangleData.targetLine[0]}
            point2={triangleData.targetLine[1]}
            color={MafsLib.Theme.red}
            strokeWidth={2.5}
            strokeDasharray="5,5"
          />
        )}
      </MafsLib.Mafs>
    </div>
  );
};

export default StackedTrianglesVisualization;