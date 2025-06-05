// src/config/sections.js - Enhanced configuration for shapes in different sections

export default {
  // Standard size mappings for theme integration
  sizeMapping: {
    starter: 'sm',
    diagnostic: 'md',
    learn: 'lg',
    examples: 'md',
    challenge: 'lg'
  },

  // Board configurations for different section types
  boardConfig: {
    starter: {
      boundingBox: [-4, 3, 3, -3],
      containerHeight: 160,
      verticalOffset: 1.0,  // ← INCREASE from 0.5 to 1.0 to raise triangles
      labelSize: 12,
      triangleOffset: { x: -2, y: 0.5 }, // ← ADD y: 0.5 to raise triangle vertically
      rightAngleSize: 0.3,
      fixedDimensions: {
        triangleBase: 1.8,
        triangleHeight: 1.5,
        squareSide: 2.0
      }
    },
    diagnostic: {
      boundingBox: [-4, 4, 4, -3],
      containerHeight: 220,
      verticalOffset: 0,
      labelSize: 13,
      fixedDimensions: {
        triangleBase: 3.0,
        triangleHeight: 2.5
      }
    },
    examples: {
      boundingBox: [-5, 5, 5, -3],
      containerHeight: 280,
      verticalOffset: 0,
      labelSize: 14,
      // ADD THESE TWO LINES:
      triangleOffset: { x: 0, y: 0 },     // No movement for examples
      rightAngleSize: 0.5,                // Normal size
      fixedDimensions: {
        triangleBase: 3.5,
        triangleHeight: 3.5
      }
    },
    challenge: {
      boundingBox: [-6, 6, 6, -4],
      containerHeight: 320,
      verticalOffset: 0,
      labelSize: 15,
      fixedDimensions: {
        triangleBase: 4.0,
        triangleHeight: 4.0
      }
    },
    default: {
      boundingBox: [-5, 5, 5, -3],
      containerHeight: 250,
      verticalOffset: 0,
      labelSize: 14,
      fixedDimensions: {
        triangleBase: 3.0,
        triangleHeight: 4.0
      }
    }
  },

  // Section-specific default props
  defaults: {
    starter: {
      labelStyle: 'numeric',
      showDimensions: true,
      showRightAngle: true,
      labelOffsetMultiplier: 0.8    // Compact labels for starters
    },
    diagnostic: {
      labelStyle: 'numeric',
      showDimensions: true,
      showRightAngle: true,
      labelOffsetMultiplier: 1.0    // Standard label placement
    },
    examples: {
      labelStyle: 'custom',
      showDimensions: true,
      showRightAngle: true,
      labelOffsetMultiplier: 1.2    // Expanded labels for examples
    },
    challenge: {
      labelStyle: 'custom',
      showDimensions: true,
      showRightAngle: true,
      labelOffsetMultiplier: 1.4    // Most space for labels
    }
  }
};