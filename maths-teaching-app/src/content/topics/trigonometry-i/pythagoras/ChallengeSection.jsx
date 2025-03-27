// src/content/topics/trigonometry-i/pythagoras/ChallengeSection.jsx
import React from 'react';
import ChallengeSectionBase from '../../../../components/sections/ChallengeSectionBase';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

// Import visualizations from the index file
import { 
  CoordinateVisualization,
  NavigationVisualization,
  StackedTrianglesVisualization
} from '../../../../components/math/visualizations';

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for challenge section
  const theme = useSectionTheme('challenge');
  
  // Create modified challenge types with random difficulty selection
  const challengeTypes = {
    coordinateDistance: {
      title: 'Coordinate Distance',
      generator: () => {
        const difficulties = ['easy', 'medium', 'hard', 'exam'];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        return generateCoordinateDistanceChallenge(randomDifficulty);
      }
    },
    navigation: {
      title: 'Navigation & Bearings',
      generator: () => {
        const difficulties = ['easy', 'medium', 'hard', 'exam'];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        return generateNavigationChallenge(randomDifficulty);
      }
    },
    stackedTriangles: {
      title: 'Stacked Triangles',
      generator: () => {
        const difficulties = ['easy', 'medium', 'hard', 'exam'];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        return generateStackedTrianglesChallenge(randomDifficulty);
      }
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Themed wrapper div - using red for challenge theme (consistent with other sections) */}
      <div className="border-2 border-t-4 border-red-500 rounded-lg shadow-md bg-white overflow-hidden">
        <ChallengeSectionBase
          challengeTypes={challengeTypes}
          currentTopic={currentTopic}
          currentLessonId={currentLessonId}
        />
      </div>
    </div>
  );
};

// Component for visualizing the distance between two points
const CoordinateDistance = ({ point1, point2, showingDistance = false }) => {
  // Calculate x and y ranges with equal scaling and padding
  const padding = 2;
  const xMin = Math.min(point1[0], point2[0]) - padding;
  const xMax = Math.max(point1[0], point2[0]) + padding;
  const yMin = Math.min(point1[1], point2[1]) - padding;
  const yMax = Math.max(point1[1], point2[1]) + padding;
  
  // Ensure equal scaling by making the range symmetric
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  
  if (xRange > yRange) {
    // Add to y-range to match x-range
    const diff = (xRange - yRange) / 2;
    const yMiddle = (yMax + yMin) / 2;
    const yViewRange = [yMiddle - xRange/2, yMiddle + xRange/2];
  } else {
    // Add to x-range to match y-range
    const diff = (yRange - xRange) / 2;
    const xMiddle = (xMax + xMin) / 2;
    const xViewRange = [xMiddle - yRange/2, xMiddle + yRange/2];
  }
  
  // Final viewbox with equal scaling
  const viewBox = { 
    x: [xMin, xMax], 
    y: [yMin, yMax]
  };
  
  // Calculate triangle sides for Pythagoras
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MafsLib.Mafs
        viewBox={viewBox}
        preserveAspectRatio="contain"
      >
        <MafsLib.Coordinates.Cartesian />
        
        {/* Points */}
        <MafsLib.Point x={point1[0]} y={point1[1]} color={MafsLib.Theme.red} />
        <MafsLib.Text x={point1[0] + 0.3} y={point1[1] + 0.3} attach="center" color={MafsLib.Theme.red}>
          A({point1[0]}, {point1[1]})
        </MafsLib.Text>
        
        <MafsLib.Point x={point2[0]} y={point2[1]} color={MafsLib.Theme.blue} />
        <MafsLib.Text x={point2[0] + 0.3} y={point2[1] + 0.3} attach="center" color={MafsLib.Theme.blue}>
          B({point2[0]}, {point2[1]})
        </MafsLib.Text>
        
        {/* Line between points */}
        <MafsLib.Line.Segment
          point1={point1}
          point2={point2}
          color={MafsLib.Theme.indigo}
          strokeWidth={2}
        />
        
        {/* Always show the right triangle for Pythagoras visualization */}
        {/* Horizontal line */}
        <MafsLib.Line.Segment
          point1={point1}
          point2={[point2[0], point1[1]]}
          color={MafsLib.Theme.green}
          strokeWidth={1.5}
          strokeDasharray="5,5"
          strokeOpacity={0.8}
        />
        
        {/* Vertical line */}
        <MafsLib.Line.Segment
          point1={[point2[0], point1[1]]}
          point2={point2}
          color={MafsLib.Theme.green}
          strokeWidth={1.5}
          strokeDasharray="5,5"
          strokeOpacity={0.8}
        />
        
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
        
        {/* Add text labels for sides */}
        <MafsLib.Text 
          x={point1[0] + dx/2} 
          y={point1[1] - 0.3} 
          attach="center" 
          color={MafsLib.Theme.green}
        >
          a = {Math.abs(dx).toFixed(1)}
        </MafsLib.Text>
        
        <MafsLib.Text 
          x={point2[0] + 0.5} 
          y={point1[1] + dy/2} 
          attach="center" 
          color={MafsLib.Theme.green}
        >
          b = {Math.abs(dy).toFixed(1)}
        </MafsLib.Text>
      </MafsLib.Mafs>
    </div>
  );
};

