// src/components/math/shapes/triangles/IsoscelesTriangle.jsx - updated for consistent positioning
import React, { useMemo } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';
import { STANDARD_SHAPES } from '../../../../config/standardShapes';
import { sections } from '../../../../config';

/**
 * IsoscelesTriangle - Enhanced component with integrated label positioning
 * Handles its own rendering details with consistent orientation support
 * 
 * @param {Object} props
 * @param {number} props.base - Base length of the triangle
 * @param {number} props.height - Height of the triangle
 * @param {boolean} props.showEqualSides - Whether to show hash marks on equal sides
 * @param {boolean} props.showEqualAngles - Whether to show angle markers for equal angles
 * @param {boolean} props.showHeight - Whether to show the height line
 * @param {boolean} props.showArea - Whether to display the area
 * @param {string} props.areaLabel - Custom area label (overrides calculation)
 * @param {string} props.labelStyle - Label style ('numeric', 'algebraic', 'custom')
 * @param {Array} props.labels - Custom labels for sides when labelStyle is 'custom'
 * @param {string} props.orientation - Orientation ('default', 'rotate90', 'rotate180', 'rotate270')
 * @param {string} props.units - Units for measurements
 * @param {number} props.containerHeight - Container height in pixels
 * @param {number} props.labelOffsetMultiplier - Multiplier for label distance from sides
 * @param {Object} props.style - Custom styling properties
 * @param {string} props.sectionType - Section type for styling
 */
