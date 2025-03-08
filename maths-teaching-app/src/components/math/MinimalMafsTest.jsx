// src/components/math/MinimalMafsTest.jsx
import React from 'react';
import { Card, CardContent } from '../common/Card';
import { 
  Mafs, 
  Coordinates, 
  Circle,
  useMovablePoint,
  useStopwatch,
  vec,
  Vector,
  Text,
  Theme,
  Line
} from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

const MinimalMafsTest = () => {
  // Simple movable point for interaction
  const point = useMovablePoint([1, 1], {
    constrain: ([x, y]) => [
      Math.max(0, Math.min(5, x)),
      Math.max(0, Math.min(5, y))
    ]
  });
  
  // Use stopwatch for animation
  const time = useStopwatch();
  
  // Calculate a pulsing radius for visual effect
  const pulsingRadius = 0.2 + Math.sin(time / 500) * 0.05;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Minimal Mafs Test</h2>
            <p className="text-gray-600 mb-4">
              This is a direct implementation of Mafs with minimal dependencies.
              Drag the point to test interactivity.
            </p>
            
            {/* Direct Mafs implementation */}
            <div style={{ height: 400, width: '100%' }}>
              <Mafs viewBox={{ x: [-1, 6], y: [-1, 6] }}>
                <Coordinates />
                
                {/* Grid square */}
                <Line.Segment
                  point1={[0, 0]}
                  point2={[5, 0]}
                  color={Theme.blue}
                />
                <Line.Segment
                  point1={[5, 0]}
                  point2={[5, 5]}
                  color={Theme.blue}
                />
                <Line.Segment
                  point1={[5, 5]}
                  point2={[0, 5]}
                  color={Theme.blue}
                />
                <Line.Segment
                  point1={[0, 5]}
                  point2={[0, 0]}
                  color={Theme.blue}
                />
                
                {/* Main movable point */}
                <Circle
                  center={point.point}
                  radius={0.2}
                  color={Theme.indigo}
                />
                
                {/* Pulsing origin point */}
                <Circle
                  center={[0, 0]}
                  radius={pulsingRadius}
                  color={Theme.green}
                />
                
                {/* Vector from origin to movable point */}
                <Vector
                  tail={[0, 0]}
                  tip={point.point}
                  color={Theme.red}
                />
                
                {/* Distance text */}
                <Text
                  x={(point.point[0] / 2)}
                  y={(point.point[1] / 2) + 0.3}
                >
                  {`Distance: ${vec.dist([0, 0], point.point).toFixed(2)}`}
                </Text>
              </Mafs>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Position: ({point.point[0].toFixed(2)}, {point.point[1].toFixed(2)})</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinimalMafsTest;