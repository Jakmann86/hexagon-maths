// maths-teaching-app/src/components/math/shapes/triangles/RightTriangle.jsx
import React, { useMemo } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';
import { STANDARD_SHAPES } from '../../../../config/standardShapes';

/**
 * RightTriangle - Enhanced component with integrated label positioning
 * Handles its own rendering details for all orientations
 * 
 * @param {Object} props
 * @param {number} props.base - Base length of the triangle
 * @param {number} props.height - Height of the triangle
 * @param {boolean} props.showRightAngle - Whether to show right angle marker
 * @param {Array|boolean} props.showAngles - Which angles to show ([base_angle, height_angle] or boolean)
 * @param {Array} props.angleLabels - Labels for angles
 * @param {string} props.labelStyle - Label style ('numeric', 'algebraic', 'custom')
 * @param {Array} props.labels - Custom labels for sides when labelStyle is 'custom'
 * @param {string} props.orientation - Orientation ('default', 'rotate90', 'rotate180', 'rotate270')
 * @param {string} props.units - Units for measurements
 * @param {number} props.containerHeight - Container height in pixels
 * @param {number} props.labelOffsetMultiplier - Multiplier for label distance from sides
 * @param {Object} props.style - Custom styling properties
 * @param {string} props.sectionType - Section type for styling
 */
