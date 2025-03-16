// src/components/math/visualizations/PythagorasVisualization.jsx
import React, { useState } from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';
import { Type } from 'lucide-react';
import { Slider } from '../../common/Slider';

const PythagorasVisualization = () => {
  // State for triangle dimensions - using integers to avoid visualization issues
  const [base, setBase] = useState(3);
  const [height, setHeight] = useState(4);
  
  // Calculate hypotenuse using Pythagoras' theorem
  const hypotenuse = Math.sqrt(base * base + height * height);
  
  // State for labels toggle (squares always show)
  const [showLabels, setShowLabels] = useState(true);
  
  // Calculate square points
  const baseSquarePoints = [
    [0, 0],
    [base, 0],
    [base, -base],
    [0, -base]
  ];
  
  const heightSquarePoints = [
    [0, 0],
    [0, height],
    [-height, height],
    [-height, 0]
  ];
  
  // Improved direct coordinate calculation for hypotenuse square
  const hypotenuseSquarePoints = calculateHypotenuseSquareDirect(base, height);
  
  // Calculate areas
  const baseSquareArea = Math.round(base * base * 100) / 100;
  const heightSquareArea = Math.round(height * height * 100) / 100;
  const hypotenuseSquareArea = Math.round(hypotenuse * hypotenuse * 100) / 100;
  
  // Calculate viewBox with adjusted proportions (10% taller, 20% narrower)
  const maxHeight = Math.max(height, base, hypotenuse) * 1.65; // 10% more height
  const maxWidth = Math.max(height, base, hypotenuse) * 1.2;   // 20% less width
  const viewBox = { 
    x: [-Math.max(height, maxWidth/2), maxWidth], 
    y: [-Math.max(base, maxHeight/2), maxHeight] 
  };
  
  return (
    <div className="pythagoras-visualization space-y-4">
      {/* Controls for side lengths - using integers only */}
      <div className="controls grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Base length: {base}</label>
          <Slider 
            value={base} 
            onChange={(value) => setBase(Math.round(value))} 
            min={1} 
            max={10} 
            step={1} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Height: {height}</label>
          <Slider 
            value={height} 
            onChange={(value) => setHeight(Math.round(value))} 
            min={1} 
            max={10} 
            step={1} 
          />
        </div>
      </div>
      
      {/* Simplified controls - just labels toggle centered */}
      <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`px-3 py-2 rounded-md flex items-center ${
            showLabels ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
          } hover:opacity-80 transition-colors`}
          title="Toggle labels"
        >
          <Type size={18} className="mr-2" />
          <span className="text-sm">Toggle Area Labels</span>
        </button>
      </div>
      
      {/* Formula display */}
      <div className="flex items-center justify-center text-gray-800 font-medium">
        <span className="text-red-500">{baseSquareArea}</span>
        <span className="mx-1">+</span>
        <span className="text-blue-500">{heightSquareArea}</span>
        <span className="mx-1">=</span>
        <span className="text-green-500">{hypotenuseSquareArea}</span>
      </div>
      
      {/* Visualization */}
      <div className="bg-white border rounded-lg shadow-sm">
        <MafsLib.Mafs
          viewBox={viewBox}
          preserveAspectRatio="contain"
          height={400}
        >
          {/* Hidden coordinate system - not visible but used for positioning */}
          <MafsLib.Coordinates.Cartesian xAxis={{ visible: false }} yAxis={{ visible: false }} />
          
          {/* Right triangle */}
          <MafsLib.Polygon
            points={[[0, 0], [base, 0], [0, height]]}
            color="purple"
            fillOpacity={0.1}
            strokeWidth={2.5}
          />
          
          {/* Right angle marker */}
          <MafsLib.Polygon
            points={[
              [0, 0.5],
              [0.5, 0.5],
              [0.5, 0]
            ]}
            color="black"
            fillOpacity={0}
            strokeWidth={1.5}
          />
          
          {/* Base square */}
          <MafsLib.Polygon
            points={baseSquarePoints}
            color="red"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          
          {/* Height square */}
          <MafsLib.Polygon
            points={heightSquarePoints}
            color="blue"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          
          {/* Hypotenuse square */}
          <MafsLib.Polygon
            points={hypotenuseSquarePoints}
            color="green"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          
          {/* Labels - only shown when toggled on, with refined positions */}
          {showLabels && (
            <>
              {/* Area labels only (no side length labels with a, b, c) */}
              <MafsLib.Text x={base/2} y={-base/2} attach="center" color="red">
                {baseSquareArea}
              </MafsLib.Text>
              
              <MafsLib.Text x={-height/2} y={height/2} attach="center" color="blue">
                {heightSquareArea}
              </MafsLib.Text>
              
              {/* Center the hypotenuse square label for better visibility */}
              <MafsLib.Text 
                x={(hypotenuseSquarePoints[0][0] + hypotenuseSquarePoints[2][0])/2} 
                y={(hypotenuseSquarePoints[0][1] + hypotenuseSquarePoints[2][1])/2} 
                attach="center"
                color="green"
              >
                {hypotenuseSquareArea}
              </MafsLib.Text>
            </>
          )}
        </MafsLib.Mafs>
      </div>
    </div>
  );
};

// Direct coordinate calculation for hypotenuse square
// For a 1x1 triangle, we want the square to have points at (0,1), (1,0), (2,1), (1,2)
function calculateHypotenuseSquareDirect(base, height) {
  // For the 1x1 case, we know exactly what we want:
  if (base === 1 && height === 1) {
    return [[0, 1], [1, 0], [2, 1], [1, 2]];
  }
  
  // For all other cases, we'll ensure a perfect square attached to the hypotenuse
  // that extends outward from the triangle (not inward)
  
  // Calculate hypotenuse length - this will be the side length of our square
  const hypLen = Math.sqrt(base * base + height * height);
  
  // Calculate unit vectors for the sides of the square
  // First, get the unit vector along the hypotenuse (from top-left to bottom-right)
  const hypUnitX = base / hypLen;
  const hypUnitY = -height / hypLen;
  
  // Now get the perpendicular unit vector (90° clockwise rotation)
  // We need to ensure it points OUTWARD from the triangle
  const perpUnitX = hypUnitY;   // Rotated vector
  const perpUnitY = -hypUnitX;  // Rotated vector
  
  // Check if we need to flip the direction
  // For a 1x1 triangle, the perpendicular should point to (1,1)
  // If the dot product of perp vector with (1,1) is negative, we need to flip
  const dotProduct = perpUnitX * 1 + perpUnitY * 1;
  
  // If dotProduct is negative, it means the perpendicular is pointing inward
  // toward the origin, so we need to flip its direction
  const adjustedPerpUnitX = dotProduct < 0 ? -perpUnitX : perpUnitX;
  const adjustedPerpUnitY = dotProduct < 0 ? -perpUnitY : perpUnitY;
  
  // The four corners of the square, starting with the two that are on the hypotenuse
  const p1 = [0, height];               // Top-left corner of triangle
  const p2 = [base, 0];                 // Bottom-right corner of triangle
  
  // The other two corners are found by moving perpendicular to the hypotenuse
  // by exactly the hypotenuse length (to make a perfect square)
  const p3 = [p2[0] + adjustedPerpUnitX * hypLen, p2[1] + adjustedPerpUnitY * hypLen];
  const p4 = [p1[0] + adjustedPerpUnitX * hypLen, p1[1] + adjustedPerpUnitY * hypLen];
  
  return [p1, p2, p3, p4];
}

export default PythagorasVisualization;