// Component for visualizing a bearing/navigation problem
const NavigationProblem = ({ start, bearing, distance, secondBearing, secondDistance }) => {
  // Convert bearing to radians
  // Bearings are measured clockwise from North (0°)
  const bearingRadians = (450 - bearing) % 360 * Math.PI / 180;
  
  // Calculate end point
  const midPoint = [
    start[0] + distance * Math.cos(bearingRadians),
    start[1] + distance * Math.sin(bearingRadians)
  ];
  
  // Default end point is the mid point (for single leg journeys)
  let endPoint = [...midPoint];
  let directDistance = distance;
  
  // Calculate second leg if applicable
  if (secondBearing !== undefined && secondDistance !== undefined) {
    const secondBearingRadians = (450 - secondBearing) % 360 * Math.PI / 180;
    endPoint = [
      midPoint[0] + secondDistance * Math.cos(secondBearingRadians),
      midPoint[1] + secondDistance * Math.sin(secondBearingRadians)
    ];
    
    // Calculate direct distance
    const dx = endPoint[0] - start[0];
    const dy = endPoint[1] - start[1];
    directDistance = Math.sqrt(dx * dx + dy * dy);
  }
  
  // Calculate view box
  const maxDistance = Math.max(distance, secondDistance || 0, 5);
      const viewBox = {
    x: [start[0] - maxDistance/2, start[0] + maxDistance * 1.2],
    y: [start[1] - maxDistance/2, start[1] + maxDistance * 1.2]
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
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
          point2={[start[0], start[1] + maxDistance / 4]}
          color={MafsLib.Theme.blue}
          strokeWidth={1.5}
        />
        <MafsLib.Text x={start[0]} y={start[1] + maxDistance / 4 + 0.5} attach="center" color={MafsLib.Theme.blue}>
          N
        </MafsLib.Text>
        
        {/* Bearing line */}
        <MafsLib.Line.Segment
          point1={start}
          point2={midPoint}
          color={MafsLib.Theme.green}
          strokeWidth={2}
        />
        
        {/* Angle indicator */}
        <MafsLib.Circle
          center={start}
          radius={maxDistance / 8}
          angleStart={Math.PI / 2}  // North
          angleEnd={bearingRadians}
          color={MafsLib.Theme.orange}
          fillOpacity={0}
          strokeWidth={1.5}
        />
        <MafsLib.Text
          x={start[0] + (maxDistance / 10) * Math.cos((Math.PI/2 + bearingRadians) / 2)}
          y={start[1] + (maxDistance / 10) * Math.sin((Math.PI/2 + bearingRadians) / 2)}
          attach="center"
          color={MafsLib.Theme.orange}
        >
          {bearing}°
        </MafsLib.Text>
        
        {/* Second leg if applicable */}
        {secondBearing !== undefined && secondDistance !== undefined && (
          <>
            {/* Mid point */}
            <MafsLib.Point x={midPoint[0]} y={midPoint[1]} color={MafsLib.Theme.purple} />
            <MafsLib.Text x={midPoint[0] + 0.3} y={midPoint[1] + 0.3} attach="center" color={MafsLib.Theme.purple}>
              Mid
            </MafsLib.Text>
            
            {/* Second bearing line */}
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
        
        {/* Always show the direct route as dashed line */}
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
          d = ?
        </MafsLib.Text>
      </MafsLib.Mafs>
    </div>
  );
};

// Component for visualizing stacked right triangles
const StackedTriangles = ({ triangleData }) => {
  // Calculate viewBox
  const points = triangleData.flatMap(t => t.points);
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
    <div style={{ width: '100%', height: '100%' }}>
      <MafsLib.Mafs
        viewBox={{ x: [minX, maxX], y: [minY, maxY] }}
        preserveAspectRatio="contain"
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
        
        {/* Additional elements if showing solution */}
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
    </div>
  );
};

// Challenge generators
// Challenge generators
const generateCoordinateDistanceChallenge = (difficulty) => {
  let point1, point2;
  
  // Function to ensure we get varied coordinate arrangements
  const generateVariedPoints = (minRange, maxRange) => {
    // Generate first point
    const x1 = Math.floor(Math.random() * minRange) - Math.floor(minRange/2);
    const y1 = Math.floor(Math.random() * minRange) - Math.floor(minRange/2);
    
    // Generate offsets for second point
    const xOffset = Math.floor(Math.random() * maxRange) + 2; // At least 2 units apart
    const yOffset = Math.floor(Math.random() * maxRange) + 2; // At least 2 units apart
    
    // Randomly decide if x and y offsets should be positive or negative
    // This ensures we get all four quadrant possibilities
    const xDirection = Math.random() < 0.5 ? 1 : -1;
    const yDirection = Math.random() < 0.5 ? 1 : -1;
    
    // Calculate second point coordinates
    const x2 = x1 + (xOffset * xDirection);
    const y2 = y1 + (yOffset * yDirection);
    
    return [[x1, y1], [x2, y2]];
  };
  
  // Adjust difficulty by using different ranges
  if (difficulty === 'easy') {
    [point1, point2] = generateVariedPoints(4, 3);
  } else if (difficulty === 'medium') {
    [point1, point2] = generateVariedPoints(5, 4);
  } else if (difficulty === 'hard') {
    [point1, point2] = generateVariedPoints(6, 5);
  } else { // exam
    // For exam difficulty, occasionally add decimal values
    [point1, point2] = generateVariedPoints(8, 6);
    
    // Add decimal component 30% of the time
    if (Math.random() < 0.3) {
      point2[0] += Math.round(Math.random() * 2) / 2; // Add 0.5 or 1.0
      point2[1] += Math.round(Math.random() * 2) / 2; // Add 0.5 or 1.0
    }
  }
  
  // Ensure no straight horizontal or vertical lines
  if (point1[0] === point2[0]) point2[0] += 1;
  if (point1[1] === point2[1]) point2[1] += 1;
  
  // Calculate horizontal and vertical differences
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  
  // Calculate distance using Pythagoras' theorem
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Format distance for solution
  const formattedDistance = Number.isInteger(distance) 
    ? distance 
    : distance.toFixed(2);
  
  // Generate problem
  return {
    problemText: `Find the distance between the points A(${point1[0]}, ${point1[1]}) and B(${point2[0]}, ${point2[1]}) on the coordinate plane.`,
    hints: [
      "Remember that you can use the Pythagorean theorem to find the distance between two points.",
      `Find the horizontal distance (difference in x-coordinates) between the points: |${point2[0]} - ${point1[0]}| = ${Math.abs(dx)}`,
      `Find the vertical distance (difference in y-coordinates) between the points: |${point2[1]} - ${point1[1]}| = ${Math.abs(dy)}`,
      "Apply the Pythagorean theorem: distance² = horizontal² + vertical²"
    ],
    solution: [
      {
        explanation: "To find the distance between two points, we need to use the distance formula, which is derived from the Pythagorean theorem.",
        formula: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}"
      },
      {
        explanation: "Calculate the difference in x-coordinates:",
        formula: `\\Delta x = ${point2[0]} - ${point1[0]} = ${dx}`
      },
      {
        explanation: "Calculate the difference in y-coordinates:",
        formula: `\\Delta y = ${point2[1]} - ${point1[1]} = ${dy}`
      },
      {
        explanation: "Square the differences:",
        formula: `(\\Delta x)^2 = ${dx}^2 = ${dx * dx}`
      },
      {
        explanation: "Square the differences:",
        formula: `(\\Delta y)^2 = ${dy}^2 = ${dy * dy}`
      },
      {
        explanation: "Add the squares:",
        formula: `d^2 = ${dx * dx} + ${dy * dy} = ${dx * dx + dy * dy}`
      },
      {
        explanation: "Take the square root to find the distance:",
        formula: `d = \\sqrt{${dx * dx + dy * dy}} = ${formattedDistance}`
      }
    ],
    shapeConfig: {
      component: CoordinateVisualization,
      props: {
        point1: point1,
        point2: point2
      }
    }
  };
};

