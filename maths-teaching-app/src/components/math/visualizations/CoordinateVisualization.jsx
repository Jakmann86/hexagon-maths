// src/components/math/visualizations/CoordinateVisualization.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';
import { useUI } from '../../../context/UIContext';

/**
 * A visualization showing two points and the line between them.
 * Shows the Pythagorean triangle when answers are toggled on.
 * Works for all point arrangements and correctly forms right angles.
 */
const CoordinateVisualization = ({ 
  point1 = [1, 1], 
  point2 = [4, 5],
  label1 = 'A',
  label2 = 'B',
  lineColor = MafsLib.Theme.indigo
}) => {
  // Get showAnswers state from UI context
  const { showAnswers } = useUI();
  
  // Calculate view box with padding
  const padding = 2;
  const xMin = Math.min(point1[0], point2[0]) - padding;
  const xMax = Math.max(point1[0], point2[0]) + padding;
  const yMin = Math.min(point1[1], point2[1]) - padding;
  const yMax = Math.max(point1[1], point2[1]) + padding;
  
  // Create viewBox
  const viewBox = {
    x: [xMin, xMax],
    y: [yMin, yMax]
  };
  
  // Calculate the differences for Pythagoras
  const dx = Math.abs(point2[0] - point1[0]);
  const dy = Math.abs(point2[1] - point1[1]);
  
  // Calculate the right angle point - this is the key for correct visualization
  // The right angle is always at the point [point2.x, point1.y]
  const rightAnglePoint = [point2[0], point1[1]];
  
  return (
    <div className="w-full h-full">
      <MafsLib.Mafs
        viewBox={viewBox}
        preserveAspectRatio="contain"
        height={400}
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
        
        {/* Only show Pythagorean triangle when answers are toggled on */}
        {showAnswers && (
          <>
            {/* Horizontal line from point1 to right angle point */}
            <MafsLib.Line.Segment
              point1={point1}
              point2={rightAnglePoint}
              color={MafsLib.Theme.green}
              strokeWidth={1.5}
              strokeDasharray="5,5"
            />
            
            {/* Vertical line from right angle point to point2 */}
            <MafsLib.Line.Segment
              point1={rightAnglePoint}
              point2={point2}
              color={MafsLib.Theme.green}
              strokeWidth={1.5}
              strokeDasharray="5,5"
            />
            
            {/* Right angle marker - adjust direction based on relative positions */}
            <MafsLib.Polygon
              points={[
                rightAnglePoint,
                [rightAnglePoint[0] - (point2[0] > point1[0] ? 0.3 : -0.3), rightAnglePoint[1]],
                [rightAnglePoint[0] - (point2[0] > point1[0] ? 0.3 : -0.3), 
                 rightAnglePoint[1] + (point2[1] > point1[1] ? 0.3 : -0.3)]
              ]}
              color={MafsLib.Theme.green}
              fillOpacity={0}
              strokeWidth={1.5}
            />
            
            {/* Simple side labels - calculate positions carefully */}
            <MafsLib.Text 
              x={(point1[0] + rightAnglePoint[0]) / 2} 
              y={point1[1] - 0.3} 
              attach="center" 
              color={MafsLib.Theme.green}
            >
              a = {dx.toFixed(1)}
            </MafsLib.Text>
            
            <MafsLib.Text 
              x={point2[0] + (point2[0] > point1[0] ? 0.4 : -0.4)} 
              y={(rightAnglePoint[1] + point2[1]) / 2} 
              attach="center" 
              color={MafsLib.Theme.green}
            >
              b = {dy.toFixed(1)}
            </MafsLib.Text>
          </>
        )}
      </MafsLib.Mafs>
    </div>
  );
};

export default CoordinateVisualization;