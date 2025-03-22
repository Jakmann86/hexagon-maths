// src/components/math/visualizations/index.js
import CoordinateDistance from './CoordinateDistance';
import NavigationProblem from './NavigationProblem';
import StackedTriangles from './StackedTriangles';
import PythagorasVisualization from './PythagorasVisualization';

export {
  CoordinateDistance,
  NavigationProblem,
  StackedTriangles,
  PythagorasVisualization
};

// Export visualization components grouped by category
export const visualizations = {
  // Pythagoras-related visualizations
  pythagoras: {
    CoordinateDistance,
    NavigationProblem,
    StackedTriangles,
    PythagorasVisualization
  }
};

export default visualizations;