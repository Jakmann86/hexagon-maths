import React from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { STANDARD_SHAPES } from '../../../config/standardShapes';

const Square = ({
  sideLength = 4,
  showDimensions = false,
  showArea = false,
  areaLabel = '',
  units = '',
  style = {},
  customLabels = {},
  containerHeight = 250,
  showSideLabels = true // New prop to control side labels
}) => {
  const STANDARD = STANDARD_SHAPES.square;
  const boardId = `square-standard`;

  const updateBoard = (board) => {
    Object.keys(board.objects).forEach(id => {
      board.removeObject(id);
    });
    
    board.suspendUpdate();
    
    const {
      fillColor = '#3498db',
      fillOpacity = 0.2,
      strokeColor = '#3498db',
      strokeWidth = 2
    } = style;
    
    // Create square with no visible vertices
    const points = [
      [0, 0],
      [STANDARD.size, 0],
      [STANDARD.size, STANDARD.size],
      [0, STANDARD.size]
    ];
    
    const squarePoints = points.map(point => 
      board.create('point', point, { visible: false, fixed: true })
    );
    
    board.create('polygon', squarePoints, {
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      strokeColor: strokeColor,
      strokeWidth: strokeWidth,
      vertices: { visible: false }
    });
    
    const sideLabel = customLabels.side || (sideLength === '?' ? '?' : `${sideLength} ${units}`);
    const areaDisplayLabel = customLabels.area || 
      (areaLabel || (sideLength !== '?' ? `${sideLength * sideLength} ${units}²` : `?`));
    
    if (showDimensions && showSideLabels) {
      // Bottom side label only
      board.create('text', [STANDARD.size/2, -0.5, sideLabel], {
        fontSize: 14,
        fixed: true,
        anchorX: 'middle'
      });
    }
    
    if (showArea) {
      board.create('text', [STANDARD.size/2, STANDARD.size/2, areaDisplayLabel], {
        fontSize: 14,
        fixed: true,
        anchorX: 'middle',
        anchorY: 'middle'
      });
    }
    
    board.unsuspendUpdate();
  };

  return (
    <div className="w-full h-full">
      <JSXGraphBoard
        id={boardId}
        boundingBox={STANDARD.boundingBox}
        height={containerHeight}
        backgroundColor="transparent"
        axis={false}
        onUpdate={updateBoard}
        dependencies={[sideLength, showDimensions, showArea, customLabels, showSideLabels]}
      />
    </div>
  );
};

export default Square;