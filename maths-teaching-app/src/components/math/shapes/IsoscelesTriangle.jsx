// maths-teaching-app/src/components/math/shapes/IsoscelesTriangle.jsx
import React from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { STANDARD_SHAPES } from '../../../config/standardShapes';

const IsoscelesTriangle = ({
  base = 6,
  height = 4,
  showHeight = false,
  labelStyle = 'standard',
  labels = {},
  units = 'cm',
  style = {},
  mafsHeight = 250,
}) => {
  // Calculate equal sides length using Pythagoras' theorem
  const halfBase = base / 2;
  const equalSide = Math.sqrt(halfBase * halfBase + height * height);
  const roundedEqualSide = Math.round(equalSide * 100) / 100;
  
  // Default labels based on labelStyle
  let defaultSideLabels = [];
  
  if (labelStyle === 'numeric') {
    defaultSideLabels = [
      `${base} ${units}`,
      `${roundedEqualSide} ${units}`,
      `${roundedEqualSide} ${units}`
    ];
  } else if (labelStyle === 'standard') {
    defaultSideLabels = ['base', 'side', 'side'];
  } else {
    defaultSideLabels = ['b', 'a', 'a'];
  }
  
  // Merge default labels with provided labels
  const sideLabels = labels.sides || defaultSideLabels;
  const vertexLabels = labels.vertices || ['A', 'B', 'C'];
  
  // Default style options
  const {
    fillColor = '#4CAF50',
    fillOpacity = 0.2,
    strokeColor = '#4CAF50',
    strokeWidth = 2,
    showGrid = false,
    heightColor = '#2196F3',
    backgroundTransparent = true,
  } = style;

  // Create unique board ID
  const boardId = `isosceles-triangle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Update function for JSXGraph board
  const updateBoard = (board) => {
    // Clear any existing objects
    Object.keys(board.objects).forEach(id => {
      board.removeObject(id);
    });
    
    board.suspendUpdate();

    try {
      // Create the triangle vertices
      const leftVertex = board.create('point', [0, 0], { visible: false, fixed: true });
      const rightVertex = board.create('point', [base, 0], { visible: false, fixed: true });
      const topVertex = board.create('point', [base/2, height], { visible: false, fixed: true });
      
      // Create the triangle
      const triangle = board.create('polygon', [leftVertex, rightVertex, topVertex], {
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        vertices: { visible: false }
      });
      
      // Height line and right angle marker
      if (showHeight) {
        // Height midpoint
        const heightPoint = board.create('point', [base/2, 0], { visible: false, fixed: true });
        
        // Height line
        const heightLine = board.create('segment', [topVertex, heightPoint], {
          strokeColor: heightColor,
          strokeWidth: 1.5,
          dash: 2
        });
        
        // Right angle marker
        const rightAngle = board.create('angle', [leftVertex, heightPoint, topVertex], {
          radius: 0.5,
          orthotype: 'square',
          fillColor: heightColor,
          fillOpacity: 0.3,
          strokeWidth: 1
        });
        
        // Height label
        board.create('text', [base/2 + 0.8, height/2, `h = ${height} ${units}`], {
          fontSize: 14,
          fixed: true,
          color: heightColor
        });
      }
      
      // Side labels
      // Base label
      board.create('text', [base/2, -0.8, sideLabels[0]], {
        fontSize: 14,
        fixed: true,
        anchorX: 'middle',
        color: '#000000'
      });
      
      // Left side label
      board.create('text', [base/4 - 0.5, height/2 - 0.5, sideLabels[1]], {
        fontSize: 14,
        fixed: true,
        anchorX: 'middle',
        color: '#000000',
        rotate: Math.atan2(height, -base/2) * 180 / Math.PI
      });
      
      // Right side label
      board.create('text', [3*base/4 + 0.5, height/2 - 0.5, sideLabels[2]], {
        fontSize: 14,
        fixed: true,
        anchorX: 'middle',
        color: '#000000',
        rotate: Math.atan2(height, base/2) * 180 / Math.PI
      });
      
      // Vertex labels (only if specifically requested)
      if (labels.vertices) {
        board.create('text', [0, 0, vertexLabels[0]], {
          fontSize: 14,
          fixed: true,
          anchorX: 'right',
          anchorY: 'top',
          offset: [-10, -10],
          color: '#000000'
        });
        
        board.create('text', [base, 0, vertexLabels[1]], {
          fontSize: 14,
          fixed: true,
          anchorX: 'left',
          anchorY: 'top',
          offset: [10, -10],
          color: '#000000'
        });
        
        board.create('text', [base/2, height, vertexLabels[2]], {
          fontSize: 14,
          fixed: true,
          anchorX: 'middle',
          anchorY: 'bottom',
          offset: [0, -10],
          color: '#000000'
        });
      }
    } catch (error) {
      console.error("Error creating isosceles triangle:", error);
    }
    
    board.unsuspendUpdate();
  };

  // Calculate appropriate bounding box
  const getBoundingBox = () => {
    const padding = 2;
    return [-padding, height + padding, base + padding, -padding];
  };

  return (
    <div className="w-full h-full" style={{ maxHeight: `${mafsHeight}px` }}>
      <JSXGraphBoard
        id={boardId}
        boundingBox={getBoundingBox()}
        height={mafsHeight}
        backgroundColor="transparent"
        axis={false}
        grid={false}
        onUpdate={updateBoard}
        dependencies={[base, height, showHeight, labels, mafsHeight]}
      />
    </div>
  );
};

export default IsoscelesTriangle;