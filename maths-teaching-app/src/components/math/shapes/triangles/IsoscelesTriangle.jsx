// maths-teaching-app/src/components/math/shapes/triangles/IsoscelesTriangle.jsx
import React, { useMemo } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';
import { 
  getIsoscelesTriangleLabelPositions, 
  adjustLabelPositionsForProportion 
} from '../../../../utils/labelPositioning';

const IsoscelesTriangle = (props) => {
  // Process and standardize configuration
  const config = useShapeConfiguration(props, 'isoscelesTriangle');

  // Use useMemo for orientation with stable reference
  const orientation = useMemo(() => {
    return config.orientation === 'random'
      ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
      : config.orientation;
  }, [config.orientation]);

  // Calculate leg length with proportion adjustments, but apply a scale factor to keep within viewbox
  const { proportionConfig, proportionType } = config;
  const proportionScaleFactor = proportionConfig?.scaleFactor || 1.0;

  // Scale dimensions while maintaining proportions
  const effectiveBaseRatio = (proportionConfig?.baseRatio || 1);
  const effectiveHeightRatio = (proportionConfig?.heightRatio || 1);

  // Apply scaling that maintains aspect ratio but fits within viewbox
  const maxRatio = Math.max(effectiveBaseRatio, effectiveHeightRatio);
  const normalizedScaleFactor = proportionScaleFactor / maxRatio;

  const scaledBase = props.base * effectiveBaseRatio * normalizedScaleFactor;
  const scaledHeight = props.height * effectiveHeightRatio * normalizedScaleFactor;

  const legLength = Math.sqrt((scaledBase / 2) * (scaledBase / 2) + scaledHeight * scaledHeight);
  const roundedLegLength = Math.round(legLength * 100) / 100;

  // Calculate area
  const area = (scaledBase * scaledHeight) / 2;
  const roundedArea = Math.round(area * 100) / 100;

  // Generate a deterministic ID based on props
  const triangleId = useMemo(() => {
    return `it-${props.base}-${props.height}-${orientation}-${Math.random().toString(36).substr(2, 5)}`;
  }, [props.base, props.height, orientation]);

  // JSXGraph board update function
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

      // Define the triangle points based on orientation and proportions
      const base = scaledBase; // Use scaled dimensions
      const height = scaledHeight;

      let points;
      switch (orientation) {
        case 'rotate90':
          points = [
            [0, base / 2],          // Apex (rotated left)
            [height, 0],            // Bottom right
            [height, base]          // Top right
          ];
          break;
        case 'rotate180':
          points = [
            [base / 2, 0],          // Apex (rotated bottom)
            [base, height],         // Top right
            [0, height]             // Top left
          ];
          break;
        case 'rotate270':
          points = [
            [height, base / 2],     // Apex (rotated right)
            [0, base],              // Top left
            [0, 0]                  // Bottom left
          ];
          break;
        case 'default':
        default:
          points = [
            [base / 2, height],     // Apex (top center)
            [0, 0],                 // Bottom left
            [base, 0]               // Bottom right
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

      // Create a reusable helper function for triangle features with different orientations
      // This reduces redundancy in the orientation-specific code
      const drawTriangleFeatures = () => {
        // Equal side markers
        if (config.showEqualSides) {
          // Add hash marks to indicate equal sides
          const markLength = Math.min(base, height) * 0.1; // Scale with triangle size

          // Function to add hash marks on a line
          const addEqualSideMarks = (p1, p2, count = 1) => {
            // Calculate vector along the line
            const dx = p2.X() - p1.X();
            const dy = p2.Y() - p1.Y();
            const length = Math.sqrt(dx * dx + dy * dy);

            // Calculate unit perpendicular vector
            const perpX = -dy / length;
            const perpY = dx / length;

            // Position the mark in the middle of the line
            const midX = (p1.X() + p2.X()) / 2;
            const midY = (p1.Y() + p2.Y()) / 2;

            // Create the hash marks
            for (let i = 0; i < count; i++) {
              // Position marks slightly apart
              const offset = (i - (count - 1) / 2) * markLength * 0.7;
              const markX = midX + offset * dx / length;
              const markY = midY + offset * dy / length;

              board.create('segment', [
                [markX + perpX * markLength / 2, markY + perpY * markLength / 2],
                [markX - perpX * markLength / 2, markY - perpY * markLength / 2]
              ], {
                strokeWidth: 2,
                strokeColor: strokeColor,
                fixed: true
              });
            }
          };

          // Add marks to the two equal sides based on orientation
          // First point is always the apex, 2nd and 3rd are the base ends
          addEqualSideMarks(trianglePoints[0], trianglePoints[1], 1); // Left/first leg
          addEqualSideMarks(trianglePoints[0], trianglePoints[2], 1); // Right/second leg
        }

        // Height line
        if (config.showHeight) {
          // Get base midpoint which depends on orientation
          let basePoint;
          
          // Base midpoint depends on orientation but pattern is consistent:
          // First point (index 0) is always apex, other two are base ends
          const baseMidX = (trianglePoints[1].X() + trianglePoints[2].X()) / 2;
          const baseMidY = (trianglePoints[1].Y() + trianglePoints[2].Y()) / 2;
          
          // Create the height line from apex to base midpoint
          board.create('segment', [
            trianglePoints[0],
            [
              orientation === 'default' || orientation === 'rotate180' 
                ? trianglePoints[0].X() // Vertical height line
                : baseMidX, 
              orientation === 'rotate90' || orientation === 'rotate270' 
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

        // Equal angles
        if (config.showEqualAngles) {
          const radius = Math.min(base, height) * 0.15;

          // Create angles at the base (these are equal in an isosceles triangle)
          // Create angle from apex to first base point to second base point
          board.create('angle', [
            trianglePoints[0], trianglePoints[1], trianglePoints[2]
          ], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)',
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });

          // Create angle from apex to second base point to first base point
          board.create('angle', [
            trianglePoints[0], trianglePoints[2], trianglePoints[1]
          ], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)',
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
        }
      };

      // Call our helper to draw features with less redundancy
      drawTriangleFeatures();

      // Create labels if enabled
      if (config.showLabels) {
        // Determine side labels based on labelStyle
        let sideLabels;
        if (config.labelStyle === 'numeric') {
          sideLabels = [
            `${props.base} ${config.units}`, // Base
            `${roundedLegLength} ${config.units}`, // Left leg
            `${roundedLegLength} ${config.units}`  // Right leg
          ];
        } else if (config.labelStyle === 'algebraic') {
          sideLabels = ['b', 'a', 'a']; // a for equal sides, b for base
        } else if (config.labelStyle === 'custom' && Array.isArray(config.labels) && config.labels.length > 0) {
          sideLabels = [...config.labels];
          while (sideLabels.length < 3) sideLabels.push('');
        } else {
          sideLabels = ['', '', ''];
        }

        // Get label positions using the utility function
        // Calculate offset multiplier, making it a proper parameter
        const offsetMultiplier = config.labelOffsetMultiplier || (config.style?.labelOffsetMultiplier || 1.2);

        // Get centralized label positions from utility
        let labelPositions = getIsoscelesTriangleLabelPositions(
          trianglePoints, 
          orientation,
          { offsetMultiplier }
        );

        // Apply proportion-specific adjustments
        labelPositions = adjustLabelPositionsForProportion(
          labelPositions,
          config.proportionType,
          'isoscelesTriangle'
        );

        // Create the labels at positions from the utility
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

        // Add height label if needed
        if (config.showHeight) {
          board.create('text', [...labelPositions.height, `${props.height} ${config.units}`], {
            fontSize: config.labelSize || 14,
            fixed: true,
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
      }

      // Add area label if requested
      if (config.showArea && config.areaLabel) {
        // Position area label in the center of the triangle
        const centerX = (trianglePoints[0].X() + trianglePoints[1].X() + trianglePoints[2].X()) / 3;
        const centerY = (trianglePoints[0].Y() + trianglePoints[1].Y() + trianglePoints[2].Y()) / 3;

        board.create('text', [centerX, centerY, config.areaLabel], {
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

  // Calculate appropriate bounding box
  const calculateBoundingBox = () => {
    // For isosceles triangle, we need to calculate a custom bounding box
    // that accounts for the actual scaled dimensions
    const padding = 2;

    // Create a bounding box based on the scaled dimensions
    switch (orientation) {
      case 'rotate90':
        return [-padding, scaledBase + padding, scaledHeight + padding, -padding];
      case 'rotate180':
        return [-padding, scaledHeight + padding, scaledBase + padding, -padding];
      case 'rotate270':
        return [-padding, scaledBase + padding, scaledHeight + padding, -padding];
      case 'default':
      default:
        return [-padding, scaledHeight + padding, scaledBase + padding, -padding];
    }
  };

  return (
    <BaseShape
      id={triangleId}
      boundingBox={calculateBoundingBox()}
      containerHeight={config.containerHeight}
      onUpdate={updateBoard}
      style={{ width: '100%', height: `${config.containerHeight}px` }}
      dependencies={[
        props.base,
        props.height,
        config.labelStyle,
        config.showEqualSides ? 1 : 0,
        config.showHeight ? 1 : 0,
        config.showArea ? 1 : 0,
        config.areaLabel,
        config.showEqualAngles ? 1 : 0,
        JSON.stringify(config.labels || []),
        orientation,
        config.proportionType,
        JSON.stringify(config.proportionConfig || {})
      ]}
    />
  );
};

// Set default props
IsoscelesTriangle.defaultProps = {
  base: 6,
  height: 4,
  showEqualSides: true,
  showEqualAngles: false,
  showHeight: false,
  showArea: false,
  areaLabel: null,
  labelStyle: 'numeric',
  units: 'cm',
  orientation: 'default',
  containerHeight: 250,
  style: {},
  proportionType: 'balanced',
  labelOffsetMultiplier: 1.2 // Added as standalone prop
};

export default IsoscelesTriangle;