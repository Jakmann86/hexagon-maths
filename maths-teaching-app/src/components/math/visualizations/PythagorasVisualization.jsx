// src/components/math/visualizations/PythagorasVisualization.jsx
import React, { useState } from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';
import { Type, Ruler } from 'lucide-react';
import { Slider } from '../../common/Slider';
import { useSectionTheme } from '../../../hooks/useSectionTheme';

const PythagorasVisualization = () => {
  // Get learn section theme colors
  const theme = useSectionTheme('learn');
  
  // State for triangle dimensions - using integers to avoid visualization issues
  const [base, setBase] = useState(3);
  const [height, setHeight] = useState(4);
  
  // Calculate hypotenuse using Pythagoras' theorem
  const hypotenuse = Math.sqrt(base * base + height * height);
  
  // State for labels toggle
  const [showLabels, setShowLabels] = useState(true);
  const [showSideLengths, setShowSideLengths] = useState(true);
  
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
  
  // Calculate hypotenuse square
  const hypotenuseSquarePoints = calculateHypotenuseSquareDirect(base, height);
  
  // Calculate areas
  const baseSquareArea = Math.round(base * base * 100) / 100;
  const heightSquareArea = Math.round(height * height * 100) / 100;
  const hypotenuseSquareArea = Math.round(hypotenuse * hypotenuse * 100) / 100;
  
  // Calculate viewBox with adjusted proportions
  const maxHeight = Math.max(height, base, hypotenuse) * 1.65;
  const maxWidth = Math.max(height, base, hypotenuse) * 1.2;
  const viewBox = { 
    x: [-Math.max(height, maxWidth/2), maxWidth], 
    y: [-Math.max(base, maxHeight/2), maxHeight] 
  };

  // Theme-specific colors for the visualization
  const visualColors = {
    triangleFill: 'purple', // Different from the squares
    baseSquareFill: 'red',
    heightSquareFill: 'blue',
    hypotenuseSquareFill: `${theme.key}`
  };
  
  // Label styling constants
  const areaLabelSize = 16;
  const lengthLabelSize = 14;
  const labelTextColor = '#666';
  
  return (
    <div className="pythagoras-visualization space-y-4">
      {/* Controls for side lengths - using integers only */}
      <div className={`controls grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-${theme.pastelBg} rounded-lg`}>
        <div className="space-y-2">
          <label className={`text-sm font-medium text-${theme.pastelText}`}>Base length: {base}</label>
          <Slider 
            value={base} 
            onChange={(value) => setBase(Math.round(value))} 
            min={1} 
            max={10} 
            step={1}
            className={`accent-${theme.primary}`}
          />
        </div>
        
        <div className="space-y-2">
          <label className={`text-sm font-medium text-${theme.pastelText}`}>Height: {height}</label>
          <Slider 
            value={height} 
            onChange={(value) => setHeight(Math.round(value))} 
            min={1} 
            max={10} 
            step={1}
            className={`accent-${theme.primary}`}
          />
        </div>
      </div>
      
      {/* Display toggles - now with side lengths toggle */}
      <div className="flex justify-center p-4 bg-gray-50 rounded-lg gap-4">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`px-3 py-2 rounded-md flex items-center ${
            showLabels ? `bg-${theme.secondary} text-${theme.secondaryText}` : 'bg-gray-100 text-gray-500'
          } hover:opacity-80 transition-colors`}
          title="Toggle area labels"
        >
          <Type size={18} className="mr-2" />
          <span className="text-sm">Area Labels</span>
        </button>
        
        <button
          onClick={() => setShowSideLengths(!showSideLengths)}
          className={`px-3 py-2 rounded-md flex items-center ${
            showSideLengths ? `bg-${theme.secondary} text-${theme.secondaryText}` : 'bg-gray-100 text-gray-500'
          } hover:opacity-80 transition-colors`}
          title="Toggle side lengths"
        >
          <Ruler size={18} className="mr-2" />
          <span className="text-sm">Side Lengths</span>
        </button>
      </div>
      
      {/* Formula display REMOVED as requested */}
      
      {/* Visualization - with centered container */}
      <div className="flex justify-center items-center">
        <div className={`bg-[#f9f7f2] border border-${theme.borderColor} rounded-lg shadow-sm w-full max-w-xl`} style={{ height: "380px" }}>
          <MafsLib.Mafs
            viewBox={viewBox}
            preserveAspectRatio="contain"
            height={380}
            background="#f9f7f2"
          >
            {/* Right triangle - with full opacity */}
            <MafsLib.Polygon
              points={[[0, 0], [base, 0], [0, height]]}
              color={visualColors.triangleFill}
              fillOpacity={1.0} // Fully opaque
              strokeWidth={2}
            />
            
            {/* Fixed right angle marker - now a proper square */}
            <MafsLib.Polygon
              points={[
                [0, 0],     // Origin point
                [0, 0.5],   // Up 0.5 units
                [0.5, 0.5], // Right 0.5 units
                [0.5, 0]    // Down to x-axis
              ]}
              color="black"
              fillOpacity={0}
              strokeWidth={1.5}
            />
            
            {/* Base square */}
            <MafsLib.Polygon
              points={baseSquarePoints}
              color={visualColors.baseSquareFill}
              fillOpacity={0.2}
              strokeWidth={2}
            />
            
            {/* Height square */}
            <MafsLib.Polygon
              points={heightSquarePoints}
              color={visualColors.heightSquareFill}
              fillOpacity={0.2}
              strokeWidth={2}
            />
            
            {/* Hypotenuse square */}
            <MafsLib.Polygon
              points={hypotenuseSquarePoints}
              color={visualColors.hypotenuseSquareFill}
              fillOpacity={0.2}
              strokeWidth={2}
            />
            
            {/* Area Labels - only shown when toggled on */}
            {showLabels && (
              <>
                <MafsLib.Text 
                  x={base/2 - 0.6} 
                  y={-base/2 - 0.1} 
                  attach="center" 
                  color="red"
                  size={areaLabelSize}
                >
                  {baseSquareArea} cm²
                </MafsLib.Text>
                
                <MafsLib.Text 
                  x={-height/2 - 0.7} 
                  y={height/2 + 0.8} 
                  attach="center" 
                  color="blue"
                  size={areaLabelSize}
                >
                  {heightSquareArea} cm²
                </MafsLib.Text>
                
                <MafsLib.Text 
                  x={(hypotenuseSquarePoints[0][0] + hypotenuseSquarePoints[2][0])/2 - 0.7} 
                  y={(hypotenuseSquarePoints[0][1] + hypotenuseSquarePoints[2][1])/2} 
                  attach="center"
                  color={visualColors.hypotenuseSquareFill}
                  size={areaLabelSize}
                >
                  {hypotenuseSquareArea} cm²
                </MafsLib.Text>
              </>
            )}
            
            {/* Side Length Labels - only shown when toggled on */}
            {showSideLengths && (
              <>
                {/* Base length - manually adjusted position */}
                <MafsLib.Text 
                  x={base/2 - 0.5} 
                  y={-0.7} 
                  attach="center" 
                  color={labelTextColor}
                  size={lengthLabelSize}
                >
                  {base} cm
                </MafsLib.Text>
                
                {/* Height length - manually adjusted position */}
                <MafsLib.Text 
                  x={-1.2}
                  y={height/2} 
                  attach="center" 
                  color={labelTextColor}
                  size={lengthLabelSize}
                >
                  {height} cm
                </MafsLib.Text>
                
                {/* Hypotenuse length - manually adjusted position */}
                <MafsLib.Text 
                  x={base/2 + 0.3}
                  y={height/2 + 0.4}
                  attach="center" 
                  color={labelTextColor}
                  size={lengthLabelSize}
                >
                  {hypotenuse.toFixed(1)} cm
                </MafsLib.Text>
              </>
            )}
          </MafsLib.Mafs>
        </div>
      </div>
    </div>
  );
};

