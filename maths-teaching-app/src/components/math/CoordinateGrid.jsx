// maths-teaching-app/src/components/math/CoordinateGrid.jsx
import React from 'react';
import JSXGraphBoard from './JSXGraphBoard';

const CoordinateGrid = ({
  id = `coordinate-grid-${Math.random().toString(36).substr(2, 9)}`,
  boundingBox = [-6, 6, 6, -6],
  height = 300,
  showGrid = true,
  showAxes = true,
  points = [],
  lines = [],
  backgroundColor = "transparent"
}) => {
  
  // Function that gets called when the board is created
  const onMountBoard = (board) => {
    if (!board) return;
    
    if (showGrid) {
      // Create a simple grid
      for (let x = Math.ceil(boundingBox[0]); x <= Math.floor(boundingBox[2]); x++) {
        if (x === 0) continue; // Skip axis line
        board.create('line', [[x, boundingBox[1]], [x, boundingBox[3]]], {
          strokeColor: '#ddd',
          strokeWidth: 1,
          fixed: true,
          highlight: false,
          straightFirst: true,
          straightLast: true,
          firstArrow: false,
          lastArrow: false,
          withLabel: false,
          name: ''
        });
      }
      
      for (let y = Math.ceil(boundingBox[1]); y <= Math.floor(boundingBox[3]); y++) {
        if (y === 0) continue; // Skip axis line
        board.create('line', [[boundingBox[0], y], [boundingBox[2], y]], {
          strokeColor: '#ddd',
          strokeWidth: 1,
          fixed: true,
          highlight: false,
          straightFirst: true,
          straightLast: true,
          firstArrow: false,
          lastArrow: false,
          withLabel: false,
          name: ''
        });
      }
    }
    
    if (showAxes) {
      // Create x and y axes with very explicit styling
      const xAxis = board.create('line', [
        [boundingBox[0], 0],
        [boundingBox[2], 0]
      ], {
        strokeColor: '#444',
        strokeWidth: 2,
        fixed: true,
        highlight: false,
        straightFirst: true,
        straightLast: true,
        firstArrow: false,
        lastArrow: true,
        withLabel: false,
        name: ''
      });
      
      const yAxis = board.create('line', [
        [0, boundingBox[1]],
        [0, boundingBox[3]]
      ], {
        strokeColor: '#444',
        strokeWidth: 2,
        fixed: true,
        highlight: false,
        straightFirst: true,
        straightLast: true,
        firstArrow: false,
        lastArrow: true,
        withLabel: false,
        name: ''
      });
      
      // Add tick marks and numbers
      for (let x = Math.ceil(boundingBox[0]); x <= Math.floor(boundingBox[2]); x++) {
        if (x === 0) continue; // Skip origin
        board.create('text', [x, -0.3, `${x}`], {
          fontSize: 10,
          fixed: true,
          anchorX: 'middle',
          anchorY: 'top'
        });
      }
      
      for (let y = Math.ceil(boundingBox[1]); y <= Math.floor(boundingBox[3]); y++) {
        if (y === 0) continue; // Skip origin
        board.create('text', [-0.3, y, `${y}`], {
          fontSize: 10,
          fixed: true,
          anchorX: 'right',
          anchorY: 'middle'
        });
      }
      
      // Origin label
      board.create('text', [0.3, 0.3, "O"], {
        fontSize: 10,
        fixed: true,
        anchorX: 'left',
        anchorY: 'bottom'
      });
    }
  };
  
  // Update the board with points and lines
  const updateBoard = (board) => {
    if (!board) return;
    
    // Clear previous points and lines but keep grid/axes
    Object.keys(board.objects).forEach(id => {
      const obj = board.objects[id];
      if (obj && 
          obj.elType !== 'axis' && 
          obj.elType !== 'ticks' &&
          !obj.visProp?.isGrid) {
        try {
          board.removeObject(obj);
        } catch (e) {
          // Ignore errors
        }
      }
    });
    
    // Create points
    const boardPoints = points.map(point => {
      return board.create('point', point.coordinates, {
        name: point.label || '',
        fixed: true,
        color: point.color || '#3498db',
        size: point.size || 4,
        withLabel: !!point.label, // Only show label if one is provided
        label: { 
          offset: point.labelOffset || [10, 10],
          color: point.color || '#3498db'
        }
      });
    });
    
    // Create lines between points
    lines.forEach(line => {
      const from = line.from !== undefined ? boardPoints[line.from] : line.fromCoords;
      const to = line.to !== undefined ? boardPoints[line.to] : line.toCoords;
      
      board.create('segment', [from, to], {
        strokeColor: line.color || '#9b59b6',
        strokeWidth: line.width || 2,
        dash: line.dash ? 2 : 0,
        fixed: true
      });
    });
  };
  
  return (
    <div className="coordinate-grid-container" style={{ width: '100%', height: `${height}px` }}>
      <JSXGraphBoard
        id={id}
        boundingBox={boundingBox}
        axis={false}  // We'll create our own axes with onMount
        grid={false}  // We'll create our own grid with onMount
        height={height}
        backgroundColor={backgroundColor}
        onMount={onMountBoard}
        onUpdate={updateBoard}
        dependencies={[JSON.stringify(points), JSON.stringify(lines)]}
      />
    </div>
  );
};

export default CoordinateGrid;