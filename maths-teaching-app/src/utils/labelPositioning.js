// src/utils/labelPositioning.js

/**
 * Label Positioning Utilities for Mathematical Shapes
 * 
 * This file provides utilities and configurations for consistently
 * positioning labels on mathematical shapes. It ensures readability
 * and educational clarity by optimizing where labels appear across
 * different shape types, sizes, and orientations.
 */

import { ORIENTATION_CONFIGS } from './shapeConfig';

/**
 * Calculates midpoint between two points
 * Useful for positioning labels on line segments
 * 
 * @param {Array} p1 First point [x, y]
 * @param {Array} p2 Second point [x, y]
 * @returns {Array} Midpoint [x, y]
 */
export const getMidpoint = (p1, p2) => {
  return [
    (p1[0] + p2[0]) / 2,
    (p1[1] + p2[1]) / 2
  ];
};

/**
 * Calculates a point with offset from another point
 * Used to position labels with a consistent offset from shape vertices
 * 
 * @param {Array} point Base point [x, y]
 * @param {Object} offset Offset values {x, y}
 * @returns {Array} New point with offset applied [x, y]
 */
export const getOffsetPoint = (point, offset) => {
  return [
    point[0] + offset.x,
    point[1] + offset.y
  ];
};

/**
 * Calculates unit vector perpendicular to a line segment
 * Useful for positioning labels alongside a line
 * 
 * @param {Array} p1 First point of line segment [x, y]
 * @param {Array} p2 Second point of line segment [x, y]
 * @returns {Array} Perpendicular unit vector [x, y]
 */
export const getPerpendicularVector = (p1, p2) => {
  // Calculate direction vector
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  
  // Calculate length
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate perpendicular unit vector (rotate 90 degrees)
  return [
    -dy / length,  // Perpendicular x component
    dx / length    // Perpendicular y component
  ];
};

/**
 * Calculates optimal label positions for a right triangle
 * Takes into account the orientation and specific side being labeled
 * 
 * @param {Array} points Triangle points [[x1,y1], [x2,y2], [x3,y3]]
 * @param {String} orientation Orientation key from ORIENTATION_CONFIGS
 * @returns {Object} Label positions for each side {base, height, hypotenuse}
 */
export const getRightTriangleLabelPositions = (points, orientation = 'bottomLeft') => {
  // Get orientation config
  const config = ORIENTATION_CONFIGS.rightTriangle[orientation];
  if (!config) {
    console.warn(`Unknown orientation: ${orientation}, using bottomLeft`);
    return getRightTriangleLabelPositions(points, 'bottomLeft');
  }
  
  // Map points to right angle, horizontal, and vertical based on orientation
  const rightAngleIndex = config.rightAngleIndex;
  const rightAnglePoint = points[rightAngleIndex];
  
  // The other two points, ordered consistently based on orientation
  const horizontalIndex = (rightAngleIndex + 1) % 3;
  const verticalIndex = (rightAngleIndex + 2) % 3;
  
  const horizontalPoint = points[horizontalIndex];
  const verticalPoint = points[verticalIndex];
  
  // Calculate midpoints of each side
  const baseMidpoint = getMidpoint(rightAnglePoint, horizontalPoint);
  const heightMidpoint = getMidpoint(rightAnglePoint, verticalPoint);
  const hypotenuseMidpoint = getMidpoint(horizontalPoint, verticalPoint);
  
  // Apply offsets from configuration
  return {
    base: getOffsetPoint(baseMidpoint, config.labelOffsets.base),
    height: getOffsetPoint(heightMidpoint, config.labelOffsets.height),
    hypotenuse: getOffsetPoint(hypotenuseMidpoint, config.labelOffsets.hypotenuse)
  };
};

/**
 * Adjusts label positions to avoid overlapping with vertices
 * Ensures that labels don't overlap with the shape itself
 * 
 * @param {Array} labelPosition Original label position [x, y]
 * @param {Array} vertices Array of vertex positions [[x1,y1], [x2,y2], ...]
 * @param {Number} minDistance Minimum acceptable distance
 * @returns {Array} Adjusted label position [x, y]
 */
export const avoidVertexOverlap = (labelPosition, vertices, minDistance = 0.5) => {
  let adjustedPosition = [...labelPosition];
  let needsAdjustment = false;
  
  // Check distance to each vertex
  for (const vertex of vertices) {
    const dx = labelPosition[0] - vertex[0];
    const dy = labelPosition[1] - vertex[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < minDistance) {
      needsAdjustment = true;
      
      // Calculate direction vector away from vertex
      const dirX = dx / distance;
      const dirY = dy / distance;
      
      // Adjust position to minimum distance
      adjustedPosition = [
        vertex[0] + dirX * minDistance,
        vertex[1] + dirY * minDistance
      ];
      
      // Only adjust for closest vertex to prevent oscillation
      break;
    }
  }
  
  return adjustedPosition;
};

/**
 * Creates optimal angle label position for a specific angle in a triangle
 * 
 * @param {Array} vertexPoint The vertex where the angle is located [x, y]
 * @param {Array} p1 First adjacent point [x, y]
 * @param {Array} p2 Second adjacent point [x, y]
 * @param {Number} radius Distance from vertex to place label
 * @returns {Array} Optimal label position [x, y]
 */
export const getAngleLabelPosition = (vertexPoint, p1, p2, radius = 0.5) => {
  // Calculate vectors from vertex to adjacent points
  const v1 = [p1[0] - vertexPoint[0], p1[1] - vertexPoint[1]];
  const v2 = [p2[0] - vertexPoint[0], p2[1] - vertexPoint[1]];
  
  // Normalize vectors
  const l1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
  const l2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
  
  const n1 = [v1[0] / l1, v1[1] / l1];
  const n2 = [v2[0] / l2, v2[1] / l2];
  
  // Calculate bisector
  const bisector = [
    (n1[0] + n2[0]) / 2,
    (n1[1] + n2[1]) / 2
  ];
  
  // Normalize bisector
  const lBisector = Math.sqrt(bisector[0] * bisector[0] + bisector[1] * bisector[1]);
  const nBisector = [
    bisector[0] / lBisector,
    bisector[1] / lBisector
  ];
  
  // Calculate position along bisector
  return [
    vertexPoint[0] + nBisector[0] * radius,
    vertexPoint[1] + nBisector[1] * radius
  ];
};

/**
 * Prepares standard label positions for a specific shape type
 * Returns a function that calculates all label positions for a shape
 * 
 * @param {String} shapeType Type of shape ('rightTriangle', 'square', etc.)
 * @returns {Function} Function to calculate label positions for that shape
 */
export const getLabelPositioningFunction = (shapeType) => {
  // Map shape types to their respective positioning functions
  const positioningFunctions = {
    rightTriangle: getRightTriangleLabelPositions,
    // Add other shape types here as they're implemented
  };
  
  // Return the appropriate function or a warning function if not found
  return positioningFunctions[shapeType] || (() => {
    console.warn(`No label positioning function available for shape type: ${shapeType}`);
    return {};
  });
};

/**
 * Scale and normalize label positions for different board sizes
 * 
 * @param {Object} labelPositions Object with label positions
 * @param {Number} scale Scale factor
 * @returns {Object} Scaled label positions
 */
export const scaleLabelPositions = (labelPositions, scale = 1.0) => {
  const scaledPositions = {};
  
  // Apply scale to each position
  for (const [key, position] of Object.entries(labelPositions)) {
    if (Array.isArray(position)) {
      scaledPositions[key] = [position[0] * scale, position[1] * scale];
    }
  }
  
  return scaledPositions;
};