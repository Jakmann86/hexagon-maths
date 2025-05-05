// maths-teaching-app/src/components/math/visualizations/CoordinateVisualization.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

const CoordinateVisualization = ({ point1, point2, showSolution = false }) => {
  // Calculate auto-scaling for consistent grid view
  const calculateViewBox = (p1, p2) => {
    const buffer = 2; // Consistent buffer around points
    
    const minX = Math.min(p1[0], p2[0]) - buffer;
    const maxX = Math.max(p1[0], p2[0]) + buffer;
    const minY = Math.min(p1[1], p2[1]) - buffer;
    const maxY = Math.max(p1[1], p2[1]) + buffer;
    
    // Ensure minimum grid size
    const width = Math.max(maxX - minX, 8);
    const height = Math.max(maxY - minY, 8);
    
    return {
      x: [minX, minX + width],
      y: [minY, minY + height]
    };
  };

  const viewBox = calculateViewBox(point1, point2);
  
  // Calculate triangle sides for Pythagoras
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Format distance to handle decimals properly  
  const formattedDistance = Number.isInteger(distance) 
    ? distance.toString()
    : distance.toFixed(2);
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MafsLib.Mafs
        viewBox={viewBox}
        preserveAspectRatio="contain"
        height={380}
      >
        {/* Grid with consistent styling */}
        <MafsLib.Coordinates.Cartesian 
          xAxis={{
            variant: 'default',
            label: 'x',
            ticks: true,
            ticksVisible: 'minor'
          }}
          yAxis={{
            variant: 'default',
            label: 'y',
            ticks: true,
            ticksVisible: 'minor'
          }}
          grid
        />
        
        {/* Points */}
        <MafsLib.Point x={point1[0]} y={point1[1]} color={MafsLib.Theme.red} />
        <MafsLib.Text 
          x={point1[0] + 0.3} 
          y={point1[1] + 0.3} 
          attach="center" 
          color={MafsLib.Theme.red}
        >
          A({point1[0]}, {point1[1]})
        </MafsLib.Text>
        
        <MafsLib.Point x={point2[0]} y={point2[1]} color={MafsLib.Theme.red} />
        <MafsLib.Text 
          x={point2[0] + 0.3} 
          y={point2[1] + 0.3} 
          attach="center" 
          color={MafsLib.Theme.red}
        >
          B({point2[0]}, {point2[1]})
        </MafsLib.Text>
        
        {/* Direct line from A to B */}
        <MafsLib.Line.Segment
          point1={point1}
          point2={point2}
          color={MafsLib.Theme.indigo}
          strokeWidth={2}
        />
        <MafsLib.Text
          x={(point1[0] + point2[0]) / 2 + 0.3}
          y={(point1[1] + point2[1]) / 2 + 0.3}
          attach="center"
          color={MafsLib.Theme.indigo}
        >
          {formattedDistance}
        </MafsLib.Text>
        
        {/* Show Pythagoras triangle when answer is visible */}
        {showSolution && (
          <>
            {/* Horizontal line */}
            <MafsLib.Line.Segment
              point1={point1}
              point2={[point2[0], point1[1]]}
              color={MafsLib.Theme.green}
              strokeWidth={1.5}
              strokeDasharray="5,5"
            />
            
            {/* Vertical line */}
            <MafsLib.Line.Segment
              point1={[point2[0], point1[1]]}
              point2={point2}
              color={MafsLib.Theme.green}
              strokeWidth={1.5}
              strokeDasharray="5,5"
            />
            
            {/* Right angle marker - conditional direction */}
            <MafsLib.Polygon
              points={[
                [point2[0], point1[1]],
                [point2[0] - (point2[0] > point1[0] ? 0.3 : -0.3), point1[1]],
                [point2[0] - (point2[0] > point1[0] ? 0.3 : -0.3), 
                 point1[1] + (point2[1] > point1[1] ? 0.3 : -0.3)]
              ]}
              color={MafsLib.Theme.green}
              fillOpacity={0}
              strokeWidth={1.5}
            />
            
            {/* Side labels */}
            <MafsLib.Text 
              x={(point1[0] + point2[0]) / 2} 
              y={point1[1] - 0.3} 
              attach="center" 
              color={MafsLib.Theme.green}
            >
              {Math.abs(dx).toFixed(1)}
            </MafsLib.Text>
            
            <MafsLib.Text 
              x={point2[0] + 0.4} 
              y={(point1[1] + point2[1]) / 2} 
              attach="center" 
              color={MafsLib.Theme.green}
            >
              {Math.abs(dy).toFixed(1)}
            </MafsLib.Text>
          </>
        )}
      </MafsLib.Mafs>
    </div>
  );
};

export default CoordinateVisualization;