// maths-teaching-app/src/components/math/shapes/RightTriangle.jsx
import React, { useRef, useEffect, memo } from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { STANDARD_SHAPES, DEFAULT_BOARD_CONFIG } from '../../../config/standardShapes';

/**
 * RightTriangle - A component for rendering right triangles with consistent sizing and labeling
 * Optimized for educational use with standardized dimensions
 */
const RightTriangle = memo(({
  base = 3,
  height = 4,
  showRightAngle = true,
  showAngles = [false, false], // [origin angle, third angle]
  angleLabels = ['θ', 'φ'],    // Labels for the non-right angles
  labelStyle = 'numeric',      // 'numeric', 'algebraic', or 'custom'
  labels = [],
  units = 'cm',
  style = {},
  orientation = 'default',
  containerHeight = 250,
  labelPositions = null,
}) => {
  // Create stable board ID and refs
  const boardIdRef = useRef(`right-triangle-${Math.random().toString(36).substr(2, 9)}`);
  const boardRef = useRef(null);
  
  // Standard dimensions from configuration - using these for consistency
  const STANDARD_BASE = STANDARD_SHAPES.rightTriangle.base;
  const STANDARD_HEIGHT = STANDARD_SHAPES.rightTriangle.height;
  const STANDARD_BOUNDS = STANDARD_SHAPES.rightTriangle.boundingBox;
  
  // Handle random orientation only once on mount
  const orientationRef = useRef(
    orientation === 'random' 
      ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
      : orientation
  );
  
  // Calculate hypotenuse based on the actual input dimensions (for labels)
  const hypotenuse = Math.sqrt(base * base + height * height);
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Update function that gets called by JSXGraphBoard
  const updateBoard = (board) => {
    // Store the board reference
    boardRef.current = board;
    
    // Clear existing objects - safely using suspendUpdate
    board.suspendUpdate();
    try {
      // Clear ALL existing objects
      while (board.objectsList.length > 0) {
        try {
          board.removeObject(board.objectsList[0]);
        } catch (e) { }
      }
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
      // We'll scale the display to match STANDARD dimensions
      // But keep original proportions for consistent visuals
      
      // Calculate scaling factors to fit triangle to standard dimensions
      const scaleX = STANDARD_BASE / Math.max(2, base);  // At least 2 for visibility
      const scaleY = STANDARD_HEIGHT / Math.max(2, height);  // At least 2 for visibility
      
      // Scale the triangle while maintaining proportions
      // But use standard dimensions for the overall size
      const scaledBase = base * scaleX;
      const scaledHeight = height * scaleY;
      
      // Define triangle points based on orientation
      const orientations = {
        default: [
          [0, 0],                // Right angle at origin
          [scaledBase, 0],       // Horizontal leg
          [0, scaledHeight]      // Vertical leg
        ],
        rotate90: [
          [0, 0],                // Right angle at origin
          [0, scaledBase],       // Vertical leg (was horizontal)
          [scaledHeight, 0]      // Horizontal leg (was vertical)
        ],
        rotate180: [
          [scaledBase, scaledHeight], // Right angle at top-right
          [0, scaledHeight],    // Horizontal leg
          [scaledBase, 0]       // Vertical leg
        ],
        rotate270: [
          [scaledHeight, scaledBase], // Right angle at bottom-right
          [scaledHeight, 0],     // Vertical leg
          [0, scaledBase]        // Horizontal leg
        ]
      };
      
      // Get points for selected orientation
      const actualOrientation = orientationRef.current;
      const points = orientations[actualOrientation] || orientations.default;
      
      // Create triangle points WITHOUT LABELS
      const trianglePoints = points.map(p =>
        board.create('point', p, {
          visible: false,
          fixed: true,
          showInfobox: false,
          name: '',
          withLabel: false
        })
      );
      
      // Create the triangle
      board.create('polygon', trianglePoints, {
        fillColor,
        fillOpacity,
        strokeColor,
        strokeWidth,
        vertices: {
          visible: false,
          withLabel: false
        },
        withLabel: false,
        name: ''
      });
      
      // Determine side labels based on labelStyle
      let sideLabels;
      if (labelStyle === 'numeric') {
        // Keep original values in the labels
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
      
      // Fixed label position offsets for consistency
      const LABEL_OFFSETS = {
        base: 0.8,     // Offset for base label
        height: 0.8,   // Offset for height label
        hypotenuse: 0.6 // Offset for hypotenuse label
      };
      
      // Helper function to get midpoint of a line
      const getMidpoint = (p1, p2) => [(p1[0] + p2[0])/2, (p1[1] + p2[1])/2];
      
      // Define standard label positions for each orientation
      const standardLabelPositions = {
        default: [
          { x: scaledBase/2, y: -LABEL_OFFSETS.base }, // Base (below)
          { x: -LABEL_OFFSETS.height, y: scaledHeight/2 }, // Height (left)
          // Hypotenuse (centered with offset)
          { 
            pos: () => {
              const mid = getMidpoint([0, scaledHeight], [scaledBase, 0]);
              return [mid[0] + LABEL_OFFSETS.hypotenuse, mid[1] + LABEL_OFFSETS.hypotenuse];
            }
          }
        ],
        rotate90: [
          { x: -LABEL_OFFSETS.base, y: scaledBase/2 }, // Base (left)
          { x: scaledHeight/2, y: -LABEL_OFFSETS.height }, // Height (below)
          // Hypotenuse
          { 
            pos: () => {
              const mid = getMidpoint([0, scaledBase], [scaledHeight, 0]);
              return [mid[0] + LABEL_OFFSETS.hypotenuse, mid[1] + LABEL_OFFSETS.hypotenuse];
            }
          }
        ],
        rotate180: [
          { x: scaledBase/2, y: scaledHeight + LABEL_OFFSETS.base }, // Base (above)
          { x: scaledBase + LABEL_OFFSETS.height, y: scaledHeight/2 }, // Height (right)
          // Hypotenuse
          { 
            pos: () => {
              const mid = getMidpoint([scaledBase, scaledHeight], [0, 0]);
              return [mid[0] - LABEL_OFFSETS.hypotenuse, mid[1] - LABEL_OFFSETS.hypotenuse];
            }
          }
        ],
        rotate270: [
          { x: scaledHeight + LABEL_OFFSETS.base, y: scaledBase/2 }, // Base (right)
          { x: scaledHeight/2, y: scaledBase + LABEL_OFFSETS.height }, // Height (above)
          // Hypotenuse
          { 
            pos: () => {
              const mid = getMidpoint([scaledHeight, scaledBase], [0, 0]);
              return [mid[0] - LABEL_OFFSETS.hypotenuse, mid[1] - LABEL_OFFSETS.hypotenuse];
            }
          }
        ]
      };
      
      // Get label positions for current orientation
      const positions = standardLabelPositions[actualOrientation] || standardLabelPositions.default;
      
      // Create side labels with fixed positions
      for (let i = 0; i < 3; i++) {
        if (!sideLabels[i]) continue;
        
        const position = positions[i];
        if (!position) continue;
        
        // Handle position function for hypotenuse
        let x, y;
        if (position.pos && typeof position.pos === 'function') {
          const pos = position.pos();
          x = pos[0];
          y = pos[1];
        } else {
          x = position.x;
          y = position.y;
        }
        
        // Create text label
        board.create('text', [x, y, sideLabels[i]], {
          fontSize: 14,
          fixed: true, 
          anchorX: 'middle',
          anchorY: 'middle',
          color: '#000000'
        });
      }
      
      // Add right angle marker if needed
      if (showRightAngle) {
        board.create('angle', [
          trianglePoints[2],  // Third point 
          trianglePoints[0],  // Right angle (first point)
          trianglePoints[1]   // Second point
        ], {
          radius: Math.min(scaledBase, scaledHeight) * 0.15,
          type: 'square',
          fillColor: 'none',
          strokeWidth: 1.5,
          fixed: true,
          name: '',
          withLabel: false
        });
      }
      
      // Add other angle markers if requested
      const angleVisibility = Array.isArray(showAngles) ? showAngles : [showAngles, showAngles];
      
      // Angle marker radiuses - consistent proportions
      const angleRadius = Math.min(scaledBase, scaledHeight) * 0.25;
      
      // Standard angle parameters for each orientation
      const angleConfig = {
        default: {
          angle1: { // Origin angle
            points: [trianglePoints[2], trianglePoints[0], trianglePoints[1]],
            labelOffset: [0.4, 0.4],
            radius: angleRadius * 0.8
          },
          angle2: { // Third angle  
            points: [trianglePoints[0], trianglePoints[2], trianglePoints[1]],
            labelOffset: [-0.4, 0.4],
            radius: angleRadius * 0.7
          }
        },
        rotate90: {
          angle1: {
            points: [trianglePoints[2], trianglePoints[0], trianglePoints[1]],
            labelOffset: [0.4, 0.4],
            radius: angleRadius * 0.8
          },
          angle2: {
            points: [trianglePoints[0], trianglePoints[2], trianglePoints[1]],
            labelOffset: [0.4, -0.4],
            radius: angleRadius * 0.7
          }
        },
        rotate180: {
          angle1: {
            points: [trianglePoints[2], trianglePoints[0], trianglePoints[1]],
            labelOffset: [-0.4, -0.4],
            radius: angleRadius * 0.8
          },
          angle2: {
            points: [trianglePoints[0], trianglePoints[2], trianglePoints[1]],
            labelOffset: [0.4, -0.4],
            radius: angleRadius * 0.7
          }
        },
        rotate270: {
          angle1: {
            points: [trianglePoints[2], trianglePoints[0], trianglePoints[1]],
            labelOffset: [-0.4, 0.4],
            radius: angleRadius * 0.8
          },
          angle2: {
            points: [trianglePoints[0], trianglePoints[2], trianglePoints[1]],
            labelOffset: [-0.4, -0.4],
            radius: angleRadius * 0.7
          }
        }
      };
      
      const currentAngleConfig = angleConfig[actualOrientation] || angleConfig.default;
      
      // Create angle markers
      if (angleVisibility[0]) {
        const angle1Params = currentAngleConfig.angle1;
        const angle1 = board.create('angle', angle1Params.points, {
          radius: angle1Params.radius,
          name: angleLabels[0],
          fillColor: 'rgba(255, 255, 0, 0.2)', 
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          fixed: true,
          withLabel: true
        });
        
        // Adjust label position if needed
        if (angle1 && angle1.label) {
          const oldPos = angle1.label.coords.usrCoords;
          angle1.label.coords.setCoordinates(
            JXG.COORDS_BY_USER,
            [oldPos[1] + angle1Params.labelOffset[0], oldPos[2] + angle1Params.labelOffset[1]]
          );
          angle1.label.fixed = true;
        }
      }
      
      if (angleVisibility[1]) {
        const angle2Params = currentAngleConfig.angle2;
        const angle2 = board.create('angle', angle2Params.points, {
          radius: angle2Params.radius,
          name: angleLabels[1],
          fillColor: 'rgba(255, 255, 0, 0.2)',
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          fixed: true,
          withLabel: true
        });
        
        // Adjust label position if needed
        if (angle2 && angle2.label) {
          const oldPos = angle2.label.coords.usrCoords;
          angle2.label.coords.setCoordinates(
            JXG.COORDS_BY_USER,
            [oldPos[1] + angle2Params.labelOffset[0], oldPos[2] + angle2Params.labelOffset[1]]
          );
          angle2.label.fixed = true;
        }
      }
    } catch (error) {
      console.error("Error creating triangle:", error);
    }
    
    board.unsuspendUpdate();
  };
  
  // Clean up the board when component unmounts
  useEffect(() => {
    return () => {
      if (boardRef.current) {
        try {
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
        boundingBox={STANDARD_BOUNDS}
        height={containerHeight}
        backgroundColor="transparent"
        axis={false}
        grid={false}
        onUpdate={updateBoard}
        dependencies={[
          base,
          height,
          labelStyle,
          showRightAngle,
          Array.isArray(showAngles) ? showAngles.join(',') : showAngles,
          angleLabels.join(','),
          JSON.stringify(labels),
          orientation
        ]}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Deep comparison for complex objects to avoid unnecessary re-renders
  return (
    prevProps.base === nextProps.base &&
    prevProps.height === nextProps.height &&
    prevProps.showRightAngle === nextProps.showRightAngle &&
    prevProps.labelStyle === nextProps.labelStyle &&
    prevProps.containerHeight === nextProps.containerHeight &&
    prevProps.orientation === nextProps.orientation &&
    JSON.stringify(prevProps.showAngles) === JSON.stringify(nextProps.showAngles) &&
    JSON.stringify(prevProps.angleLabels) === JSON.stringify(nextProps.angleLabels) &&
    JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style) &&
    JSON.stringify(prevProps.labels) === JSON.stringify(nextProps.labels)
  );
});

// Set display name for dev tools
RightTriangle.displayName = 'RightTriangle';

export default RightTriangle;