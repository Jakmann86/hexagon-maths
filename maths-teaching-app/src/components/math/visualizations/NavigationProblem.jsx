// src/components/math/visualizations/NavigationProblem.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * NavigationProblem component visualizes a navigation problem involving bearings.
 * It can show one or two legs of a journey and calculate the direct distance.
 * 
 * @param {Array} start - [x, y] coordinates of the starting point
 * @param {number} bearing - First bearing angle in degrees (0° = North, clockwise)
 * @param {number} distance - First leg distance
 * @param {number} secondBearing - Optional second bearing in degrees
 * @param {number} secondDistance - Optional second leg distance
 * @param {boolean} showSolution - Whether to show the end point and direct route
 */
const NavigationProblem = ({ 
  start = [0, 0], 
  bearing = 45, 
  distance = 5,
  secondBearing = null,
  secondDistance = null,
  showSolution = false
}) => {
  // Convert bearings to radians
  // Bearings are measured clockwise from North (0°)
  const bearingRadians = (450 - bearing) % 360 * Math.PI / 180;
  
  // Calculate end point for first leg
  const midPoint = [
    start[0] + distance * Math.cos(bearingRadians),
    start[1] + distance * Math.sin(bearingRadians)
  ];
  
  // Calculate end point for second leg, if applicable
  let endPoint = [...midPoint];
  let directDistance = distance;

  if (secondBearing !== null && secondDistance !== null) {
    const secondBearingRadians = (450 - secondBearing) % 360 * Math.PI / 180;
    endPoint = [
      midPoint[0] + secondDistance * Math.cos(secondBearingRadians),
      midPoint[1] + secondDistance * Math.sin(secondBearingRadians)
    ];
    
    // Calculate direct distance from start to end
    const dx = endPoint[0] - start[0];
    const dy = endPoint[1] - start[1];
    directDistance = Math.sqrt(dx * dx + dy * dy);
  }
  
  // Calculate view box
  const points = [start, midPoint];
  if (secondBearing !== null) points.push(endPoint);
  
  const xValues = points.map(p => p[0]);
  const yValues = points.map(p => p[1]);
  
  const minX = Math.min(...xValues) - 1;
  const maxX = Math.max(...xValues) + 1;
  const minY = Math.min(...yValues) - 1;
  const maxY = Math.max(...yValues) + 1;
  
  const viewBox = { x: [minX, maxX], y: [minY, maxY] };
  
  return (
    <MafsLib.Mafs
      viewBox={viewBox}
      preserveAspectRatio="contain"
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
        point2={[start[0], start[1] + 2]}
        color={MafsLib.Theme.blue}
        strokeWidth={1.5}
        strokeDasharray="5,5"
      />
      <MafsLib.Text x={start[0]} y={start[1] + 2.5} attach="center" color={MafsLib.Theme.blue}>
        N
      </MafsLib.Text>
      
      {/* First leg bearing angle indicator */}
      <MafsLib.Circle
        center={start}
        radius={1}
        angleStart={Math.PI / 2}  // North
        angleEnd={bearingRadians}
        color={MafsLib.Theme.orange}
        fillOpacity={0}
        strokeWidth={1.5}
      />
      <MafsLib.Text
        x={start[0] + Math.cos((Math.PI/2 + bearingRadians) / 2)}
        y={start[1] + Math.sin((Math.PI/2 + bearingRadians) / 2)}
        attach="center"
        color={MafsLib.Theme.orange}
      >
        {bearing}°
      </MafsLib.Text>
      
      {/* First leg */}
      <MafsLib.Line.Segment
        point1={start}
        point2={midPoint}
        color={MafsLib.Theme.green}
        strokeWidth={2}
      />
      <MafsLib.Text
        x={(start[0] + midPoint[0]) / 2 + 0.3}
        y={(start[1] + midPoint[1]) / 2 + 0.3}
        attach="center"
        color={MafsLib.Theme.green}
      >
        {distance}
      </MafsLib.Text>
      
      {/* Second leg, if applicable */}
      {secondBearing !== null && secondDistance !== null && (
        <>
          <MafsLib.Point x={midPoint[0]} y={midPoint[1]} color={MafsLib.Theme.purple} />
          <MafsLib.Text x={midPoint[0] + 0.3} y={midPoint[1] + 0.3} attach="center" color={MafsLib.Theme.purple}>
            Mid
          </MafsLib.Text>
          
          {/* North indicator from mid point */}
          <MafsLib.Line.Segment
            point1={midPoint}
            point2={[midPoint[0], midPoint[1] + 1.5]}
            color={MafsLib.Theme.blue}
            strokeWidth={1}
            strokeDasharray="5,5"
            strokeOpacity={0.5}
          />
          
          {/* Second bearing angle indicator */}
          <MafsLib.Circle
            center={midPoint}
            radius={0.8}
            angleStart={Math.PI / 2}  // North
            angleEnd={(450 - secondBearing) % 360 * Math.PI / 180}
            color={MafsLib.Theme.pink}
            fillOpacity={0}
            strokeWidth={1.5}
          />
          <MafsLib.Text
            x={midPoint[0] + Math.cos((Math.PI/2 + (450 - secondBearing) % 360 * Math.PI / 180) / 2) * 0.8}
            y={midPoint[1] + Math.sin((Math.PI/2 + (450 - secondBearing) % 360 * Math.PI / 180) / 2) * 0.8}
            attach="center"
            color={MafsLib.Theme.pink}
          >
            {secondBearing}°
          </MafsLib.Text>
          
          {/* Second leg */}
          <MafsLib.Line.Segment
            point1={midPoint}
            point2={endPoint}
            color={MafsLib.Theme.green}
            strokeWidth={2}
          />
          <MafsLib.Text
            x={(midPoint[0] + endPoint[0]) / 2 + 0.3}
            y={(midPoint[1] + endPoint[1]) / 2 + 0.3}
            attach="center"
            color={MafsLib.Theme.green}
          >
            {secondDistance}
          </MafsLib.Text>
        </>
      )}
      
      {/* End point */}
      <MafsLib.Point x={endPoint[0]} y={endPoint[1]} color={secondBearing !== null ? MafsLib.Theme.yellow : MafsLib.Theme.green} />
      <MafsLib.Text x={endPoint[0] + 0.3} y={endPoint[1] + 0.3} attach="center" color={secondBearing !== null ? MafsLib.Theme.yellow : MafsLib.Theme.green}>
        End
      </MafsLib.Text>
      
      {/* Direct route if showing solution */}
      {showSolution && (
        <>
          <MafsLib.Line.Segment
            point1={start}
            point2={endPoint}
            color={MafsLib.Theme.red}
            strokeWidth={1.5}
            strokeDasharray="5,5"
          />
          <MafsLib.Text
            x={(start[0] + endPoint[0]) / 2 + 0.5}
            y={(start[1] + endPoint[1]) / 2 + 0.5}
            attach="center"
            color={MafsLib.Theme.red}
          >
            {directDistance.toFixed(2)}
          </MafsLib.Text>
        </>
      )}
    </MafsLib.Mafs>
  );
};

export default NavigationProblem;