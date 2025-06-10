// src/factories/coordinateFactory.js
import _ from 'lodash';

/**
 * Creates configuration for a generic coordinate grid visualization
 * Returns ONLY a configuration object, not a React component
 * 
 * @param {Object} config - Configuration options
 * @param {Array[]} config.points - Array of points, each [x, y]
 * @param {string[]} config.pointLabels - Labels for points
 * @param {Array[]} config.segments - Array of segments, each [pointIndex1, pointIndex2]
 * @param {boolean} config.showGrid - Whether to show the grid
 * @param {boolean} config.showAxes - Whether to show the axes
 * @param {number} config.gridSize - Size of the grid
 * @param {string} config.sectionType - Section type for styling
 * @param {Object} config.style - Custom styling options
 * @returns {Object} Configuration object for CoordinateVisualization component
 */
export const createCoordinateGrid = ({
  points = [[0, 0]],
  pointLabels = ["O"],
  segments = [],
  showGrid = true,
  showAxes = true,
  gridSize = 6,
  sectionType = 'default',
  style = {}
} = {}) => {
  // Set default style with neutral colors
  const defaultStyle = {
    pointColors: Array(points.length).fill('#666666'), // Neutral gray for points
    segmentColors: Array(segments.length).fill('#666666'), // Neutral gray for segments
    gridColor: '#dddddd',     // Light gray for grid
    axisColor: '#666666',     // Medium gray for axes
    strokeWidth: 2,
    opacity: 0.9
  };
  
  // Merge provided style with defaults
  const mergedStyle = {
    ...defaultStyle,
    ...style
  };
  
  // Return ONLY configuration object, not a React component
  return {
    points,
    pointLabels,
    segments,
    showGrid,
    showAxes,
    gridSize,
    sectionType,
    style: mergedStyle
  };
};

/**
 * Creates a distance problem in the coordinate plane
 * Built on top of the generic coordinate grid factory
 * 
 * @param {Object} config - Configuration options
 * @param {Array} config.point1 - First point coordinates [x, y]
 * @param {Array} config.point2 - Second point coordinates [x, y]
 * @param {boolean} config.showSolution - Whether to show the solution construction
 * @param {string} config.sectionType - Section type for styling
 * @param {boolean} config.showRightTriangle - Whether to show the right triangle construction
 * @returns {Object} Configuration for a distance problem
 */
export const createDistanceProblem = ({
  point1 = [1, 1],
  point2 = [4, 5],
  showSolution = false,
  sectionType = 'challenge',
  showRightTriangle = false
} = {}) => {
  // Create base grid configuration
  const gridConfig = createCoordinateGrid({
    points: [point1, point2],
    pointLabels: ['A', 'B'],
    segments: [[0, 1]], // Connect points A and B
    sectionType,
    gridSize: 8,
    // Override with colors for Pythagoras challenge
    style: {
      pointColors: ['#e74c3c', '#3498db'], // Red for A, Blue for B
      segmentColors: ['#9b59b6'],          // Purple for the line
    }
  });
  
  // Calculate distance and components
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Add problem-specific properties
  return {
    ...gridConfig,
    showSolution,
    showRightTriangle,
    distanceProblem: true,
    boundingBox: [-7, 7, 7, -7],
    // Add calculated values
    dx,
    dy,
    distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
  };
};

/**
 * Generates Pythagorean triple points on the coordinate grid
 * 
 * @param {Object} config - Configuration options
 * @param {Array} config.triple - Pythagorean triple [a, b, c]
 * @param {Array} config.origin - Origin point [x, y]
 * @returns {Array} Two points that form a right triangle with integer sides
 */
export const generatePythagoreanPoints = ({
  triple = [3, 4, 5],
  origin = [0, 0]
} = {}) => {
  const [a, b] = triple;
  const point1 = origin;
  const point2 = [origin[0] + a, origin[1] + b];
  
  return [point1, point2];
};

// Export default object for convenience
export default {
  createCoordinateGrid,
  createDistanceProblem,
  generatePythagoreanPoints
};