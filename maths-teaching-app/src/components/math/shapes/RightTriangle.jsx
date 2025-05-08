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
      
      // IMPROVED LABEL POSITIONING: Define fixed positions for each orientation
      // Scale offsets based on triangle size for better positioning
      
      // For better height label positioning - move it further out from the triangle
      const heightOffset = Math.max(1.0, Math.min(base, height) * 0.25);
      
      // For better base label positioning
      const baseOffset = Math.max(0.8, Math.min(base, height) * 0.2);
      
      // Hypotenuse label should be outside the triangle, not in the center
      // Calculate the midpoint of the hypotenuse
      const getMidpoint = (p1, p2) => [(p1[0] + p2[0])/2, (p1[1] + p2[1])/2];
      
      // Get vectors for positioning hypotenuse label
      const hypLabelPositionByOrientation = {
        default: () => {
          // Find midpoint of hypotenuse
          const midpoint = getMidpoint([0, height], [base, 0]);
          // Calculate perpendicular offset in outward direction
          return [midpoint[0] + 0.6, midpoint[1] + 0.6]; // Offset outward
        },
        rotate90: () => {
          // Find midpoint of hypotenuse
          const midpoint = getMidpoint([0, base], [height, 0]);
          // Calculate perpendicular offset in outward direction
          return [midpoint[0] + 0.6, midpoint[1] + 0.6]; // Offset outward
        },
        rotate180: () => {
          // Find midpoint of hypotenuse
          const midpoint = getMidpoint([base, height], [0, 0]);
          // Calculate perpendicular offset in outward direction
          return [midpoint[0] - 0.6, midpoint[1] - 0.6]; // Offset outward
        },
        rotate270: () => {
          // Find midpoint of hypotenuse
          const midpoint = getMidpoint([height, base], [0, 0]);
          // Calculate perpendicular offset in outward direction
          return [midpoint[0] - 0.6, midpoint[1] - 0.6]; // Offset outward
        }
      };
      
      // Calculate hypotenuse label position
      const getHypotenusePosition = () => {
        if (hypLabelPositionByOrientation[actualOrientation]) {
          return hypLabelPositionByOrientation[actualOrientation]();
        }
        return [base/2, height/2]; // Default fallback
      };
      
      // New improved label positions by orientation
      const labelPositionsByOrientation = {
        default: [
          { x: base/2, y: -baseOffset }, // Base (move down further)
          { x: -heightOffset, y: height/2 }, // Height (move further left)
          { pos: getHypotenusePosition() } // Hypotenuse (outside the triangle)
        ],
        rotate90: [
          { x: -baseOffset, y: base/2 }, // Base (now on left)
          { x: height/2, y: -heightOffset }, // Height (move down further)
          { pos: getHypotenusePosition() } // Hypotenuse (outside the triangle)
        ],
        rotate180: [
          { x: base/2, y: height + baseOffset }, // Base (top)
          { x: base + heightOffset, y: height/2 }, // Height (move further right)
          { pos: getHypotenusePosition() } // Hypotenuse (outside the triangle)
        ],
        rotate270: [
          { x: height + baseOffset, y: base/2 }, // Base (right)
          { x: height/2, y: base + heightOffset }, // Height (move up further)
          { pos: getHypotenusePosition() } // Hypotenuse (outside the triangle)
        ]
      };
      
      // Use custom positions if provided, otherwise use the improved positioning
      const positions = (labelPositions && labelPositions[actualOrientation]) || 
                         labelPositionsByOrientation[actualOrientation] || 
                         labelPositionsByOrientation.default;
      
      // Create side labels with fixed, optimized positions
      for (let i = 0; i < 3; i++) {
        if (!sideLabels[i]) continue;
        
        const position = positions[i];
        if (!position) continue;
        
        // Special handling for hypotenuse position which uses 'pos' property
        const x = position.pos ? position.pos[0] : position.x;
        const y = position.pos ? position.pos[1] : position.y;
        
        board.create('text', [x, y, sideLabels[i]], {
          fontSize: 14,
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle',
          color: '#000000'
        });
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
    const padding = maxDim * 0.25; // Increased padding
    
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