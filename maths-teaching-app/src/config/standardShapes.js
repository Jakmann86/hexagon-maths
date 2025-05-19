// maths-teaching-app/src/config/standardShapes.js

// Standard shape configurations for consistent rendering
export const STANDARD_SHAPES = {
  rightTriangle: {
    base: 6,
    height: 5,
    // Just a simple bounding box
    boundingBox: [-1, 5, 5, -1]
  },
  square: {
    size: 5,
    boundingBox: [-1.5, 6.5, 6.5, -1.5] // More generous bounding box
  },
  isoscelesTriangle: {
    base: 6,
    height: 5,
    boundingBox: [-2, 7, 8, -2] // More generous bounding box
  },
  rectangle: {
    width: 7,
    height: 4,
    boundingBox: [-2, 5.5, 9, -2] // More generous bounding box
  }
};

// Default board configuration for all shapes
export const DEFAULT_BOARD_CONFIG = {
  axis: false,
  grid: false,
  backgroundColor: 'transparent',
  showNavigation: false,
  showCopyright: false,
  pan: { enabled: false },
  zoom: { enabled: false }
};