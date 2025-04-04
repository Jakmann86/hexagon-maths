import React from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { getBoardConfig } from '../../../config/boardSizes';

/**
 * RightTriangle - Pure visualization component for rendering right-angled triangles
 * 
 * @param {number} base - Length of base 
 * @param {number} height - Height
 * @param {boolean} showRightAngle - Whether to show the right angle marker
 * @param {Array} labels - Labels for sides: [base, height, hypotenuse]
 * @param {string} units - Units for measurements
 * @param {Object} style - Styling options
 * @param {string} size - Size preset from boardSizes
 * @param {number} containerHeight - Optional override height
 * @param {boolean} smallDisplay - Whether this is for smaller displays
 * @param {string} position - Position adjustment: 'default', 'higher', 'middle', 'lower'
 */
const RightTriangle = ({
  base = 3,
  height = 4,
  showRightAngle = true,
  labels = [],
  units = 'cm',
  style = {},
  size = 'starter',
  containerHeight,
  smallDisplay = false,
  position = 'default'
}) => {
  // Calculate hypotenuse (only used if needed for default labels)
  const hypotenuse = Math.sqrt(base * base + height * height);
  
  // Get board configuration
  const boardConfig = getBoardConfig(smallDisplay ? 'small' : size);
  
  // Final height calculation
  const finalHeight = containerHeight || boardConfig.height;

  // Create a stable ID for the JSXGraph board
  const boardId = `right-triangle-${base}-${height}-${smallDisplay ? 'small' : 'std'}`;

  // Board rendering function
  const updateBoard = (board) => {
    // Clear any existing elements
    board.objects = {};
    board.suspendUpdate();
    
    // Position offset based on position prop
    let yOffset = 0;
    if (position === 'higher') {
      yOffset = 1;
    } else if (position === 'middle') {
      yOffset = 0.5;
    } else if (position === 'lower') {
      yOffset = -1;
    }
    
    // Style defaults
    const {
      fillColor = 'indigo',
      fillOpacity = 0.2,
      strokeColor = 'indigo',
      strokeWidth = 2
    } = style;
    
    // Scale up for small display
    const scaleFactor = smallDisplay ? 1.2 : 1;
    const scaledBase = base * scaleFactor;
    const scaledHeight = height * scaleFactor;
    
    // Create the triangle points
    const p1 = board.create('point', [0, yOffset], { visible: false, fixed: true, name: 'A' });
    const p2 = board.create('point', [scaledBase, yOffset], { visible: false, fixed: true, name: 'B' });
    const p3 = board.create('point', [0, scaledHeight + yOffset], { visible: false, fixed: true, name: 'C' });
    
    // Create the triangle
    const poly = board.create('polygon', [p1, p2, p3], {
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      strokeColor: strokeColor,
      strokeWidth: strokeWidth,
      vertices: { visible: false }
    });
    
    // Default labels if none provided
    const sideLabels = labels.length === 3 ? labels : [
      `${base} ${units}`, 
      `${height} ${units}`, 
      `${hypotenuse.toFixed(2)} ${units}`
    ];
    
    // Add side labels with improved positioning
    board.create('text', [scaledBase/2, yOffset - 0.5, sideLabels[0]], {
      fontSize: 14,
      fixed: true
    });
    
    board.create('text', [-0.5, yOffset + scaledHeight/2, sideLabels[1]], {
      fontSize: 14,
      fixed: true
    });
    
    // Move hypotenuse label to the right (60% along hypotenuse)
    const hypotenuseX = scaledBase * 0.6;
    const hypotenuseY = yOffset + scaledHeight * 0.6;
    
    board.create('text', [hypotenuseX, hypotenuseY, sideLabels[2]], {
      fontSize: 14,
      fixed: true
    });
    
    // Right angle marker
    if (showRightAngle) {
      board.create('angle', [p2, p1, p3], {
        radius: 0.5,
        orthotype: 'square',
        fillColor: 'none',
        strokeWidth: 1,
        fixed: true
      });
    }
    
    board.unsuspendUpdate();
  };

  // Adjust boundingBox based on position
  let boundingBox = [...boardConfig.boundingBox];
  if (position === 'higher') {
    boundingBox[1] += 1;
    boundingBox[3] += 1;
  } else if (position === 'middle') {
    boundingBox[1] += 0.5;
    boundingBox[3] += 0.5;
  } else if (position === 'lower') {
    boundingBox[1] -= 1;
    boundingBox[3] -= 1;
  }

  return (
    <div className="w-full h-full">
      <JSXGraphBoard
        id={boardId}
        boundingBox={boundingBox}
        height={finalHeight}
        backgroundColor="transparent"
        axis={false}
        onUpdate={updateBoard}
      />
    </div>
  );
};

export default RightTriangle;