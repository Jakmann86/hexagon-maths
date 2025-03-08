// src/components/math/ShapeDisplay.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import MathView from './MathView';
import Square from './shapes/Square';
import Rectangle from './shapes/Rectangle';
import RightTriangle from './shapes/RightTriangle';
import Coordinates from './primitives/Coordinates';

/**
 * A display component for rendering mathematical shapes
 * Provides a wrapper around various shape components
 */
const ShapeDisplay = ({ 
  shape,
  height = 250,
  className = '',
  showAxes = true,
  showGrid = true,
  ...props 
}) => {
  if (!shape || !shape.type) return null;
  
  const { type, ...shapeProps } = shape;
  
  // Determine appropriate viewBox based on shape type and dimensions
  const getViewBox = () => {
    const defaultPadding = 1;
    
    // Extract dimensions
    let maxX = 5, maxY = 5;
    
    switch (type) {
      case 'square':
        maxX = maxY = (shapeProps.sideLength || 5) + defaultPadding;
        break;
      case 'rectangle':
        maxX = (shapeProps.width || 6) + defaultPadding;
        maxY = (shapeProps.height || 4) + defaultPadding;
        break;
      case 'rightTriangle':
        maxX = (shapeProps.base || 3) + defaultPadding;
        maxY = (shapeProps.height || 4) + defaultPadding;
        break;
      default:
        maxX = maxY = 5;
    }
    
    return { x: [-defaultPadding, maxX], y: [-defaultPadding, maxY] };
  };
  
  // Render the appropriate shape
  const renderShape = () => {
    switch (type) {
      case 'square':
        return <Square {...shapeProps} />;
      case 'rectangle':
        return <Rectangle {...shapeProps} />;
      case 'rightTriangle':
        return <RightTriangle {...shapeProps} />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`shape-display ${className}`} style={{ height }}>
      <MathView viewBox={getViewBox()} height={height}>
        <Coordinates
          showGrid={showGrid}
          showAxes={showAxes}
        />
        {renderShape()}
      </MathView>
    </div>
  );
};

export default ShapeDisplay;