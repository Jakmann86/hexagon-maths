// maths-teaching-app/src/components/math/ShapeDisplay.jsx
import React, { memo, useMemo } from 'react';
import Square from './shapes/Square';
import RightTriangle from './shapes/RightTriangle';
import Triangle from './shapes/Triangle';
import Rectangle from './shapes/Rectangle';

/**
 * ShapeDisplay - A wrapper component that renders the appropriate shape component
 * based on the provided shape configuration.
 * 
 * @param {Object} props
 * @param {Object} props.shape - Shape configuration object
 * @param {string} props.shape.type - Type of shape to render ('square', 'rightTriangle', etc.)
 * @param {Object} props.shape - Additional shape-specific properties
 * @param {number} props.height - Height of the shape display container (default: 300)
 * @param {string} props.className - Additional CSS classes to apply
 */
const ShapeDisplay = memo(({ shape, height = 300, className = '' }) => {
  if (!shape || !shape.type) {
    console.warn('ShapeDisplay: Missing shape configuration or type');
    return null;
  }

  // Memoize the shape component to prevent unnecessary recreation
  const ShapeComponent = useMemo(() => {
    const { type, style = {}, ...otherProps } = shape;
    
    // Enhanced style with transparent background
    const enhancedStyle = {
      ...style,
      backgroundTransparent: true,
      showGrid: style.showGrid || false,
    };

    // Props with height directly passed to component
    const enhancedProps = {
      ...otherProps,
      style: enhancedStyle,
      // Pass explicit height to each shape component
      containerHeight: height,
      // Add key for stability
      key: `shape-${type}-${JSON.stringify(otherProps).slice(0, 20)}`
    };
    
    // Select and return appropriate shape component
    switch (type) {
      case 'square':
        return <Square {...enhancedProps} />;
      case 'rightTriangle':
        return <RightTriangle {...enhancedProps} />;
      case 'triangle':
        return <Triangle {...enhancedProps} />;
      case 'rectangle':
        return <Rectangle {...enhancedProps} />;
      default:
        console.warn(`ShapeDisplay: Unknown shape type "${type}"`);
        return null;
    }
  }, [shape, height]);

  // Simple wrapper div with stable class name
  return (
    <div 
      className={`math-shape-display ${className}`} 
      style={{ 
        height: `${height}px`,
        width: `${height}px`, // Make width equal to height for square aspect ratio
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto', // Center the container horizontally
        background: 'transparent' // Ensure the container background is transparent
      }}
    >
      {ShapeComponent}
    </div>
  );
});

ShapeDisplay.displayName = 'ShapeDisplay';

export default ShapeDisplay;