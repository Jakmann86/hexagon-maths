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
  const boardId = `right-triangle-standard-${actualOrientation}-${scale}`;

  const updateBoard = (board) => {
    const objectIds = Object.keys(board.objects);
    for (let i = objectIds.length - 1; i >= 0; i--) {
      board.removeObject(board.objects[objectIds[i]]);
    }
    
    board.suspendUpdate();
    
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
    
    // Fixed label positions for all orientations
    let labelPositions;
    switch (actualOrientation) {
      case 'rotate90':
        labelPositions = [
          [STANDARD.height + 0.8, STANDARD.base/2, sideLabels[0]], // base label
          [STANDARD.height/2, -0.5, sideLabels[1]], // height label (right side)
          [STANDARD.height/2 + 1.5, STANDARD.base/2 + 1, sideLabels[2]] // hypotenuse (right and up)
        ];
        break;
      case 'rotate180':
        labelPositions = [
          [STANDARD.base/2, STANDARD.height + 0.5, sideLabels[0]], // base label (top)
          [STANDARD.base + 0.8, STANDARD.height/2, sideLabels[1]], // height label (right)
          [STANDARD.base/2 - 1.5, STANDARD.height/2 + 1, sideLabels[2]] // hypotenuse (left and up)
        ];
        break;
      case 'rotate270':
        labelPositions = [
          [-0.8, STANDARD.base/2, sideLabels[0]], // base label (left)
          [STANDARD.height/2, STANDARD.base + 0.5, sideLabels[1]], // height label (bottom)
          [STANDARD.height/2 - 1.5, STANDARD.base/2 + 1, sideLabels[2]] // hypotenuse (left and up)
        ];
        break;
      default:
        labelPositions = [
          [STANDARD.base/2, -0.5, sideLabels[0]], // base label (bottom)
          [-0.8, STANDARD.height/2, sideLabels[1]], // height label (left)
          [STANDARD.base/2 + 1.5, STANDARD.height/2 + 1, sideLabels[2]] // hypotenuse (right and up)
        ];
    }
    
    labelPositions.forEach(([x, y, text]) => {
      board.create('text', [x, y, text], {
        fontSize: 14 * scale,
        fixed: true,
        anchorX: 'middle',
        anchorY: 'middle'
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
    
    board.unsuspendUpdate();
  };

  return (
    <div className="w-full h-full" style={{ maxHeight: `${containerHeight}px` }}>
      <JSXGraphBoard
        id={boardId}
        boundingBox={STANDARD.boundingBox}
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