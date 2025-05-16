// src/config/board.js

export default {
  // Default board configurations
  defaults: {
    axis: false,
    grid: false,
    showNavigation: false,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false },
    keepAspectRatio: true
  },
  
  // Standard bounding boxes for different shapes
  boundingBoxes: {
    rightTriangle: [-2, 6, 8, -2],
    isoscelesTriangle: [-2, 7, 8, -2],
    square: [-1.5, 6.5, 6.5, -1.5],
    rectangle: [-2, 5.5, 9, -2]
  }
};