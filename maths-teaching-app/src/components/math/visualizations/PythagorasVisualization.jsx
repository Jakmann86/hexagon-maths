import React, { useState } from 'react';
import { Mafs, Coordinates, Polygon, Text } from 'mafs';
import { Square as SquareIcon } from 'lucide-react';

const PythagorasVisualization = ({ 
  base = 3, 
  height = 4
}) => {
  // Calculate hypotenuse using Pythagoras' theorem
  const hypotenuse = Math.sqrt(base * base + height * height);
  
  // Local state for visualization toggles (since useUI context seems to be causing issues)
  const [showBaseSquare, setShowBaseSquare] = useState(true);
  const [showHeightSquare, setShowHeightSquare] = useState(true);
  const [showHypotenuseSquare, setShowHypotenuseSquare] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  
  // Calculate points for the squares on each side of the triangle
  const baseSquarePoints = calculateSquarePoints('base', base, height);
  const heightSquarePoints = calculateSquarePoints('height', base, height);
  const hypotenuseSquarePoints = calculateSquarePoints('hypotenuse', base, height, hypotenuse);
  
  // Calculate area of each square
  const baseSquareArea = base * base;
  const heightSquareArea = height * height;
  const hypotenuseSquareArea = hypotenuse * hypotenuse;
  
  // Calculate viewBox to ensure everything is visible
  const maxDimension = Math.max(base, height, hypotenuse) * 1.5;
  const viewBox = { 
    x: [-maxDimension/2, maxDimension], 
    y: [-maxDimension/2, maxDimension] 
  };
  
  return (
    <div className="pythagoras-visualization">
      {/* Controls */}
      <div className="controls flex items-center justify-end gap-3 mb-4 py-2 px-4 bg-gray-50 rounded-md">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Toggle:</span>
          
          <button 
            onClick={() => setShowBaseSquare(!showBaseSquare)}
            className={`p-1.5 rounded-md ${showBaseSquare ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'} mx-1 hover:bg-red-100`}
            title="Toggle base square"
          >
            <SquareIcon size={18} />
            <span className="sr-only">Base Square</span>
          </button>
          
          <button 
            onClick={() => setShowHeightSquare(!showHeightSquare)}
            className={`p-1.5 rounded-md ${showHeightSquare ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'} mx-1 hover:bg-blue-100`}
            title="Toggle height square"
          >
            <SquareIcon size={18} />
            <span className="sr-only">Height Square</span>
          </button>
          
          <button 
            onClick={() => setShowHypotenuseSquare(!showHypotenuseSquare)}
            className={`p-1.5 rounded-md ${showHypotenuseSquare ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-500'} mx-1 hover:bg-green-100`}
            title="Toggle hypotenuse square"
          >
            <SquareIcon size={18} />
            <span className="sr-only">Hypotenuse Square</span>
          </button>
          
          <button 
            onClick={() => setShowLabels(!showLabels)}
            className={`p-1.5 rounded-md ${showLabels ? 'bg-indigo-50 text-indigo-500' : 'bg-gray-100 text-gray-500'} mx-1 hover:bg-indigo-100`}
            title="Toggle labels"
          >
            <span className="text-xs font-bold px-1">a,b,c</span>
            <span className="sr-only">Labels</span>
          </button>
        </div>
      </div>
      
      <Mafs
        viewBox={viewBox}
        preserveAspectRatio={true}
        height={400}
      >
        <Coordinates />
        
        {/* Right triangle */}
        <Polygon
          points={[[0, 0], [base, 0], [0, height]]}
          strokeStyle="solid"
          strokeWidth={2}
          fillOpacity={0.1}
          color="purple"
        />
        
        {/* Base square */}
        {showBaseSquare && (
          <Polygon
            points={baseSquarePoints}
            strokeStyle="solid"
            strokeWidth={1.5}
            fillOpacity={0.2}
            color="red"
          />
        )}
        
        {/* Height square */}
        {showHeightSquare && (
          <Polygon
            points={heightSquarePoints}
            strokeStyle="solid"
            strokeWidth={1.5}
            fillOpacity={0.2}
            color="blue"
          />
        )}
        
        {/* Hypotenuse square */}
        {showHypotenuseSquare && (
          <Polygon
            points={hypotenuseSquarePoints}
            strokeStyle="solid"
            strokeWidth={1.5}
            fillOpacity={0.2}
            color="green"
          />
        )}
        
        {/* Labels */}
        {showLabels && (
          <>
            {/* Side labels */}
            <Text x={base/2} y={-0.3}>
              a = {base}
            </Text>
            <Text x={-0.7} y={height/2}>
              b = {height}
            </Text>
            <Text x={base/3} y={height/3} color="purple">
              c = {hypotenuse.toFixed(2)}
            </Text>
            
            {/* Square area labels */}
            {showBaseSquare && (
              <Text x={base/2} y={-base/2} color="red">
                a² = {baseSquareArea}
              </Text>
            )}
            
            {showHeightSquare && (
              <Text x={-height/2} y={height/2} color="blue">
                b² = {heightSquareArea}
              </Text>
            )}
            
            {showHypotenuseSquare && (
              <Text 
                x={(hypotenuseSquarePoints[0][0] + hypotenuseSquarePoints[2][0])/2 - 0.5} 
                y={(hypotenuseSquarePoints[0][1] + hypotenuseSquarePoints[2][1])/2} 
                color="green"
              >
                c² = {hypotenuseSquareArea.toFixed(2)}
              </Text>
            )}
          </>
        )}
      </Mafs>
    </div>
  );
};

// Simplified helper function to calculate square points based on position
const calculateSquarePoints = (position, base, height, hypotenuse) => {
  switch(position) {
    case 'base':
      // Square on the base (a)
      return [
        [0, 0],
        [base, 0],
        [base, -base],
        [0, -base]
      ];
      
    case 'height':
      // Square on the height (b)
      return [
        [0, 0],
        [0, height],
        [-height, height],
        [-height, 0]
      ];
      
    case 'hypotenuse':
      // Calculate the direction vector of the hypotenuse
      const hypVector = [-base, height];
      
      // Normalize the vector
      const length = Math.sqrt(base*base + height*height);
      const normX = hypVector[0] / length;
      const normY = hypVector[1] / length;
      
      // Get perpendicular vector by rotating 90 degrees
      const perpX = -normY;
      const perpY = normX;
      
      // Scale by hypotenuse length
      const scaledPerpX = perpX * hypotenuse;
      const scaledPerpY = perpY * hypotenuse;
      
      // Create square points
      return [
        [0, 0],                          // Origin
        [base, 0],                       // Bottom right corner of triangle
        [base + scaledPerpX, scaledPerpY], // Move perpendicular from bottom right
        [scaledPerpX, scaledPerpY]         // Move perpendicular from origin
      ];
      
    default:
      return [];
  }
};

export default PythagorasVisualization;