const generateNavigationChallenge = (difficulty) => {
  // Starting point
  const start = [0, 0];
  
  // Generate bearing based on difficulty
  let bearing, distance, secondBearing, secondDistance;
  
  if (difficulty === 'easy') {
    bearing = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, or 270 degrees
    distance = Math.floor(Math.random() * 5) + 3; // 3 to 7 units
  } else if (difficulty === 'medium') {
    bearing = Math.floor(Math.random() * 8) * 45; // 0, 45, 90, 135, 180, 225, 270, or 315 degrees
    distance = Math.floor(Math.random() * 6) + 4; // 4 to 9 units
  } else if (difficulty === 'hard' || difficulty === 'exam') {
    bearing = Math.floor(Math.random() * 36) * 10; // Multiple of 10 degrees
    distance = Math.floor(Math.random() * 8) + 5; // 5 to 12 units
    
    // For hard/exam, add a second leg of the journey
    secondBearing = (bearing + 90 + Math.floor(Math.random() * 180)) % 360; // Different direction
    secondDistance = Math.floor(Math.random() * 8) + 5; // 5 to 12 units
  }
  
  // Convert bearing to radians for calculation
  const bearingRadians = (450 - bearing) % 360 * Math.PI / 180;
  
  // Calculate end point after first leg
  const midPoint = [
    start[0] + distance * Math.cos(bearingRadians),
    start[1] + distance * Math.sin(bearingRadians)
  ];
  
  let finalPoint = [...midPoint];
  let directDistance;
  
  // If there's a second leg, calculate the final position
  if (secondBearing !== undefined && secondDistance !== undefined) {
    const secondBearingRadians = (450 - secondBearing) % 360 * Math.PI / 180;
    finalPoint = [
      midPoint[0] + secondDistance * Math.cos(secondBearingRadians),
      midPoint[1] + secondDistance * Math.sin(secondBearingRadians)
    ];
    
    // Calculate direct distance from start to final point
    const dx = finalPoint[0] - start[0];
    const dy = finalPoint[1] - start[1];
    directDistance = Math.sqrt(dx * dx + dy * dy);
  } else {
    directDistance = distance; // For easy/medium, direct distance is just the distance
  }
  
  // Format for solution
  const formattedDirectDistance = Number.isInteger(directDistance) 
    ? directDistance 
    : directDistance.toFixed(2);
  
  // Generate problem text based on difficulty
  let problemText;
  let hints;
  let solution;
  
  if (difficulty === 'easy' || difficulty === 'medium') {
    problemText = `A ship sails from port on a bearing of ${bearing}° for a distance of ${distance} nautical miles. How far is the ship from its starting point?`;
    
    hints = [
      "For cardinal directions (N, E, S, W), the distance from start will be the same as the traveled distance.",
      "For other bearings, you need to use the Pythagorean theorem.",
      `Break down the journey into eastward/westward and northward/southward components.`,
      "Apply the Pythagorean theorem to find the direct distance from the start to the current position."
    ];
    
    solution = [
      {
        explanation: "We need to find the components of the ship's journey in terms of east-west and north-south movements.",
        formula: "\\text{Distance} = \\sqrt{(\\text{east-west})^2 + (\\text{north-south})^2}"
      },
      {
        explanation: `For a bearing of ${bearing}°, we need to calculate the east-west component:`,
        formula: `\\text{East-west} = ${distance} \\times \\sin(${bearing}°) = ${(distance * Math.sin(bearing * Math.PI / 180)).toFixed(2)}`
      },
      {
        explanation: `And the north-south component:`,
        formula: `\\text{North-south} = ${distance} \\times \\cos(${bearing}°) = ${(distance * Math.cos(bearing * Math.PI / 180)).toFixed(2)}`
      },
      {
        explanation: "Now we can apply the Pythagorean theorem:",
        formula: `\\text{Distance}^2 = (${(distance * Math.sin(bearing * Math.PI / 180)).toFixed(2)})^2 + (${(distance * Math.cos(bearing * Math.PI / 180)).toFixed(2)})^2`
      },
      {
        explanation: "Calculate the squares:",
        formula: `\\text{Distance}^2 = ${(Math.pow(distance * Math.sin(bearing * Math.PI / 180), 2)).toFixed(2)} + ${(Math.pow(distance * Math.cos(bearing * Math.PI / 180), 2)).toFixed(2)} = ${(Math.pow(distance * Math.sin(bearing * Math.PI / 180), 2) + Math.pow(distance * Math.cos(bearing * Math.PI / 180), 2)).toFixed(2)}`
      },
      {
        explanation: "Take the square root to find the distance:",
        formula: `\\text{Distance} = \\sqrt{${(Math.pow(distance * Math.sin(bearing * Math.PI / 180), 2) + Math.pow(distance * Math.cos(bearing * Math.PI / 180), 2)).toFixed(2)}} = ${formattedDirectDistance}`
      }
    ];
  } else {
    problemText = `A ship leaves port and sails ${distance} nautical miles on a bearing of ${bearing}°. It then changes course and sails ${secondDistance} nautical miles on a bearing of ${secondBearing}°. How far is the ship from its starting point?`;
    
    hints = [
      "Break the journey into two legs and find the final position relative to the starting point.",
      "For each leg, calculate the east-west and north-south components.",
      "Find the total east-west and north-south displacements.",
      "Use the Pythagorean theorem to calculate the direct distance from start to finish."
    ];
    
    // Calculate components for both legs
    const dx1 = distance * Math.sin(bearing * Math.PI / 180);
    const dy1 = distance * Math.cos(bearing * Math.PI / 180);
    const dx2 = secondDistance * Math.sin(secondBearing * Math.PI / 180);
    const dy2 = secondDistance * Math.cos(secondBearing * Math.PI / 180);
    const totalDx = dx1 + dx2;
    const totalDy = dy1 + dy2;
    
    solution = [
      {
        explanation: "We need to find the final position of the ship relative to its starting point.",
        formula: "\\text{We'll use the Pythagorean theorem after finding the total displacement.}"
      },
      {
        explanation: "For the first leg (bearing: " + bearing + "°, distance: " + distance + " miles):",
        formula: `\\begin{align} 
          \\text{East-west} &= ${distance} \\times \\sin(${bearing}°) = ${dx1.toFixed(2)} \\\\
          \\text{North-south} &= ${distance} \\times \\cos(${bearing}°) = ${dy1.toFixed(2)}
        \\end{align}`
      },
      {
        explanation: "For the second leg (bearing: " + secondBearing + "°, distance: " + secondDistance + " miles):",
        formula: `\\begin{align} 
          \\text{East-west} &= ${secondDistance} \\times \\sin(${secondBearing}°) = ${dx2.toFixed(2)} \\\\
          \\text{North-south} &= ${secondDistance} \\times \\cos(${secondBearing}°) = ${dy2.toFixed(2)}
        \\end{align}`
      },
      {
        explanation: "Calculate the total displacement in each direction:",
        formula: `\\begin{align} 
          \\text{Total East-west} &= ${dx1.toFixed(2)} + ${dx2.toFixed(2)} = ${totalDx.toFixed(2)} \\\\
          \\text{Total North-south} &= ${dy1.toFixed(2)} + ${dy2.toFixed(2)} = ${totalDy.toFixed(2)}
        \\end{align}`
      },
      {
        explanation: "Now we can apply the Pythagorean theorem to find the direct distance:",
        formula: `\\text{Distance} = \\sqrt{(${totalDx.toFixed(2)})^2 + (${totalDy.toFixed(2)})^2}`
      },
      {
        explanation: "Calculate the squares and add them:",
        formula: `\\text{Distance}^2 = ${Math.pow(totalDx, 2).toFixed(2)} + ${Math.pow(totalDy, 2).toFixed(2)} = ${(Math.pow(totalDx, 2) + Math.pow(totalDy, 2)).toFixed(2)}`
      },
      {
        explanation: "Take the square root to find the distance:",
        formula: `\\text{Distance} = \\sqrt{${(Math.pow(totalDx, 2) + Math.pow(totalDy, 2)).toFixed(2)}} = ${formattedDirectDistance}`
      }
    ];
  }
  
  return {
    problemText,
    hints,
    solution,
    shapeConfig: {
      component: NavigationVisualization,
      props: {
        start,
        bearing,
        distance,
        secondBearing,
        secondDistance
      }
    }
  };
};

