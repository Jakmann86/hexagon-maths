// maths-teaching-app/src/components/math/shapes/base/useShapeConfiguration.js
import { useMemo } from 'react';
import {
  SHAPE_THEMES,
  SHAPE_SIZES,
  STANDARD_DIMENSIONS,
  BOARD_DEFAULTS,
  STANDARD_PROPORTIONS,
  STANDARD_VIEWBOXES
} from '../../../../utils/shapeConfig';

/**
 * useShapeConfiguration - Custom hook for standardizing shape configurations
 * Merges default configurations with custom ones, prioritizing existing styles
 * 
 * @param {Object} props - Component props with configuration options
 * @param {string} shapeType - Type of shape ('rightTriangle', 'square', etc.)
 * @param {string} sectionType - Section type ('starter', 'diagnostic', etc.) for theme
 * @returns {Object} Processed configuration for rendering the shape
 */
const useShapeConfiguration = (props, shapeType, sectionType = 'learn') => {
  return useMemo(() => {
    // Extract properties or use defaults
    const {
      containerHeight,
      orientation = 'default',
      units = 'cm',
      style = {},
      showLabels = true,
      labelStyle = 'numeric',
      labels = [],
      showAngles = [false, false],
      angleLabels = ['θ', 'φ'],
      showRightAngle = true,
      ...restProps
    } = props;

    // Process proportion type
    const proportionType = 'balanced';
    
    // Get proportion configuration
    const proportionConfig = 
  STANDARD_PROPORTIONS[shapeType]?.balanced || 
  { baseRatio: 1, heightRatio: 1, scaleFactor: 1 };

    // Get standard dimensions for the shape type
    const standardDims = STANDARD_DIMENSIONS[shapeType] || STANDARD_DIMENSIONS.rightTriangle;

    // Get size configuration based on containerHeight or section type
    const sizeConfig = (() => {
      if (containerHeight) {
        // If explicit containerHeight is provided, use it
        return {
          ...SHAPE_SIZES.diagnostic,
          containerHeight
        };
      }
      // Otherwise use section-based sizing
      return SHAPE_SIZES[sectionType] || SHAPE_SIZES.diagnostic;
    })();

    // Get theme configuration based on section type, but prioritize custom styles
    const themeConfig = {
      ...SHAPE_THEMES[sectionType] || SHAPE_THEMES.learn,
      ...style
    };

    // Get viewBox based on proportion type and shape type
    const viewBox =
      STANDARD_VIEWBOXES[shapeType]?.[proportionType] ||
      STANDARD_VIEWBOXES[shapeType]?.default ||
      standardDims.boundingBox;

    // Process bounding box - either use provided one or compute based on proportion
    const boundingBox = props.boundingBox || viewBox;

    // Process labels based on labelStyle
    const processedLabels = (() => {
      if (labels && labels.length > 0) {
        // Use provided labels if available (ensure we clone the array)
        return [...labels];
      }

      // Otherwise generate default labels based on labelStyle
      if (labelStyle === 'algebraic') {
        return ['a', 'b', 'c']; // Standard algebraic labels
      }

      return []; // Return empty array for numeric or other styles
    })();

    // Combine all processed configurations
    return {
      // Core configuration
      shapeType,
      sectionType,
      orientation,
      units,

      // Proportion-related
      proportionType,
      proportionConfig,

      // Styling
      style: themeConfig,

      // Dimensions
      boundingBox,
      viewBox,
      containerHeight: sizeConfig.containerHeight,
      labelSize: sizeConfig.labelSize,
      scale: sizeConfig.scale,

      // Labels
      showLabels,
      labelStyle,
      labels: processedLabels,

      // Angles
      showAngles,
      angleLabels,
      showRightAngle,

      // Pass through any other props
      ...restProps
    };
  }, [props, shapeType, sectionType]);
};

export default useShapeConfiguration;