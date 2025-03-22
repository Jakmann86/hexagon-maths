// src/components/math/visualizations/NavigationVisualization.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * A simple visualization for navigation problems showing bearing paths
 */
const NavigationVisualization = ({ start, bearing, distance, secondBearing, secondDistance }) => {
  // Convert bearing to radians
  const bearingRadians = (450 - bearing) % 360 * Math.PI / 180;
  
  // Calculate end point
  const midPoint = [
    start[0] + distance * Math.cos(bearingRadians),
    start[1] + distance * Math.sin(bearingRadians)
  ];
  
  // Default end point is the mid point (for single leg journeys)
  let endPoint = [...midPoint];
  
  // Calculate second leg if applicable
  if (secondBearing !== undefined && secondDistance !== undefined) {
    const secondBearingRadians = (450 - secondBearing) % 360 * Math.PI / 180;
    endPoint = [
      midPoint[0] + secondDistance * Math.cos(secondBearingRadians),
      midPoint[1] + secondDistance * Math.sin(secondBearingRadians)
    ];
  }
  
  // Calculate view box with more padding
  const maxDistance = Math.max(distance, secondDistance || 0, 5);
  const padding = maxDistance * 0.3; // Add 30% padding
  const viewBox = {
    x: [start[0] - padding, start[0] + maxDistance + padding],
    y: [start[1] - padding, start[1] + maxDistance + padding]
  };

  return (
    <div className="w-full h-full">
      <MafsLib.Mafs
        viewBox={viewBox}
        preserveAspectRatio="contain"
        height={400}
      >
        <MafsLib.Coordinates.Cartesian />
        
        {/* Starting point */}
        <MafsLib.Point x={start[0]} y={start[1]} color={MafsLib.Theme.red} />
        <MafsLib.Text x={start[0] + 0.3} y={start[1] + 0.3} attach="center" color={MafsLib.Theme.red}>
          Start
        </MafsLib.Text>
        
        {/* North indicator */}
        <MafsLib.Line.Segment
          point1={start}
          point2={[start[0], start[1] + maxDistance / 4]}
          color={MafsLib.Theme.blue}
          strokeWidth={1.5}
        />
        <MafsLib.Text x={start[0]} y={start[1] + maxDistance / 4 + 0.5} attach="center" color={MafsLib.Theme.blue}>
          N
        </MafsLib.Text>
        
        {/* First leg */}
        <MafsLib.Line.Segment
          point1={start}
          point2={midPoint}
          color={MafsLib.Theme.green}
          strokeWidth={2}
        />
        
        {/* Second leg if applicable */}
        {secondBearing !== undefined && secondDistance !== undefined && (
          <>
            <MafsLib.Point x={midPoint[0]} y={midPoint[1]} color={MafsLib.Theme.purple} />
            <MafsLib.Text x={midPoint[0] + 0.3} y={midPoint[1] + 0.3} attach="center" color={MafsLib.Theme.purple}>
              Mid
            </MafsLib.Text>
            
            <MafsLib.Line.Segment
              point1={midPoint}
              point2={endPoint}
              color={MafsLib.Theme.green}
              strokeWidth={2}
            />
          </>
        )}
        
        {/* End point */}
        <MafsLib.Point x={endPoint[0]} y={endPoint[1]} color={MafsLib.Theme.yellow} />
        <MafsLib.Text x={endPoint[0] + 0.3} y={endPoint[1] + 0.3} attach="center" color={MafsLib.Theme.yellow}>
          End
        </MafsLib.Text>
        
        {/* Direct route as dashed line */}
        <MafsLib.Line.Segment
          point1={start}
          point2={endPoint}
          color={MafsLib.Theme.red}
          strokeWidth={1.5}
          strokeDasharray="5,5"
        />
      </MafsLib.Mafs>
    </div>
  );
};

export default NavigationVisualization;