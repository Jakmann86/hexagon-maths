import React, { useState } from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { Slider } from '../../common/Slider';
import { Type, Ruler, Info, HelpCircle } from 'lucide-react';
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
  const [showHint, setShowHint] = useState(false);
  
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
    // *** FIX FOR GHOST EFFECT: Clear all existing objects first ***
    // This ensures no objects remain from previous renders
    Object.keys(board.objects).forEach(id => {
      if (board.objects[id] && board.objects[id].elementType !== 'axis') {
        board.removeObject(id, false); // false means don't update until later
      }
    });
    
    board.suspendUpdate();
    
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
    board.create('polygon', [origin, basePoint, heightPoint], {
      ...commonOptions,
      fillColor: '#9c59b6', // Purple for the triangle
      fillOpacity: 0.7, // More opaque
      borders: { 
        strokeWidth: 2, 
        strokeColor: '#8e44ad',
        fixed: true
      }
    });
    
    // Create the right angle marker
    board.create('angle', [basePoint, origin, heightPoint], {
      radius: 0.5,
      orthotype: 'square',
      fillColor: 'black',
      fillOpacity: 0.2,
      strokeWidth: 1.5,
      fixed: true
    });
    
    // Base square (red)
    board.create('polygon', [
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
    
    // Height square (blue)
    board.create('polygon', [
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
    
    // Calculate points for the hypotenuse square using the improved function
    const hypSquarePoints = calculateHypotenuseSquareDirect(base, height);
    
    // Hypotenuse square (green)
    board.create('polygon', hypSquarePoints, {
      ...commonOptions,
      fillColor: '#2ecc71', // Green
      fillOpacity: 0.4,
      borders: { 
        strokeWidth: 1.5, 
        strokeColor: '#27ae60',
        fixed: true
      }
    });
    
    // Add labels if enabled - with improved styling and more stable positioning
    if (showLabels) {
      // Base square area label (bottom) - more stable positioning
      // Position the label at a proportional distance from center of the square
      const baseLabelX = base/2;
      const baseLabelY = -base/2;
      
      board.create('text', [baseLabelX, baseLabelY, baseSquareArea + " cm²"], {
        fontSize: 16,
        color: '#c0392b',
        anchorX: 'middle',
        anchorY: 'middle',
        cssClass: 'jxgraph-label',
        fixed: true,
        highlight: false
      });
      
      // Height square area label (left side) - more stable positioning
      // Fixed distance from the square based on the height, positioned at the center
      // When height=8, this puts the label at a good distance
      const heightLabelOffset = Math.max(1, height * 0.15);
      const heightLabelX = -height/2 - heightLabelOffset;
      const heightLabelY = height/2;
      
      board.create('text', [heightLabelX, heightLabelY, heightSquareArea + " cm²"], {
        fontSize: 16,
        color: '#2980b9',
        anchorX: 'middle',
        anchorY: 'middle',
        cssClass: 'jxgraph-label',
        fixed: true,
        highlight: false
      });
      
      // Hypotenuse square area label - centered in the square
      const hx = (hypSquarePoints[0][0] + hypSquarePoints[2][0]) / 2;
      const hy = (hypSquarePoints[0][1] + hypSquarePoints[2][1]) / 2;
      
      board.create('text', [hx, hy, hypotenuseSquareArea + " cm²"], {
        fontSize: 16,
        color: '#27ae60',
        anchorX: 'middle',
        anchorY: 'middle',
        cssClass: 'jxgraph-label',
        fixed: true,
        highlight: false
      });
    }
    
    // Add side length labels if enabled - with improved positioning for consistent display
    if (showSideLengths) {
      // Base (bottom) side label - keep centered and slightly below
      board.create('text', [base/2, -0.4, base + " cm"], {
        fontSize: 14,
        color: '#333',
        anchorX: 'middle',
        anchorY: 'middle',
        cssClass: 'jxgraph-length',
        fixed: true,
        highlight: false
      });
      
      // Height (left) side label - positioned with proportional offset
      // Scale the offset based on height to keep it consistently outside the square
      const heightLabelOffset = Math.max(1, height * 0.15);
      board.create('text', [-heightLabelOffset, height/2, height + " cm"], {
        fontSize: 14,
        color: '#333',
        anchorX: 'middle',
        anchorY: 'middle',
        cssClass: 'jxgraph-length',
        fixed: true,
        highlight: false
      });
      
      // Hypotenuse side label - positioned along the hypotenuse
      // Calculate position to ensure it's centered and oriented along the hypotenuse
      const hypAngle = Math.atan2(-height, base) * (180/Math.PI);
      const hypLabelX = base/2 - 0.3;
      const hypLabelY = height/2 - 0.3;
      
      board.create('text', [hypLabelX, hypLabelY, hypotenuse.toFixed(1) + " cm"], {
        fontSize: 14,
        color: '#333',
        rotate: hypAngle,
        cssClass: 'jxgraph-length',
        fixed: true,
        highlight: false
      });
    }
    
    // Add equation display to connect visual with formula
    if (showHint) {
      // Add Pythagoras' theorem formula with actual values
      const formulaText = `a² + b² = c²`;
      const calculationText = `${base}² + ${height}² = ${hypotenuse.toFixed(1)}²`;
      const resultText = `${baseSquareArea} + ${heightSquareArea} = ${hypotenuseSquareArea}`;
      
      // Position formulas more consistently 
      // Create a box in the top left that will contain the formulas
      // This provides a more consistent placement regardless of triangle dimensions
      const boxX = -height * 0.5;  // Position box to the left
      const boxY = height + 1;     // Position box above the triangle
      
      // Create a semi-transparent background rectangle for better readability
      board.create('polygon', [
        [boxX - 3, boxY - 0.5],
        [boxX + 6, boxY - 0.5],
        [boxX + 6, boxY + 2.5],
        [boxX - 3, boxY + 2.5]
      ], {
        fillColor: 'white',
        fillOpacity: 0.7,
        hasInnerPoints: false,
        vertices: { visible: false },
        borders: { visible: false }
      });
      
      // Add each line of the equation with fixed vertical spacing
      board.create('text', [boxX, boxY + 1.5, formulaText], {
        fontSize: 18,
        cssClass: 'jxgraph-formula',
        anchorX: 'left',
        fixed: true,
        highlight: false
      });
      
      board.create('text', [boxX, boxY + 0.75, calculationText], {
        fontSize: 16,
        cssClass: 'jxgraph-formula',
        anchorX: 'left',
        fixed: true,
        highlight: false
      });
      
      board.create('text', [boxX, boxY, resultText], {
        fontSize: 16,
        cssClass: 'jxgraph-formula',
        anchorX: 'left',
        fixed: true,
        highlight: false
      });
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
      

      
      {/* Display toggles - Improved with additional hint toggle */}
      <div className="flex flex-wrap justify-center p-4 bg-gray-50 rounded-lg gap-4">
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
        
        <button
          onClick={() => setShowHint(!showHint)}
          className={`px-3 py-2 rounded-md flex items-center ${
            showHint ? `bg-${theme.secondary} text-${theme.secondaryText}` : 'bg-gray-100 text-gray-500'
          } hover:opacity-80 transition-colors`}
          title="Show formula relationship"
        >
          <HelpCircle size={18} className="mr-2" />
          <span className="text-sm">Show Formula</span>
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
          dependencies={[base, height, showLabels, showSideLengths, showHint]}
        />
      </div>
      

    </div>
  );
};

export default PythagorasVisualizationGraph;