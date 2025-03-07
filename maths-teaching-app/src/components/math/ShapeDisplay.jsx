// src/components/math/ShapeDisplay.jsx
import React from 'react';
import MathView from './MathView';
import Square from './shapes/Square';
import Rectangle from './shapes/Rectangle';
import RightTriangle from './shapes/RightTriangle';
import Triangle from './shapes/Triangle';
import { Theme } from 'mafs';

/**
 * ShapeDisplay is a versatile component for displaying mathematical shapes
 * with consistent styling across the application.
 * 
 * @param {Object} shape - The shape configuration object
 * @param {string} shape.type - Type of shape to render ('square', 'rectangle', 'rightTriangle', 'triangle')
 * @param {Object} shape - Additional shape-specific properties
 * @param {number} height - Height of the MathView container
 * @param {Object} viewBox - Custom viewBox for the MathView container
 */
const ShapeDisplay = ({ 
  shape,
  height = 250,
  viewBox = null,
  className = '',
  ...props 
}) => {
  if (!shape || !shape.type) return null;
  
  const { type, ...shapeProps } = shape;
  
  // Default color scheme for shapes
  const defaultColors = {
    square: {
      fill: Theme.green,
      stroke: Theme.green,
    },
    rectangle: {
      fill: Theme.blue,
      stroke: Theme.blue,
    },
    rightTriangle: {
      fill: Theme.indigo,
      stroke: Theme.indigo,
    },
    triangle: {
      fill: Theme.violet,
      stroke: Theme.violet,
    }
  };
  
  // Default viewBox settings for each shape type
  const defaultViewBoxes = {
    square: { x: [-1, 8], y: [-1, 8] },
    rectangle: { x: [-1, 10], y: [-1, 8] },
    rightTriangle: { x: [-1, 10], y: [-1, 10] },
    triangle: { x: [-2, 10], y: [-2, 10] }
  };
  
  // Determine which viewBox to use
  const effectiveViewBox = viewBox || defaultViewBoxes[type] || { x: [-5, 5], y: [-5, 5] };
  
  // Get color scheme for the shape
  const colorScheme = defaultColors[type] || { fill: Theme.blue, stroke: Theme.blue };
  
  // Render the appropriate shape component
  const renderShape = () => {
    switch (type) {
      case 'square':
        return (
          <Square
            sideLength={shapeProps.sideLength || 5}
            showDimensions={shapeProps.showDimensions !== false}
            showArea={shapeProps.showArea || false}
            labelStyle={shapeProps.labelStyle || 'numeric'}
            fill={shapeProps.fill || colorScheme.fill}
            fillOpacity={shapeProps.fillOpacity || 0.2}
            stroke={shapeProps.stroke || colorScheme.stroke}
            units={shapeProps.units || 'cm'}
            {...props}
          />
        );
        
      case 'rectangle':
        return (
          <Rectangle
            width={shapeProps.width || 6}
            height={shapeProps.height || 4}
            showDimensions={shapeProps.showDimensions !== false}
            showArea={shapeProps.showArea || false}
            labelStyle={shapeProps.labelStyle || 'numeric'}
            fill={shapeProps.fill || colorScheme.fill}
            fillOpacity={shapeProps.fillOpacity || 0.2}
            stroke={shapeProps.stroke || colorScheme.stroke}
            units={shapeProps.units || 'cm'}
            {...props}
          />
        );
        
      case 'rightTriangle':
        return (
          <RightTriangle
            base={shapeProps.base || 3}
            height={shapeProps.height || 4}
            orientation={shapeProps.orientation || 'bottom-left'}
            showRightAngle={shapeProps.showRightAngle !== false}
            showLabels={shapeProps.showLabels !== false}
            labelStyle={shapeProps.labelStyle || 'numeric'}
            fill={shapeProps.fill || colorScheme.fill}
            fillOpacity={shapeProps.fillOpacity || 0.2}
            stroke={shapeProps.stroke || colorScheme.stroke}
            units={shapeProps.units || 'cm'}
            {...props}
          />
        );
        
      case 'triangle':
        return (
          <Triangle
            vertices={shapeProps.vertices}
            sides={shapeProps.sides}
            base={shapeProps.base}
            height={shapeProps.height}
            showLabels={shapeProps.showLabels !== false}
            labelStyle={shapeProps.labelStyle || 'numeric'}
            fill={shapeProps.fill || colorScheme.fill}
            fillOpacity={shapeProps.fillOpacity || 0.2}
            stroke={shapeProps.stroke || colorScheme.stroke}
            units={shapeProps.units || 'cm'}
            {...props}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`shape-display ${className}`}>
      <MathView
        viewBox={effectiveViewBox}
        height={height}
        preserveAspectRatio={true}
      >
        {renderShape()}
      </MathView>
    </div>
  );
};

export default ShapeDisplay;