const IsoscelesTriangle = ({
  base = STANDARD_SHAPES.isoscelesTriangle?.base || 6,
  height = STANDARD_SHAPES.isoscelesTriangle?.height || 5,
  showEqualSides = true,
  showEqualAngles = false,
  showHeight = false,
  showArea = false,
  areaLabel = null,
  labelStyle = 'numeric',
  labels = [],
  units = 'cm',
  orientation = 'default',
  containerHeight = 250,
  labelOffsetMultiplier = 1.2,
  style = {},
  sectionType = 'learn',
  ...otherProps
}) => {
  // Process and standardize configuration
  const config = useShapeConfiguration({
    base,
    height,
    showEqualSides,
    showEqualAngles,
    showHeight,
    showArea,
    areaLabel,
    labelStyle,
    labels,
    units,
    orientation,
    containerHeight,
    labelOffsetMultiplier,
    style,
    sectionType,
    ...otherProps
  }, 'isoscelesTriangle', sectionType);

  // Use useMemo for orientation with stable reference
  const resolvedOrientation = useMemo(() => {
    return orientation === 'random'
      ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
      : orientation;
  }, [orientation]);

  // Calculate leg length (the equal sides)
  const legLength = useMemo(() => {
    const halfBase = base / 2;
    return Math.sqrt(halfBase * halfBase + height * height);
  }, [base, height]);

  const roundedLegLength = Math.round(legLength * 100) / 100;

  // Calculate area for area label
  const area = useMemo(() => {
    return (base * height) / 2;
  }, [base, height]);

  const roundedArea = Math.round(area * 100) / 100;

  // Generate a deterministic ID based on props
  const triangleId = useMemo(() => {
    return `it-${base}-${height}-${resolvedOrientation}-${Math.random().toString(36).substr(2, 5)}`;
  }, [base, height, resolvedOrientation]);

  /**
   * Internal helper function to calculate label positions
   * Handles all orientations with consistent label placement
   * 
   * @param {Array} points - Array of JSXGraph points [apexPoint, leftBasePoint, rightBasePoint]
   * @returns {Object} - Label positions for base, leftLeg, rightLeg, height, and center
   */
  const calculateLabelPositions = (points) => {
    if (!points || points.length !== 3) {
      console.warn('Invalid points provided to calculateLabelPositions');
      return {
        base: [0, 0],
        leftLeg: [0, 0],
        rightLeg: [0, 0],
        height: [0, 0],
        center: [0, 0]
      };
    }

    // Helper to safely get coordinates from point objects
    const getCoords = (point) => {
      if (typeof point.X === 'function' && typeof point.Y === 'function') {
        return [point.X(), point.Y()];
      }
      return Array.isArray(point) ? point : [0, 0];
    };

    // Get coordinates for all three points
    const [apexX, apexY] = getCoords(points[0]);         // Apex point
    const [leftBaseX, leftBaseY] = getCoords(points[1]); // Left base point
    const [rightBaseX, rightBaseY] = getCoords(points[2]); // Right base point

    // Calculate midpoints of sides
    const getMidpoint = (p1, p2) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];

    const baseMidpoint = getMidpoint([leftBaseX, leftBaseY], [rightBaseX, rightBaseY]);
    const leftLegMidpoint = getMidpoint([apexX, apexY], [leftBaseX, leftBaseY]);
    const rightLegMidpoint = getMidpoint([apexX, apexY], [rightBaseX, rightBaseY]);

    // Calculate height midpoint (special position needed for height line)
    const heightBase = baseMidpoint;
    const heightMidpoint = getMidpoint([apexX, apexY], heightBase);

    // Calculate center point (for area label)
    const centerPoint = [
      (apexX + leftBaseX + rightBaseX) / 3,
      (apexY + leftBaseY + rightBaseY) / 3
    ];

    // Apply offset multiplier to all distances
    const baseOffset = 0.8 * labelOffsetMultiplier;
    const legOffset = 0.6 * labelOffsetMultiplier;
    const heightOffset = 0.5 * labelOffsetMultiplier;

    // Determine offset directions based on orientation
    let baseOffsetDir, leftLegOffsetDir, rightLegOffsetDir, heightOffsetDir;

    switch (resolvedOrientation) {
      case 'rotate90': // Apex on left
        baseOffsetDir = [baseOffset, 0]; // Right for base (vertical)
        leftLegOffsetDir = [legOffset * 0.5, legOffset]; // Up-right for top leg
        rightLegOffsetDir = [legOffset * 0.5, -legOffset]; // Down-right for bottom leg
        heightOffsetDir = [-heightOffset, 0]; // Left for height (horizontal)
        break;

      case 'rotate180': // Apex on bottom
        baseOffsetDir = [0, baseOffset]; // Up for base (horizontal)
        leftLegOffsetDir = [-legOffset, legOffset * 0.5]; // Up-left for left leg
        rightLegOffsetDir = [legOffset, legOffset * 0.5]; // Up-right for right leg
        heightOffsetDir = [0, -heightOffset]; // Down for height (vertical)
        break;

      case 'rotate270': // Apex on right
        baseOffsetDir = [-baseOffset, 0]; // Left for base (vertical)
        leftLegOffsetDir = [-legOffset * 0.5, -legOffset]; // Down-left for bottom leg
        rightLegOffsetDir = [-legOffset * 0.5, legOffset]; // Up-left for top leg
        heightOffsetDir = [heightOffset, 0]; // Right for height (horizontal)
        break;

      case 'default': // Apex on top
      default:
        baseOffsetDir = [0, -baseOffset]; // Down for base (horizontal)
        leftLegOffsetDir = [-legOffset, -legOffset * 0.5]; // Down-left for left leg
        rightLegOffsetDir = [legOffset, -legOffset * 0.5]; // Down-right for right leg
        heightOffsetDir = [0, heightOffset]; // Up for height (vertical)
        break;
    }

    // Apply offsets to create final positions
    const basePosition = [
      baseMidpoint[0] + baseOffsetDir[0],
      baseMidpoint[1] + baseOffsetDir[1]
    ];

    const leftLegPosition = [
      leftLegMidpoint[0] + leftLegOffsetDir[0],
      leftLegMidpoint[1] + leftLegOffsetDir[1]
    ];

    const rightLegPosition = [
      rightLegMidpoint[0] + rightLegOffsetDir[0],
      rightLegMidpoint[1] + rightLegOffsetDir[1]
    ];

    const heightPosition = [
      heightMidpoint[0] + heightOffsetDir[0],
      heightMidpoint[1] + heightOffsetDir[1]
    ];

    return {
      base: basePosition,
      leftLeg: leftLegPosition,
      rightLeg: rightLegPosition,
      height: heightPosition,
      center: centerPoint
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
      // Clear all existing objects first - using the safer approach like in RightTriangle
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
        fillColor = '#3F51B5',
        fillOpacity = 0.2,
        strokeColor = '#3F51B5',
        strokeWidth = 2
      } = config.style;

      // FIXED DIMENSIONS FOR ALL TRIANGLES - same as RightTriangle
      // This ensures consistent visualization while allowing labels to show actual values
      const sectionConfig = sections.boardConfig[sectionType] || sections.boardConfig.default;
      const fixedBase = sectionConfig.fixedDimensions.triangleBase;
      const fixedHeight = sectionConfig.fixedDimensions.triangleHeight;

      const triangleOffset = sectionConfig.triangleOffset || { x: 0, y: 0 };

      // Define the triangle points based on orientation with FIXED dimensions and offset
      let points;
      switch (resolvedOrientation) {
        case 'rotate90': // Apex on left
          points = [
            [0 + triangleOffset.x, fixedBase / 2 + triangleOffset.y],          // Apex on left side
            [fixedHeight + triangleOffset.x, 0 + triangleOffset.y],            // Bottom right
            [fixedHeight + triangleOffset.x, fixedBase + triangleOffset.y]          // Top right
          ];
          break;

        case 'rotate180': // Apex on bottom
          points = [
            [fixedBase / 2 + triangleOffset.x, 0 + triangleOffset.y],          // Apex on bottom
            [fixedBase + triangleOffset.x, fixedHeight + triangleOffset.y],         // Top right
            [0 + triangleOffset.x, fixedHeight + triangleOffset.y]             // Top left
          ];
          break;

        case 'rotate270': // Apex on right
          points = [
            [fixedHeight + triangleOffset.x, fixedBase / 2 + triangleOffset.y],     // Apex on right side
            [0 + triangleOffset.x, fixedBase + triangleOffset.y],              // Top left
            [0 + triangleOffset.x, 0 + triangleOffset.y]                  // Bottom left
          ];
          break;

        case 'default': // Apex on top
        default:
          points = [
            [fixedBase / 2 + triangleOffset.x, fixedHeight + triangleOffset.y],     // Apex on top
            [0 + triangleOffset.x, 0 + triangleOffset.y],                 // Bottom left
            [fixedBase + triangleOffset.x, 0 + triangleOffset.y]               // Bottom right
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

      // Create equal side markers if enabled
      if (showEqualSides) {
        // Marker length scales with triangle size
        const markLength = Math.min(fixedBase, fixedHeight) * 0.1;

        // Add hash marks on the equal sides (legs)
        const addEqualSideMarks = (p1, p2) => {
          // Calculate vector along the line
          const dx = p2.X() - p1.X();
          const dy = p2.Y() - p1.Y();
          const length = Math.sqrt(dx * dx + dy * dy);

          // Calculate perpendicular vector
          const perpX = -dy / length;
          const perpY = dx / length;

          // Position in the middle of the line
          const midX = (p1.X() + p2.X()) / 2;
          const midY = (p1.Y() + p2.Y()) / 2;

          // Create hash mark
          board.create('segment', [
            [midX + perpX * markLength / 2, midY + perpY * markLength / 2],
            [midX - perpX * markLength / 2, midY - perpY * markLength / 2]
          ], {
            strokeWidth: 2,
            strokeColor: strokeColor,
            fixed: true
          });
        };

        // Add marks to both legs (equal sides)
        addEqualSideMarks(trianglePoints[0], trianglePoints[1]); // Apex to left base
        addEqualSideMarks(trianglePoints[0], trianglePoints[2]); // Apex to right base
      }

      // Create height line if enabled
      if (showHeight) {
        // Get base midpoint
        const baseMidX = (trianglePoints[1].X() + trianglePoints[2].X()) / 2;
        const baseMidY = (trianglePoints[1].Y() + trianglePoints[2].Y()) / 2;

        // Create height line from apex to base midpoint
        board.create('segment', [
          trianglePoints[0],
          [
            resolvedOrientation === 'default' || resolvedOrientation === 'rotate180'
              ? trianglePoints[0].X() // Vertical height line 
              : baseMidX,
            resolvedOrientation === 'rotate90' || resolvedOrientation === 'rotate270'
              ? trianglePoints[0].Y() // Horizontal height line
              : baseMidY
          ]
        ], {
          strokeWidth: 1,
          strokeColor: strokeColor,
          dash: 2,
          fixed: true
        });
      }

      // Create equal angle markers if enabled
      if (showEqualAngles) {
        const radius = Math.min(fixedBase, fixedHeight) * 0.15;

        // Create angles at the base (these are equal in an isosceles triangle)
        board.create('angle', [
          trianglePoints[0],  // Apex
          trianglePoints[1],  // Left base point
          trianglePoints[2]   // Right base point
        ], {
          radius: radius,
          fillColor: 'rgba(255, 255, 0, 0.2)',
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          fixed: true,
          name: '°'
        });

        board.create('angle', [
          trianglePoints[0],  // Apex
          trianglePoints[2],  // Right base point
          trianglePoints[1]   // Left base point
        ], {
          radius: radius,
          fillColor: 'rgba(255, 255, 0, 0.2)',
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          fixed: true,
          name: '°'
        });
      }

      // Create labels if enabled
      if (config.showLabels) {
        // Determine side labels based on labelStyle
        let sideLabels;
        if (labelStyle === 'custom' && Array.isArray(labels) && labels.length > 0) {
          // Prioritize custom labels when provided
          sideLabels = [...labels];
        } else if (labelStyle === 'numeric') {
          sideLabels = [
            `${base} ${units}`,                 // Base
            `${roundedLegLength} ${units}`,     // Left leg
            `${roundedLegLength} ${units}`      // Right leg
          ];
        } else if (labelStyle === 'algebraic') {
          sideLabels = ['b', 'a', 'a']; // a for equal sides, b for base
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
          board.create('text', [...labelPositions.leftLeg, sideLabels[1]], {
            fontSize: config.labelSize || 14,
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }

        if (sideLabels[2]) {
          board.create('text', [...labelPositions.rightLeg, sideLabels[2]], {
            fontSize: config.labelSize || 14,
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }

        // Add height label if height line is shown
        if (showHeight) {
          const heightLabel = `${Math.round(height * 100) / 100} ${units}`;

          board.create('text', [...labelPositions.height, heightLabel], {
            fontSize: config.labelSize || 14,
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
      }

      // Add area label if enabled
      if (showArea) {
        const labelPositions = calculateLabelPositions(trianglePoints);
        const areaLabelText = areaLabel || `Area = ${roundedArea} ${units}²`;

        board.create('text', [labelPositions.center[0], labelPositions.center[1], areaLabelText], {
          fontSize: config.labelSize || 14,
          fixed: true,
          anchorX: 'middle',
          anchorY: 'middle',
          color: '#000000'
        });
      }

    } catch (error) {
      console.error("Error creating isosceles triangle:", error);
    }

    board.unsuspendUpdate();
  };

  /**
   * Calculate appropriate bounding box based on triangle dimensions
   */
  const calculateBoundingBox = () => {
    // Get section-specific config (with fallback) - same as RightTriangle
    const sectionConfig = sections.boardConfig[sectionType] || sections.boardConfig.default;

    // Use section-specific boundingBox if available
    if (sectionConfig && sectionConfig.boundingBox) {
      return sectionConfig.boundingBox;
    }

    // Otherwise calculate based on dimensions with padding
    const padding = sectionConfig?.padding || 3;
    return [-padding, 5 + padding, 5 + padding, -padding];
  };

  // Memoize the dependencies to avoid unnecessary redraws
  const deps = useMemo(() => [
    base,
    height,
    showEqualSides ? 1 : 0,
    showEqualAngles ? 1 : 0,
    showHeight ? 1 : 0,
    showArea ? 1 : 0,
    areaLabel || '',
    labelStyle,
    JSON.stringify(labels || []),
    resolvedOrientation,
    labelOffsetMultiplier
  ], [
    base,
    height,
    showEqualSides,
    showEqualAngles,
    showHeight,
    showArea,
    areaLabel,
    labelStyle,
    labels,
    resolvedOrientation,
    labelOffsetMultiplier
  ]);

  return (
    <BaseShape
      id={triangleId}
      boundingBox={calculateBoundingBox()}
      containerHeight={containerHeight}
      onUpdate={updateBoard}
      style={{ width: '100%', height: `${containerHeight}px` }}
      dependencies={deps}
    />
  );
};

export default IsoscelesTriangle;