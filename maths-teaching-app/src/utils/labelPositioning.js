// src/utils/labelPositioning.js
/**
 * Label Positioning Utilities for Mathematical Shapes
 */

import { ORIENTATION_CONFIGS, STANDARD_PROPORTIONS } from './shapeConfig'; // Added missing import

// [All existing utility functions: getMidpoint, getOffsetPoint, getPerpendicularVector, 
// getRightTriangleLabelPositions remain the same]

/**
 * Calculates optimal label positions for an isosceles triangle
 * Takes into account the orientation and specific sides being labeled
 * 
 * @param {Array} points Triangle points [[x1,y1], [x2,y2], [x3,y3]]
 * @param {String} orientation Orientation name ('default', 'rotate90', etc.)
 * @param {Object} options Additional options like offset multipliers
 * @returns {Object} Label positions for each side {base, leftLeg, rightLeg, height}
 */
export const getIsoscelesTriangleLabelPositions = (points, orientation = 'default', options = {}) => {
  if (!points || points.length !== 3) {
    console.warn('Invalid points provided to getIsoscelesTriangleLabelPositions');
    return { base: [0, 0], leftLeg: [0, 0], rightLeg: [0, 0], height: [0, 0] };
  }

  // Default offset multiplier - can be overridden by options
  const offsetMultiplier = options.offsetMultiplier || 1.0;

  // Calculate triangle dimensions to determine appropriate offsets
  // Use safer access pattern that doesn't assume JSXGraph API
  const getPointCoords = (point) => {
    if (typeof point.X === 'function' && typeof point.Y === 'function') {
      return [point.X(), point.Y()];
    }
    return Array.isArray(point) ? point : [0, 0];
  };

  const [apexX, apexY] = getPointCoords(points[0]);
  const [leftX, leftY] = getPointCoords(points[1]);
  const [rightX, rightY] = getPointCoords(points[2]);

  // Calculate base width and height to determine proportions
  const baseWidth = Math.abs(rightX - leftX);
  const height = orientation === 'default' || orientation === 'rotate180'
    ? Math.abs(apexY - leftY)  // Default or rotate180: vertical height
    : Math.abs(apexX - leftX); // rotate90 or rotate270: horizontal height

  // Determine if this is a wide triangle (base much larger than height)
  const isWide = baseWidth > height * 1.5;
  const isTall = height > baseWidth * 1.5;

  // Extract points based on orientation
  const apexPoint = points[0];
  let leftPoint, rightPoint;

  // Determine which point is the apex and which are the base points
  // based on the orientation
  switch (orientation) {
    case 'rotate90': // Apex on left
      leftPoint = points[2]; // Top right
      rightPoint = points[1]; // Bottom right
      break;

    case 'rotate180': // Apex on bottom
      leftPoint = points[2]; // Top left
      rightPoint = points[1]; // Top right
      break;

    case 'rotate270': // Apex on right
      leftPoint = points[1]; // Bottom left 
      rightPoint = points[2]; // Top left
      break;

    case 'default': // Apex on top
    default:
      leftPoint = points[1]; // Bottom left
      rightPoint = points[2]; // Bottom right
      break;
  }

  // Calculate midpoints using our safer coordinate access
  const baseMidpoint = getMidpoint(getPointCoords(leftPoint), getPointCoords(rightPoint));
  const leftLegMidpoint = getMidpoint(getPointCoords(apexPoint), getPointCoords(leftPoint));
  const rightLegMidpoint = getMidpoint(getPointCoords(apexPoint), getPointCoords(rightPoint));

  // Increase leg label offset for better visibility
  const legOffsetBase = 0.6 * offsetMultiplier;
  const legOffsetIncrease = isWide ? 1.5 : (isTall ? 1.2 : 1.3);
  const legOffset = legOffsetBase * legOffsetIncrease;

  // Base offset - closer for wide triangles, further for tall ones
  const baseOffsetBase = 0.8 * offsetMultiplier;
  const baseOffsetAdjustment = isWide ? 0.8 : (isTall ? 1.2 : 1.0);
  const baseOffset = baseOffsetBase * baseOffsetAdjustment;

  // Height offset
  const heightOffsetBase = 0.8 * offsetMultiplier;

  // Base offset direction depends on orientation
  let baseOffsetVec, leftLegOffsetVec, rightLegOffsetVec, heightOffsetVec;

  switch (orientation) {
    case 'rotate90': // Apex on left
      baseOffsetVec = { x: baseOffset, y: 0 };
      leftLegOffsetVec = { x: legOffset * 0.5, y: legOffset };
      rightLegOffsetVec = { x: legOffset * 0.5, y: -legOffset };
      heightOffsetVec = { x: -heightOffsetBase, y: 0 };
      break;

    case 'rotate180': // Apex on bottom
      baseOffsetVec = { x: 0, y: baseOffset };
      leftLegOffsetVec = { x: -legOffset, y: legOffset * 0.5 };
      rightLegOffsetVec = { x: legOffset, y: legOffset * 0.5 };
      heightOffsetVec = { x: 0, y: -heightOffsetBase };
      break;

    case 'rotate270': // Apex on right
      baseOffsetVec = { x: -baseOffset, y: 0 };
      leftLegOffsetVec = { x: -legOffset * 0.5, y: -legOffset };
      rightLegOffsetVec = { x: -legOffset * 0.5, y: legOffset };
      heightOffsetVec = { x: heightOffsetBase, y: 0 };
      break;

    case 'default': // Apex on top
    default:
      baseOffsetVec = { x: 0, y: -baseOffset };
      leftLegOffsetVec = { x: -legOffset, y: -legOffset * 0.5 };
      rightLegOffsetVec = { x: legOffset, y: -legOffset * 0.5 };
      heightOffsetVec = { x: 0, y: heightOffsetBase };
      break;
  }

  // Calculate height line position (mid-base to apex)
  const heightBase = getMidpoint(getPointCoords(leftPoint), getPointCoords(rightPoint));
  const heightPosition = getMidpoint(getPointCoords(apexPoint), heightBase);

  // Apply offsets to create final positions
  const positions = {
    base: getOffsetPoint(baseMidpoint, baseOffsetVec),
    leftLeg: getOffsetPoint(leftLegMidpoint, leftLegOffsetVec),
    rightLeg: getOffsetPoint(rightLegMidpoint, rightLegOffsetVec),
    height: getOffsetPoint(heightPosition, heightOffsetVec)
  };

  // Avoid vertex overlap for better label positioning
  const vertices = [
    getPointCoords(apexPoint),
    getPointCoords(leftPoint),
    getPointCoords(rightPoint)
  ];

  Object.keys(positions).forEach(key => {
    positions[key] = avoidVertexOverlap(positions[key], vertices, 0.7);
  });

  return positions;
};

