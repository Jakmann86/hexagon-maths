// src/components/math/shapes/triangles/RightTriangle.jsx
import React, { useMemo, useState, useEffect } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';
import { STANDARD_SHAPES } from '../../../../config/standardShapes';
import { sections } from '../../../../config';

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
 * @param {boolean} props.autoCycle - Whether to automatically cycle through orientations
 * @param {string} props.questionId - ID of the question, used to trigger updates
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

  // State for orientation cycling
  const [currentOrientation, setCurrentOrientation] = useState(0);
  const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];

  // Effect to cycle orientation when props.autoCycle is true
  useEffect(() => {
    if (props.autoCycle) {
      setCurrentOrientation((prev) => (prev + 1) % orientations.length);
    }
  }, [props.questionId]); // Trigger on questionId change

  const effectiveOrientation = props.autoCycle 
      ? orientations[currentOrientation]
      : props.orientation || 'default';

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
      const sectionConfig = sections.boardConfig[props.sectionType] || sections.boardConfig.default;
      const fixedBase = sectionConfig.fixedDimensions.triangleBase;
      const fixedHeight = sectionConfig.fixedDimensions.triangleHeight;

      const triangleOffset = sectionConfig.triangleOffset || { x: 0, y: 0 };

      // Define the triangle points based on orientation with FIXED dimensions
      let points;
      switch (effectiveOrientation) {
          case 'rotate90': // Right angle at top-left
              points = [
                  [0 + triangleOffset.x, fixedHeight + triangleOffset.y],          // Right angle at top-left
                  [0 + triangleOffset.x, 0 + triangleOffset.y],                    // Bottom point
                  [fixedBase + triangleOffset.x, fixedHeight + triangleOffset.y]   // Top-right point
              ];
              break;

          case 'rotate180': // Right angle at top-right
              points = [
                  [fixedBase + triangleOffset.x, fixedHeight + triangleOffset.y],  // Right angle at top-right
                  [0 + triangleOffset.x, fixedHeight + triangleOffset.y],          // Top-left point
                  [fixedBase + triangleOffset.x, 0 + triangleOffset.y]             // Bottom-right point
              ];
              break;

          case 'rotate270': // Right angle at bottom-right
              points = [
                  [fixedBase + triangleOffset.x, 0 + triangleOffset.y],           // Right angle at bottom-right
                  [fixedBase + triangleOffset.x, fixedHeight + triangleOffset.y],  // Top point
                  [0 + triangleOffset.x, 0 + triangleOffset.y]                     // Bottom-left point
              ];
              break;

          default: // Right angle at bottom-left (default)
              points = [
                  [0 + triangleOffset.x, 0 + triangleOffset.y],                    // Right angle at bottom-left
                  [fixedBase + triangleOffset.x, 0 + triangleOffset.y],            // Bottom-right point
                  [0 + triangleOffset.x, fixedHeight + triangleOffset.y]           // Top-left point
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
        const baseOffset = 0.4;  // Keep original
        const heightOffset = 0.7; // Keep original
        const hypotenuseOffset = 0.5;

        // Helper to calculate hypotenuse offset based on angle
        const getHypOffset = (points) => {
            const dx = points[2].X() - points[1].X();
            const dy = points[2].Y() - points[1].Y();
            const angle = Math.atan2(dy, dx);
            return [
                Math.sin(angle) * hypotenuseOffset,  // Perpendicular to hypotenuse
                -Math.cos(angle) * hypotenuseOffset   // Opposite direction for readability
            ];
        };

        switch (effectiveOrientation) {
          case 'rotate90':
              return {
                  base: [-baseOffset - 0.2, 0],        // Keep original
                  height: [0, -heightOffset + 1],    // Keep original
                  hypotenuse: getHypOffset(trianglePoints)
              };

          case 'rotate180':
              return {
                  base: [0, baseOffset],         // Keep original
                  height: [heightOffset, 0],     // Keep original
                  hypotenuse: getHypOffset(trianglePoints)
              };

          case 'rotate270':
              return {
                  base: [baseOffset + 0.2, 0],         // Keep original
                  height: [0, heightOffset - 1],     // Keep original
                  hypotenuse: getHypOffset(trianglePoints)
              };

          default:
              return {
                  base: [0, -baseOffset * 0.7],  // Keep original
                  height: [-heightOffset, 0],    // Keep original
                  hypotenuse: getHypOffset(trianglePoints)
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
        // Get size from section config, or use default
        const rightAngleSize = sectionConfig.rightAngleSize || 0.5;

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
    // Get section-specific config (with fallback)
    const sectionConfig = sections.boardConfig[props.sectionType] || sections.boardConfig.default;

    // Use section-specific boundingBox if available
    if (sectionConfig && sectionConfig.boundingBox) {
      console.log("Using section bounding box:", sectionConfig.boundingBox);
      return sectionConfig.boundingBox;
    }

    // Otherwise calculate based on dimensions with padding
    const padding = sectionConfig?.padding || 3;
    return [-padding, fixedHeight + padding, fixedBase + padding, -padding];
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
  sectionType: 'starter',
  autoCycle: false,
  questionId: null  // Used to trigger orientation changes
};

export default RightTriangle;