// maths-teaching-app/src/components/math/shapes/quadrilaterals/Square.jsx
import React, { useMemo } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';
import { sections } from '../../../../config';

/**
 * Square - Renders a square with consistent styling and labels
 * NOW USES PATTERN 2 ARCHITECTURE with fixed visual dimensions
 * 
 * @param {Object} props
 * @param {number} props.sideLength - Mathematical length of the square's side (for labels only)
 * @param {boolean} props.showDimensions - Whether to show dimension labels
 * @param {boolean} props.showArea - Whether to show the area
 * @param {string} props.areaLabel - Custom area label (if showArea is true)
 * @param {string} props.orientation - Orientation of the square ('default', etc.)
 * @param {string} props.units - Units to display ('cm', 'm', etc.)
 * @param {number} props.containerHeight - Height of the container
 * @param {Object} props.style - Custom styling options
 * @param {string} props.sectionType - Section type for consistent sizing
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
    units = 'cm',
    sectionType = 'diagnostic'
  } = props;

  // Generate deterministic ID
  const squareId = useMemo(() => {
    return `sq-${sideLength}-${Math.random().toString(36).substr(2, 5)}`;
  }, [sideLength]);

  // Calculate area for labels (mathematical calculation)
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

      // *** PATTERN 2 ARCHITECTURE: Use FIXED visual dimensions ***
      // Get section-specific configuration for consistent visual sizing
      const sectionConfig = sections.boardConfig[sectionType] || sections.boardConfig.default;
      
      // Use fixed square side from section config (visual size, not mathematical)
      const fixedSquareSide = sectionConfig.fixedDimensions?.squareSide || 3.0;
      
      // Calculate centering offset to position square in center of bounding box
      const boundingBox = calculateBoundingBox();
      const centerX = (boundingBox[2] + boundingBox[0]) / 2; // (xMax + xMin) / 2
      const centerY = (boundingBox[1] + boundingBox[3]) / 2; // (yMax + yMin) / 2
      
      // Position square centered in bounding box
      const squareLeft = centerX - (fixedSquareSide / 2);
      const squareBottom = centerY - (fixedSquareSide / 2);
      
      // Apply any section-specific offset on top of centering
      const squareOffset = sectionConfig.squareOffset || { x: 0, y: 0 };

      // Create square points using FIXED dimensions for consistent visual size
      const points = [
        [squareLeft + squareOffset.x, squareBottom + squareOffset.y],                                      // Bottom left
        [squareLeft + fixedSquareSide + squareOffset.x, squareBottom + squareOffset.y],                  // Bottom right
        [squareLeft + fixedSquareSide + squareOffset.x, squareBottom + fixedSquareSide + squareOffset.y], // Top right
        [squareLeft + squareOffset.x, squareBottom + fixedSquareSide + squareOffset.y]                   // Top left
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

      // Add dimension labels if enabled (show MATHEMATICAL values, not visual)
      if (showDimensions) {
        // Side length label - bottom (show actual mathematical side length)
        board.create('text', [
          centerX + squareOffset.x,  // Center horizontally
          squareBottom - 0.5 + squareOffset.y,  // Below the square
          `${sideLength} ${units}`  // ← Mathematical value in label
        ], {
          fontSize: config.labelSize || 14,
          anchorX: 'middle',
          anchorY: 'middle',
          fixed: true,
          color: '#000000'
        });
      }

      // Add area label if enabled (show MATHEMATICAL values, not visual)
      if (showArea) {
        const displayLabel = areaLabel || `Area = ${area} ${units}²`;

        board.create('text', [
          centerX + squareOffset.x,  // Center horizontally
          centerY + squareOffset.y,  // Center vertically
          displayLabel  // ← Mathematical value in label
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

  // Calculate appropriate bounding box based on FIXED dimensions
  const calculateBoundingBox = () => {
    // Get section-specific config for consistent bounding box
    const sectionConfig = sections.boardConfig[sectionType] || sections.boardConfig.default;
    
    // Use section-specific boundingBox if available
    if (sectionConfig && sectionConfig.boundingBox) {
      return sectionConfig.boundingBox;
    }
    
    // Otherwise calculate based on fixed dimensions with padding
    const fixedSquareSide = sectionConfig.fixedDimensions?.squareSide || 3.0;
    const padding = sectionConfig?.padding || 3;
    
    // Allow more space at the bottom for dimension label
    return [-padding, fixedSquareSide + padding, fixedSquareSide + padding, -padding - 1];
  };

  return (
    <BaseShape
      id={squareId}
      boundingBox={calculateBoundingBox()}
      containerHeight={config.containerHeight}
      onUpdate={updateBoard}
      style={{ width: '100%', height: `${config.containerHeight}px` }}
      dependencies={[
        sideLength,                    // Mathematical value (for labels)
        showDimensions ? 1 : 0,
        showArea ? 1 : 0,
        areaLabel,
        units,
        sectionType                    // Section type affects visual sizing
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
  style: {},
  sectionType: 'diagnostic'
};

export default Square;