const RightTriangle = (props) => {
  // Process and standardize configuration
  const config = useShapeConfiguration(props, 'rightTriangle', props.sectionType);

  // Extract key properties for cleaner code
  const {
    base,
    height,
    showRightAngle,
    showAngles,
    angleLabels,
    labelStyle,
    labels,
    units,
    containerHeight,
    labelOffsetMultiplier = 1.0,
    sectionType
  } = props;

  // Use useMemo for orientation with stable reference
  const orientation = useMemo(() => {
    return props.orientation === 'random'
      ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
      : props.orientation;
  }, [props.orientation]);

  // Calculate hypotenuse for labels
  const hypotenuse = useMemo(() => {
    return Math.sqrt(base * base + height * height);
  }, [base, height]);

  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;

  // Generate a deterministic ID based on props
  const triangleId = useMemo(() => {
    return `rt-${base}-${height}-${orientation}-${Math.random().toString(36).substr(2, 5)}`;
  }, [base, height, orientation]);

  /**
 * Internal helper function to calculate label positions
 * Provides better label placement across all orientations
 * 
 * @param {Array} points - Array of JSXGraph points [rightAnglePoint, basePoint, heightPoint]
 * @returns {Object} - Label positions for base, height, and hypotenuse
 */
  const calculateLabelPositions = (points) => {
    if (!points || points.length !== 3) {
      console.warn('Invalid points provided to calculateLabelPositions');
      return { base: [0, 0], height: [0, 0], hypotenuse: [0, 0] };
    }

    // Helper to safely get coordinates from point objects
    const getCoords = (point) => {
      if (typeof point.X === 'function' && typeof point.Y === 'function') {
        return [point.X(), point.Y()];
      }
      return Array.isArray(point) ? point : [0, 0];
    };

    // Get coordinates for all three points
    const [rightAngleX, rightAngleY] = getCoords(points[0]); // Right angle point
    const [basePointX, basePointY] = getCoords(points[1]);   // Base end point
    const [heightPointX, heightPointY] = getCoords(points[2]); // Height end point

    // Calculate midpoints of sides
    const getMidpoint = (p1, p2) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];

    const baseMidpoint = getMidpoint([rightAngleX, rightAngleY], [basePointX, basePointY]);
    const heightMidpoint = getMidpoint([rightAngleX, rightAngleY], [heightPointX, heightPointY]);
    const hypotenuseMidpoint = getMidpoint([basePointX, basePointY], [heightPointX, heightPointY]);

    // Use smaller offsets to avoid labels getting too far from the shape
    const baseOffset = 0.6 * labelOffsetMultiplier;
    const heightOffset = 0.6 * labelOffsetMultiplier;
    const hypotenuseOffset = 0.5 * labelOffsetMultiplier;

    // Determine offset directions based on orientation
    let baseOffsetDir, heightOffsetDir, hypotenuseOffsetDir;

    switch (orientation) {
      case 'rotate90': // Right angle at origin, vertical base, horizontal height
        baseOffsetDir = [-baseOffset, 0]; // Left for base (vertical)
        heightOffsetDir = [0, -heightOffset]; // Down for height (horizontal)
        hypotenuseOffsetDir = [hypotenuseOffset * 0.8, 0]; // Slight right for hypotenuse
        break;

      case 'rotate180': // Right angle at top-right
        baseOffsetDir = [0, baseOffset]; // Up for base (horizontal)
        heightOffsetDir = [heightOffset, 0]; // Right for height (vertical)
        hypotenuseOffsetDir = [-hypotenuseOffset * 0.8, -hypotenuseOffset * 0.8]; // Diagonal in
        break;

      case 'rotate270': // Right angle at bottom-right
        baseOffsetDir = [baseOffset, 0]; // Right for base (vertical)
        heightOffsetDir = [0, heightOffset]; // Up for height (horizontal)
        hypotenuseOffsetDir = [-hypotenuseOffset * 0.8, 0]; // Slight left for hypotenuse
        break;

      case 'default': // Right angle at origin, horizontal base right, vertical height up
      default:
        baseOffsetDir = [0, -baseOffset]; // Down for base (horizontal)
        heightOffsetDir = [-heightOffset, 0]; // Left for height (vertical)
        hypotenuseOffsetDir = [0, hypotenuseOffset * 0.8]; // Slight up for hypotenuse
        break;
    }

    // Apply offsets to create final positions
    const basePosition = [
      baseMidpoint[0] + baseOffsetDir[0],
      baseMidpoint[1] + baseOffsetDir[1]
    ];

    const heightPosition = [
      heightMidpoint[0] + heightOffsetDir[0],
      heightMidpoint[1] + heightOffsetDir[1]
    ];

    // For hypotenuse, use more orientation-specific positioning
    const hypotenusePosition = [
      hypotenuseMidpoint[0] + hypotenuseOffsetDir[0],
      hypotenuseMidpoint[1] + hypotenuseOffsetDir[1]
    ];

    return {
      base: basePosition,
      height: heightPosition,
      hypotenuse: hypotenusePosition
    };
  };

  /**
   * JSXGraph board update function
   * Contains integrated logic for all orientations
   */
  const updateBoard = (board) => {
    if (!board) return;

    // Clear existing objects for clean redraw
    board.suspendUpdate();

    try {
      // Clear all existing objects first
      for (const id in board.objects) {
        if (board.objects[id] && typeof board.objects[id].remove === 'function') {
          board.removeObject(board.objects[id], false);
        }
      }

      // Extract styling options
      const {
        fillColor = '#3F51B5',
        fillOpacity = 0.2,
        strokeColor = '#3F51B5',
        strokeWidth = 2
      } = config.style;

      // Define the triangle points based on orientation
      let points;

      switch (orientation) {
        case 'rotate90': // Right angle at origin, vertical base, horizontal height
          points = [
            [0, 0],          // Right angle at origin
            [0, base],       // Vertical base (up from origin)
            [height, 0]      // Horizontal height (right from origin)
          ];
          break;

        case 'rotate180': // Right angle at top-right, horizontal base left, vertical height down
          points = [
            [base, height],  // Right angle at top-right
            [0, height],     // Horizontal base (left from right angle)
            [base, 0]        // Vertical height (down from right angle)
          ];
          break;

        case 'rotate270': // Right angle at bottom-right, vertical base up, horizontal height left
          points = [
            [height, base],  // Right angle at bottom-right
            [height, 0],     // Vertical base (up from right angle)
            [0, base]        // Horizontal height (left from right angle)
          ];
          break;

        case 'default': // Right angle at origin, horizontal base right, vertical height up
        default:
          points = [
            [0, 0],          // Right angle at origin
            [base, 0],       // Horizontal base (right from origin)
            [0, height]      // Vertical height (up from origin)
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

      // Create labels if enabled
      if (config.showLabels) {
        // Determine side labels based on labelStyle
        let sideLabels;
        if (labelStyle === 'numeric') {
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

        // Calculate label positions using our internal method
        const labelPositions = calculateLabelPositions(trianglePoints);

        // Create the labels
        if (sideLabels[0]) {
          board.create('text', [...labelPositions.base, sideLabels[0]], {
            fontSize: config.labelSize || 14,
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }

        if (sideLabels[1]) {
          board.create('text', [...labelPositions.height, sideLabels[1]], {
            fontSize: config.labelSize || 14,
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }

        if (sideLabels[2]) {
          board.create('text', [...labelPositions.hypotenuse, sideLabels[2]], {
            fontSize: config.labelSize || 14,
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
      }

      // Add right angle marker if enabled
      if (showRightAngle) {
        // First point is always the right angle
        board.create('angle', [
          trianglePoints[2],  // Height endpoint
          trianglePoints[0],  // Right angle point
          trianglePoints[1]   // Base endpoint
        ], {
          radius: Math.min(base, height) * 0.15,
          type: 'square',
          fillColor: 'none',
          strokeWidth: 1.5,
          fixed: true,
          name: '',
          withLabel: false
        });
      }

      // Add other angle markers if requested
      const angleVisibility = Array.isArray(showAngles)
        ? showAngles
        : [showAngles, showAngles];

      if (angleVisibility[0]) {
        // First non-right angle (at origin point)
        const angle1 = board.create('angle', [
          trianglePoints[2],  // Height endpoint
          trianglePoints[0],  // Right angle
          trianglePoints[1]   // Base endpoint
        ], {
          radius: Math.min(base, height) * 0.2,
          name: angleLabels[0],
          fillColor: 'rgba(255, 255, 0, 0.2)',
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          fixed: true
        });

        // Position the angle label - calculate better position
        if (angle1.label && typeof JXG !== 'undefined' && JXG.COORDS_BY_USER) {
          const p0 = [trianglePoints[0].X(), trianglePoints[0].Y()];
          const p1 = [trianglePoints[1].X(), trianglePoints[1].Y()];
          const p2 = [trianglePoints[2].X(), trianglePoints[2].Y()];

          // Calculate angle bisector
          const bisectorX = (p1[0] - p0[0] + p2[0] - p0[0]) / 2 + p0[0];
          const bisectorY = (p1[1] - p0[1] + p2[1] - p0[1]) / 2 + p0[1];

          // Scale to get label position
          const scale = 0.3;
          const labelX = p0[0] + (bisectorX - p0[0]) * scale;
          const labelY = p0[1] + (bisectorY - p0[1]) * scale;

          angle1.label.setPosition(JXG.COORDS_BY_USER, [labelX, labelY]);
          angle1.label.fixed = true;
        }
      }

      if (angleVisibility[1]) {
        // Second non-right angle (at height endpoint)
        const angle2 = board.create('angle', [
          trianglePoints[0],  // Right angle
          trianglePoints[2],  // Height endpoint
          trianglePoints[1]   // Base endpoint
        ], {
          radius: Math.min(base, height) * 0.2,
          name: angleLabels[1],
          fillColor: 'rgba(255, 255, 0, 0.2)',
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          fixed: true
        });

        // Position the angle label - calculate better position
        if (angle2.label && typeof JXG !== 'undefined' && JXG.COORDS_BY_USER) {
          const p0 = [trianglePoints[2].X(), trianglePoints[2].Y()];
          const p1 = [trianglePoints[0].X(), trianglePoints[0].Y()];
          const p2 = [trianglePoints[1].X(), trianglePoints[1].Y()];

          // Calculate angle bisector
          const bisectorX = (p1[0] - p0[0] + p2[0] - p0[0]) / 2 + p0[0];
          const bisectorY = (p1[1] - p0[1] + p2[1] - p0[1]) / 2 + p0[1];

          // Scale to get label position
          const scale = 0.3;
          const labelX = p0[0] + (bisectorX - p0[0]) * scale;
          const labelY = p0[1] + (bisectorY - p0[1]) * scale;

          angle2.label.setPosition(JXG.COORDS_BY_USER, [labelX, labelY]);
          angle2.label.fixed = true;
        }
      }

    } catch (error) {
      console.error("Error creating triangle:", error);
    }

    board.unsuspendUpdate();
  };

  /**
   * Calculate appropriate bounding box based on triangle dimensions
   */
  const calculateBoundingBox = () => {
    // Use standard shape dimensions if available
    const standardShape = STANDARD_SHAPES.rightTriangle;

    // If we have standard dimensions, use them for consistent bounding box
    if (standardShape && standardShape.boundingBox) {
      return standardShape.boundingBox;
    }

    // Otherwise calculate based on dimensions with padding
    const padding = 2;

    switch (orientation) {
      case 'rotate90':
        return [-padding, base + padding, height + padding, -padding];
      case 'rotate180':
        return [-padding, height + padding, base + padding, -padding];
      case 'rotate270':
        return [-padding, base + padding, height + padding, -padding];
      case 'default':
      default:
        return [-padding, height + padding, base + padding, -padding];
    }
  };

  return (
    <BaseShape
      id={triangleId}
      boundingBox={calculateBoundingBox()}
      containerHeight={containerHeight}
      onUpdate={updateBoard}
      style={{ width: '100%', height: `${containerHeight}px` }}
      dependencies={[
        base,
        height,
        labelStyle,
        showRightAngle ? 1 : 0,
        Array.isArray(showAngles) ? showAngles.join(',') : showAngles ? 1 : 0,
        angleLabels ? angleLabels.join(',') : '',
        JSON.stringify(labels || []),
        orientation,
        labelOffsetMultiplier
      ]}
    />
  );
};

// Set default props
RightTriangle.defaultProps = {
  base: STANDARD_SHAPES.rightTriangle.base || 6,
  height: STANDARD_SHAPES.rightTriangle.height || 5,
  showRightAngle: true,
  showAngles: [false, false],
  angleLabels: ['θ', 'φ'],
  labelStyle: 'numeric',
  units: 'cm',
  orientation: 'default',
  containerHeight: 250,
  labelOffsetMultiplier: 1.0,
  style: {},
  sectionType: 'learn'
};

export default RightTriangle;