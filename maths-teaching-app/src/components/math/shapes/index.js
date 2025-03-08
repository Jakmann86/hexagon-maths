// src/components/math/shapes/index.js
import Square from './Square';
import Rectangle from './Rectangle';
import RightTriangle from './RightTriangle';
import Triangle from './Triangle';
import ShapeDisplay from '../ShapeDisplay';

// Export a registry object that maps shape types to their components
export const ShapeComponents = {
  Square,
  Rectangle,
  RightTriangle,
  Triangle
};

// Export individual components
export {
  Square,
  Rectangle,
  RightTriangle,
  Triangle,
  ShapeDisplay
};

// Utility function to get a shape component by name
export const getShapeComponent = (name) => {
  return ShapeComponents[name] || null;
};

export default ShapeComponents;