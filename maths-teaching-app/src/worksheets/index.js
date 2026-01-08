// src/worksheets/index.js
// Main exports for worksheet system
// V2.0

// Core builders
export { 
  default as WorksheetBuilder,
  generateTestWorksheet, 
  generateWorkedExamples,
  generatePracticeWorksheet,
  renderVisualization 
} from './WorksheetBuilder';

// PDF Generator
export { default as PDFGenerator } from './pdf/PDFGenerator';

// Styles
export { A4, MARGINS, COLORS, FONTS } from './pdf/styles';

// UI Components
export { default as WorksheetButtons } from './components/WorksheetButtons';

// Renderers
export { renderRightTriangle, renderIsoscelesTriangle } from './renderers/TriangleRenderer';
export { renderCoordinateGrid } from './renderers/CoordinateRenderer';
export { renderContextDiagram } from './renderers/ContextRenderer';