// Direct coordinate calculation for hypotenuse square
function calculateHypotenuseSquareDirect(base, height) {
  // For the 1x1 case, we know exactly what we want:
  if (base === 1 && height === 1) {
    return [[0, 1], [1, 0], [2, 1], [1, 2]];
  }
  
  // Calculate hypotenuse length
  const hypLen = Math.sqrt(base * base + height * height);
  
  // Calculate unit vectors
  const hypUnitX = base / hypLen;
  const hypUnitY = -height / hypLen;
  
  // Get perpendicular vector
  const perpUnitX = hypUnitY;
  const perpUnitY = -hypUnitX;
  
  // Check direction
  const dotProduct = perpUnitX * 1 + perpUnitY * 1;
  
  // Adjust direction if needed
  const adjustedPerpUnitX = dotProduct < 0 ? -perpUnitX : perpUnitX;
  const adjustedPerpUnitY = dotProduct < 0 ? -perpUnitY : perpUnitY;
  
  // Calculate square corners
  const p1 = [0, height];
  const p2 = [base, 0];
  const p3 = [p2[0] + adjustedPerpUnitX * hypLen, p2[1] + adjustedPerpUnitY * hypLen];
  const p4 = [p1[0] + adjustedPerpUnitX * hypLen, p1[1] + adjustedPerpUnitY * hypLen];
  
  return [p1, p2, p3, p4];
}

export default PythagorasVisualization;