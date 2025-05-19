// src/components/math/shapes/triangles/RightTriangle.jsx
import React, { useMemo } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';
import { STANDARD_SHAPES } from '../../../../config/standardShapes';

/**
 * RightTriangle - Renders a right triangle with consistent styling and labels
 * Based on the standardized architecture using BaseShape
 * 
 * @param {Object} props
 * @param {number} props.base - Base length of the triangle
 * @param {number} props.height - Height of the triangle
 * @param {boolean} props.showRightAngle - Whether to show the right angle marker
 * @param {string} props.labelStyle - Label style ('numeric', 'algebraic', 'custom')
 * @param {Array} props.labels - Custom labels for sides when labelStyle is 'custom'
 * @param {boolean[]} props.showAngles - Array of booleans to determine which angles to show
 * @param {string[]} props.angleLabels - Labels for angles
 * @param {string} props.orientation - Orientation ('default', 'rotate90', 'rotate180', 'rotate270')
 * @param {string} props.units - Units to display ('cm', 'm', etc.)
 * @param {number} props.containerHeight - Height of the container
 * @param {Object} props.style - Custom styling options
 * @param {string} props.sectionType - Section type for styling
 */
const RightTriangle = (props) => {
  // Process and standardize configuration
  const config = useShapeConfiguration(props, 'rightTriangle', props.sectionType);

  // Extract key properties after configuration is processed
  const {
    base = STANDARD_SHAPES.rightTriangle?.base || 6,
    height = STANDARD_SHAPES.rightTriangle?.height || 5,
    showRightAngle = true,
    labelStyle = 'numeric',
    labels = [],
    showAngles = [false, false],
    angleLabels = ['θ', 'φ'],
    orientation = 'default',
    units = 'cm'
  } = props;

  // Calculate hypotenuse for labels
  const hypotenuse = Math.sqrt(base * base + height * height);
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Generate deterministic ID
  const triangleId = useMemo(() => {
    return `rt-${base}-${height}-${orientation}-${Math.random().toString(36).substr(2, 9)}`;
  }, [base, height, orientation]);

  // JSXGraph board update function
  const updateBoard = (board) => {
    if (!board) return;

    board.suspendUpdate();

    try {
      // Clear any existing objects for clean redraw
      // First get all objects in a safe way
      const objectIds = [];
      for (const id in board.objects) {
        if (board.objects[id] && typeof board.objects[id].remove === 'function') {
          objectIds.push(id);
        }
      }

      // Then remove them in a separate loop to avoid modifying while iterating
      for (const id of objectIds) {
        board.removeObject(board.objects[id], false);
      }

      // Extract styling options
      const {
        fillColor = '#3498db', // Default blue color
        fillOpacity = 0.2,
        strokeColor = '#3498db',
        strokeWidth = 2
      } = config.style;

      // FIXED DIMENSIONS FOR ALL TRIANGLES - regardless of actual measurements
      // This ensures consistent visualization while allowing labels to show actual values
      const fixedBase = 3;
      const fixedHeight = 4;

      // Define the triangle points based on orientation with FIXED dimensions
      let points;
      switch (orientation) {
        case 'rotate90': // Right angle at origin, vertical base, horizontal height
          points = [
            [0, 0],           // Right angle at origin
            [0, fixedBase],   // Vertical base (up from origin)
            [fixedHeight, 0]  // Horizontal height (right from origin)
          ];
          break;

        case 'rotate180': // Right angle at top-right
          points = [
            [fixedBase, fixedHeight], // Right angle at top-right
            [0, fixedHeight],         // Horizontal base (left from right angle)
            [fixedBase, 0]            // Vertical height (down from right angle)
          ];
          break;

        case 'rotate270': // Right angle at bottom-right
          points = [
            [fixedHeight, fixedBase], // Right angle at bottom-right
            [fixedHeight, 0],         // Vertical base (up from right angle)
            [0, fixedBase]            // Horizontal height (left from right angle)
          ];
          break;

        case 'default': // Right angle at origin, horizontal base right, vertical height up
        default:
          points = [
            [0, 0],            // Right angle at origin
            [fixedBase, 0],    // Horizontal base (right from origin)
            [0, fixedHeight]   // Vertical height (up from origin)
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
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
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
      if (config.showLabels) {
        // Determine side labels based on labelStyle
        let sideLabels;

        if (labelStyle === 'custom' && labels.length > 0) {
          sideLabels = [...labels];
          while (sideLabels.length < 3) sideLabels.push('');
        } else if (labelStyle === 'numeric') {
          sideLabels = [
            `${base} ${units}`,
            `${height} ${units}`,
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
            fontSize: config.labelSize || 14,
            anchorX: 'middle',
            anchorY: 'middle',
            fixed: true,
            color: '#000000'
          });
        }

        if (sideLabels[1]) {
          board.create('text', [...labelPositions.height, sideLabels[1]], {
            fontSize: config.labelSize || 14,
            anchorX: 'middle',
            anchorY: 'middle',
            fixed: true,
            color: '#000000'
          });
        }

        if (sideLabels[2]) {
          board.create('text', [...labelPositions.hypotenuse, sideLabels[2]], {
            fontSize: config.labelSize || 14,
            anchorX: 'middle',
            anchorY: 'middle',
            fixed: true,
            color: '#000000'
          });
        }
      }

      // Add angle markers if requested
      if (showAngles[0] || showAngles[1]) {
        const angleRadius = 0.7;
        const anglePoints = [
          [trianglePoints[2], trianglePoints[0], trianglePoints[1]], // Angle at right angle point
          [trianglePoints[0], trianglePoints[1], trianglePoints[2]], // Angle at base endpoint
          [trianglePoints[1], trianglePoints[2], trianglePoints[0]]  // Angle at height endpoint
        ];

        // Create angle markers
        if (showAngles[0]) {
          board.create('angle', anglePoints[1], {
            radius: angleRadius,
            name: angleLabels[0] || 'θ',
            fillColor: fillColor,
            fillOpacity: 0.2,
            strokeColor: strokeColor,
            strokeWidth: 1
          });
        }

        if (showAngles[1]) {
          board.create('angle', anglePoints[2], {
            radius: angleRadius,
            name: angleLabels[1] || 'φ',
            fillColor: fillColor,
            fillOpacity: 0.2,
            strokeColor: strokeColor,
            strokeWidth: 1
          });
        }
      }

      // Add right angle marker if requested
      if (showRightAngle) {
        // Fixed size for right angle marker
        const rightAngleSize = 0.5;

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
  };

  const calculateBoundingBox = () => {
    // Use standard shape dimensions if available
    if (STANDARD_SHAPES.rightTriangle && STANDARD_SHAPES.rightTriangle.boundingBox) {
      return STANDARD_SHAPES.rightTriangle.boundingBox;
    }

    // Simple default
    return [-1, 5, 5, -1];
  };

  // Dependencies array for BaseShape
  const deps = useMemo(() => [
    base,
    height,
    orientation,
    labelStyle,
    JSON.stringify(labels),
    showRightAngle ? 1 : 0,
    JSON.stringify(showAngles),
    JSON.stringify(angleLabels),
    units
  ], [
    base,
    height,
    orientation,
    labelStyle,
    labels,
    showRightAngle,
    showAngles,
    angleLabels,
    units
  ]);

  return (
    <BaseShape
      id={triangleId}
      boundingBox={calculateBoundingBox()}
      containerHeight={config.containerHeight}
      axis={config.board.axis}
      grid={config.board.grid}
      showNavigation={config.board.showNavigation}
      showCopyright={config.board.showCopyright}
      pan={config.board.pan}
      zoom={config.board.zoom}
      onUpdate={updateBoard}
      dependencies={deps}
    />
  );
};

// Default props for RightTriangle
RightTriangle.defaultProps = {
  base: 6,
  height: 5,
  showRightAngle: true,
  labelStyle: 'numeric',
  showAngles: [false, false],
  angleLabels: ['θ', 'φ'],
  orientation: 'default',
  units: 'cm',
  sectionType: 'learn'
};

export default RightTriangle;