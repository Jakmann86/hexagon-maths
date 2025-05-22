// src/utils/shapeConfig.js

/**
 * Mathematical Shape Configuration System
 * 
 * This file defines the standard configurations for mathematical shapes
 * used throughout the application. These configurations ensure consistency
 * in size, appearance, and behavior across different sections.
 */

/**
 * Standard size presets for shapes in different educational contexts
 * Each size configuration includes height, scale factor, and label sizes
 */
export const SHAPE_SIZES = {
  // Size for starter questions (smaller, compact)
  starter: {
    containerHeight: 140,
    scale: 0.9,
    labelSize: 12,
    padding: 1.5,
    // Add positioning parameters
    boundingBox: [-4, 3, 3, -3], // Shifted left viewing area
    horizontalOffset: -1.0      // Left shift
  },
  
  // Size for diagnostic questions (medium)
  diagnostic: {
    containerHeight: 220,
    scale: 1.0,
    labelSize: 13,
    padding: 2.0
  },
  
  // Size for example demonstrations (larger, more detailed)
  example: {
    containerHeight: 300,
    scale: 1.2,
    labelSize: 14,
    padding: 2.5
  },
  
  // Size for challenge problems (large, comprehensive)
  challenge: {
    containerHeight: 320,
    scale: 1.3,
    labelSize: 14,
    padding: 3.0
  }
};

/**
 * Color themes aligned with section styles
 * Each theme includes fill color, stroke color, and opacity settings
 */
export const SHAPE_THEMES = {
  // Blue theme for starter sections
  starter: {
    fillColor: '#e0f2fe',      // Light blue fill
    strokeColor: '#0284c7',    // Medium blue stroke
    fillOpacity: 0.2,          // Subtle fill
    strokeWidth: 2             // Standard line width
  },
  
  // Purple theme for diagnostic sections
  diagnostic: {
    fillColor: '#f3e8ff',      // Light purple fill
    strokeColor: '#9333ea',    // Medium purple stroke
    fillOpacity: 0.2,
    strokeWidth: 2
  },
  
  // Green theme for learn sections
  learn: {
    fillColor: '#dcfce7',      // Light green fill
    strokeColor: '#16a34a',    // Medium green stroke
    fillOpacity: 0.2,
    strokeWidth: 2
  },
  
  // Orange theme for examples sections
  examples: {
    fillColor: '#ffedd5',      // Light orange fill
    strokeColor: '#f97316',    // Medium orange stroke
    fillOpacity: 0.2,
    strokeWidth: 2
  },
  
  // Red theme for challenge sections
  challenge: {
    fillColor: '#fee2e2',      // Light red fill
    strokeColor: '#dc2626',    // Medium red stroke
    fillOpacity: 0.2,
    strokeWidth: 2
  }
};

/**
 * Standard orientation configurations
 * These represent common ways to position shapes on the board,
 * with consistent naming that's more intuitive than angle-based rotation
 */
export const ORIENTATION_CONFIGS = {
  // Right triangle orientations
  rightTriangle: {
    // Right angle at bottom left (default)
    bottomLeft: {
      points: [
        [0, 0],         // Right angle point
        [1, 0],         // Horizontal point
        [0, 1]          // Vertical point
      ],
      rightAngleIndex: 0,
      // Label position offsets for consistent placement
      labelOffsets: {
        base: { x: 0.5, y: -0.4 },        // Bottom side
        height: { x: -0.4, y: 0.5 },      // Left side
        hypotenuse: { x: 0.4, y: 0.4 }    // Diagonal side
      }
    },
    
    // Right angle at bottom right
    bottomRight: {
      points: [
        [1, 0],         // Right angle point
        [0, 0],         // Horizontal point
        [1, 1]          // Vertical point
      ],
      rightAngleIndex: 0,
      labelOffsets: {
        base: { x: 0.5, y: -0.4 },
        height: { x: 1.4, y: 0.5 },
        hypotenuse: { x: 0.4, y: 0.4 }
      }
    },
    
    // Right angle at top left
    topLeft: {
      points: [
        [0, 1],         // Right angle point
        [0, 0],         // Vertical point
        [1, 1]          // Horizontal point
      ],
      rightAngleIndex: 0,
      labelOffsets: {
        base: { x: 0.5, y: 1.4 },
        height: { x: -0.4, y: 0.5 },
        hypotenuse: { x: 0.4, y: 0.4 }
      }
    },
    
    // Right angle at top right
    topRight: {
      points: [
        [1, 1],         // Right angle point
        [1, 0],         // Vertical point
        [0, 1]          // Horizontal point
      ],
      rightAngleIndex: 0,
      labelOffsets: {
        base: { x: 0.5, y: 1.4 },
        height: { x: 1.4, y: 0.5 },
        hypotenuse: { x: 0.4, y: 0.4 }
      }
    }
  }
};

/**
 * Standard dimensions for shapes
 * These provide default sizes for shapes when specific dimensions
 * aren't provided, ensuring consistent display
 */
export const STANDARD_DIMENSIONS = {
  // Default dimensions for right triangle
  rightTriangle: {
    base: 5,
    height: 4,
    unitScale: 1.0,      // Scale for unit conversion
    boundingBox: [-1, 6, 6, -1] // [xMin, yMax, xMax, yMin]
  },
  
  // Default dimensions for square
  square: {
    sideLength: 5,
    unitScale: 1.0,
    boundingBox: [-1, 6, 6, -1]
  },
  
  // Default dimensions for rectangle
  rectangle: {
    width: 6,
    height: 4,
    unitScale: 1.0,
    boundingBox: [-1, 5, 7, -1]
  }
};

/**
 * JSXGraph board configuration defaults
 * These settings are used when creating JSXGraph boards for all shapes
 */
export const BOARD_DEFAULTS = {
  axis: false,            // Don't show axes by default
  grid: false,            // Don't show grid by default
  showNavigation: false,  // Don't show navigation controls
  showCopyright: false,   // Don't show copyright
  keepAspectRatio: true,  // Maintain aspect ratio
  boundingBox: [-1, 6, 6, -1], // Default bounding box
  pan: {
    enabled: false        // Disable panning
  },
  zoom: {
    enabled: false        // Disable zooming
  }
};

/**
 * Standard proportion configurations for geometric shapes
 * Using only balanced proportions for consistent visualization
 */
export const STANDARD_PROPORTIONS = {
  // Right triangle proportions - only balanced option
  rightTriangle: {
    // Balanced - consistent appearance for educational purposes
    balanced: {
      baseRatio: 1,
      heightRatio: 1,
      scaleFactor: 1.0
    }
  },
  
  // Isosceles triangle proportions - only balanced option
  isoscelesTriangle: {
    // Balanced - consistent appearance for educational purposes
    balanced: {
      baseRatio: 1.4,
      heightRatio: 1,
      scaleFactor: 1.0
    }
  }
};

/**
 * Standard viewBox configurations for different shape types
 * Simplified to provide consistent presentation
 */
export const STANDARD_VIEWBOXES = {
  rightTriangle: {
    default: [-1, 6, 6, -1]     // [xMin, yMax, xMax, yMin]
  },
  
  isoscelesTriangle: {
    default: [-2, 7, 7, -2]
  }
};