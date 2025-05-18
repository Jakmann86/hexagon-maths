// maths-teaching-app/src/components/math/shapes/quadrilaterals/Square.jsx
import React, { useMemo } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';

/**
 * Square - Renders a square with consistent styling and labels
 * Based on the new architecture using BaseShape
 * 
 * @param {Object} props
 * @param {number} props.sideLength - Length of the square's side
 * @param {boolean} props.showDimensions - Whether to show dimension labels
 * @param {boolean} props.showArea - Whether to show the area
 * @param {string} props.areaLabel - Custom area label (if showArea is true)
 * @param {string} props.orientation - Orientation of the square ('default', etc.)
 * @param {string} props.units - Units to display ('cm', 'm', etc.)
 * @param {number} props.containerHeight - Height of the container
 * @param {Object} props.style - Custom styling options
 */
const Square = (props) => {
  // Process and standardize configuration
  const config = useShapeConfiguration(props, 'square', props.sectionType);

  // Extract properties
  const {
    sideLength = 5,
    showDimensions = true,
    showArea = false,
    areaLabel = null,
    units = 'cm'
  } = props;

  // Generate deterministic ID
  const squareId = useMemo(() => {
    return `sq-${sideLength}-${Math.random().toString(36).substr(2, 5)}`;
  }, [sideLength]);

  // Calculate area if needed
  const area = sideLength * sideLength;

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
        fillColor = '#3498db', // Default blue color
        fillOpacity = 0.2,
        strokeColor = '#3498db',
        strokeWidth = 2
      } = config.style;

      // Create square points
      const points = [
        [0, 0],                       // Bottom left
        [sideLength, 0],              // Bottom right
        [sideLength, sideLength],     // Top right
        [0, sideLength]               // Top left
      ];

      // Create the points
      const squarePoints = points.map(p =>
        board.create('point', p, {
          visible: false,
          fixed: true,
          showInfobox: false,
          name: '',
          withLabel: false
        })
      );

      // Create the square
      board.create('polygon', squarePoints, {
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

      // Add dimension labels if enabled
      if (showDimensions) {
        // Side length label - bottom
        board.create('text', [
          sideLength / 2,
          -0.5,
          `${sideLength} ${units}`
        ], {
          fontSize: config.labelSize || 14,
          anchorX: 'middle',
          anchorY: 'middle',
          fixed: true,
          color: '#000000'
        });
      }

      // Add area label if enabled
      if (showArea) {
        const displayLabel = areaLabel || `Area = ${area} ${units}²`;

        board.create('text', [
          sideLength / 2,
          sideLength / 2,
          displayLabel
        ], {
          fontSize: config.labelSize || 14,
          anchorX: 'middle',
          anchorY: 'middle',
          fixed: true,
          color: '#000000'
        });
      }

    } catch (error) {
      console.error("Error creating square:", error);
    }

    board.unsuspendUpdate();
  };

  // Calculate appropriate bounding box
  const calculateBoundingBox = () => {
    // Increase padding for better label visibility
    const padding = 3; // Increased from 2

    // Allow more space at the bottom for dimension label
    return [-padding, sideLength + padding, sideLength + padding, -padding - 1]; // Added extra padding at bottom
  };

  return (
    <BaseShape
      id={squareId}
      boundingBox={calculateBoundingBox()}
      containerHeight={config.containerHeight}
      onUpdate={updateBoard}
      style={{ width: '100%', height: `${config.containerHeight}px` }}
      dependencies={[
        sideLength,
        showDimensions ? 1 : 0,
        showArea ? 1 : 0,
        areaLabel,
        units
      ]}
    />
  );
};

// Set default props
Square.defaultProps = {
  sideLength: 5,
  showDimensions: true,
  showArea: false,
  orientation: 'default',
  units: 'cm',
  containerHeight: 250,
  style: {}
};

export default Square;