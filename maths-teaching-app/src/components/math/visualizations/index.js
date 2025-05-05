// maths-teaching-app/src/components/math/visualizations/index.js
import PythagorasVisualization from './PythagorasVisualization';
import CoordinateVisualization from './CoordinateVisualization';
import NavigationVisualization from './NavigationVisualization';
import StackedTrianglesVisualization from './StackedTrianglesVisualization';

export {
  PythagorasVisualization,
  CoordinateVisualization,
  NavigationVisualization,
  StackedTrianglesVisualization
};

// Export visualization components grouped by category
export const visualizations = {
  // Pythagoras-related visualizations
  pythagoras: {
    PythagorasVisualization,
    CoordinateVisualization,
    NavigationVisualization,
    StackedTrianglesVisualization
  }
};

export default visualizations;