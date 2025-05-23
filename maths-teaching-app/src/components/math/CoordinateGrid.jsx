// src/components/math/visualizations/CoordinateGrid.jsx
import React, { useRef, useEffect } from 'react';
import JSXGraphBoard from './JSXGraphBoard';
/**
 * A generic coordinate grid visualization component
 * Renders only basic elements: grid, axes, points, and segments
 * 
 * @param {Object} props - Props from coordinateFactory
 */
const CoordinateGrid = (props) => {
  // Extract props with defaults
  const {
    points = [[0, 0]],
    pointLabels = ["O"],
    segments = [],
    showGrid = true,
    showAxes = true,
    gridSize = 6,
    sectionType = 'default',
    containerHeight = 300,
    style = {},
    // Optional callback for custom drawings
    onBoardCreated = null
  } = props;

  // Extract style properties with defaults
  const {
    pointColors = Array(points.length).fill('#666666'),
    segmentColors = Array(segments.length).fill('#666666'),
    gridColor = '#cccccc',  // Darker grid lines
    axisColor = '#666666',
    strokeWidth = 2,
    opacity = 0.9
  } = style;

  // Reference to the board
  const boardRef = useRef(null);

  // JSXGraph board initialization
  const initBoard = (board) => {
    // Store reference to the board
    boardRef.current = board;

    // Create grid if showGrid is true
    if (showGrid) {
      for (let x = -gridSize; x <= gridSize; x++) {
        if (x === 0) continue; // Skip the axis line
        board.create('line',
          [[x, -gridSize], [x, gridSize]],
          {
            straightFirst: false,
            straightLast: false,
            strokeColor: gridColor,
            strokeWidth: 1,
            dash: 1,
            fixed: true,
            highlight: false
          }
        );
      }

      for (let y = -gridSize; y <= gridSize; y++) {
        if (y === 0) continue; // Skip the axis line
        board.create('line',
          [[-gridSize, y], [gridSize, y]],
          {
            straightFirst: false,
            straightLast: false,
            strokeColor: gridColor,
            strokeWidth: 1,
            dash: 1,
            fixed: true,
            highlight: false
          }
        );
      }
    }

    // Create axes if showAxes is true
    if (showAxes) {
      // Step 1: Create axis lines that stop at grid boundaries
      // X-axis as a segment (not a full axis)
      board.create('segment', [[-gridSize, 0], [gridSize, 0]], {
        strokeColor: axisColor,
        strokeWidth: 2,
        highlight: false,
        fixed: true,
        name: 'xAxis'
      });

      // Y-axis as a segment (not a full axis)
      board.create('segment', [[0, -gridSize], [0, gridSize]], {
        strokeColor: axisColor,
        strokeWidth: 2,
        highlight: false,
        fixed: true,
        name: 'yAxis'
      });

      // Step 2: Add arrows at the ends of the axes
      // X-axis arrow
      board.create('arrow', [[gridSize - 0.7, 0], [gridSize, 0]], {
        strokeColor: axisColor,
        strokeWidth: 2,
        highlight: false,
        fixed: true
      });

      // Y-axis arrow
      board.create('arrow', [[0, gridSize - 0.7], [0, gridSize]], {
        strokeColor: axisColor,
        strokeWidth: 2,
        highlight: false,
        fixed: true
      });

      // Step 3: Add axis labels (x and y)
      // X-axis label
      board.create('text', [gridSize - 0.5, -0.5, "x"], {
        fontSize: 16,
        color: axisColor,
        fixed: true
      });

      // Y-axis label
      board.create('text', [0.5, gridSize - 0.5, "y"], {
        fontSize: 16,
        color: axisColor,
        fixed: true
      });

      // Step 4: Add numeric labels for the axes
      // X-axis numeric labels
      for (let x = -gridSize; x <= gridSize; x++) {
        if (x !== 0) { // Skip origin
          // Add tick mark
          board.create('segment', [[x, -0.1], [x, 0.1]], {
            strokeColor: axisColor,
            strokeWidth: 1,
            fixed: true
          });
          // Add number label
          board.create('text', [x, -0.2, x.toString()], {
            anchorX: 'middle',
            anchorY: 'top',
            fontSize: 10,  // Smaller font
            color: axisColor,
            fixed: true
          });
        }
      }

      // Y-axis numeric labels
      for (let y = -gridSize; y <= gridSize; y++) {
        if (y !== 0) { // Skip origin
          // Add tick mark
          board.create('segment', [[-0.1, y], [0.1, y]], {
            strokeColor: axisColor,
            strokeWidth: 1,
            fixed: true
          });
          // Add number label
          board.create('text', [-0.2, y, y.toString()], {
            anchorX: 'right',
            anchorY: 'middle',
            fontSize: 10,  // Smaller font
            color: axisColor,
            fixed: true
          });
        }
      }

      // Origin label (0)
      board.create('text', [-0.2, -0.2, "0"], {
        anchorX: 'right',
        anchorY: 'top',
        fontSize: 10,  // Smaller font
        color: axisColor,
        fixed: true
      });
    }
    

    // Create points
    const jsxPoints = points.map((coords, index) => {
      return board.create('point', coords, {
        name: pointLabels[index] || '',
        size: 4,
        fixed: true,
        strokeColor: pointColors[index] || pointColors[0] || '#666666',
        fillColor: pointColors[index] || pointColors[0] || '#666666',
        label: {
          offset: [10, 10],
          color: pointColors[index] || pointColors[0] || '#666666'
        }
      });
    });

    // Create segments
    segments.forEach((segmentPoints, index) => {
      const [p1Index, p2Index] = segmentPoints;
      if (jsxPoints[p1Index] && jsxPoints[p2Index]) {
        board.create('segment', [jsxPoints[p1Index], jsxPoints[p2Index]], {
          strokeColor: segmentColors[index] || segmentColors[0] || '#666666',
          strokeWidth: strokeWidth,
          fixed: true
        });
      }
    });

    // Call the onBoardCreated callback if provided
    // This allows topic-specific customizations without polluting the generic component
    if (onBoardCreated && typeof onBoardCreated === 'function') {
      onBoardCreated(board, jsxPoints);
    }
  };

  // Generate a unique ID for the board
  const boardId = `coordinate-grid-${Math.random().toString(36).substr(2, 9)}`;

  // Set the bounding box to the gridSize
  const boundingBox = [-gridSize, gridSize, gridSize, -gridSize];

  return (
    <div className="coordinate-grid" style={{ width: '100%', height: `${containerHeight}px` }}>
      <JSXGraphBoard
        id={boardId}
        boundingBox={boundingBox}
        axis={false}  // We'll create our own axes
        grid={false}  // We'll create our own grid
        containerHeight={containerHeight}
        backgroundColor="#f9f9f9"  // Light gray background
        onMount={initBoard}
        sectionType={sectionType}
      />
    </div>
  );
};

export default CoordinateGrid;