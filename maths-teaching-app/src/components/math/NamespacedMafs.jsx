// src/components/math/NamespacedMafs.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '../common/Card';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

// We use the MafsLib namespace to avoid conflicts with your own components
const NamespacedMafs = () => {
  const [activeTest, setActiveTest] = useState('basic');
  
  // Use Mafs hooks with the namespace
  const point = MafsLib.useMovablePoint([2, 2], {
    constrain: ([x, y]) => [
      Math.max(0, Math.min(4, x)),
      Math.max(0, Math.min(4, y))
    ]
  });
  
  // Render different tests
  const renderTest = () => {
    switch (activeTest) {
      case 'basic':
        return (
          <MafsLib.Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }}>
            {/* Empty Mafs container */}
          </MafsLib.Mafs>
        );
        
      case 'coordinates':
        return (
          <MafsLib.Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }}>
            <MafsLib.Coordinates />
          </MafsLib.Mafs>
        );
        
      case 'circle':
        return (
          <MafsLib.Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }}>
            <MafsLib.Coordinates />
            <MafsLib.Circle center={[0, 0]} radius={2} color={MafsLib.Theme.blue} />
          </MafsLib.Mafs>
        );
        
      case 'square':
        return (
          <MafsLib.Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }}>
            <MafsLib.Coordinates />
            <MafsLib.Polygon 
              points={[[0, 0], [4, 0], [4, 4], [0, 4]]} 
              color={MafsLib.Theme.green}
              fillOpacity={0.2}
            />
          </MafsLib.Mafs>
        );
        
      case 'text':
        return (
          <MafsLib.Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }}>
            <MafsLib.Coordinates />
            <MafsLib.Polygon 
              points={[[0, 0], [4, 0], [4, 4], [0, 4]]} 
              color={MafsLib.Theme.green}
              fillOpacity={0.2}
            />
            <MafsLib.Text x={2} y={2}>Area = 16</MafsLib.Text>
          </MafsLib.Mafs>
        );
        
      case 'interactive':
        return (
          <MafsLib.Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }}>
            <MafsLib.Coordinates />
            <MafsLib.Polygon 
              points={[[0, 0], [4, 0], [4, 4], [0, 4]]} 
              color={MafsLib.Theme.green}
              fillOpacity={0.2}
            />
            <MafsLib.Circle center={point.point} radius={0.2} color={MafsLib.Theme.indigo} />
            <MafsLib.Vector tail={[0, 0]} tip={point.point} color={MafsLib.Theme.red} />
            <MafsLib.Text x={point.point[0] + 0.3} y={point.point[1]}>
              ({point.point[0].toFixed(1)}, {point.point[1].toFixed(1)})
            </MafsLib.Text>
          </MafsLib.Mafs>
        );
        
      default:
        return (
          <MafsLib.Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} />
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Namespaced Mafs Test</h2>
            <p className="text-gray-600 mb-4">
              Using namespaced imports to avoid conflicts with your custom components
            </p>
            
            {/* Test selector buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                onClick={() => setActiveTest('basic')}
                className={`px-3 py-1 rounded ${activeTest === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Basic
              </button>
              <button 
                onClick={() => setActiveTest('coordinates')}
                className={`px-3 py-1 rounded ${activeTest === 'coordinates' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Coordinates
              </button>
              <button 
                onClick={() => setActiveTest('circle')}
                className={`px-3 py-1 rounded ${activeTest === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Circle
              </button>
              <button 
                onClick={() => setActiveTest('square')}
                className={`px-3 py-1 rounded ${activeTest === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Square
              </button>
              <button 
                onClick={() => setActiveTest('text')}
                className={`px-3 py-1 rounded ${activeTest === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Text
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

export default NamespacedMafs;