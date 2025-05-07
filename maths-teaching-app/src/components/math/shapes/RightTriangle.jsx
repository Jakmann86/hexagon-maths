// maths-teaching-app/src/components/math/shapes/RightTriangle.jsx
import React, { useRef, useEffect, memo } from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { STANDARD_SHAPES } from '../../../config/standardShapes';

// Memoize the entire component to prevent unnecessary re-renders
const RightTriangle = memo(({
  base = 3,
  height = 4,
  showRightAngle = true,
  labelStyle = 'numeric', // 'numeric', 'algebraic', or 'custom'
  labels = [],
  units = 'cm',
  style = {},
  orientation = 'default',
  containerHeight = 250,
  labelPositions = null,
}) => {
  // Create stable board ID using a ref that doesn't change between renders
  const boardIdRef = useRef(`right-triangle-${Math.random().toString(36).substr(2, 9)}`);
  
  // Calculate hypotenuse
  const hypotenuse = Math.sqrt(base * base + height * height);
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Handle random orientation only once on mount
  const orientationRef = useRef(
    orientation === 'random' 
      ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
      : orientation
  );

  // Store the JSXGraph board reference
  const boardRef = useRef(null);

  // Update function that gets called by JSXGraphBoard
  const updateBoard = (board) => {
    // Store the board reference
    boardRef.current = board;
    
    // Clear existing objects - more safely using suspendUpdate
    board.suspendUpdate();
    try {
      Object.keys(board.objects).forEach(id => {
        try {
          board.removeObject(board.objects[id]);
        } catch (e) {}
      });
    } catch (error) {
      console.error("Error clearing board:", error);
    }
    
    try {
      // Extract styling options with defaults
      const {
        fillColor = '#3F51B5',
        fillOpacity = 0.2,
        strokeColor = '#3F51B5',
        strokeWidth = 2
      } = style;
      
      // Define four standard orientations with points
      // Right angle is always at the first point for consistent angle marking
      const orientations = {
        default: [
          [0, 0],        // Right angle at origin
          [base, 0],     // Horizontal leg
          [0, height]    // Vertical leg
        ],
        rotate90: [
          [0, 0],        // Right angle at origin
          [0, base],     // Vertical leg (was horizontal)
          [height, 0]    // Horizontal leg (was vertical)
        ],
        rotate180: [
          [base, height], // Right angle at top-right
          [0, height],    // Horizontal leg
          [base, 0]       // Vertical leg
        ],
        rotate270: [
          [height, base], // Right angle at bottom-right
          [height, 0],    // Vertical leg
          [0, base]       // Horizontal leg
        ]
      };
      
      // Get points for selected orientation
      const actualOrientation = orientationRef.current;
      const points = orientations[actualOrientation] || orientations.default;
      
      // Create triangle points (fixed and invisible)
      const trianglePoints = points.map(p => 
        board.create('point', p, { visible: false, fixed: true })
      );
      
      // Create the triangle
      board.create('polygon', trianglePoints, {
        fillColor,
        fillOpacity, 
        strokeColor,
        strokeWidth,
        vertices: { visible: false }
      });
      
      // Determine side labels based on labelStyle
      let sideLabels;
      if (labelStyle === 'numeric') {
        // Label order always matches sides: base, height, hypotenuse
        sideLabels = [
          `${base} ${units}`,
          `${height} ${units}`,
          `${roundedHypotenuse} ${units}`
        ];
      } else if (labelStyle === 'algebraic') {
        sideLabels = ['a', 'b', 'c'];
      } else if (labelStyle === 'custom' && Array.isArray(labels) && labels.length > 0) {
        sideLabels = [...labels];
        while (sideLabels.length < 3) sideLabels.push('');
      } else {
        sideLabels = ['', '', ''];
      }
      
      // Use custom label positions if provided, otherwise calculate automatically
      if (labelPositions && labelPositions[actualOrientation]) {
        // Use custom positions for this orientation
        const customPositions = labelPositions[actualOrientation];
        
        sideLabels.forEach((label, index) => {
          if (!label || !customPositions[index]) return;
          
          const { x, y, anchorX = 'middle', anchorY = 'middle' } = customPositions[index];
          
          board.create('text', [x, y, label], {
            fontSize: 14,
            fixed: true,
            anchorX,
            anchorY,
            color: '#000000'
          });
        });
      } else {
        // Use automatic label positioning
        // Add labels to sides
        for (let i = 0; i < 3; i++) {
          if (!sideLabels[i]) continue;
          
          // Define points for this side
          const p1 = trianglePoints[i];
          const p2 = trianglePoints[(i + 1) % 3];
          
          // Find midpoint of side
          const midX = (p1.X() + p2.X()) / 2;
          const midY = (p1.Y() + p2.Y()) / 2;
          
          // Calculate perpendicular offset direction (normal vector)
          const dx = p2.X() - p1.X();
          const dy = p2.Y() - p1.Y();
          const len = Math.sqrt(dx*dx + dy*dy);
          
          // Offset distance proportional to triangle size
          const maxDim = Math.max(base, height);
          const offsetDist = maxDim * 0.1;
          
          // Use perpendicular vector for offset
          const nx = -dy / len * offsetDist;
          const ny = dx / len * offsetDist;
          
          // Create the label text
          board.create('text', [midX + nx, midY + ny, sideLabels[i]], {
            fontSize: 14,
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
      }
      
      // Add right angle marker
      if (showRightAngle) {
        // Create right angle using JSXGraph's built-in angle object
        // The right angle is always at point 0 and between points 1 and 2
        board.create('angle', [
          trianglePoints[2],  // Third point
          trianglePoints[0],  // Right angle (first point)
          trianglePoints[1]   // Second point
        ], {
          radius: Math.min(base, height) * 0.15, // Proportional size
          type: 'square',
          fillColor: 'none',
          strokeWidth: 1.5,
          fixed: true,
          name: '' // No label
        });
      }
    } catch (error) {
      console.error("Error creating triangle:", error);
    }
    
    board.unsuspendUpdate();
  };
  
  // Calculate appropriate bounding box
  const getBoundingBox = () => {
    const maxDim = Math.max(base, height);
    const padding = maxDim * 0.2;
    
    // Create a bounding box with sufficient padding
    return [-padding, maxDim + padding, maxDim + padding, -padding];
  };

  // Clean up the board when component unmounts or boundingBox changes
  useEffect(() => {
    return () => {
      if (boardRef.current) {
        try {
          // Attempts to clean up properly on unmount
          JXG.JSXGraph.freeBoard(boardRef.current);
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <JSXGraphBoard
        id={boardIdRef.current}
        boundingBox={getBoundingBox()}
        height={containerHeight}
        backgroundColor="transparent"
        axis={false}
        onUpdate={updateBoard}
        // Stable JSON.stringify to avoid unnecessary updates
        dependencies={[
          base, 
          height, 
          labelStyle, 
          showRightAngle,
          // These are stable so no need to include in dependencies
          // orientation, labelPositions, JSON.stringify(labels)
        ]}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Deep comparison for complex objects to avoid unnecessary re-renders
  // Only re-render if these specific props change
  return (
    prevProps.base === nextProps.base &&
    prevProps.height === nextProps.height &&
    prevProps.showRightAngle === nextProps.showRightAngle &&
    prevProps.labelStyle === nextProps.labelStyle &&
    prevProps.containerHeight === nextProps.containerHeight &&
    // For complex objects, do a shallow string comparison
    JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style) &&
    JSON.stringify(prevProps.labels) === JSON.stringify(nextProps.labels)
  );
});

// Ensure displayName is set for dev tools
RightTriangle.displayName = 'RightTriangle';

export default RightTriangle;