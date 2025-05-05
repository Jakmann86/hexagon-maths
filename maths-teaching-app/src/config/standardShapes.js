// Standard shape configurations for consistent rendering
export const STANDARD_SHAPES = {
    rightTriangle: {
      base: 6,
      height: 4,
      boundingBox: [-1.5, 5, 7.5, -1.5]
    },
    square: {
      size: 5,
      boundingBox: [-1, 6, 6, -1]
    },
    isoscelesTriangle: {
      base: 6,
      height: 5,
      boundingBox: [-1.5, 6, 7.5, -1.5]
    },
    rectangle: {
      width: 7,
      height: 4,
      boundingBox: [-1.5, 5, 8.5, -1.5]
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