// [Keep all other utility functions the same]

/**
 * Adjust label positions based on proportion type
 * Scales offsets appropriately for different triangle shapes
 * 
 * @param {Object} labelPositions Original label positions
 * @param {String} proportionType Proportion type ('balanced', 'tall', 'wide')
 * @param {String} shapeType Type of shape ('rightTriangle', 'isoscelesTriangle', etc.)
 * @returns {Object} Adjusted label positions
 */
export const adjustLabelPositionsForProportion = (labelPositions, proportionType, shapeType) => {
  if (!labelPositions) return {};

  // Get proportion configuration with fallback for safety
  const proportion = {
    baseRatio: 1,
    heightRatio: 1,
    scaleFactor: 1
  };
  
  if (STANDARD_PROPORTIONS && 
      STANDARD_PROPORTIONS[shapeType] && 
      STANDARD_PROPORTIONS[shapeType][proportionType]) {
    Object.assign(proportion, STANDARD_PROPORTIONS[shapeType][proportionType]);
  } else if (STANDARD_PROPORTIONS && 
             STANDARD_PROPORTIONS[shapeType] && 
             STANDARD_PROPORTIONS[shapeType].balanced) {
    Object.assign(proportion, STANDARD_PROPORTIONS[shapeType].balanced);
  }

  // For 'tall' shapes, increase vertical spacing
  if (proportionType === 'tall') {
    return Object.fromEntries(
      Object.entries(labelPositions).map(([key, pos]) => {
        // Increase Y offset for vertical elements
        if (key === 'height') {
          return [key, [pos[0], pos[1] * 1.2]];
        }
        return [key, pos];
      })
    );
  }

  // For 'wide' shapes, increase horizontal spacing
  if (proportionType === 'wide') {
    return Object.fromEntries(
      Object.entries(labelPositions).map(([key, pos]) => {
        // Increase X offset for horizontal elements
        if (key === 'base') {
          return [key, [pos[0] * 1.2, pos[1]]];
        }
        return [key, pos];
      })
    );
  }

  // For balanced, just return the original positions
  return labelPositions;
};