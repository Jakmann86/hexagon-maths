// src/hooks/useShapeConfig.js

import { useMemo } from 'react';
import { shapes, themes, sections, board } from '../config';

/**
 * useShapeConfig - Hook for accessing unified shape configuration
 * 
 * Merges configuration from multiple sources with clear priorities:
 * 1. Custom props override everything
 * 2. Section defaults come next
 * 3. Shape defaults come last
 * 
 * @param {Object} props - Configuration props and overrides
 * @param {string} props.shapeType - Type of shape ('rightTriangle', 'square', etc.)
 * @param {string} props.sectionType - Section type ('starter', 'diagnostic', etc.)
 * @param {string} props.size - Explicit size (overrides section default)
 * @returns {Object} Complete configuration object
 */
export function useShapeConfig({
  shapeType,
  sectionType = 'learn',
  size: explicitSize,
  ...customProps
}) {
  return useMemo(() => {
    // Get section defaults
    const sectionDefaults = sections.defaults[sectionType] || {};
    
    // Get section-suggested size
    const sectionSize = sections.sizeMapping[sectionType] || 'md';
    
    // Determine final size (explicit size overrides section default)
    const sizeKey = explicitSize || sectionSize;
    
    // Get size configuration
    const sizeConfig = themes.sizes[sizeKey] || themes.sizes.md;
    
    // Get shape defaults
    const shapeDefaults = shapes[shapeType] || {};
    
    // Get theme for section
    const themeConfig = themes.sections[sectionType] || themes.sections.learn;
    
    // Get board configuration
    const boardConfig = {
      ...board.defaults,
      boundingBox: board.boundingBoxes[shapeType] || board.boundingBoxes.default || board.defaults.boundingBox
    };
    
    // Build final configuration with clear priority:
    return {
      // Shape mathematical properties (use direct props if provided)
      dimensions: {
        ...shapeDefaults.defaultDimensions,
        // Override with any dimension props provided directly
        ...(customProps.base !== undefined && { base: customProps.base }),
        ...(customProps.height !== undefined && { height: customProps.height }),
        ...(customProps.side !== undefined && { side: customProps.side }),
        ...(customProps.radius !== undefined && { radius: customProps.radius }),
      },
      
      // Visualization properties
      theme: themeConfig,
      size: sizeConfig,
      
      // Board configuration
      board: boardConfig,
      
      // Standard data arrays
      standardTriples: shapeDefaults.standardTriples || [],
      standardTriangles: shapeDefaults.standardTriangles || [],
      
      // Combined defaults (section defaults override shape defaults)
      ...shapeDefaults,
      ...sectionDefaults,
      
      // Custom props override everything else
      ...customProps
    };
  }, [shapeType, sectionType, explicitSize, customProps]);
}

export default useShapeConfig;