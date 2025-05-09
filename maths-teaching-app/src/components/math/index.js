// src/components/math/index.js
// Main wrapper components
import MafsWrapper from './MafsWrapper';
import MathView from './MathView';
import ShapeDisplay from './ShapeDisplay';
import CoordinateGrid from './CoordinateGrid'; // Add the new component

// Shape components
import Square from './shapes/Square';
import Rectangle from './shapes/Rectangle';
import RightTriangle from './shapes/RightTriangle';
import Triangle from './shapes/Triangle';
import IsoscelesTriangle from './shapes/IsoscelesTriangle';

// Primitive components - these were missing imports but referenced later
import Point from './primitives/Point';
import Line from './primitives/Line';
import Polygon from './primitives/Polygon';
import Text from './primitives/Text';
import Angle from './primitives/Angle';
import Coordinates from './primitives/Coordinates';

// Visualizations
import PythagorasVisualization from './visualizations/PythagorasVisualization';
import CoordinateVisualization from './visualizations/CoordinateVisualization';
import NavigationVisualization from './visualizations/NavigationVisualization';
import StackedTrianglesVisualization from './visualizations/StackedTrianglesVisualization';

// Export shape components
export const Shapes = {
  Square,
  Rectangle,
  RightTriangle,
  Triangle,
  IsoscelesTriangle
};

// Export primitive components
export const Primitives = {
  Point,
  Line,
  Polygon,
  Text,
  Angle,
  Coordinates
};

// Export visualization components
export const Visualizations = {
  PythagorasVisualization,
  CoordinateVisualization,
  NavigationVisualization,
  StackedTrianglesVisualization,
  CoordinateGrid // Add to the visualizations object
};

// Named exports of all components
export {
  // Main components
  MafsWrapper,
  MathView,
  ShapeDisplay,
  CoordinateGrid, // Add to named exports
  
  // Shapes
  Square,
  Rectangle,
  RightTriangle,
  Triangle,
  IsoscelesTriangle,
  
  // Primitives
  Point,
  Line,
  Polygon,
  Text,
  Angle,
  Coordinates,
  
  // Visualizations
  PythagorasVisualization,
  CoordinateVisualization,
  NavigationVisualization,
  StackedTrianglesVisualization
};

// Default export for convenient imports
export default {
  MafsWrapper,
  MathView,
  ShapeDisplay,
  CoordinateGrid, // Add to default export
  Shapes,
  Primitives,
  Visualizations
};