// src/worksheets/index.js
// V3.0 - Updated exports including new static worked examples
//
// Place this file in: src/worksheets/index.js

// Core builders
export { 
  default as WorksheetBuilder,
  generateTestWorksheet, 
  generateWorkedExamples,  // Legacy - uses app examples
  generatePracticeWorksheet,
  renderVisualization 
} from './WorksheetBuilder';

// NEW: Static worked examples generator
export { 
  generateStaticWorkedExamplesPDF,
  default as WorkedExamplesPDF 
} from './generators/WorkedExamplesPDF';

// NEW: Static worked examples data
export { 
  PYTHAGORAS_WORKED_EXAMPLES,
  example1_findHypotenuse,
  example2_findShorterSide,
  example3_isoscelesArea,
} from './data/pythagorasWorkedExamples';

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