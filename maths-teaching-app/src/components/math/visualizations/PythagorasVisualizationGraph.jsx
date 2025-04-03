import React, { useState } from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { Slider } from '../../common/Slider';
import { Type, Ruler } from 'lucide-react';
import { useSectionTheme } from '../../../hooks/useSectionTheme';

const PythagorasVisualizationGraph = () => {
  // Get learn section theme colors
  const theme = useSectionTheme('learn');
  
  // State for triangle dimensions
  const [base, setBase] = useState(3);
  const [height, setHeight] = useState(4);
  
  // State for labels toggle
  const [showLabels, setShowLabels] = useState(true);
  const [showSideLengths, setShowSideLengths] = useState(true);
  
  // Calculate hypotenuse using Pythagoras' theorem
  const hypotenuse = Math.sqrt(base * base + height * height);
  
  // Calculate square areas
  const baseSquareArea = Math.round(base * base * 100) / 100;
  const heightSquareArea = Math.round(height * height * 100) / 100;
  const hypotenuseSquareArea = Math.round(hypotenuse * hypotenuse * 100) / 100;

  // Improved bounding box calculation - more generous padding
  const maxDim = Math.max(base, height, hypotenuse);
  const padding = Math.max(3, maxDim * 0.3); // More generous dynamic padding
  
  // This ensures we can see all three squares
  const boundingBox = [
    -Math.max(height + 1, padding), 
    Math.max(base + height, maxDim + padding), 
    Math.max(base + height, maxDim + padding), 
    -Math.max(base + 1, padding)
  ];

  // Create/update the visualization using JSXGraph
  const updateBoard = (board) => {
    board.suspendUpdate();
    
    // Store references to objects we'll create
    const objects = [];
    
    // Common styling options - increased opacity for better visibility
    const commonOptions = {
      fixed: true,
      highlight: false,
      draft: false,
      hasInnerPoints: false,
      vertices: {
        visible: false
      }
    };
    
    // Create points for the right triangle
    const origin = board.create('point', [0, 0], { 
      name: 'O', 
      fixed: true, 
      visible: false,
      showInfobox: false
    });
    
    const basePoint = board.create('point', [base, 0], { 
      name: 'A', 
      fixed: true, 
      visible: false,
      showInfobox: false
    });
    
    const heightPoint = board.create('point', [0, height], { 
      name: 'B', 
      fixed: true, 
      visible: false,
      showInfobox: false
    });
    
    // Create the right triangle
    const triangle = board.create('polygon', [origin, basePoint, heightPoint], {
      ...commonOptions,
      fillColor: '#9c59b6', // Purple for the triangle
      fillOpacity: 0.7, // More opaque
      borders: { 
        strokeWidth: 2, 
        strokeColor: '#8e44ad',
        fixed: true
      }
    });
    objects.push(triangle);
    
    // Create the right angle marker
    const rightAngle = board.create('angle', [basePoint, origin, heightPoint], {
      radius: 0.5,
      orthotype: 'square',
      fillColor: 'black',
      fillOpacity: 0.2,
      strokeWidth: 1.5,
      fixed: true
    });
    objects.push(rightAngle);
    
    // Base square (red)
    const baseSquare = board.create('polygon', [
      origin,
      basePoint,
      [base, -base],
      [0, -base]
    ], {
      ...commonOptions,
      fillColor: '#e74c3c', // Red
      fillOpacity: 0.4,
      borders: { 
        strokeWidth: 1.5, 
        strokeColor: '#c0392b',
        fixed: true
      }
    });
    objects.push(baseSquare);
    
    // Height square (blue)
    const heightSquare = board.create('polygon', [
      origin,
      heightPoint,
      [-height, height],
      [-height, 0]
    ], {
      ...commonOptions,
      fillColor: '#3498db', // Blue
      fillOpacity: 0.4,
      borders: { 
        strokeWidth: 1.5, 
        strokeColor: '#2980b9',
        fixed: true
      }
    });
    objects.push(heightSquare);
    
    // Calculate points for the hypotenuse square using the improved function
    const hypSquarePoints = calculateHypotenuseSquareDirect(base, height);
    
    // Hypotenuse square (green)
    const hypSquare = board.create('polygon', hypSquarePoints, {
      ...commonOptions,
      fillColor: '#2ecc71', // Green
      fillOpacity: 0.4,
      borders: { 
        strokeWidth: 1.5, 
        strokeColor: '#27ae60',
        fixed: true
      }
    });
    objects.push(hypSquare);
    
    // Add labels if enabled - with improved styling
    if (showLabels) {
      // Area labels with better contrast
      const baseLabel = board.create('text', [base/2, -base/2, baseSquareArea + " cm²"], {
        fontSize: 16,
        color: '#c0392b',
        anchorX: 'middle',
        anchorY: 'middle',
        cssClass: 'jxgraph-label',
        fixed: true,
        highlight: false
      });
      objects.push(baseLabel);
      
      const heightLabel = board.create('text', [-height/2, height/2, heightSquareArea + " cm²"], {
        fontSize: 16,
        color: '#2980b9',
        anchorX: 'middle',
        anchorY: 'middle',
        cssClass: 'jxgraph-label',
        fixed: true,
        highlight: false
      });
      objects.push(heightLabel);
      
      // Calculate center of hypotenuse square
      const hx = (hypSquarePoints[0][0] + hypSquarePoints[2][0]) / 2;
      const hy = (hypSquarePoints[0][1] + hypSquarePoints[2][1]) / 2;
      
      const hypLabel = board.create('text', [hx, hy, hypotenuseSquareArea + " cm²"], {
        fontSize: 16,
        color: '#27ae60',
        anchorX: 'middle',
        anchorY: 'middle',
        cssClass: 'jxgraph-label',
        fixed: true,
        highlight: false
      });
      objects.push(hypLabel);
    }
    
    // Add side length labels if enabled - with improved contrast
    if (showSideLengths) {
      const baseLength = board.create('text', [base/2, -0.3, base + " cm"], {
        fontSize: 14,
        color: '#333',
        anchorX: 'middle',
        cssClass: 'jxgraph-length',
        fixed: true,
        highlight: false
      });
      objects.push(baseLength);
      
      const heightLength = board.create('text', [-0.5, height/2, height + " cm"], {
        fontSize: 14,
        color: '#333',
        anchorY: 'middle',
        cssClass: 'jxgraph-length',
        fixed: true,
        highlight: false
      });
      objects.push(heightLength);
      
      const hypLength = board.create('text', [base/2 - 0.3, height/2 - 0.3, hypotenuse.toFixed(1) + " cm"], {
        fontSize: 14,
        color: '#333',
        rotate: Math.atan2(-height, base) * (180/Math.PI),
        cssClass: 'jxgraph-length',
        fixed: true,
        highlight: false
      });
      objects.push(hypLength);
    }
    
    board.unsuspendUpdate();
  };

  // Improved hypotenuse square calculation taken from original PythagorasVisualization
  const calculateHypotenuseSquareDirect = (base, height) => {
    // For the 1x1 case, we know exactly what we want:
    if (base === 1 && height === 1) {
      return [[0, 1], [1, 0], [2, 1], [1, 2]];
    }
    
    // Calculate hypotenuse length
    const hypLen = Math.sqrt(base * base + height * height);
    
    // Calculate unit vectors (note the negative sign on height)
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
  };

  return (
    <div className="pythagoras-visualization space-y-4">
      {/* Controls */}
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
      
      {/* Display toggles */}
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
      
      {/* JSXGraph Visualization */}
      <div className={`bg-[#f9f7f2] border border-${theme.borderColor} rounded-lg shadow-sm w-full max-w-2xl mx-auto`}>
        <JSXGraphBoard
          id="pythagoras-board"
          boundingBox={boundingBox}
          height="460px"
          backgroundColor="#f9f7f2"
          axis={false}
          onUpdate={updateBoard}
          dependencies={[base, height, showLabels, showSideLengths]}
        />
      </div>
    </div>
  );
};

export default PythagorasVisualizationGraph;