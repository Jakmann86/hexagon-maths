// src/components/math/ShapeDisplay.jsx
import React from 'react';
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
const ShapeDisplay = ({ shape, height = 300, className = '' }) => {
  if (!shape || !shape.type) {
    console.warn('ShapeDisplay: Missing shape configuration or type');
    return null;
  }

  // Get proper shape component based on type
  const getShapeComponent = () => {
    const { type, style = {}, ...otherProps } = shape;
    
    // Enhanced style with transparent background
    const enhancedStyle = {
      ...style,
      backgroundTransparent: true,
      showGrid: style.showGrid || false,
    };

    // Props with height directly passed to Mafs component
    const enhancedProps = {
      ...otherProps,
      style: enhancedStyle,
      // Pass explicit height to each shape component
      mafsHeight: height
    };
    
    // Select and return appropriate shape component
    switch (type) {
      case 'square':
        return <WrappedShape Component={Square} {...enhancedProps} />;
      case 'rightTriangle':
        return <WrappedShape Component={RightTriangle} {...enhancedProps} />;
      case 'triangle':
        return <WrappedShape Component={Triangle} {...enhancedProps} />;
      case 'rectangle':
        return <WrappedShape Component={Rectangle} {...enhancedProps} />;
      default:
        console.warn(`ShapeDisplay: Unknown shape type "${type}"`);
        return null;
    }
  };

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
      {getShapeComponent()}
    </div>
  );
};

/**
 * WrappedShape - Helper component to ensure consistent rendering across shapes
 * This ensures the height prop is properly passed to the Mafs component
 */
const WrappedShape = ({ Component, mafsHeight, ...props }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Component 
        {...props} 
        mafsHeight={mafsHeight} // This will be used inside shape components
      />
    </div>
  );
};

export default ShapeDisplay;