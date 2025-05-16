// src/config/sections.js

export default {
  // Standard sizes for each section type
  // This maps sections to standard sizes
  sizeMapping: {
    starter: 'sm',
    diagnostic: 'md',
    learn: 'lg',
    examples: 'md',
    challenge: 'lg'
  },
  
  // Default orientations and other section-specific defaults
  defaults: {
    starter: {
      labelStyle: 'numeric',
      showDimensions: true
    },
    diagnostic: {
      labelStyle: 'numeric',
      showDimensions: true
    },
    examples: {
      labelStyle: 'custom',
      showDimensions: true
    },
    // etc.
  }
};