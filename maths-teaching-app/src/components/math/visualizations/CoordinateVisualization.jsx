// src/components/math/visualizations/CoordinateVisualization.jsx
import React, { useState, useEffect } from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import _ from 'lodash';

/**
 * A reusable coordinate visualization component using JSXGraph
 * Can be used for coordinate geometry problems, distance calculations, etc.
 * 
 * @param {Object} props
 * @param {Array} props.point1 - First point coordinates [x, y]
 * @param {Array} props.point2 - Second point coordinates [x, y]
 * @param {boolean} props.showSolution - Whether to show the solution construction (right triangle)
 * @param {string} props.point1Label - Label for point1 (default: "A")
 * @param {string} props.point2Label - Label for point2 (default: "B")
 * @param {boolean} props.showGrid - Whether to show the grid (default: true)
 * @param {boolean} props.showAxes - Whether to show the axes (default: true)
 * @param {number} props.gridSize - Size of the grid, e.g. 6 means -6 to 6 (default: 6)
 * @param {number} props.height - Height of the visualization (default: 300)
 * @param {function} props.onPointsChange - Callback when points are changed (if draggable)
 * @param {boolean} props.draggable - Whether points can be dragged (default: false)
 * @param {string} props.displayDistance - How to display the distance: "none", "decimal", "exact", "surd" (default: "decimal")
 */