const generateStackedTrianglesChallenge = (difficulty) => {
  // Generate different configurations based on difficulty
  let triangleData;
  let problemText;
  let targetDistance;
  
  if (difficulty === 'easy') {
    // Simple stacked triangles with common side
    const base = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const height1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const height2 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    
    triangleData = [
      {
        points: [[0, 0], [base, 0], [0, height1]],
        color: MafsLib.Theme.blue,
        labels: ['A', 'B', 'C'],
        rightAngleIndex: 0
      },
      {
        points: [[0, 0], [0, -height2], [base, 0]],
        color: MafsLib.Theme.green,
        labels: ['A', 'D', 'B'],
        rightAngleIndex: 0
      }
    ];
    
    triangleData.targetLine = [[0, height1], [0, -height2]];
    
    // Calculate distance from C to D
    targetDistance = height1 + height2;
    
    problemText = `In the diagram, triangle ABC and triangle ABD are right-angled triangles with right angles at A. 
                   If AB = ${base}, AC = ${height1}, and AD = ${height2}, find the distance from C to D.`;
  } else if (difficulty === 'medium') {
    // Stacked triangles with common hypotenuse
    const base1 = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const height1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const hypotenuse = Math.sqrt(base1 * base1 + height1 * height1);
    
    // Create a second triangle sharing the hypotenuse
    const base2 = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const height2 = Math.sqrt(hypotenuse * hypotenuse - base2 * base2);
    
    triangleData = [
      {
        points: [[0, 0], [base1, 0], [0, height1]],
        color: MafsLib.Theme.blue,
        labels: ['A', 'B', 'C'],
        rightAngleIndex: 0
      },
      {
        points: [[0, height1], [base1, 0], [base1 + base2, height1 - height2]],
        color: MafsLib.Theme.green,
        labels: ['C', 'B', 'D'],
        rightAngleIndex: null
      }
    ];
    
    triangleData.targetLine = [[0, 0], [base1 + base2, height1 - height2]];
    
    // Calculate distance from A to D
    targetDistance = Math.sqrt(Math.pow(base1 + base2, 2) + Math.pow(height1 - height2, 2));
    const formattedDistance = Number.isInteger(targetDistance) 
      ? targetDistance 
      : targetDistance.toFixed(2);
    
    problemText = `In the diagram, triangle ABC is a right-angled triangle with a right angle at A. 
                   Triangle CBD has a side CB that is the hypotenuse of triangle ABC. 
                   If AB = ${base1}, AC = ${height1}, and BD = ${base2.toFixed(2)}, find the distance from A to D.`;
  } else {
    // Complex arrangement with third triangle for hard/exam difficulty
    const base1 = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const height1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const base2 = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const height2 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    
    triangleData = [
      {
        points: [[0, 0], [base1, 0], [0, height1]],
        color: MafsLib.Theme.blue,
        labels: ['A', 'B', 'C'],
        rightAngleIndex: 0
      },
      {
        points: [[base1, 0], [base1 + base2, 0], [base1, height2]],
        color: MafsLib.Theme.green,
        labels: ['B', 'D', 'E'],
        rightAngleIndex: 0
      }
    ];
    
    triangleData.targetLine = [[0, height1], [base1, height2]];
    
    // Calculate distance from C to E
    targetDistance = Math.sqrt(Math.pow(base1, 2) + Math.pow(height1 - height2, 2));
    const formattedDistance = Number.isInteger(targetDistance) 
      ? targetDistance 
      : targetDistance.toFixed(2);
    
    problemText = `In the diagram, triangle ABC and triangle BDE are right-angled triangles with right angles at A and B respectively. 
                   If AB = ${base1}, AC = ${height1}, BD = ${base2}, and BE = ${height2}, find the distance from C to E.`;
  }
  
  const formattedDistance = Number.isInteger(targetDistance) 
    ? targetDistance 
    : targetDistance.toFixed(2);
  
  return {
    problemText,
    hints: [
      "Identify the coordinates of each point in the diagram.",
      "Remember you can use the Pythagorean theorem to find the distance between any two points.",
      "Break the problem down into components using the right angles and known sides.",
      "Use the distance formula: distance = √[(x₂ - x₁)² + (y₂ - y₁)²]"
    ],
    solution: [
      {
        explanation: "First, let's identify the coordinates of each point.",
        formula: "\\text{Using the diagram and given information}"
      },
      {
        explanation: "For the requested distance, we need to apply the Pythagorean theorem.",
        formula: "\\text{distance} = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}"
      },
      {
        explanation: "Calculating the horizontal and vertical components of the distance:",
        formula: `\\begin{align} 
          \\text{Horizontal component} &= ${triangleData.targetLine[1][0] - triangleData.targetLine[0][0]} \\\\
          \\text{Vertical component} &= ${triangleData.targetLine[1][1] - triangleData.targetLine[0][1]}
        \\end{align}`
      },
      {
        explanation: "Substituting into the Pythagorean formula:",
        formula: `\\text{distance} = \\sqrt{${Math.pow(triangleData.targetLine[1][0] - triangleData.targetLine[0][0], 2)} + ${Math.pow(triangleData.targetLine[1][1] - triangleData.targetLine[0][1], 2)}}`
      },
      {
        explanation: "Calculating the distance:",
        formula: `\\text{distance} = \\sqrt{${Math.pow(triangleData.targetLine[1][0] - triangleData.targetLine[0][0], 2) + Math.pow(triangleData.targetLine[1][1] - triangleData.targetLine[0][1], 2)}} = ${formattedDistance}`
      }
    ],
    shapeConfig: {
      component: StackedTrianglesVisualization,
      props: {
        triangleData
      }
    }
  };
};

export default ChallengeSection;