// src/config/shapes.js

export default {
  // Mathematical properties only - no visual styling
  rightTriangle: {
    defaultDimensions: {
      base: 6,
      height: 5 
    },
    // Pythagorean triples as reference values for exact calculations
    standardTriples: [
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      // etc.
    ]
  },
  
  isoscelesTriangle: {
    defaultDimensions: {
      base: 6,
      height: 5
    },
    // Integer leg-length triangles for clean visualizations
    standardTriangles: [
      { base: 8, height: 6, leg: 10 },    
      { base: 6, height: 8, leg: 10 },    
      { base: 12, height: 5, leg: 13 },
      // etc.   
    ]
  },
  
  square: {
    defaultDimensions: {
      side: 5
    }
  },
  
  // Add other shapes as needed
};