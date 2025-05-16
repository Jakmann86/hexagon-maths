// src/components/math/shapes/triangles/RightTriangle.jsx

import React, { useId, useCallback, useEffect, useRef } from 'react';
import { useShapeConfig } from '../../../../hooks/useShapeConfig';
import JSXGraphBoard from '../../JSXGraphBoard';

// Import JSXGraph directly if not globally available
// import JXG from 'jsxgraph';

function RightTriangle({
  // Allow direct dimension specification
  base,
  height,

  // Standard properties
  shapeType = 'rightTriangle',
  sectionType = 'learn',
  orientation = 'default',
  labels = [],
  labelStyle = 'numeric',
  showRightAngle = true,
  units = 'cm',

  // Other props
  ...otherProps
}) {
  // Reference to track if board was initialized
  const isInitializedRef = useRef(false);

  // Debug logging for props
  useEffect(() => {
    console.log("RightTriangle Props:", {
      base, height, orientation, sectionType, labelStyle, labels
    });
  }, [base, height, orientation, sectionType, labelStyle, labels]);

  // Generate stable ID
  const uniqueId = useId().replace(/:/g, '-');
  const boardId = `triangle-${uniqueId}`;

  // Get unified configuration
  const config = useShapeConfig({
    shapeType,
    sectionType,
    orientation,
    // Pass all props for proper overrides
    base,
    height,
    labels,
    labelStyle,
    ...otherProps
  });

  // Log config for debugging
  useEffect(() => {
    console.log("Shape Config:", config);
  }, [config]);

  // Use final values from config
  const {
    dimensions,
    theme,
    size,
    board: boardConfig
  } = config;

  // Use provided dimensions or defaults
  const finalBase = base || dimensions.base || 6;
  const finalHeight = height || dimensions.height || 5;

  // Calculate hypotenuse
  const hypotenuse = Math.sqrt(finalBase * finalBase + finalHeight * finalHeight);
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Initialize board function
  const initializeBoard = useCallback((board) => {
    if (!board) {
      console.error("No board provided to initializeBoard");
      return;
    }

    console.log(`Triangle board ${boardId} initialized`);
    isInitializedRef.current = true;

    try {
      // Clear existing objects
      board.suspendUpdate();

      // Clear any existing objects
      try {
        // First approach - try to use objectsList if available
        if (board.objectsList && Array.isArray(board.objectsList)) {
          // Create a copy of the array to avoid modification during iteration
          const objects = [...board.objectsList];
          for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            if (obj && typeof obj.remove === 'function') {
              board.removeObject(obj, false);
            }
          }
        }
        // Alternative - if no direct access to objects list, just clear the board
        else {
          board.removeObject(board.select(function () {
            return true;
          }));
        }
      } catch (err) {
        console.log("Could not clear board objects:", err);
        // If all else fails, just create a new board
        board.suspendUpdate();
      }
      // Standardize triangle size to match 3-4-5 triangle
      const standardBase = 3;
      const standardHeight = 4;
      const scaleBase = standardBase / finalBase;
      const scaleHeight = standardHeight / finalHeight;
      const scale = Math.min(scaleBase, scaleHeight);

      // Scaled dimensions - fit within 3-4-5 proportions
      const scaledBase = finalBase * scale;
      const scaledHeight = finalHeight * scale;
      // Define the triangle points based on orientation
      let points;

      switch (orientation) {
        case 'rotate90': // Right angle at origin, vertical base, horizontal height
          points = [
            [0, 0],           // Right angle at origin
            [0, scaledBase],   // Vertical base (up from origin)
            [scaledHeight, 0]  // Horizontal height (right from origin)
          ];
          break;

        case 'rotate180': // Right angle at top-right
          points = [
            [scaledBase, scaledHeight], // Right angle at top-right
            [0, scaledHeight],         // Horizontal base (left from right angle)
            [scaledBase, 0]            // Vertical height (down from right angle)
          ];
          break;

        case 'rotate270': // Right angle at bottom-right
          points = [
            [scaledHeight, scaledBase], // Right angle at bottom-right
            [scaledHeight, 0],         // Vertical base (up from right angle)
            [0, scaledBase]            // Horizontal height (left from right angle)
          ];
          break;

        case 'default': // Right angle at origin, horizontal base right, vertical height up
        default:
          points = [
            [0, 0],            // Right angle at origin
            [scaledBase, 0],    // Horizontal base (right from origin)
            [0, scaledHeight]   // Vertical height (up from origin)
          ];
          break;
      }

      // Create the triangle points
      const trianglePoints = points.map(p =>
        board.create('point', p, {
          visible: false,
          fixed: true,
          showInfobox: false,
          name: '',
          withLabel: false
        })
      );

      // Create the triangle with theme colors
      board.create('polygon', trianglePoints, {
        fillColor: theme.backgroundColor || '#e0f2fe',
        fillOpacity: theme.fillOpacity || 0.2,
        strokeColor: theme.color || '#0284c7',
        strokeWidth: theme.strokeWidth || 2,
        vertices: {
          visible: false,
          withLabel: false
        },
        withLabel: false,
        name: ''
      });

      // Calculate label positions based on orientation
      // Helper function to get midpoint of a line
      const getMidpoint = (p1, p2) => [
        (p1.X() + p2.X()) / 2,
        (p1.Y() + p2.Y()) / 2
      ];

      // Calculate midpoints for sides
      const baseMidpoint = getMidpoint(trianglePoints[0], trianglePoints[1]);
      const heightMidpoint = getMidpoint(trianglePoints[0], trianglePoints[2]);
      const hypotenuseMidpoint = getMidpoint(trianglePoints[1], trianglePoints[2]);

      // Offset factors for different orientations
      const getOffsets = () => {
        const baseOffset = 0.6;
        const heightOffset = 0.6;
        const hypotenuseOffset = 0.5;

        switch (orientation) {
          case 'rotate90': // Right angle at origin, vertical base, horizontal height
            return {
              base: [-baseOffset, 0],        // Left for vertical base
              height: [0, -heightOffset],    // Down for horizontal height
              hypotenuse: [hypotenuseOffset * 0.8, -hypotenuseOffset * 0.8] // Diagonal
            };

          case 'rotate180': // Right angle at top-right
            return {
              base: [0, baseOffset],          // Up for horizontal base
              height: [heightOffset, 0],      // Right for vertical height
              hypotenuse: [-hypotenuseOffset * 0.8, -hypotenuseOffset * 0.8] // Diagonal
            };

          case 'rotate270': // Right angle at bottom-right
            return {
              base: [baseOffset, 0],          // Right for vertical base
              height: [0, heightOffset],      // Up for horizontal height
              hypotenuse: [-hypotenuseOffset * 0.8, hypotenuseOffset * 0.8] // Diagonal
            };

          case 'default': // Right angle at origin
          default:
            return {
              base: [0, -baseOffset],         // Down for horizontal base
              height: [-heightOffset, 0],     // Left for vertical height
              hypotenuse: [hypotenuseOffset * 0.5, hypotenuseOffset * 0.8] // Diagonal
            };
        }
      };

      const offsets = getOffsets();

      // Apply offsets to create final positions
      const labelPositions = {
        base: [
          baseMidpoint[0] + offsets.base[0],
          baseMidpoint[1] + offsets.base[1]
        ],
        height: [
          heightMidpoint[0] + offsets.height[0],
          heightMidpoint[1] + offsets.height[1]
        ],
        hypotenuse: [
          hypotenuseMidpoint[0] + offsets.hypotenuse[0],
          hypotenuseMidpoint[1] + offsets.hypotenuse[1]
        ]
      };

      // Create labels if needed
      if (labels.length > 0 || labelStyle !== 'none') {
        // Determine side labels based on labelStyle
        let sideLabels;

        if (labelStyle === 'custom' && labels.length > 0) {
          sideLabels = [...labels];
          while (sideLabels.length < 3) sideLabels.push('');
        } else if (labelStyle === 'numeric') {
          sideLabels = [
            `${finalBase} ${units}`,
            `${finalHeight} ${units}`,
            `${roundedHypotenuse} ${units}`
          ];
        } else if (labelStyle === 'algebraic') {
          sideLabels = ['a', 'b', 'c'];
        } else {
          sideLabels = ['', '', ''];
        }

        // Add the labels if they exist
        if (sideLabels[0]) {
          board.create('text', [...labelPositions.base, sideLabels[0]], {
            fontSize: size.labelSize || 14,
            anchorX: 'middle',
            anchorY: 'middle',
            fixed: true,
            color: '#000000'
          });
        }

        if (sideLabels[1]) {
          board.create('text', [...labelPositions.height, sideLabels[1]], {
            fontSize: size.labelSize || 14,
            anchorX: 'middle',
            anchorY: 'middle',
            fixed: true,
            color: '#000000'
          });
        }

        if (sideLabels[2]) {
          board.create('text', [...labelPositions.hypotenuse, sideLabels[2]], {
            fontSize: size.labelSize || 14,
            anchorX: 'middle',
            anchorY: 'middle',
            fixed: true,
            color: '#000000'
          });
        }
      }

      // Add right angle marker if requested
      if (showRightAngle) {
        // Size based on triangle dimensions
        const rightAngleSize = Math.min(finalBase, finalHeight) * 0.15;

        // Create right angle marker
        board.create('angle', [
          trianglePoints[2], // Height endpoint
          trianglePoints[0], // Right angle point
          trianglePoints[1]  // Base endpoint
        ], {
          radius: rightAngleSize,
          type: 'square',
          fillColor: 'none',
          strokeWidth: 1.5,
          fixed: true,
          name: '',
          withLabel: false
        });
      }
    } catch (error) {
      console.error("Error drawing triangle:", error);
    }

    board.unsuspendUpdate();
  }, [boardId, finalBase, finalHeight, orientation, labelStyle, labels, showRightAngle, theme, size, units]);

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '1px' }}>
      <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>
        RightTriangle: {finalBase}x{finalHeight}, {orientation}
      </div>

      <JSXGraphBoard
        id={boardId}
        boundingBox={[-1, 5, 5, -1]} // Fixed standard bounding box for all triangles
        containerHeight={size.containerHeight || 250}
        onMount={initializeBoard}
        axis={false}
        grid={false}
      />
    </div>
  );
}

export default RightTriangle;