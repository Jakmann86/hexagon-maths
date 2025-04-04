// src/config/boardSizes.js

export const BOARD_SIZES = {
  small: {
    height: 120,
    boundingBox: [-6, 6, 6, -6], // Increased viewbox to prevent label cutoff
    padding: 2 // Increased padding for better label visibility
  },
  starter: {
    height: 180,
    boundingBox: [-6, 6, 6, -6],
    padding: 1.5
  },
  diagnostic: {
    height: 250,
    boundingBox: [-7, 7, 7, -7],
    padding: 2
  },
  challenge: {
    height: 300,
    boundingBox: [-8, 8, 8, -8],
    padding: 2.5
  },
  examples: {
    height: 280,
    boundingBox: [-8, 8, 8, -8],
    padding: 2.5
  },
  learn: {
    height: 460,
    boundingBox: [-10, 10, 10, -10],
    padding: 3
  }
};

// Helper function to get board configuration
export const getBoardConfig = (size = 'diagnostic') => {
  return BOARD_SIZES[size] || BOARD_SIZES.diagnostic;
};