const CoordinateVisualization = ({
  point1 = [1, 1],
  point2 = [4, 5],
  showSolution = false,
  point1Label = "A",
  point2Label = "B",
  showGrid = true,
  showAxes = true,
  gridSize = 6,
  height = 300,
  onPointsChange = null,
  draggable = false,
  displayDistance = "decimal"
}) => {
  // State to track points internally if draggable
  const [internalPoint1, setInternalPoint1] = useState(point1);
  const [internalPoint2, setInternalPoint2] = useState(point2);
  
  // Update internal points when props change
  useEffect(() => {
    setInternalPoint1(point1);
    setInternalPoint2(point2);
  }, [point1, point2]);
  
  // Function to check if a number is a perfect square
  const isPerfectSquare = (num) => {
    const sqrt = Math.sqrt(num);
    return sqrt === Math.floor(sqrt);
  };
  
  // Function to get the simplified radical form
  const getRadicalForm = (num) => {
    // Check if perfect square first
    if (isPerfectSquare(num)) {
      return Math.sqrt(num).toString();
    }
    
    // Find the largest perfect square factor
    let radical = num;
    let coefficient = 1;
    
    // Look for perfect square factors
    for (let i = 2; i * i <= num; i++) {
      while (num % (i * i) === 0) {
        coefficient *= i;
        num /= (i * i);
      }
    }
    
    radical = num;
    
    // Format the result
    if (coefficient === 1) {
      return `\\sqrt{${radical}}`;
    } else {
      return `${coefficient}\\sqrt{${radical}}`;
    }
  };
  
  // Calculate distance between points
  const calculateDistance = () => {
    const p1 = internalPoint1;
    const p2 = internalPoint2;
    
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    
    // Calculate exact distance
    const squaredSum = dx * dx + dy * dy;
    const exactDistance = Math.sqrt(squaredSum);
    
    // Return formatted distance based on displayDistance prop
    switch (displayDistance) {
      case "none":
        return null;
      case "exact":
        // For integer values or well-known Pythagorean triples
        if (Number.isInteger(exactDistance)) {
          return exactDistance.toString();
        } else {
          return exactDistance.toFixed(2);
        }
      case "surd":
        // Return in simplified radical form
        return getRadicalForm(squaredSum);
      case "decimal":
      default:
        // Return rounded to 2 decimal places
        return Math.round(exactDistance * 100) / 100;
    }
  };
  
  // Format the distance label
  const getDistanceLabel = () => {
    const distance = calculateDistance();
    if (distance === null) return null;
    
    // If displayDistance is surd, use MathJax
    if (displayDistance === "surd" && !Number.isInteger(Math.sqrt(distance))) {
      return distance;
    }
    
    return distance.toString();
  };
  
  // JSXGraph board initialization function
  const onMountBoard = (board) => {
    // Create grid lines if showGrid is true
    if (showGrid) {
      // Create custom grid explicitly
      for (let x = -gridSize; x <= gridSize; x++) {
        const gridLine = board.create('line', 
          [[x, -gridSize], [x, gridSize]], 
          {
            strokeColor: '#dddddd',
            strokeWidth: 1,
            fixed: true,
            highlight: false,
            straightFirst: false,
            straightLast: false,
            firstArrow: false,
            lastArrow: false,
            hasGrid: true,  // Mark as grid for identification
            name: `grid-x-${x}`  // Give it a unique name for identification
          }
        );
      }
      
      for (let y = -gridSize; y <= gridSize; y++) {
        const gridLine = board.create('line', 
          [[-gridSize, y], [gridSize, y]], 
          {
            strokeColor: '#dddddd',
            strokeWidth: 1,
            fixed: true,
            highlight: false,
            straightFirst: false,
            straightLast: false,
            firstArrow: false,
            lastArrow: false,
            hasGrid: true,  // Mark as grid for identification
            name: `grid-y-${y}`  // Give it a unique name for identification
          }
        );
      }
    }
    
    // Create axes with thicker lines if showAxes is true
    if (showAxes) {
      // X-axis as a segment (not a line)
      board.create('segment', [[-gridSize, 0], [gridSize, 0]], {
        strokeColor: '#666666',
        strokeWidth: 2,
        fixed: true,
        highlight: false,
        name: 'xAxis'
      });
      
      // Y-axis as a segment (not a line)
      board.create('segment', [[0, -gridSize], [0, gridSize]], {
        strokeColor: '#666666',
        strokeWidth: 2,
        fixed: true,
        highlight: false,
        name: 'yAxis'
      });
      
      // Add axis labels
      for (let x = -gridSize; x <= gridSize; x++) {
        if (x !== 0) {
          board.create('text', [x, -0.3, x.toString()], {
            fixed: true,
            anchorX: 'middle',
            anchorY: 'top',
            fontSize: 14,
            hasLabel: true
          });
        }
      }
      
      for (let y = -gridSize; y <= gridSize; y++) {
        if (y !== 0) {
          board.create('text', [-0.3, y, y.toString()], {
            fixed: true,
            anchorX: 'right',
            anchorY: 'middle',
            fontSize: 14,
            hasLabel: true
          });
        }
      }
      
      // Add origin label
      board.create('text', [-0.3, -0.3, '0'], {
        fixed: true,
        anchorX: 'right',
        anchorY: 'top',
        fontSize: 14,
        hasLabel: true
      });
    }
  };
  
  // JSXGraph board update function
  const updateBoard = (board) => {
    board.suspendUpdate();
    
    try {
      // *** FIX FOR GHOST EFFECT: Clear all existing objects except grid, axes, and labels ***
      const elements = Object.values(board.objects);
      elements.forEach(el => {
        if (el && el.remove && 
            !el.hasGrid && 
            !(el.name === 'xAxis' || el.name === 'yAxis') && 
            !el.hasLabel) {
          try {
            board.removeObject(el);
          } catch (e) {
            // Ignore errors during removal
          }
        }
      });
      
      // *** FIX FOR LINES EXTENDING BEYOND BOUNDS ***
      // Create points
      const p1 = board.create('point', internalPoint1, {
        name: point1Label,
        fixed: !draggable,
        color: '#e74c3c', // Red
        size: 4,
        label: { 
          offset: [10, 10],
          strokeColor: '#e74c3c'
        },
        // Settings for draggable points
        snapToGrid: draggable,
        snapSizeX: 1, 
        snapSizeY: 1
      });
      
      const p2 = board.create('point', internalPoint2, {
        name: point2Label,
        fixed: !draggable,
        color: '#3498db', // Blue
        size: 4,
        label: { 
          offset: [10, 10],
          strokeColor: '#3498db'
        },
        // Settings for draggable points
        snapToGrid: draggable,
        snapSizeX: 1, 
        snapSizeY: 1
      });
      
      // Add point move event listeners if draggable
      if (draggable && onPointsChange) {
        p1.on('drag', function() {
          // Enforce limits without using bounded property
          const x = Math.max(-gridSize, Math.min(gridSize, p1.X()));
          const y = Math.max(-gridSize, Math.min(gridSize, p1.Y()));
          p1.moveTo([x, y]);
          
          // Update internal state
          setInternalPoint1([x, y]);
          
          // Call the callback
          onPointsChange([x, y], [p2.X(), p2.Y()]);
        });
        
        p2.on('drag', function() {
          // Enforce limits without using bounded property
          const x = Math.max(-gridSize, Math.min(gridSize, p2.X()));
          const y = Math.max(-gridSize, Math.min(gridSize, p2.Y()));
          p2.moveTo([x, y]);
          
          // Update internal state
          setInternalPoint2([x, y]);
          
          // Call the callback
          onPointsChange([p1.X(), p1.Y()], [x, y]);
        });
      }
      
      // Create line between points as a SEGMENT (not line)
      const line = board.create('segment', [p1, p2], {
        strokeColor: '#9b59b6', // Purple
        strokeWidth: 2,
        fixed: true
      });
      
      // Add distance label
      const distanceValue = getDistanceLabel();
      if (distanceValue !== null) {
        // Position label at the middle of the segment
        const midX = (internalPoint1[0] + internalPoint2[0]) / 2;
        const midY = (internalPoint1[1] + internalPoint2[1]) / 2;
        
        // Add small offset to avoid overlapping with the line
        const offsetX = 0.3;
        const offsetY = 0.3;
        
        // Create the distance label
        board.create('text', [midX + offsetX, midY + offsetY, distanceValue], {
          fontSize: 16,
          color: '#9b59b6', // Purple to match the line
          fixed: true,
          useLatex: displayDistance === "surd" // Use LaTeX for surd display
        });
      }
      
      // Create the right triangle construction if showing solution
      if (showSolution) {
        // Calculate differences
        const dx = internalPoint2[0] - internalPoint1[0];
        const dy = internalPoint2[1] - internalPoint1[1];
        
        // Create right angle point C
        const rightAnglePoint = board.create('point', [internalPoint2[0], internalPoint1[1]], {
          name: 'C',
          fixed: true,
          color: '#2ecc71', // Green
          size: 4,
          label: { 
            offset: [10, -10],
            strokeColor: '#2ecc71'
          }
        });
        
        // Create horizontal and vertical segments for the right triangle
        const horizontalLine = board.create('segment', [p1, rightAnglePoint], {
          strokeColor: '#2ecc71', // Green
          strokeWidth: 2,
          dash: 2
        });
        
        const verticalLine = board.create('segment', [rightAnglePoint, p2], {
          strokeColor: '#2ecc71', // Green
          strokeWidth: 2,
          dash: 2
        });
        
        // Add right angle marker
        board.create('angle', [p2, rightAnglePoint, p1], {
          radius: 0.25,
          name: '90°',
          type: 'square',
          fillColor: '#2ecc71',
          fillOpacity: 0.4,
          label: { offset: [0, 0] }
        });
        
        // Add dimension labels for the triangle sides
        board.create('text', [
          (internalPoint1[0] + internalPoint2[0]) / 2,
          internalPoint1[1] - 0.5,
          `a = ${Math.abs(dx).toFixed(1)}`
        ], { 
          fontSize: 14,
          fixed: true,
          color: '#2ecc71' // Green
        });
        
        board.create('text', [
          internalPoint2[0] + 0.5,
          (internalPoint1[1] + internalPoint2[1]) / 2,
          `b = ${Math.abs(dy).toFixed(1)}`
        ], { 
          fontSize: 14,
          fixed: true,
          color: '#2ecc71' // Green
        });
      }
    } catch (error) {
      console.error("Error updating CoordinateVisualization board:", error);
    }
    
    board.unsuspendUpdate();
  };

  // Ensure board has unique ID
  const boardId = `coordinate-visualization-${Math.random().toString(36).substr(2, 9)}`;
  
  // Set the bounding box to the gridSize
  const boundingBox = [-gridSize, gridSize, gridSize, -gridSize];
  
  return (
    <div className="coordinate-visualization" style={{ width: '100%', height: `${height}px` }}>
      <JSXGraphBoard
        id={boardId}
        boundingBox={boundingBox}
        axis={false}  // Disable default axes
        grid={false}  // Disable default grid
        height={height}
        backgroundColor="#f9f9f9"  // Light gray background
        onMount={onMountBoard}
        onUpdate={updateBoard}
        dependencies={[internalPoint1, internalPoint2, showSolution, displayDistance, point1Label, point2Label]}
      />
    </div>
  );
};

export default CoordinateVisualization;