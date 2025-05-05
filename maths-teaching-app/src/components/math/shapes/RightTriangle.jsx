// maths-teaching-app/src/components/math/shapes/RightTriangle.jsx
import React from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { STANDARD_SHAPES } from '../../../config/standardShapes';

const RightTriangle = ({
  base = 3,
  height = 4,
  showRightAngle = true,
  labels = [],
  units = 'cm',
  style = {},
  containerHeight = 250,
  orientation = 'default',
  scale = 1,
  markAngle = null
}) => {
  const actualOrientation = orientation === 'random' 
    ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
    : orientation;
  
  const STANDARD = {
    base: STANDARD_SHAPES.rightTriangle.base * scale,
    height: STANDARD_SHAPES.rightTriangle.height * scale,
    boundingBox: STANDARD_SHAPES.rightTriangle.boundingBox.map(v => v * scale)
  };
  
  const hypotenuse = Math.sqrt(base * base + height * height);
  // Add unique identifier to prevent board conflicts
  const boardId = `right-triangle-standard-${actualOrientation}-${scale}-${Math.random().toString(36).substr(2, 9)}`;

  const updateBoard = (board) => {
    // Clear existing objects more safely
    const objectIds = Object.keys(board.objects);
    for (let i = objectIds.length - 1; i >= 0; i--) {
      try {
        board.removeObject(board.objects[objectIds[i]]);
      } catch (e) {
        // Ignore errors during object removal
      }
    }
    
    board.suspendUpdate();
    
    try {
      const {
        fillColor = 'indigo',
        fillOpacity = 0.2,
        strokeColor = 'indigo',
        strokeWidth = 2
      } = style;
      
      let points;
      switch (actualOrientation) {
        case 'rotate90':
          points = [
            [STANDARD.height, 0],
            [STANDARD.height, STANDARD.base],
            [0, 0]
          ];
          break;
        case 'rotate180':
          points = [
            [STANDARD.base, STANDARD.height],
            [0, STANDARD.height],
            [STANDARD.base, 0]
          ];
          break;
        case 'rotate270':
          points = [
            [0, STANDARD.base],
            [0, 0],
            [STANDARD.height, STANDARD.base]
          ];
          break;
        default:
          points = [
            [0, 0],
            [STANDARD.base, 0],
            [0, STANDARD.height]
          ];
      }
      
      const p1 = board.create('point', points[0], { visible: false, fixed: true });
      const p2 = board.create('point', points[1], { visible: false, fixed: true });
      const p3 = board.create('point', points[2], { visible: false, fixed: true });
      
      board.create('polygon', [p1, p2, p3], {
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        vertices: { visible: false }
      });
      
      const sideLabels = labels.length === 3 ? labels : [
        `${base} ${units}`,
        `${height} ${units}`,
        `${hypotenuse.toFixed(2)} ${units}`
      ];
      
      // Improved label positions with better offsets
      let labelPositions;
      const labelOffset = 0.8 * scale;
      const diagonalOffset = 1.2 * scale;
      
      switch (actualOrientation) {
        case 'rotate90':
          labelPositions = [
            [STANDARD.height + labelOffset, STANDARD.base/2, sideLabels[0]],
            [STANDARD.height/2, -labelOffset, sideLabels[1]],
            [STANDARD.height/2 + diagonalOffset, STANDARD.base/2 + labelOffset, sideLabels[2]]
          ];
          break;
        case 'rotate180':
          labelPositions = [
            [STANDARD.base/2, STANDARD.height + labelOffset, sideLabels[0]],
            [STANDARD.base + labelOffset, STANDARD.height/2, sideLabels[1]],
            [STANDARD.base/2 - diagonalOffset, STANDARD.height/2 + labelOffset, sideLabels[2]]
          ];
          break;
        case 'rotate270':
          labelPositions = [
            [-labelOffset, STANDARD.base/2, sideLabels[0]],
            [STANDARD.height/2, STANDARD.base + labelOffset, sideLabels[1]],
            [STANDARD.height/2 - diagonalOffset, STANDARD.base/2 + labelOffset, sideLabels[2]]
          ];
          break;
        default:
          labelPositions = [
            [STANDARD.base/2, -labelOffset, sideLabels[0]],
            [-labelOffset, STANDARD.height/2, sideLabels[1]],
            [STANDARD.base/2 + diagonalOffset, STANDARD.height/2 + labelOffset, sideLabels[2]]
          ];
      }
      
      labelPositions.forEach(([x, y, text]) => {
        board.create('text', [x, y, text], {
          fontSize: 14 * scale,
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle',
          color: '#000000' // Ensure black text for visibility
        });
      });
      
      if (showRightAngle) {
        board.create('angle', [p2, p1, p3], {
          radius: 0.5 * scale,
          orthotype: 'square',
          fillColor: 'none',
          strokeWidth: 1,
          fixed: true
        });
      }
    } catch (error) {
      console.error('Error creating triangle:', error);
    }
    
    board.unsuspendUpdate();
  };

  // Improved bounding box to ensure triangle is fully visible
  const getBoundingBox = () => {
    let bb;
    switch (actualOrientation) {
      case 'rotate90':
        bb = [-1, 8, 7, -1];
        break;
      case 'rotate180':
        bb = [-1, 5, 7, -1];
        break;
      case 'rotate270':
        bb = [-1, 5, 7, -1];
        break;
      default:
        bb = [-1, 7, 5, -1];
    }
    return bb.map(v => v * scale);
  };

  return (
    <div className="w-full h-full" style={{ maxHeight: `${containerHeight}px` }}>
      <JSXGraphBoard
        id={boardId}
        boundingBox={getBoundingBox()}
        height={containerHeight}
        backgroundColor="transparent"
        axis={false}
        onUpdate={updateBoard}
        dependencies={[base, height, labels, actualOrientation, scale]}
      />
    </div>
  );
};

export default RightTriangle;