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
 * @param {number} props.height - Height of the shape display container
 * @param {string} props.className - Additional CSS classes to apply
 */
const ShapeDisplay = ({ shape, height = 100, className = '' }) => {
  if (!shape || !shape.type) {
    console.warn('ShapeDisplay: Missing shape configuration or type');
    return null;
  }

  // Choose the appropriate shape component based on type
  const renderShapeComponent = () => {
    switch (shape.type) {
      case 'square':
        return <Square {...shape} />;
      
      case 'rightTriangle':
        return <RightTriangle {...shape} />;
      
      case 'triangle':
        return <Triangle {...shape} />;
      
      case 'rectangle':
        return <Rectangle {...shape} />;
      
      default:
        console.warn(`ShapeDisplay: Unknown shape type "${shape.type}"`);
        return null;
    }
  };

  return (
    <div 
      className={`math-shape-display ${className}`} 
      style={{ height: height ? `${height}px` : '200px', width: '100%' }}
    >
      {renderShapeComponent()}
    </div>
  );
};

export default ShapeDisplay;