// src/components/math/BasicMafsRender.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '../common/Card';
import { 
  Mafs, 
  Coordinates, 
  Circle, 
  Line, 
  Polygon,
  Text,
  Vector, 
  useMovablePoint,
  Theme
} from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

const BasicMafsRender = () => {
  const [activeTest, setActiveTest] = useState('mafs');
  
  // Movable point for interactive test
  const point = useMovablePoint([2, 2], {
    constrain: ([x, y]) => [
      Math.max(0, Math.min(4, x)),
      Math.max(0, Math.min(4, y))
    ]
  });
  
  // Different test renders
  const renderTest = () => {
    switch (activeTest) {
      case 'mafs':
        return (
          <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} />
        );
        
      case 'coordinates':
        return (
          <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }}>
            <Coordinates />
          </Mafs>
        );
        
      case 'circle':
        return (
          <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }}>
            <Coordinates />
            <Circle center={[0, 0]} radius={2} color={Theme.blue} />
          </Mafs>
        );
        
      case 'square':
        return (
          <Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }}>
            <Coordinates />
            <Polygon 
              points={[[0, 0], [4, 0], [4, 4], [0, 4]]} 
              color={Theme.green}
              fillOpacity={0.2}
            />
          </Mafs>
        );
        
      case 'text':
        return (
          <Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }}>
            <Coordinates />
            <Polygon 
              points={[[0, 0], [4, 0], [4, 4], [0, 4]]} 
              color={Theme.green}
              fillOpacity={0.2}
            />
            <Text x={2} y={2}>Area = 16</Text>
          </Mafs>
        );
        
      case 'interactive':
        return (
          <Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }}>
            <Coordinates />
            <Polygon 
              points={[[0, 0], [4, 0], [4, 4], [0, 4]]} 
              color={Theme.green}
              fillOpacity={0.2}
            />
            <Circle center={point.point} radius={0.2} color={Theme.indigo} />
            <Vector tail={[0, 0]} tip={point.point} color={Theme.red} />
            <Text x={point.point[0] + 0.3} y={point.point[1]}>
              ({point.point[0].toFixed(1)}, {point.point[1].toFixed(1)})
            </Text>
          </Mafs>
        );
        
      default:
        return (
          <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} />
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Mafs Render Test</h2>
            
            {/* Test selector buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                onClick={() => setActiveTest('mafs')}
                className={`px-3 py-1 rounded ${activeTest === 'mafs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Basic Container
              </button>
              <button 
                onClick={() => setActiveTest('coordinates')}
                className={`px-3 py-1 rounded ${activeTest === 'coordinates' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                + Coordinates
              </button>
              <button 
                onClick={() => setActiveTest('circle')}
                className={`px-3 py-1 rounded ${activeTest === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                + Circle
              </button>
              <button 
                onClick={() => setActiveTest('square')}
                className={`px-3 py-1 rounded ${activeTest === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                + Square
              </button>
              <button 
                onClick={() => setActiveTest('text')}
                className={`px-3 py-1 rounded ${activeTest === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                + Text
              </button>
              <button 
                onClick={() => setActiveTest('interactive')}
                className={`px-3 py-1 rounded ${activeTest === 'interactive' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Interactive
              </button>
            </div>
            
            <div className="w-full space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Current Test: {activeTest}</h3>
                <div style={{ height: 400, width: '100%', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  {renderTest()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicMafsRender;